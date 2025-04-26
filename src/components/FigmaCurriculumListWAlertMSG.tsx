import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import ArchiveIcon from "@mui/icons-material/Archive";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import RoomIcon from "@mui/icons-material/MeetingRoom";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SchoolIcon from "@mui/icons-material/School";
import {
  AppBar,
  Box,
  Button,
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
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

const FigmaCurriculumListWAlertMSG = () => {
  const [scheduleOpen, setScheduleOpen] = React.useState(false);
  const [archiveOpen, setArchiveOpen] = React.useState(false);

  const handleScheduleClick = () => {
    setScheduleOpen(!scheduleOpen);
  };

  const handleArchiveClick = () => {
    setArchiveOpen(!archiveOpen);
  };

  const curriculumData = [
    {
      year: "2020-2024",
      programCode: "BSIT",
      programName: "Bachelor of Science in Information Technology",
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 383,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 383,
            boxSizing: "border-box",
            bgcolor: "primary.main",
          },
        }}
      >
        <List sx={{ mt: 7 }}>
          <ListItem disablePadding>
            <ListItemButton sx={{ pl: 3.5 }}>
              <ListItemIcon>
                <HomeIcon sx={{ color: "white", fontSize: 26 }} />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={handleScheduleClick} sx={{ pl: 3.5 }}>
              <ListItemIcon>
                <ScheduleIcon sx={{ color: "white", fontSize: 22 }} />
              </ListItemIcon>
              <ListItemText primary="Schedule" />
              {scheduleOpen ? <></> : <></>}
            </ListItemButton>
          </ListItem>
          <Collapse in={scheduleOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 10 }}>
                <ListItemText primary="Create Schedule" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 10 }}>
                <ListItemText primary="Schedule Overview" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItem disablePadding>
            <ListItemButton sx={{ pl: 3.5 }}>
              <ListItemIcon>
                <SchoolIcon sx={{ color: "white", fontSize: 22 }} />
              </ListItemIcon>
              <ListItemText primary="Faculty Loading" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton sx={{ pl: 3.5 }}>
              <ListItemIcon>
                <SchoolIcon sx={{ color: "white", fontSize: 22 }} />
              </ListItemIcon>
              <ListItemText primary="Curriculum" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton sx={{ pl: 3.5 }}>
              <ListItemIcon>
                <RoomIcon sx={{ color: "white", fontSize: 23 }} />
              </ListItemIcon>
              <ListItemText primary="Room Availability" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={handleArchiveClick} sx={{ pl: 3.5 }}>
              <ListItemIcon>
                <ArchiveIcon sx={{ color: "white", fontSize: 25 }} />
              </ListItemIcon>
              <ListItemText primary="Archive" />
              {archiveOpen ? <></> : <></>}
            </ListItemButton>
          </ListItem>
          <Collapse in={archiveOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 10 }}>
                <ListItemText primary="Schedule Archive" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 10 }}>
                <ListItemText primary="Faculty Archive" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 10 }}>
                <ListItemText primary="Curriculum Archive" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItem disablePadding sx={{ mt: 5 }}>
            <ListItemButton sx={{ pl: 3.5 }}>
              <ListItemIcon>
                <LogoutIcon sx={{ color: "white", fontSize: 23 }} />
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* App Bar */}
        <AppBar
          position="fixed"
          color="default"
          elevation={4}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            height: 86,
            bgcolor: "background.paper",
          }}
        >
          <Toolbar>
            <Box
              component="img"
              src="https://placeholder.com/101x62"
              alt="Logo"
              sx={{ width: 101, height: 62, mr: 3 }}
            />
            <Typography variant="h4" color="text.primary" sx={{ flexGrow: 1 }}>
              Academic Resource Management
            </Typography>
            <AccountCircleIcon sx={{ fontSize: 42, mr: 1 }} />
            <Typography variant="h3" color="text.primary">
              Admin
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Saved Changes Button */}
        <Button
          variant="contained"
          color="secondary"
          startIcon={<CheckCircleIcon />}
          sx={{
            position: "fixed",
            top: 66,
            right: 40,
            zIndex: (theme) => theme.zIndex.drawer + 2,
            width: 294,
            height: 76,
            borderRadius: "10px",
            bgcolor: "rgba(16, 167, 94, 0.77)",
            fontSize: "1.5rem",
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Saved Changes
        </Button>

        {/* Content */}
        <Box sx={{ flexGrow: 1, p: 3, mt: 12 }}>
          <Typography variant="h1" color="text.secondary" sx={{ mb: 3 }}>
            Curriculum Overview
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{
                height: 42,
                width: 219,
                borderRadius: "10px",
              }}
            >
              Add Curriculum
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>YEAR</TableCell>
                  <TableCell>PROGRAM CODE</TableCell>
                  <TableCell>PROGRAM NAME</TableCell>
                  <TableCell>ACTION</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {curriculumData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.year}</TableCell>
                    <TableCell>{row.programCode}</TableCell>
                    <TableCell>{row.programName}</TableCell>
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Button
                          variant="contained"
                          startIcon={<EditIcon />}
                          sx={{
                            bgcolor: "primary.light",
                            color: "black",
                            "&:hover": { bgcolor: "primary.light" },
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<ArchiveIcon />}
                          sx={{
                            bgcolor: "warning.main",
                            color: "black",
                            "&:hover": { bgcolor: "warning.main" },
                          }}
                        >
                          Archive
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default FigmaCurriculumListWAlertMSG;