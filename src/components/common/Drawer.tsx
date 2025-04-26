import {
    Collapse,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Box,
  } from "@mui/material";
  
import {
    ExpandLess,
    ExpandMore,
    ExitToApp as SignOutIcon,
  } from "@mui/icons-material";

import React from "react";
  
  export interface MenuItem {
    text: string;
    icon: React.ReactNode;
    path?: string;
    hasSubmenu?: boolean;
    submenuItems?: { text: string; path: string }[];
  }
  
  interface DrawerProps {
    open: boolean;
    menuItems: MenuItem[];
    scheduleOpen: boolean;
    curriculumOpen: boolean;
    archiveOpen: boolean;
    onScheduleClick: () => void;
    onCurriculumClick: () => void;
    onArchiveClick: () => void;
  }
  
  const DrawerWithToggle: React.FC<DrawerProps> = ({
    open,
    menuItems,
    scheduleOpen,
    curriculumOpen,
    archiveOpen,
    onScheduleClick,    
    onCurriculumClick,
    onArchiveClick,
  }) => {
    return (
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: 383,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 383,
            boxSizing: "border-box",
            bgcolor: "primary.main",
            color: "common.white",
            border: "none",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", mt: 2 }}>
          <List>
            {menuItems.map((item) => {
              const isOpen =
                item.text === "Schedule"
                  ? scheduleOpen
                  : item.text === "Curriculum"
                  ? curriculumOpen
                  : item.text === "Archive"
                  ? archiveOpen
                  : false;
              const onClick =
                item.text === "Schedule"
                  ? onScheduleClick
                  :item.text === "Curriculum"
                  ? onCurriculumClick
                  : item.text === "Archive"
                  ? onArchiveClick
                  : undefined;
  
              return (
                <React.Fragment key={item.text}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={item.hasSubmenu ? onClick : undefined} sx={{ pl: 4 }}>
                      <ListItemIcon sx={{ color: "common.white" }}>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                      {item.hasSubmenu && (isOpen ? <ExpandLess /> : <ExpandMore />)}
                    </ListItemButton>
                  </ListItem>
  
                  {item.hasSubmenu && isOpen && item.submenuItems && (
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.submenuItems.map((subItem) => (
                          <ListItem key={subItem.text} disablePadding>
                            <ListItemButton sx={{ pl: 10 }}>
                              <ListItemText primary={subItem.text} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </React.Fragment>
              );
            })}
  
            {/* Sign Out */}
            <ListItem disablePadding sx={{ mt: 4 }}>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon sx={{ color: "common.white" }}>
                  <SignOutIcon />
                </ListItemIcon>
                <ListItemText primary="Sign Out" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    );
  };
  
  export default DrawerWithToggle;
  