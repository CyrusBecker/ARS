import ArchiveIcon from "@mui/icons-material/Archive";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PersonIcon from "@mui/icons-material/Person";
import ScheduleIcon from "@mui/icons-material/Schedule";
import {
  AppBar,
  Box,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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

const FigmaCurriculumArchiveView = () => {
  // State for expandable menu items
  const [scheduleOpen, setScheduleOpen] = React.useState(false);
  const [archiveOpen, setArchiveOpen] = React.useState(true);

  // Course data
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

  // Navigation items
  const navItems = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    {
      text: "Schedule",
      icon: <ScheduleIcon />,
      hasSubmenu: true,
      open: scheduleOpen,
      onToggle: () => setScheduleOpen(!scheduleOpen),
      submenu: [
        { text: "Create Schedule", path: "/create-schedule" },
        { text: "Schedule Overview", path: "/schedule-overview" },
      ],
    },
    {
      text: "Faculty Loading",
      icon: <AssignmentIcon />,
      path: "/faculty-loading",
    },
    { text: "Curriculum", icon: <DescriptionIcon />, path: "/curriculum" },
    {
      text: "Room Availability",
      icon: <MeetingRoomIcon />,
      path: "/room-availability",
    },
    {
      text: "Archive",
      icon: <ArchiveIcon />,
      hasSubmenu: true,
      open: archiveOpen,
      onToggle: () => setArchiveOpen(!archiveOpen),
      submenu: [
        { text: "Schedule Archive", path: "/schedule-archive" },
        { text: "Faculty Archive", path: "/faculty-archive" },
        {
          text: "Curriculum Archive",
          path: "/curriculum-archive",
          active: true,
        },
      ],
    },
  ];

  return (
    <Box sx={{ display: "flex", bgcolor: "background.default" }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: 383,
          flexShrink: 0,
          bgcolor: "primary.main",
          height: "100vh",
        }}
      >
        <List sx={{ pt: 10.5 }}>
          {navItems.map((item, index) => (
            <React.Fragment key={item.text}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={item.hasSubmenu ? item.onToggle : undefined}
                  sx={{ pl: 3.5 }}
                >
                  <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                  {item.hasSubmenu && (
                    <Box component="span" sx={{ ml: "auto" }}>
                      {item.open ? (
                        <ExpandLessIcon sx={{ color: "white" }} />
                      ) : (
                        <ExpandMoreIcon sx={{ color: "white" }} />
                      )}
                    </Box>
                  )}
                </ListItemButton>
              </ListItem>
              {item.hasSubmenu && (
                <Collapse in={item.open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.submenu.map((subItem) => (
                      <ListItemButton
                        key={subItem.text}
                        sx={{ pl: 10 }}
                        selected={subItem.active}
                      >
                        <ListItemText primary={subItem.text} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
          <ListItem disablePadding sx={{ mt: 5 }}>
            <ListItemButton sx={{ pl: 3.5 }}>
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* App Bar */}
        <AppBar
          position="static"
          color="default"
          elevation={2}
          sx={{ bgcolor: "white" }}
        >
          <Toolbar>
            <Box
              component="img"
              src="/web-8-1.png"
              alt="Logo"
              sx={{ width: 101, height: 62, mr: 2 }}
            />
            <Typography variant="subtitle1" color="text.secondary">
              Academic Resource Management
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <PersonIcon sx={{ mr: 1 }} />
            <Typography variant="body1" color="text.secondary">
              Admin
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box sx={{ p: 5, pl: 6 }}>
          <Typography variant="h1" color="text.primary" sx={{ mb: 3 }}>
            Curriculum Archive
          </Typography>
          <Typography variant="h2" color="primary.light" sx={{ mb: 5 }}>
            Bachelor of Science in Information Technology (2020 - 2024)
          </Typography>

          {/* Semester section */}
          <Box sx={{ maxWidth: 1357 }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "primary.light",
                color: "white",
                py: 1,
                px: 2,
                width: 311,
                height: 69,
                mb: 1,
                borderRadius: "5px",
              }}
            >
              <Typography variant="h3" component="p">
                1st Year - 1st Semester
              </Typography>
            </Button>

            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>COURSE CODE</TableCell>
                    <TableCell>COURSE NAME</TableCell>
                    <TableCell>LEC</TableCell>
                    <TableCell>LAB</TableCell>
                    <TableCell>UNITS</TableCell>
                    <TableCell>COMP LAB</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courseData.map((course) => (
                    <TableRow
                      key={course.courseCode}
                      sx={{ bgcolor: "background.paper" }}
                    >
                      <TableCell>{course.courseCode}</TableCell>
                      <TableCell>{course.courseName}</TableCell>
                      <TableCell>{course.lec}</TableCell>
                      <TableCell>{course.lab}</TableCell>
                      <TableCell>{course.units}</TableCell>
                      <TableCell>{course.compLab}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} align="right">
                      <Typography
                        variant="h4"
                        component="div"
                        sx={{ fontWeight: "bold" }}
                      >
                        Total Units
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">3</Typography>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FigmaCurriculumArchiveView;