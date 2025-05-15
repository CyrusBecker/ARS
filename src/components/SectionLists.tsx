import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Avatar,
  AppBar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SchoolIcon from "@mui/icons-material/School";
import ArchiveIcon from "@mui/icons-material/Archive";

interface SectionRecord {
  SectionID: number;
  SectionName: string;
  CurriculumID: number;
  ProgramCode: string;
  YearLevel: number;
  Semester: number;
  ScheduleStatus: string;
}

const SectionList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sections, setSections] = useState<SectionRecord[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (location.state?.success) {
      setOpenSnackbar(true);
    }
    fetch("http://localhost:3000/api/subj/sections?program=BSIT")
      .then((res) => res.json())
      .then((data) => setSections(data))
      .catch((err) => console.error("Error fetching sections:", err));
  }, []);

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    {
      text: "Schedule",
      icon: <ScheduleIcon />,
      path: "/schedule",
      expandIcon: <ExpandMoreIcon />,
      subItems: [
        { text: "Create Schedule", path: "/schedule/create" },
        { text: "Schedule Overview", path: "/schedule/overview" },
      ],
    },
    { text: "Faculty Loading", icon: <SchoolIcon />, path: "/facultyOverview" },
    { text: "Curriculum", icon: <MenuBookIcon />, path: "/curriculum" },
    { text: "Room Availability", icon: <MeetingRoomIcon />, path: "/rooms" },
    {
      text: "Archive",
      icon: <ArchiveIcon />,
      path: "/archive",
      expandIcon: <ExpandMoreIcon />,
      subItems: [
        { text: "Schedule Archive", path: "/archive/schedule" },
        { text: "Faculty Archive", path: "/archive/faculty" },
        { text: "Curriculum Archive", path: "/archive/curriculum" },
      ],
    },
    { text: "Sign Out", icon: <LogoutIcon />, path: "/signout" },
  ];

  // Grouping the sections by year and semester
  const groupedSections = sections.reduce((acc: any, section) => {
    const key = `Year ${section.YearLevel} - Semester ${section.Semester}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(section);
    return acc;
  }, {});

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: "86px",
          color: "text.primary",
        }}
      >
        <Toolbar>
          <Box
            component="img"
            src="/web-8-1.png"
            alt="STI Logo"
            sx={{ width: "101px", height: "62px", mr: 2 }}
          />
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Alata-Regular', Helvetica",
              fontSize: "1.875rem",
            }}
          >
            Academic Resource Management
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Avatar sx={{ mr: 1 }} />
          <Typography variant="subtitle1">Admin</Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: 383,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 383,
            boxSizing: "border-box",
            mt: "86px",
            height: "calc(100% - 86px)",
          },
        }}
      >
        <List sx={{ mt: 2 }}>
          {menuItems.map((item) => (
            <Box key={item.text}>
              <ListItem disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                  {item.expandIcon && (
                    <Box component="span" sx={{ ml: 1 }}>
                      {item.expandIcon}
                    </Box>
                  )}
                </ListItemButton>
              </ListItem>
              {item.subItems?.map((subItem) => (
                <ListItem key={subItem.text} disablePadding>
                  <ListItemButton sx={{ pl: 10 }}>
                    <ListItemText primary={subItem.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </Box>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: "86px", ml: 2 }}>
        <Typography variant="h4" sx={{ mt: 5, mb: 3 }}>
          BSIT Sections
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/section/add")}
          >
            Add Section
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ maxWidth: 1374 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">YEAR & SEMESTER</TableCell>
                <TableCell align="center">SECTION NAME</TableCell>
                <TableCell align="center">STATUS</TableCell>
                <TableCell align="center">ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(groupedSections).map((group) =>
                groupedSections[group].map(
                  (section: SectionRecord, index: number) => (
                    <TableRow key={section.SectionID}>
                      {index === 0 && (
                        <TableCell
                          rowSpan={groupedSections[group].length}
                          sx={{ fontWeight: "bold", verticalAlign: "top" }}
                        >
                          {group}
                        </TableCell>
                      )}
                      <TableCell>{section.SectionName}</TableCell>
                      <TableCell>
                        {section.ScheduleStatus === "No Schedule" &&
                          "No Schedule"}
                        {section.ScheduleStatus === "Partially Completed" &&
                          "Partially Completed"}
                        {section.ScheduleStatus === "Completed" && "Completed"}
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={2}
                          justifyContent="center"
                        >
                          <Button
                            variant="contained" // outlined, contained
                            startIcon={<EditIcon />}
                            onClick={() =>
                              navigate(`/schedule/create/${section.SectionID}`)
                            }
                            disabled={
                              section.ScheduleStatus ===
                                "Partially Completed" ||
                              section.ScheduleStatus === "Completed"
                            }
                            sx={{
                              bgcolor: "primary.light",
                              color: "black",
                              "&:hover": { bgcolor: "primary.light" },
                            }}
                          >
                            Create Schedule
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() =>
                              navigate(`/schedule/view/${section.SectionID}`)
                            }
                            sx={{
                              bgcolor: "primary.light",
                              color: "black",
                              "&:hover": { bgcolor: "primary.light" },
                            }}
                          >
                            View
                          </Button>
                          {/* New Assign Professors Button */}
                          <Button
                            variant="contained"
                            onClick={() =>
                              navigate(`/schedule/assign/${section.SectionID}`)
                            }
                            sx={{
                              bgcolor: "primary.light",
                              color: "black",
                              "&:hover": { bgcolor: "primary.light" },
                            }}
                          >
                            Assign Professors
                          </Button>
                          <Button
                            disabled
                            sx={{
                              bgcolor: "primary.light",
                              color: "black",
                              "&:hover": { bgcolor: "primary.light" },
                            }}
                          >
                            Archive
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default SectionList;
