import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface NavigationProps {
  onMenuClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onMenuClick }) => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#004080', height: 64, zIndex: 1200 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            color="inherit" 
            edge="start"
            onClick={onMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            ARM System
          </Typography>
        </Box>

        <Box>
          <Button color="inherit">Admin</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;