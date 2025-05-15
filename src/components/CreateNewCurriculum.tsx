import React, { useState } from "react";
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
} from "@mui/material";
import { Add, Delete, ContentCopy } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

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

// SubjSuggest and Autocomplete - Commented for now
/*
interface SubjSuggest {
  SubjectID: number;
  CourseCode: string;
  CourseName: string;
  Units: number;
  LectureHours: number;
  LabHours: number;
  IsLab: boolean;
}
*/

const levelOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const semesterOptions = ["1st Semester", "2nd Semester"];
/*const startYear = 2022;
  const yearOptions = Array.from({ length: 4 }, (_, i) => `${startYear + i}`);

  <Select 
    fullWidth 
    size="small" 
    value={row.C_Year} 
    onChange={(e) => inputChange(idx, 'C_Year', e.target.value)}>
      <MenuItem 
      value="" 
      disabled>
        Year
      </MenuItem>
    {yearOptions.map(year => 
      <MenuItem 
      key={year} 
      value={year}>
        {year}
        </MenuItem>)
    }
  </Select>
 */

const CreateNewCurriculum: React.FC = () => {
  const [manualUnitChange, setManualUnitChange] = useState(false);
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
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();
  //const [subjSuggest, setSubjSuggest] = useState<SubjSuggest[]>([]); // Commented for now

  const unitCalc = (lec: number, lab: number) => lec + Math.floor(lab / 3);

  const inputChange = (
    index: number,
    field: keyof TableRowData,
    value: string | number | boolean
  ) => {
    const updated = [...rows];
    (updated[index] as any)[field] = value;
    setRows(updated);
  };

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

  const calculateAcademicYear = () => {
    const validYears = rows
      .map((row) => parseInt(row.C_Year))
      .filter((year) => !isNaN(year));

    if (validYears.length === 0) return "";

    const minYear = Math.min(...validYears);
    const maxYear = Math.max(...validYears);
    return `${minYear}-${maxYear + 1}`;
  };

  const handleSave = async () => {
    const academicYear = calculateAcademicYear();

    if (!academicYear) {
      alert("Please set the Year fields correctly.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/subj/curriculums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          academicYear,
          programCode: "BSIT",
          notes,
          subjects: rows,
        }),
      });

      if (!res.ok) throw new Error("Failed to save curriculum.");

      const result = await res.json();
      console.log(result);

      navigate("/curriculumOverview", { state: { success: true } }); // Need to update it so that it takes the created ID to identify that it is indeed successful
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save curriculum."); // Turn the save operation to not accept the Curriculum inserts when an error occurs
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h6" mb={2}>
        Create New Curriculum
      </Typography>
      <Typography fontSize={12}>
        Note To self: Remember to make the Units inputBox able to accept decimal
        values and make the arrow bars unable to go down past 0 like -1
      </Typography>
      <TextField
        fullWidth
        label="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        multiline
        rows={3}
        sx={{ mb: 2 }}
      />
      <Checkbox
        checked={manualUnitChange}
        onChange={(e) => setManualUnitChange(e.target.checked)}
      />
      Enable Manual Unit Override (Experimental)
      <Table size="small" sx={{ mt: 2 }}>
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
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  inputProps={{ maxLength: 4 }}
                  value={row.C_Year}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 4);
                    if (/^\d*$/.test(value)) {
                      inputChange(idx, "C_Year", value);
                    }
                  }}
                />
              </TableCell>
              <TableCell>
                <Select
                  fullWidth
                  size="small"
                  value={row.Semester}
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
                  size="small"
                  value={row.Level}
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
                <TextField
                  fullWidth
                  size="small"
                  value={row.Course_Code}
                  onChange={(e) =>
                    inputChange(idx, "Course_Code", e.target.value)
                  }
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
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    if (row.Boolean) {
                      inputChange(idx, "Lec", value <= 2 ? value : 2);
                    } else {
                      inputChange(idx, "Lec", value <= 3 ? value : 3);
                    }
                  }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  type="number"
                  size="small"
                  disabled={!row.Boolean}
                  value={row.Lab}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    inputChange(idx, "Lab", value <= 3 ? value : 3);
                  }}
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
                  checked={row.Boolean}
                  onChange={(e) => {
                    inputChange(idx, "Boolean", e.target.checked);
                    if (!e.target.checked) {
                      inputChange(idx, "Lab", 0);
                    }
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box mt={3} textAlign="right">
        <Button variant="contained" color="success" onClick={handleSave}>
          Save New Curriculum
        </Button>
      </Box>
    </Box>
  );
};

export default CreateNewCurriculum;
