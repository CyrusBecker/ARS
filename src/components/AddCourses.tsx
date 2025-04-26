import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArchiveIcon from "@mui/icons-material/Archive";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";

interface CurriculumInfo {
  CurriculumID: number;
  AcademicYear: string;
  ProgramCode: string;
  Notes: string;
}

interface Subject {
  YearLevel: number;
  Semester: number;
  CourseCode: string;
  CourseName: string;
  LectureHours: number;
  LabHours: number;
  Units: number;
  IsLab: boolean;
}

const semesterLabel = (sem: number) => (sem === 1 ? "1st Semester" : "2nd Semester");
const yearLabel = (year: number) => {
  const map = ["1st", "2nd", "3rd", "4th"];
  return map[year - 1] || `${year}th`;
};

const ViewCurriculum: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [curriculumInfo, setCurriculumInfo] = useState<CurriculumInfo | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const groupSubjects = () => {
    const grouped: Record<string, Subject[]> = {};
    subjects.forEach((subj) => {
      const key = `${subj.YearLevel}-${subj.Semester}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(subj);
    });
    return grouped;
  };

  const fetchCurriculumInfo = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/curriculum/${id}`);
      const data = await res.json();
      setCurriculumInfo(data);
    } catch (err) {
      console.error("Failed to load curriculum info", err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/curriculum-subjects/${id}`);
      const data = await res.json();
      setSubjects(data);
    } catch (err) {
      console.error("Failed to load curriculum subjects", err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCurriculumInfo();
      fetchSubjects();
    }
  }, [id]);

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/curriculumOverview`)}
          sx={{ fontSize: "1.8rem", fontWeight: 700, textTransform: "none", color: "#222" }}
        >
          View Curriculum
        </Button>
      </Box>

      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#004080", mb: 4 }}>
        {curriculumInfo
          ? `Bachelor of Science in Information Technology (${curriculumInfo.AcademicYear})`
          : ""}
      </Typography>

      {/* Archive & Edit Buttons (Single Instance) */}
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <Button 
            variant="contained" 
            startIcon={<ArchiveIcon />} 
            disabled
            sx={{ bgcolor: "#fad78c", color: "black" }}
            >
          Archive
        </Button>
        <Button 
            variant="contained"
            startIcon={<EditIcon />}
            disabled={!curriculumInfo}
            onClick={() => navigate(`/curriculum/edit/${curriculumInfo?.CurriculumID}`)}
            sx={{ bgcolor: "#7dbdff", color: "black" }}
            >
          Edit
        </Button>
      </Box>

      {/* Grouped Semester Tables */}
      {Object.entries(groupSubjects()).map(([key, group]) => {
        const [year, sem] = key.split("-");
        const title = `${yearLabel(Number(year))} Year - ${semesterLabel(Number(sem))}`;
        const expanded = expandedGroups[key] ?? true;

        return (
          <Box key={key} sx={{ mb: 4 }}>
            <Button
              fullWidth
              onClick={() => toggleGroup(key)}
              sx={{
                bgcolor: "#004080",
                color: "white",
                fontWeight: "bold",
                fontSize: "20px",
                borderRadius: "6px",
                textTransform: "none",
                justifyContent: "space-between",
              }}
            >
              {title}
              {expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
            </Button>

            <Collapse in={expanded}>
              <TableContainer component={Paper} elevation={3} sx={{ borderRadius: "10px", mt: 1 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {["Course Code", "Course Name", "Lec", "Lab", "Units", "Comp Lab"].map(header => (
                        <TableCell
                          key={header}
                          align="center"
                          sx={{ fontWeight: "bold", color: "#004080", fontSize: "1.1rem" }}
                        >
                          {header.toUpperCase()}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {group.map((subject, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">{subject.CourseCode}</TableCell>
                        <TableCell align="center">{subject.CourseName}</TableCell>
                        <TableCell align="center">{subject.LectureHours}</TableCell>
                        <TableCell align="center">{subject.LabHours}</TableCell>
                        <TableCell align="center">{subject.Units}</TableCell>
                        <TableCell align="center">{subject.IsLab ? "Yes" : "No"}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} />
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>Total Units</TableCell>
                      <TableCell align="center">
                        {group.reduce((acc, curr) => acc + curr.Units, 0)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Collapse>
          </Box>
        );
      })}
    </Container>
  );
};

export default ViewCurriculum;
