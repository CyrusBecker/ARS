import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  FormControl,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";
import { useNavigate } from "react-router-dom";

interface SubjectOption {
  SubjectID: number;
  CourseCode: string;
  CourseName: string;
  Units: number;
}

interface SubjectRow {
  courseCode: string;
  courseName: string;
  units: number;
  subjectID?: number;
}

const AddProf: React.FC = () => {
  const navigate = useNavigate();
  const [professorName, setProfessorName] = useState("");
  const [shift, setShift] = useState("");
  const [subjects, setSubjects] = useState<SubjectRow[]>([
    { courseCode: "", courseName: "", units: 0, subjectID: undefined },
  ]);
  const [subjectOptions, setSubjectOptions] = useState<SubjectOption[]>([]);

  const fetchSubjects = async (search: string) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/subj/subjects?search=${search}`
      );
      const data = await res.json();
      setSubjectOptions(data);
    } catch (err) {
      console.error("Error fetching subjects:", err);
    }
  };

  const handleAddRow = () => {
    setSubjects([...subjects, { courseCode: "", courseName: "", units: 0 }]);
  };

  const handleDeleteRow = (index: number) => {
    const updated = [...subjects];
    updated.splice(index, 1);
    setSubjects(updated);
  };

  const handleSave = async () => {
    try {
      const profRes = await fetch("http://localhost:3000/api/subj/professors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: professorName,
          employmentStatus: shift,
        }),
      });

      const profData = await profRes.json();
      const professorID = profData.professorID;

      if (!professorID) {
        throw new Error("Failed to get professor ID from server!");
      }

      // Check subjectIDs
      const subjectIDs = subjects.map((s) => s.subjectID).filter((id) => id);
      console.log("Subject IDs to be added:", subjectIDs); // Add this log

      if (subjectIDs.length === 0) {
        throw new Error("No valid subject IDs found.");
      }

      await fetch("http://localhost:3000/api/subj/professor-subjects/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ professorID, subjects: subjectIDs }),
      });

      navigate("/facultyOverview", { state: { success: true } });
    } catch (err) {
      console.error("Error saving professor:", err);
    }
  };

  return (
    <Box p={3}>
      <Stack direction="row" spacing={3} mb={3}>
        <TextField
          label="Professor Name"
          value={professorName}
          onChange={(e) => setProfessorName(e.target.value)}
        />
        <TextField label="Program Code" value="BSIT" disabled />
        <FormControl>
          <Select
            displayEmpty
            value={shift}
            onChange={(e) => setShift(e.target.value)}
          >
            <MenuItem value="" disabled>
              Select shift
            </MenuItem>
            <MenuItem value="Full-Time">Full-Time</MenuItem>
            <MenuItem value="Part-Time">Part-Time</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Course Code</TableCell>
            <TableCell>Course Name</TableCell>
            <TableCell>Units</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subjects.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell width="30%">
                <Autocomplete
                  freeSolo
                  disableClearable
                  size="small"
                  options={subjectOptions}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.CourseCode
                  }
                  value={
                    subjectOptions.find(
                      (s) => s.CourseCode === row.courseCode
                    ) || undefined
                  }
                  isOptionEqualToValue={(o, v) => o.CourseCode === v.CourseCode}
                  onInputChange={async (_, val) => {
                    const updated = [...subjects];
                    updated[idx].courseCode = val;
                    updated[idx].courseName = "";
                    updated[idx].units = 0;
                    setSubjects(updated);
                    if (val.length >= 2) {
                      await fetchSubjects(val);
                    }
                  }}
                  onChange={(_, val: any) => {
                    if (val) {
                      const updated = [...subjects];
                      updated[idx].courseCode = val.CourseCode;
                      updated[idx].courseName = val.CourseName;
                      updated[idx].units = val.Units;
                      updated[idx].subjectID = val.SubjectID;
                      setSubjects(updated);
                    }
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </TableCell>
              <TableCell>
                <TextField value={row.courseName} size="small" disabled />
              </TableCell>
              <TableCell>
                <TextField value={row.units} size="small" disabled />
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <IconButton onClick={handleAddRow}>
                    <Add />
                  </IconButton>
                  {idx > 0 && (
                    <IconButton onClick={() => handleDeleteRow(idx)}>
                      <Delete />
                    </IconButton>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box mt={3} textAlign="right">
        <Button variant="contained" onClick={handleSave} color="primary">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default AddProf;
