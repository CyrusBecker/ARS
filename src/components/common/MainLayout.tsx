import React from "react";
import { Box, Toolbar, } from "@mui/material";
import Navigation from "./Navigation";
import DrawerWithToggle, { MenuItem } from "./Drawer";
import HomeIcon from "@mui/icons-material/Home";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SchoolIcon from "@mui/icons-material/School";
import RoomIcon from "@mui/icons-material/MeetingRoom";
import ArchiveIcon from "@mui/icons-material/Archive";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [scheduleOpen, setScheduleOpen] = React.useState(true);
  const [curriculumOpen, setCurriculumOpen] = React.useState(true);
  const [archiveOpen, setArchiveOpen] = React.useState(true);
  const [drawerOpen, setDrawerOpen] = React.useState(true);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems: MenuItem[] = [
    {
        text: "Home",
        icon: <HomeIcon />,
        path: "/dashboard",
      },
      {
        text: "Schedule",
        icon: <ScheduleIcon />,
        hasSubmenu: true,
        submenuItems: [
          { text: "Schedule Overview", path: "#" },
          { text: "Faculty", path: "#" },
        ],
      },
      {
       text: "Curriculum",
       icon: <SchoolIcon />,
       hasSubmenu: true,
       submenuItems: [
        {text: "Create Curriculum", path: '/curriculum/add' }, 
        {text: "View Curriculum", path: '#'}, 
       ]
      },
      {
        text: "Room Management",
        icon: <RoomIcon />,
        path: "#",
      },
      {
        text: "Archive",
        icon: <ArchiveIcon />,
        hasSubmenu: true,
        submenuItems: [
          { text: "Schedule Archive", path: "#" },
          { text: "Faculty Archive", path: "#" },
          { text: "Curriculum Archive", path: "#" },
        ],
      },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Navigation onMenuClick={handleDrawerToggle}/>
      <DrawerWithToggle
        open={drawerOpen}
        menuItems={menuItems}
        scheduleOpen={scheduleOpen}
        curriculumOpen={curriculumOpen}
        archiveOpen={archiveOpen}
        onScheduleClick={() => setScheduleOpen(!scheduleOpen)}
        onCurriculumClick={() => setCurriculumOpen(!curriculumOpen)}
        onArchiveClick={() => setArchiveOpen(!archiveOpen)}
      />*
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerOpen ? 383 : 0}px)` },
          ml: drawerOpen ? "383px" : "0px", // "240px" : "60px"  Appbar Width
          mt: '64px', // Appbar height
          transition: "margin-left 0.3s ease, width 0.3s ease",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
