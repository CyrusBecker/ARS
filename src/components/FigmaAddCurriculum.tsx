import AccountCircle from "@mui/icons-material/AccountCircle";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ContentCopy from "@mui/icons-material/ContentCopy";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
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

const FigmaAddCurriculum = () => {
  // Data for the form
  const formData = {
    year: "",
    semester: "",
    level: "",
    programCode: "",
    courseCode: "",
    courseName: "",
    lec: "",
    lab: "",
    units: "",
    compLab: "",
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Header/AppBar */}
      <AppBar position="static" color="default" elevation={4}>
        <Toolbar>
          <Box
            component="img"
            src="./web-8-1.png"
            alt="Logo"
            sx={{ width: 101, height: 62, mr: 2 }}
          />
          <Typography variant="h3" sx={{ flexGrow: 1 }}>
            Academic Resource Management
          </Typography>
          <AccountCircle sx={{ fontSize: 42 }} />
          <Typography variant="body1" sx={{ ml: 1 }}>
            Admin
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth={false} sx={{ mt: 6, px: 16 }}>
        {/* Back button and title */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <IconButton sx={{ mr: 1 }}>
            <ArrowBack sx={{ width: 36, height: 30 }} />
          </IconButton>
          <Typography variant="h1" color="text.secondary">
            Add Curriculum
          </Typography>
        </Box>

        {/* Curriculum Form */}
        <Paper elevation={4} sx={{ mb: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Action</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Level</TableCell>
                  <TableCell>Program Code</TableCell>
                  <TableCell>Course Code</TableCell>
                  <TableCell>Course Name</TableCell>
                  <TableCell>Lec</TableCell>
                  <TableCell>Lab</TableCell>
                  <TableCell>Units</TableCell>
                  <TableCell>Comp Lab</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconButton size="small" color="primary">
                        <ContentCopy />
                      </IconButton>
                      <Chip
                        label="Copy"
                        size="small"
                        sx={{
                          bgcolor: "grey.100",
                          borderRadius: "10px",
                          fontSize: "1.25rem",
                          height: 25,
                          width: 74,
                        }}
                      />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={formData.year}
                      InputProps={{
                        sx: { height: 32, borderRadius: "5px" },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      displayEmpty
                      value={formData.semester}
                      size="small"
                      fullWidth
                      renderValue={() => "Sele Semester"}
                      IconComponent={KeyboardArrowDown}
                      sx={{ height: 32 }}
                    >
                      <MenuItem value="">Select Semester</MenuItem>
                      <MenuItem value="1">First Semester</MenuItem>
                      <MenuItem value="2">Second Semester</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      displayEmpty
                      value={formData.level}
                      size="small"
                      fullWidth
                      renderValue={() => "Sel Year"}
                      IconComponent={KeyboardArrowDown}
                      sx={{ height: 32 }}
                    >
                      <MenuItem value="">Select Year</MenuItem>
                      <MenuItem value="1">First Year</MenuItem>
                      <MenuItem value="2">Second Year</MenuItem>
                      <MenuItem value="3">Third Year</MenuItem>
                      <MenuItem value="4">Fourth Year</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      displayEmpty
                      value={formData.programCode}
                      size="small"
                      fullWidth
                      renderValue={() => "Select option"}
                      IconComponent={KeyboardArrowDown}
                      sx={{ height: 32 }}
                    >
                      <MenuItem value="">Select Program Code</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={formData.courseCode}
                      InputProps={{
                        sx: { height: 32, borderRadius: "5px" },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={formData.courseName}
                      InputProps={{
                        sx: { height: 32, borderRadius: "5px" },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      size="small"
                      value={formData.lec}
                      InputProps={{
                        sx: { height: 32, width: 33, borderRadius: "5px" },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      size="small"
                      value={formData.lab}
                      InputProps={{
                        sx: { height: 32, width: 33, borderRadius: "5px" },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      size="small"
                      value={formData.units}
                      InputProps={{
                        sx: { height: 32, width: 33, borderRadius: "5px" },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      displayEmpty
                      value={formData.compLab}
                      size="small"
                      renderValue={() => "Sele"}
                      IconComponent={KeyboardArrowDown}
                      sx={{ height: 32 }}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Save Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              width: 219,
              height: 47,
              fontWeight: "bold",
              fontSize: "22px",
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default FigmaAddCurriculum;