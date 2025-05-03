import React from "react";
import { Paper, Typography, Box } from "@mui/material";

interface Subject {
  id: number;
  name: string;
  units: number;
}

interface Props {
  subjects: Subject[];
}

const SubjectSidebar: React.FC<Props> = ({ subjects }) => {
  return (
    <Box
      sx={{
        width: 300,
        p: 2,
        bgcolor: "grey.100",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Subjects
      </Typography>
      {subjects.map((subject) => (
        <Paper
          key={subject.id}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData("subject", JSON.stringify(subject));
          }}
          sx={{
            p: 2,
            mb: 2,
            cursor: "grab",
            bgcolor: "primary.light",
            borderRadius: 2,
          }}
          elevation={3}
        >
          <Typography variant="subtitle1">{subject.name}</Typography>
          <Typography variant="caption">{subject.units} units</Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default SubjectSidebar;
