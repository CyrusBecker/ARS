import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Grid from './Grid';
import axios from 'axios';

interface Subject {
    id: number;
    name: string;
    course: string;
    yearLevel: string;
}

interface Room {
    id: number;
    type: string; // ComLab, General Classrooms
}

interface Professor {
    id: number;
    units: number;
    target_students: string; // SHS, College or Both
    name: string;
    major_subjects: string[];
}

const ScheduleCreation: React.FC = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [course, setCourse] = useState<string>('');  // This should be set based on the user input
  const [yearLevel, setYearLevel] = useState<string>('');  // Same for yearLevel
  
  // Fetch subjects based on selected course and year level
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        //const response = await axios.get(`your-api-endpoint/subjects?course=${course}&yearLevel=${yearLevel}`);
        //setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    if (course && yearLevel) {
      fetchSubjects();
    }
  }, [course, yearLevel]); // Re-run the effect if course or yearLevel changes

  return (
    <div className="schedule-creation">
      <Sidebar />
      <Grid subjects={subjects} />
    </div>
  );
};

export default ScheduleCreation;