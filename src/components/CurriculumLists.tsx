import AddIcon from "@mui/icons-material/Add";
import ArchiveIcon from "@mui/icons-material/Archive";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SchoolIcon from "@mui/icons-material/School";
import {
  AppBar,
  Avatar,
  Box,
  Button,
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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CurriculumRecord {
  CurriculumID: number;
  AcademicYear: string;
  ProgramCode: string;
  ProgramName?: string;
  Notes: string;
}

const CurriculumList: React.FC = () => {
  const navigate = useNavigate();
  const [curriculums, setCurriculums] = useState<CurriculumRecord[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/curriculums?program=BSIT")
      .then((res) => res.json())
      .then((data) => setCurriculums(data))
      .catch((err) => console.error("Error fetching curriculums:", err));
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
    { text: "Faculty Loading", icon: <SchoolIcon />, path: "/faculty" },
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
            sx={{ fontFamily: "'Alata-Regular', Helvetica", fontSize: "1.875rem" }}
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
            <React.Fragment key={item.text}>
              <ListItem disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon sx={{ color: "white", minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                  {item.expandIcon && <Box component="span" sx={{ ml: 1 }}>{item.expandIcon}</Box>}
                </ListItemButton>
              </ListItem>
              {item.subItems?.map((subItem) => (
                <ListItem key={subItem.text} disablePadding>
                  <ListItemButton sx={{ pl: 10 }}>
                    <ListItemText primary={subItem.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </React.Fragment>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: "86px", ml: 2 }}>
        <Typography variant="h4" sx={{ mt: 5, mb: 3 }}>Curriculum</Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/curriculum/add")}
          >
            Add Curriculum
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ maxWidth: 1374 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>YEAR</TableCell>
                <TableCell>PROGRAM CODE</TableCell>
                <TableCell>PROGRAM NAME</TableCell>
                <TableCell>NOTES</TableCell>
                <TableCell>ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {curriculums.map((row) => (
                <TableRow key={row.CurriculumID}>
                  <TableCell>{row.AcademicYear}</TableCell>
                  <TableCell>{row.ProgramCode}</TableCell>
                  <TableCell>{row.ProgramName || "Bachelor of Science in Information Technology"}</TableCell>
                  <TableCell>{row.Notes}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} justifyContent="center">
                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/curriculum/view/${row.CurriculumID}`)}
                        sx={{ bgcolor: "primary.light", color: "black", "&:hover": { bgcolor: "primary.light" } }}
                      >
                        View
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/curriculum/edit/${row.CurriculumID}`)}
                        sx={{ bgcolor: "primary.main", color: "white", "&:hover": { bgcolor: "primary.dark" } }}
                      >
                        Edit
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
  );
};

export default CurriculumList;