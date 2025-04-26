import React from 'react';
import Navigation from './common/Navigation';
import CoursesForCurriculum from './CoursesForCurriculum';
import { Box } from '@mui/material';

const AddingCourses: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navigation Bar (fixed top layout) */}

      {/* Main Content below the nav */}
      <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>
        <CoursesForCurriculum />
      </Box>
    </Box>
  );
};

export default AddingCourses;
