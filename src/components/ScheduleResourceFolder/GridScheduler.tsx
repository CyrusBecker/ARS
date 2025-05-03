import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

interface ScheduledSubject {
  subjectId: number;
  subjectName: string;
  startTime: string;
  endTime: string;
  day: string;
}

interface DragSubject {
  id: number;
  name: string;
  units: number;
}

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const getTimeFromRow = (row: number) => {
  const baseHour = 7;
  const totalMinutes = row * 30;
  const hour = Math.floor(baseHour + totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
};

const GridScheduler: React.FC = () => {
  const [scheduled, setScheduled] = useState<ScheduledSubject[]>([]);

  const handleDrop = (
    e: React.DragEvent<HTMLTableCellElement>,
    row: number,
    day: string
  ) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("subject");
    if (!data) return;
    const subject: DragSubject = JSON.parse(data);
    const startTime = getTimeFromRow(row);
    const endTime = getTimeFromRow(row + subject.units * 2); // 1 unit = 1 hour = 2 rows

    const newScheduled: ScheduledSubject = {
      subjectId: subject.id,
      subjectName: subject.name,
      startTime,
      endTime,
      day,
    };

    setScheduled((prev) => [...prev, newScheduled]);
  };

  const allowDrop = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.preventDefault();
  };

  return (
    <Box sx={{ p: 2 }}>
      <TableContainer component={Paper}>
        <Table>
          {/* Table Header */}
          <TableHead>
            <TableRow>
              <TableCell />
              {days.map((day) => (
                <TableCell key={day} align="center">
                  <Typography fontWeight="bold">{day}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {Array.from({ length: 27 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {/* Time Label Column */}
                <TableCell>{getTimeFromRow(rowIndex)}</TableCell>

                {/* Day Cells */}
                {days.map((day) => {
                  const cellKey = `${day}-${rowIndex}`;
                  return (
                    <TableCell
                      key={cellKey}
                      onDrop={(e) => handleDrop(e, rowIndex, day)}
                      onDragOver={allowDrop}
                      sx={{ height: "50px", verticalAlign: "top" }}
                    >
                      <Paper
                        sx={{
                          height: "100%",
                          position: "relative",
                          bgcolor: "grey.50",
                          border: "1px dashed grey",
                        }}
                        elevation={0}
                      >
                        {scheduled
                          .filter(
                            (s) =>
                              s.startTime === getTimeFromRow(rowIndex) &&
                              s.day === day
                          )
                          .map((s) => (
                            <Box
                              key={s.subjectId}
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                bgcolor: "primary.main",
                                color: "white",
                                p: 0.5,
                                fontSize: "0.75rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 1,
                              }}
                            >
                              {s.subjectName}
                            </Box>
                          ))}
                      </Paper>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GridScheduler;
