import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  TextField,
  Autocomplete,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

interface Subject {
  SubjectID: number;
  CourseCode: string;
  CourseName: string;
  Units: number;
}

interface ProfessorSubjectRow {
  CourseCode: string;
  CourseName: string;
}

interface ProfessorInfo {
  ProfessorID: number;
  FullName: string;
  EmploymentStatus: string;
  MaxUnits: number;
  CurrentUnits: number;
}

const EditProfessorSubjects = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [professorInfo, setProfessorInfo] = useState<ProfessorInfo | null>(
    null
  );
  const [rows, setRows] = useState<ProfessorSubjectRow[]>([
    { CourseCode: "", CourseName: "" },
  ]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProfessorDetails(id);
      fetchSubjects();
    }
  }, [id]);

  const fetchProfessorDetails = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/subj/professor/${id}`);
      const data = await res.json();

      if (!data.professor) {
        console.error("No professor found for ID", id);
        return;
      }

      // Set the professor info (this will populate the professor's details in the form)
      setProfessorInfo(data.professor);

      // Pre-fill rows with subjects
      setRows(
        data.eligibleSubjects.length > 0
          ? data.eligibleSubjects.map((subj: any) => ({
              CourseCode: subj.CourseCode,
              CourseName: subj.CourseName,
            }))
          : [{ CourseCode: "", CourseName: "" }] // Default empty row if no subjects
      );
    } catch (err) {
      console.error("Failed to load professor details:", err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/subj/subjects");
      const data = await res.json();
      setSubjects(data);
    } catch (err) {
      console.error("Failed loading subjects:", err);
    }
  };

  const handleInputChange = (
    index: number,
    field: keyof ProfessorSubjectRow,
    value: string
  ) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([...rows, { CourseCode: "", CourseName: "" }]);
  };

  const deleteRow = (index: number) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  const handleSave = async () => {
    try {
      if (professorInfo) {
        await fetch(`http://localhost:3000/api/subj/professor/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: professorInfo.FullName,
            employmentStatus: professorInfo.EmploymentStatus,
          }),
        });
      }

      await fetch(`http://localhost:3000/api/subj/professor-subjects/update`, {
        // /update was appended
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professorID: id,
          subjects: rows.map((row) => row.CourseCode),
        }),
      });

      navigate("/facultyOverview", { state: { success: true } });
    } catch (err) {
      console.error("Error saving professor:", err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box mb={2}>
        <Button
          variant="contained"
          onClick={() => navigate("/facultyOverview")}
        >
          Back
        </Button>
      </Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Edit Professor Subjects
      </Typography>
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Professor Name"
          fullWidth
          value={professorInfo?.FullName || ""}
          onChange={(e) =>
            setProfessorInfo((prev) =>
              prev ? { ...prev, FullName: e.target.value } : prev
            )
          }
          sx={{ mb: 2 }}
        />
        <TextField
          label="Employment Status"
          fullWidth
          select
          SelectProps={{ native: true }}
          value={professorInfo?.EmploymentStatus || ""}
          onChange={(e) =>
            setProfessorInfo((prev) =>
              prev ? { ...prev, EmploymentStatus: e.target.value } : prev
            )
          }
          sx={{ mb: 2 }}
        >
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
        </TextField>
        <TextField
          label="Program"
          disabled
          fullWidth
          value="BSIT"
          InputProps={{ readOnly: true }}
        />
      </Box>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course Code</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell width="40%">
                  <Autocomplete
                    options={subjects}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.CourseCode
                    }
                    value={
                      subjects.find((s) => s.CourseCode === row.CourseCode) ||
                      null
                    }
                    onInputChange={async (_, val) => {
                      if (val.length >= 2) {
                        try {
                          const response = await fetch(
                            `http://localhost:3000/api/subj/subjects?search=${val}`
                          );
                          const data = await response.json();
                          setSubjects(data); // Update subjects dynamically here!
                        } catch (err) {
                          console.error("Autocomplete fetch error:", err);
                        }
                      }
                    }}
                    onChange={(_, newValue) => {
                      if (newValue) {
                        handleInputChange(
                          index,
                          "CourseCode",
                          newValue.CourseCode
                        );
                        handleInputChange(
                          index,
                          "CourseName",
                          newValue.CourseName
                        );
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} size="small" />
                    )}
                  />
                </TableCell>
                <TableCell width="40%">
                  <TextField
                    size="small"
                    fullWidth
                    value={row.CourseName}
                    onChange={(e) =>
                      handleInputChange(index, "CourseName", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell width="20%">
                  <IconButton onClick={() => deleteRow(index)}>
                    <Delete />
                  </IconButton>
                  {index === rows.length - 1 && (
                    <IconButton onClick={addRow}>
                      <Add />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box textAlign="right">
        <Button variant="contained" color="success" onClick={handleSave}>
          Save Changes
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        message="Subjects updated successfully!"
        onClose={() => setSnackbarOpen(false)}
      />
    </Container>
  );
};

export default EditProfessorSubjects;
