import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import ArchiveIcon from "@mui/icons-material/Archive";
import EditIcon from "@mui/icons-material/Edit";
import SortIcon from "@mui/icons-material/Sort";
import { useNavigate, useLocation } from "react-router-dom";

interface Professor {
  ProfessorID: number;
  FullName: string;
  EmploymentStatus: string;
}

const FacultyLoading: React.FC = () => {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const location = useLocation();
  const [professors, setProfessors] = useState<Professor[]>([]);

  useEffect(() => {
    if (location.state?.success) {
      setOpenSnackbar(true);
    }
    fetchProfessors();
  }, []);

  const fetchProfessors = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/subj/professors");
      const data = await res.json();
      setProfessors(data);
    } catch (error) {
      console.error("Failed to fetch professors:", error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Faculty Loading
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button variant="contained" disabled startIcon={<SortIcon />}>
          Sort
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => navigate("/faculty/add")}
        >
          Add
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">PROFESSOR</TableCell>
              <TableCell align="center">SHIFT</TableCell>
              <TableCell align="center">ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {professors.map((prof) => (
              <TableRow key={prof.ProfessorID}>
                <TableCell align="center">{prof.FullName}</TableCell>
                <TableCell align="center">{prof.EmploymentStatus}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate(`/faculty/edit/${prof.ProfessorID}`)
                    }
                    startIcon={<EditIcon />}
                    sx={{ mr: 1 }}
                  >
                    Courses
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate(`/faculty/schedule/${prof.ProfessorID}`)
                    }
                    startIcon={<EditIcon />}
                    sx={{ mr: 1 }}
                  >
                    Schedule
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    disabled
                    startIcon={<ArchiveIcon />}
                  >
                    Archive
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Professor added successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FacultyLoading;
