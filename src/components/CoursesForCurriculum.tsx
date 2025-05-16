import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  IconButton,
  Button,
  Typography,
  Autocomplete,
} from "@mui/material";
import { Add, Delete, ContentCopy } from "@mui/icons-material";
import { useParams } from "react-router-dom";

interface TableRowData {
  C_Year: string;
  Semester: string;
  Level: string;
  Program_Code: string;
  Boolean: boolean;
  Course_Code: string;
  Course_Name: string;
  Lec: number;
  Lab: number;
  Units: number;
  manualUnitChange?: boolean;
}

interface SubjSuggest {
  SubjectID: number;
  CourseCode: string;
  CourseName: string;
  Units: number;
  LectureHours: number;
  LabHours: number;
  IsLab: boolean;
}

interface CurriculumInfo {
  CurriculumID: number;
  AcademicYear: string;
  ProgramCode: string;
  Notes: string;
}

const levelOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const semesterOptions = ["1st Semester", "2nd Semester"];
const startYear = 2022;
const yearOptions = Array.from({ length: 4 }, (_, i) => `${startYear + i}`);

const CoursesForCurriculum: React.FC = () => {
  const { id: curriculumId } = useParams<{ id: string }>();
  const [manualUnitChange, setManualUnitChange] = useState(false);
  const [curriculumInfo, setCurriculumInfo] = useState<CurriculumInfo | null>(
    null
  );
  const [rows, setRows] = useState<TableRowData[]>([
    {
      C_Year: "",
      Semester: "",
      Level: "",
      Program_Code: "BSIT",
      Course_Code: "",
      Course_Name: "",
      Lec: 1,
      Lab: 0,
      Units: 1,
      Boolean: false,
    },
  ]);
  const [subjSuggest, setSubjSuggest] = useState<SubjSuggest[]>([]);

  useEffect(() => {
    console.log("Curriculum ID:", curriculumId); // Log the curriculumId
    if (curriculumId) {
      fetchCurriculumInfo(curriculumId);
      fetchSubjects(curriculumId);
    }
  }, [curriculumId]);

  const fetchSubjects = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/subj/curriculum-subjects/${id}`
      );
      const data = await res.json();

      // Fix: Map Level, Course_Code, and Boolean (Comp Lab) robustly
      const mapped: TableRowData[] = data.map((subj: any) => {
        // Level: Use subj.YearLevel if present, fallback to "1st Year"
        let levelStr = "";
        if (subj.YearLevel) {
          const yearNum = parseInt(subj.YearLevel);
          if (!isNaN(yearNum) && yearNum >= 1 && yearNum <= 4) {
            levelStr = `${yearNum}st Year`;
            if (yearNum === 2) levelStr = "2nd Year";
            else if (yearNum === 3) levelStr = "3rd Year";
            else if (yearNum === 4) levelStr = "4th Year";
          } else {
            levelStr = "1st Year";
          }
        } else {
          levelStr = "1st Year";
        }

        // Course_Code: fallback to subj.CourseCode or empty string
        const courseCode = subj.CourseCode || "";

        // Boolean: Comp Lab checkbox, true if IsLab is 1 or true
        const isLab = subj.IsLab === 1 || subj.IsLab === true;

        return {
          C_Year: "",
          Semester: subj.Semester === 1 ? "1st Semester" : "2nd Semester",
          Level: levelStr,
          Program_Code: "BSIT",
          Course_Code: courseCode,
          Course_Name: subj.CourseName || "",
          Lec: subj.LectureHours ?? 0,
          Lab: subj.LabHours ?? 0,
          Units: subj.Units ?? 0,
          Boolean: isLab,
        };
      });

      setSubjSuggest(data);
      setRows(mapped);
    } catch (err) {
      console.error("Error loading subjects:", err);
    }
  };

  const fetchCurriculumInfo = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/subj/curriculum/${id}`
      );
      const data = await res.json();
      console.log("Fetched curriculum info:", data); // For debugging

      // Set the fetched curriculum info to state
      setCurriculumInfo(data); // This will populate the curriculum details
    } catch (err) {
      console.error("Error loading curriculum info:", err);
    }
  };

  const handleSave = async () => {
    try {
      // Map rows to backend format
      const mappedRows = rows.map((row) => {
        // Find SubjectID from subjSuggest using Course_Code
        const subj = subjSuggest.find((s) => s.CourseCode === row.Course_Code);
        if (!subj) {
          throw new Error(
            `Subject with CourseCode ${row.Course_Code} not found in suggestions.`
          );
        }
        // Convert "1st Year" → 1, "2nd Year" → 2, etc.
        const yearLevel =
          typeof row.Level === "string"
            ? parseInt(row.Level) ||
              (row.Level.match(/^(\d)/) ? parseInt(row.Level[0]) : 1)
            : 1;
        // Convert "1st Semester" → 1, "2nd Semester" → 2
        const semester = row.Semester && row.Semester.includes("1") ? 1 : 2;

        return {
          SubjectID: subj.SubjectID,
          CurriculumID: curriculumId,
          YearLevel: yearLevel,
          Semester: semester,
        };
      });

      const res = await fetch(
        "http://localhost:3000/api/subj/curriculum-subjects",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rows: mappedRows,
            curriculumID: curriculumId,
          }),
        }
      );
      const result = await res.json();
      console.log(result);
      alert("Curriculum subjects saved!");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save curriculum subjects.");
    }
  };

  const inputChange = (
    index: number,
    field: keyof TableRowData,
    value: string | number | boolean
  ) => {
    const updated = [...rows];
    (rows[index] as any)[field] = value;
    setRows(updated);
  };

  const unitCalc = (lec: number, lab: number) => lec + Math.floor(lab / 3);

  const addRow = () => {
    setRows([
      ...rows,
      {
        C_Year: "",
        Semester: "",
        Level: "",
        Program_Code: "BSIT",
        Course_Code: "",
        Course_Name: "",
        Lec: 1,
        Lab: 0,
        Units: 1,
        Boolean: false,
      },
    ]);
  };

  const copyRow = (index: number) => {
    const newRow = { ...rows[index] };
    setRows([...rows, newRow]);
  };

  const deleteRow = (index: number) => {
    if (rows.length > 1) {
      const updated = [...rows];
      updated.splice(index, 1);
      setRows(updated);
    }
  };

  // Fix: Only update the current row's Course_Code and suggestions, not all rows
  const handleCourseCodeInputChange = async (idx: number, val: string) => {
    inputChange(idx, "Course_Code", val);
    if (val.length >= 2) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/subj/subjects?search=${val}`
        );
        const data = await response.json();
        // Instead of setSubjSuggest(data), merge new suggestions with existing ones
        setSubjSuggest((prev) => {
          // Merge unique CourseCodes only
          const codes = new Set([...prev, ...data].map((s) => s.CourseCode));
          return [...prev, ...data].filter(
            (s, i, arr) =>
              arr.findIndex((ss) => ss.CourseCode === s.CourseCode) === i
          );
        });
      } catch (err) {
        console.error("Autocomplete fetch error:", err);
      }
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h6" mb={2}>
        Editing Curriculum ID: {curriculumId}{" "}
        {curriculumInfo
          ? `(${curriculumInfo.AcademicYear} - ${curriculumInfo.ProgramCode})`
          : ""}
      </Typography>
      {curriculumInfo?.Notes && (
        <Typography fontSize={15} mb={2}>
          Notes: {curriculumInfo.Notes}
        </Typography>
      )}
      <Typography fontSize={12} mb={2}>
        Remember to make the Level and CourseCode values stop disappearing
      </Typography>
      <Box mb={2}>
        <Checkbox
          checked={manualUnitChange}
          onChange={(e) => setManualUnitChange(e.target.checked)}
        />
        Enable Manual Unit Override (Experimental)
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Actions</TableCell>
            <TableCell>Year</TableCell>
            <TableCell>Semester</TableCell>
            <TableCell>Level</TableCell>
            <TableCell>Course Code</TableCell>
            <TableCell>Course Name</TableCell>
            <TableCell>Lec</TableCell>
            <TableCell>Lab</TableCell>
            <TableCell>Units</TableCell>
            <TableCell>Comp Lab</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <IconButton onClick={() => copyRow(idx)}>
                  <ContentCopy />
                </IconButton>
                {idx === 0 ? (
                  <IconButton onClick={addRow}>
                    <Add />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => deleteRow(idx)}>
                    <Delete />
                  </IconButton>
                )}
              </TableCell>
              <TableCell>
                <Select
                  fullWidth
                  value={row.C_Year}
                  displayEmpty
                  size="small"
                  onChange={(e) => inputChange(idx, "C_Year", e.target.value)}
                >
                  <MenuItem value="" disabled>
                    Year
                  </MenuItem>
                  {yearOptions.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  fullWidth
                  value={row.Semester}
                  displayEmpty
                  size="small"
                  onChange={(e) => inputChange(idx, "Semester", e.target.value)}
                >
                  <MenuItem value="" disabled>
                    Semester
                  </MenuItem>
                  {semesterOptions.map((sem) => (
                    <MenuItem key={sem} value={sem}>
                      {sem}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  fullWidth
                  value={row.Level || ""}
                  displayEmpty
                  size="small"
                  onChange={(e) => inputChange(idx, "Level", e.target.value)}
                >
                  <MenuItem value="" disabled>
                    Level
                  </MenuItem>
                  {levelOptions.map((lvl) => (
                    <MenuItem key={lvl} value={lvl}>
                      {lvl}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <Autocomplete
                  fullWidth
                  freeSolo
                  disableClearable
                  size="small"
                  options={subjSuggest}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.CourseCode
                  }
                  value={
                    row.Course_Code
                      ? subjSuggest.find(
                          (s) => s.CourseCode === row.Course_Code
                        ) || row.Course_Code
                      : ""
                  }
                  isOptionEqualToValue={(o, v) =>
                    typeof o === "string" || typeof v === "string"
                      ? o === v
                      : o.CourseCode === v.CourseCode
                  }
                  onInputChange={(_, val) =>
                    handleCourseCodeInputChange(idx, val)
                  }
                  onChange={(_, val: any) => {
                    if (val) {
                      inputChange(idx, "Course_Code", val.CourseCode);
                      inputChange(idx, "Course_Name", val.CourseName);
                      inputChange(idx, "Lec", val.LectureHours);
                      inputChange(idx, "Lab", val.LabHours);
                      inputChange(idx, "Units", val.Units);
                      inputChange(
                        idx,
                        "Boolean",
                        val.IsLab === true || val.IsLab === 1
                      );
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Course Code" />
                  )}
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  size="small"
                  value={row.Course_Name}
                  onChange={(e) =>
                    inputChange(idx, "Course_Name", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  type="number"
                  size="small"
                  value={row.Lec}
                  onChange={(e) =>
                    inputChange(idx, "Lec", parseInt(e.target.value) || 0)
                  }
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  type="number"
                  size="small"
                  disabled={!row.Boolean}
                  value={row.Lab}
                  onChange={(e) =>
                    inputChange(idx, "Lab", parseInt(e.target.value) || 0)
                  }
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  type="number"
                  size="small"
                  value={
                    manualUnitChange ? row.Units : unitCalc(row.Lec, row.Lab)
                  }
                  onChange={(e) =>
                    inputChange(idx, "Units", parseInt(e.target.value) || 0)
                  }
                  InputProps={{ readOnly: !manualUnitChange }}
                />
              </TableCell>
              <TableCell align="center">
                <Checkbox
                  checked={!!row.Boolean}
                  onChange={(e) => {
                    inputChange(idx, "Boolean", e.target.checked);
                    if (!e.target.checked) inputChange(idx, "Lab", 0);
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box mt={3} textAlign="right">
        <Button variant="contained" color="success" onClick={handleSave}>
          Save Curriculum
        </Button>
      </Box>
    </Box>
  );
};

export default CoursesForCurriculum;
