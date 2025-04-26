import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  AppBar,
  Box,
  Button,
  Container,
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

const curriculumData = [
  {
    year: "2020-2024",
    programCode: "BSIT",
    programName: "Bachelor of Science in Information Technology",
  },
];

const FigmaCurriculumArchiveList = () => {
  return (
    <Box
      sx={{
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <AppBar position="static" color="default" elevation={4}>
        <Toolbar>
          <Box
            component="img"
            src="./web-8-1.png"
            alt="STI Logo"
            sx={{ height: 62, width: 101, mr: 3 }}
          />
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Alata-Regular', Helvetica",
              color: "secondary.main",
              flexGrow: 1,
            }}
          >
            Academic Resource Management
          </Typography>
          <AccountCircleIcon sx={{ fontSize: 42, color: "secondary.main" }} />
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Almarai-Regular', Helvetica",
              color: "secondary.main",
              ml: 1,
            }}
          >
            Admin
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 6 }}>
        <Typography
          variant="h1"
          sx={{
            fontFamily: "'Almarai-ExtraBold', Helvetica",
            fontWeight: "extrabold",
            mb: 4,
          }}
        >
          Curriculum Archive
        </Typography>

        <TableContainer
          component={Paper}
          sx={{ mt: 4, maxWidth: 1262, mx: "auto" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontFamily: "'Almarai-Bold', Helvetica",
                    fontWeight: "bold",
                    color: "primary.main",
                  }}
                >
                  YEAR
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: "'Almarai-Bold', Helvetica",
                    fontWeight: "bold",
                    color: "primary.main",
                  }}
                >
                  PROGRAM CODE
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: "'Almarai-Bold', Helvetica",
                    fontWeight: "bold",
                    color: "primary.main",
                  }}
                >
                  PROGRAM NAME
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: "'Almarai-Bold', Helvetica",
                    fontWeight: "bold",
                    color: "primary.main",
                  }}
                >
                  ACTION
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {curriculumData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      fontFamily: "'Almarai-Regular', Helvetica",
                      color: "secondary.main",
                    }}
                  >
                    {row.year}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: "'Almarai-Regular', Helvetica",
                      color: "secondary.main",
                    }}
                  >
                    {row.programCode}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: "'Almarai-Regular', Helvetica",
                      color: "secondary.main",
                    }}
                  >
                    {row.programName}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<VisibilityIcon />}
                      sx={{
                        fontFamily: "'Almarai-Regular', Helvetica",
                        color: "black",
                        textTransform: "none",
                        borderRadius: "10px",
                        px: 2,
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default FigmaCurriculumArchiveList;