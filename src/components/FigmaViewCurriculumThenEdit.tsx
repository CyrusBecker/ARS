import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";

const FigmaViewCurriculumThenEdit = () => {
  // Course data for the table
  const courseData = [
    {
      courseCode: "CITE1003",
      courseName: "Computer Programming 1",
      lec: 2,
      lab: 3,
      units: 3,
      compLab: "Yes",
    },
  ];

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" color="default" elevation={2}>
        <Toolbar>
          <Box
            component="img"
            src="./web-8-1.png"
            alt="Logo"
            sx={{ width: 101, height: 62, mr: 2 }}
          />
          <Typography variant="h3" sx={{ fontFamily: "Alata-Regular" }}>
            Academic Resource Management
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <AccountCircleIcon sx={{ fontSize: 42, mr: 1 }} />
          <Typography variant="h3">Admin</Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth={false} sx={{ mt: 6, ml: 8 }}>
        <IconButton
          sx={{ position: "absolute", left: 13, top: 101 }}
          aria-label="back"
        >
          <ArrowBackIcon sx={{ width: 36, height: 30 }} />
        </IconButton>

        <Typography
          variant="h1"
          sx={{
            fontFamily: "'Almarai-ExtraBold', Helvetica",
            fontWeight: 800,
            color: "#222222",
            mb: 3,
          }}
        >
          Edit Curriculum
        </Typography>

        <Typography
          variant="h2"
          sx={{
            fontFamily: "'Almarai-Bold', Helvetica",
            fontWeight: 700,
            color: "primary.main",
            textAlign: "center",
            mb: 4,
          }}
        >
          Bachelor of Science in Information Technology (2020 - 2024)
        </Typography>

        {/* Curriculum Section */}
        <Box sx={{ position: "relative", mb: 4 }}>
          <Box
            sx={{
              width: 351,
              height: 69,
              bgcolor: "primary.main",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Almarai-Bold', Helvetica",
                fontWeight: 700,
                color: "common.white",
                textAlign: "center",
              }}
            >
              1st Year - 1st Semester
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              bgcolor: "primary.light",
              color: "common.black",
              borderRadius: "10px",
              fontFamily: "'Almarai-Bold', Helvetica",
              fontWeight: 700,
              fontSize: "24px",
              height: 53,
              width: 104,
            }}
          >
            Edit
          </Button>

          <TableContainer
            component={Paper}
            sx={{ width: "100%", boxShadow: "0px 5px 4px rgba(0, 0, 0, 0.25)" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily: "'Almarai-Bold', Helvetica",
                      fontSize: "24px",
                    }}
                  >
                    COURSE CODE
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily: "'Almarai-Bold', Helvetica",
                      fontSize: "24px",
                    }}
                  >
                    COURSE NAME
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily: "'Almarai-Bold', Helvetica",
                      fontSize: "24px",
                    }}
                  >
                    LEC
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily: "'Almarai-Bold', Helvetica",
                      fontSize: "24px",
                    }}
                  >
                    LAB
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily: "'Almarai-Bold', Helvetica",
                      fontSize: "24px",
                    }}
                  >
                    UNITS
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily: "'Almarai-Bold', Helvetica",
                      fontSize: "24px",
                    }}
                  >
                    COMP LAB
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courseData.map((course, index) => (
                  <TableRow key={index} sx={{ bgcolor: "background.paper" }}>
                    <TableCell
                      align="center"
                      sx={{
                        fontFamily: "'Almarai-Regular', Helvetica",
                        fontSize: "24px",
                      }}
                    >
                      {course.courseCode}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontFamily: "'Almarai-Regular', Helvetica",
                        fontSize: "24px",
                      }}
                    >
                      {course.courseName}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontFamily: "'Almarai-Regular', Helvetica",
                        fontSize: "24px",
                      }}
                    >
                      {course.lec}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontFamily: "'Almarai-Regular', Helvetica",
                        fontSize: "24px",
                      }}
                    >
                      {course.lab}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontFamily: "'Almarai-Regular', Helvetica",
                        fontSize: "24px",
                      }}
                    >
                      {course.units}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontFamily: "'Almarai-Regular', Helvetica",
                        fontSize: "24px",
                      }}
                    >
                      {course.compLab}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} />
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily: "'Almarai-Bold', Helvetica",
                      fontSize: "24px",
                      color: "common.black",
                    }}
                  >
                    Total Units
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily: "'Almarai-Regular', Helvetica",
                      fontSize: "24px",
                    }}
                  >
                    3
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </Box>
  );
};

export default FigmaViewCurriculumThenEdit;