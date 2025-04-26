import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";

const FigmaEditExistingCurriculum = () => {
  // Data for dropdowns
  const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const semesterOptions = ["1st Semester", "2nd Semester", "Summer"];
  const levelOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const programOptions = ["BSIT", "BSCS", "BSIS"];
  const compLabOptions = ["Yes", "No"];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Header */}
      <AppBar position="static" color="default" elevation={4}>
        <Toolbar>
          <Box
            component="img"
            src="/web-8-1.png"
            alt="Logo"
            sx={{ height: 62, width: 101, mr: 2 }}
          />
          <Typography
            variant="h2"
            sx={{ color: "text.primary", fontFamily: "Alata" }}
          >
            Academic Resource Management
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <AccountCircleIcon sx={{ fontSize: 42, color: "text.primary" }} />
          <Typography variant="h2" sx={{ ml: 1, fontFamily: "Almarai" }}>
            Admin
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Back button */}
      <Box sx={{ mt: 2, ml: 2 }}>
        <IconButton color="primary" aria-label="back">
          <ArrowBackIcon sx={{ fontSize: 30 }} />
        </IconButton>
      </Box>

      {/* Page title */}
      <Typography
        variant="h1"
        sx={{
          mt: 2,
          ml: 16,
          color: "text.secondary",
          fontFamily: "Almarai",
          fontWeight: 800,
        }}
      >
        Edit Curriculum
      </Typography>

      {/* Main content */}
      <Box sx={{ px: 16, mt: 4 }}>
        <Paper elevation={4}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Action</TableCell>
                  <TableCell align="center">Year</TableCell>
                  <TableCell align="center">Semester</TableCell>
                  <TableCell align="center">Level</TableCell>
                  <TableCell align="center">Program Code</TableCell>
                  <TableCell align="center">Course Code</TableCell>
                  <TableCell align="center">Course Name</TableCell>
                  <TableCell align="center">Lec</TableCell>
                  <TableCell align="center">Lab</TableCell>
                  <TableCell align="center">Units</TableCell>
                  <TableCell align="center">Comp Lab</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconButton size="small">
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          bgcolor: "grey.100",
                          color: "text.primary",
                          "&:hover": { bgcolor: "grey.200" },
                          borderRadius: "10px",
                          fontFamily: "Almarai",
                        }}
                      >
                        Copy
                      </Button>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      fullWidth
                      size="small"
                      placeholder="|"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px",
                          border: "1px solid black",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={semesterOptions[0]}
                      fullWidth
                      size="small"
                      sx={{
                        borderRadius: "5px",
                        border: "1px solid black",
                        bgcolor: "background.paper",
                      }}
                    >
                      {semesterOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={levelOptions[0]}
                      fullWidth
                      size="small"
                      sx={{
                        borderRadius: "5px",
                        border: "1px solid black",
                        bgcolor: "background.paper",
                      }}
                    >
                      {levelOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={programOptions[0]}
                      fullWidth
                      size="small"
                      sx={{
                        borderRadius: "5px",
                        border: "1px solid black",
                        bgcolor: "background.paper",
                      }}
                    >
                      {programOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      fullWidth
                      size="small"
                      placeholder="|"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px",
                          border: "1px solid black",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      fullWidth
                      size="small"
                      placeholder="|"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px",
                          border: "1px solid black",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      fullWidth
                      size="small"
                      placeholder="|"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px",
                          border: "1px solid black",
                          width: "33px",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      fullWidth
                      size="small"
                      placeholder="|"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px",
                          border: "1px solid black",
                          width: "33px",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      fullWidth
                      size="small"
                      placeholder="|"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px",
                          border: "1px solid black",
                          width: "33px",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={compLabOptions[0]}
                      fullWidth
                      size="small"
                      sx={{
                        borderRadius: "5px",
                        border: "1px solid black",
                        bgcolor: "background.paper",
                      }}
                    >
                      {compLabOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Save Changes button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              fontFamily: "Almarai",
              fontWeight: 700,
              fontSize: "22px",
              py: 1,
              px: 3,
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FigmaEditExistingCurriculum;