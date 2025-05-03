import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArchiveIcon from "@mui/icons-material/Archive";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SchoolIcon from "@mui/icons-material/School";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Collapse,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const AddSections = () => {
  // State for expandable menu items
  const [scheduleOpen, setScheduleOpen] = useState(true);
  const [archiveOpen, setArchiveOpen] = useState(true);

  // Handle menu expansions
  const handleScheduleClick = () => {
    setScheduleOpen(!scheduleOpen);
  };

  const handleArchiveClick = () => {
    setArchiveOpen(!archiveOpen);
  };

  return (
    <Box
      sx={{ display: "flex", bgcolor: "background.paper", minHeight: "100vh" }}
    >
      {/* Left Sidebar */}
      <Box
        component="nav"
        sx={{
          width: 280,
          flexShrink: 0,
          bgcolor: "#01579b",
          color: "white",
          height: "100vh",
          position: "fixed",
          zIndex: 1,
        }}
      >
        <List sx={{ pt: 8 }}>
          <ListItem button>
            <ListItemIcon>
              <HomeIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText
              primary="Home"
              primaryTypographyProps={{ fontSize: "1.25rem" }}
            />
          </ListItem>

          <ListItem button onClick={handleScheduleClick}>
            <ListItemIcon>
              <ScheduleIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText
              primary="Schedule"
              primaryTypographyProps={{ fontSize: "1.25rem" }}
            />
            {scheduleOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={scheduleOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 4 }}>
                <ListItemText
                  primary="Create Schedule"
                  primaryTypographyProps={{ fontSize: "1.25rem" }}
                />
              </ListItem>
              <ListItem button sx={{ pl: 4 }}>
                <ListItemText
                  primary="Schedule Overview"
                  primaryTypographyProps={{ fontSize: "1.25rem" }}
                />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button>
            <ListItemIcon>
              <SchoolIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText
              primary="Faculty Loading"
              primaryTypographyProps={{ fontSize: "1.25rem" }}
            />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
              <MenuBookIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText
              primary="Curriculum"
              primaryTypographyProps={{ fontSize: "1.25rem" }}
            />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
              <MeetingRoomIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText
              primary="Room Availability"
              primaryTypographyProps={{ fontSize: "1.25rem" }}
            />
          </ListItem>

          <ListItem button onClick={handleArchiveClick}>
            <ListItemIcon>
              <ArchiveIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText
              primary="Archive"
              primaryTypographyProps={{ fontSize: "1.25rem" }}
            />
            {archiveOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={archiveOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 4 }}>
                <ListItemText
                  primary="Schedule Archive"
                  primaryTypographyProps={{ fontSize: "1.25rem" }}
                />
              </ListItem>
              <ListItem button sx={{ pl: 4 }}>
                <ListItemText
                  primary="Faculty Archive"
                  primaryTypographyProps={{ fontSize: "1.25rem" }}
                />
              </ListItem>
              <ListItem button sx={{ pl: 4 }}>
                <ListItemText
                  primary="Curriculum Archive"
                  primaryTypographyProps={{ fontSize: "1.25rem" }}
                />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button sx={{ mt: 2 }}>
            <ListItemIcon>
              <ExitToAppIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText
              primary="Sign Out"
              primaryTypographyProps={{ fontSize: "1.25rem" }}
            />
          </ListItem>
        </List>
      </Box>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, ml: "280px" }}>
        {/* App Bar */}
        <AppBar
          position="fixed"
          color="default"
          elevation={2}
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                component="img"
                src="https://via.placeholder.com/101x62"
                alt="Logo"
                sx={{ height: 62, mr: 2 }}
              />
              <Typography
                variant="h5"
                component="div"
                sx={{ fontFamily: "Alata", color: "#1e1e1e" }}
              >
                Academic Resource Management
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ mr: 1 }}>
                <AccountCircleIcon />
              </Avatar>
              <Typography
                variant="h6"
                sx={{ fontFamily: "Almarai", color: "#1e1e1e" }}
              >
                Admin
              </Typography>
            </Box>
          </Toolbar>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", pr: 4, pb: 1 }}
          >
            <Button
              variant="contained"
              startIcon={<NotificationsActiveIcon />}
              sx={{
                bgcolor: "#10a75ec4",
                borderRadius: "10px",
                textTransform: "none",
                py: 1,
                px: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontFamily: "Almarai", fontWeight: "bold" }}
              >
                Schedule Submitted
              </Typography>
            </Button>
          </Box>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth={false} sx={{ mt: 16, mb: 4, px: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontFamily: "Almarai", fontWeight: 800, mb: 4 }}
          >
            Create Schedule
          </Typography>

          <Paper
            elevation={3}
            sx={{
              borderRadius: "10px",
              overflow: "hidden",
              bgcolor: "#f8f8f8",
              maxWidth: 1150,
            }}
          >
            <Box sx={{ bgcolor: "#d9d9d9", p: 2 }}>
              <Grid container>
                <Grid item xs={3}>
                  <Typography
                    variant="h6"
                    align="center"
                    sx={{
                      fontFamily: "Almarai",
                      fontWeight: "bold",
                      color: "#004080",
                    }}
                  >
                    PROGRAM CODE
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    variant="h6"
                    align="center"
                    sx={{
                      fontFamily: "Almarai",
                      fontWeight: "bold",
                      color: "#004080",
                    }}
                  >
                    SEMESTER
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    variant="h6"
                    align="center"
                    sx={{
                      fontFamily: "Almarai",
                      fontWeight: "bold",
                      color: "#004080",
                    }}
                  >
                    LEVEL
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    variant="h6"
                    align="center"
                    sx={{
                      fontFamily: "Almarai",
                      fontWeight: "bold",
                      color: "#004080",
                    }}
                  >
                    SECTION
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ p: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Select
                    fullWidth
                    displayEmpty
                    defaultValue=""
                    variant="outlined"
                  >
                    <MenuItem value="">Select option</MenuItem>
                    <MenuItem value="option1">Option 1</MenuItem>
                    <MenuItem value="option2">Option 2</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={3}>
                  <Select
                    fullWidth
                    displayEmpty
                    defaultValue=""
                    variant="outlined"
                  >
                    <MenuItem value="">Select Semester</MenuItem>
                    <MenuItem value="sem1">Semester 1</MenuItem>
                    <MenuItem value="sem2">Semester 2</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={3}>
                  <Select
                    fullWidth
                    displayEmpty
                    defaultValue=""
                    variant="outlined"
                  >
                    <MenuItem value="">Select Year</MenuItem>
                    <MenuItem value="year1">Year 1</MenuItem>
                    <MenuItem value="year2">Year 2</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={3}>
                  <Select
                    fullWidth
                    displayEmpty
                    defaultValue=""
                    variant="outlined"
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="section1">Section 1</MenuItem>
                    <MenuItem value="section2">Section 2</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#01579b",
                borderRadius: "20px",
                px: 3,
                py: 1,
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Almarai",
                  fontWeight: "bold",
                  fontSize: "1.375rem",
                }}
              >
                NEXT
              </Typography>
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AddSections;
