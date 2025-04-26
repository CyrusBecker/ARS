import React, { useState } from 'react';
import {
  Box, Table, TableHead, TableBody, TableRow, TableCell,
  TextField, Select, MenuItem, Checkbox, IconButton, Button,
  Typography, Autocomplete
} from '@mui/material';
import { Add, Delete, ContentCopy } from '@mui/icons-material';

// Academic Years do not exist on the tables yet, fix the issue of why some rows does not load their Year Level

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

const levelOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const semesterOptions = ['1st Semester', '2nd Semester'];
const startYear = 2022;
const yearOptions = Array.from({ length: 4 }, (_, i) => `${startYear + i}`);

const CreateNewCurriculum: React.FC = () => {
  const [manualUnitChange, setManualUnitChange] = useState(false);
  const [rows, setRows] = useState<TableRowData[]>([{
    C_Year: '', Semester: '', Level: '', Program_Code: 'BSIT', Course_Code: '', Course_Name: '', Lec: 1, Lab: 0, Units: 1, Boolean: false
  }]);
  const [subjSuggest, setSubjSuggest] = useState<SubjSuggest[]>([]);
  const [academicYear, setAcademicYear] = useState('');
  const [notes, setNotes] = useState('');

  const unitCalc = (lec: number, lab: number) => lec + Math.floor(lab / 3);

  const inputChange = (index: number, field: keyof TableRowData, value: string | number | boolean) => {
    const updated = [...rows];
    (updated[index] as any)[field] = value;
    setRows(updated);
  };

  const addRow = () => {
    setRows([...rows, {
      C_Year: '', Semester: '', Level: '', Program_Code: 'BSIT', Course_Code: '', Course_Name: '', Lec: 1, Lab: 0, Units: 1, Boolean: false
    }]);
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

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/curriculums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          academicYear,
          programCode: 'BSIT',
          notes,
          subjects: rows
        })
      });
      const result = await res.json();
      console.log(result);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h6" mb={2}>Create New Curriculum</Typography>
      <TextField fullWidth label="Academic Year" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} multiline rows={3} sx={{ mb: 2 }} />

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
                <IconButton onClick={() => copyRow(idx)}><ContentCopy /></IconButton>
                {idx === 0 ? <IconButton onClick={addRow}><Add /></IconButton> : <IconButton onClick={() => deleteRow(idx)}><Delete /></IconButton>}
              </TableCell>
              <TableCell>
                <Select fullWidth size="small" value={row.C_Year} onChange={(e) => inputChange(idx, 'C_Year', e.target.value)}>
                  <MenuItem value="" disabled>Year</MenuItem>
                  {yearOptions.map(year => <MenuItem key={year} value={year}>{year}</MenuItem>)}
                </Select>
              </TableCell>
              <TableCell>
                <Select fullWidth size="small" value={row.Semester} onChange={(e) => inputChange(idx, 'Semester', e.target.value)}>
                  <MenuItem value="" disabled>Semester</MenuItem>
                  {semesterOptions.map(sem => <MenuItem key={sem} value={sem}>{sem}</MenuItem>)}
                </Select>
              </TableCell>
              <TableCell>
                <Select fullWidth size="small" value={row.Level} onChange={(e) => inputChange(idx, 'Level', e.target.value)}>
                  <MenuItem value="" disabled>Level</MenuItem>
                  {levelOptions.map(lvl => <MenuItem key={lvl} value={lvl}>{lvl}</MenuItem>)}
                </Select>
              </TableCell>
              <TableCell>
                <Autocomplete
                  fullWidth
                  freeSolo
                  disableClearable
                  size="small"
                  options={subjSuggest}
                  getOptionLabel={(option) => typeof option === 'string' ? option : option.CourseCode}
                  value={subjSuggest.find(s => s.CourseCode === row.Course_Code) || undefined}
                  isOptionEqualToValue={(o, v) => o.CourseCode === v.CourseCode}
                  onInputChange={async (_, val) => {
                    inputChange(idx, 'Course_Code', val);
                    if (val.length >= 2) {
                      try {
                        const response = await fetch(`http://localhost:3000/api/subjects?search=${val}`);
                        const data = await response.json();
                        setSubjSuggest(data);
                      } catch (err) {
                        console.error("Autocomplete fetch error:", err);
                      }
                    }
                  }}
                  onChange={(_, val: any) => {
                    if (val) {
                      inputChange(idx, 'Course_Code', val.CourseCode);
                      inputChange(idx, 'Course_Name', val.CourseName);
                      inputChange(idx, 'Lec', val.LectureHours);
                      inputChange(idx, 'Lab', val.LabHours);
                      inputChange(idx, 'Units', val.Units);
                      inputChange(idx, 'Boolean', val.IsLab === true);
                    }
                  }}
                  renderInput={(params) => <TextField {...params} label="Course Code" />}
                />
              </TableCell>
              <TableCell>
                <TextField fullWidth size="small" value={row.Course_Name} onChange={(e) => inputChange(idx, 'Course_Name', e.target.value)} />
              </TableCell>
              <TableCell>
                <TextField fullWidth type="number"
                  size="small"
                  value={row.Lec}
                  onChange={(e) => inputChange(idx, 'Lec', parseInt(e.target.value) || 0)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  type="number"
                  size="small"
                  disabled={!row.Boolean}
                  value={row.Lab}
                  onChange={(e) => inputChange(idx, 'Lab', parseInt(e.target.value) || 0)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  type="number"
                  size="small"
                  value={manualUnitChange ? row.Units : unitCalc(row.Lec, row.Lab)}
                  onChange={(e) => inputChange(idx, 'Units', parseInt(e.target.value) || 0)}
                  InputProps={{ readOnly: !manualUnitChange }}
                />
              </TableCell>
              <TableCell align="center">
                <Checkbox
                  checked={row.Boolean}
                  onChange={(e) => {
                    inputChange(idx, 'Boolean', e.target.checked);
                    if (!e.target.checked) inputChange(idx, 'Lab', 0);
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