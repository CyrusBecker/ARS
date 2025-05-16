import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";

interface ScheduleEntry {
  ScheduleID: number;
  SubjectID: number;
  SectionID: number;
  RoomID: number;
  ProfessorID?: number | null;
  DayOfWeek: string;
  StartTime: string;
  EndTime: string;
  CourseCode: string;
  CourseName: string;
  LectureHours: number;
  LabHours: number;
  isLab: boolean;
  FullName: string; // Professor's name
  RoomName: string;
  SectionName: string;
  Units: number;
}

interface Professor {
  ProfessorID: number;
  FullName: string;
  MaxUnits: number;
  CurrentUnits: number;
}

interface ProfessorAvailability {
  currentUnits: number;
  occupiedSlots: {
    DayOfWeek: string;
    StartTime: string;
    EndTime: string;
    SectionID: number;
  }[];
  eligibleSubjects: number[];
}

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const timeSlots = [
  "7:00 AM - 7:30 AM",
  "7:30 AM - 8:00 AM",
  "8:00 AM - 8:30 AM",
  "8:30 AM - 9:00 AM",
  "9:00 AM - 9:30 AM",
  "9:30 AM - 10:00 AM",
  "10:00 AM - 10:30 AM",
  "10:30 AM - 11:00 AM",
  "11:00 AM - 11:30 AM",
  "11:30 AM - 12:00 PM",
  "12:00 PM - 12:30 PM",
  "12:30 PM - 1:00 PM",
  "1:00 PM - 1:30 PM",
  "1:30 PM - 2:00 PM",
  "2:00 PM - 2:30 PM",
  "2:30 PM - 3:00 PM",
  "3:00 PM - 3:30 PM",
  "3:30 PM - 4:00 PM",
  "4:00 PM - 4:30 PM",
  "4:30 PM - 5:00 PM",
  "5:00 PM - 5:30 PM",
  "5:30 PM - 6:00 PM",
  "6:00 PM - 6:30 PM",
  "6:30 PM - 7:00 PM",
  "7:00 PM - 7:30 PM",
  "7:30 PM - 8:00 PM",
  "8:00 PM - 8:30 PM",
];

const AssigningProfessors: React.FC = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const [scheduleData, setScheduleData] = useState<ScheduleEntry[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [professorAvailability, setProfessorAvailability] = useState<
    Record<number, ProfessorAvailability>
  >({});
  const [draggedProfessor, setDraggedProfessor] = useState<Professor | null>(
    null
  );
  const [sectionName, setSectionName] = useState<string>("");

  useEffect(() => {
    fetch(`http://localhost:3000/api/profassign/schedules/section/${sectionId}`)
      .then((res) => res.json())
      .then((data) => {
        setScheduleData(data);
        if (data.length > 0) setSectionName(data[0].SectionName);
        /*
        if (Array.isArray(data) && data.length > 0 && data[0].SectionName) {
          setSectionName(data[0].SectionName);
        } */
      });

    fetch(`http://localhost:3000/api/profassign/professors`)
      .then((res) => res.json())
      .then((profs) => {
        setProfessors(profs);
        // Fetch professor availability for each professor
        profs.forEach((prof: Professor) => {
          fetch(
            `http://localhost:3000/api/profassign/professor-availability/${prof.ProfessorID}`
          )
            .then((res) => res.json())
            .then((data) => {
              setProfessorAvailability((prev) => ({
                ...prev,
                [prof.ProfessorID]: data,
              }));
            });
        });
      });
  }, [sectionId]);

  // Helper: Extract "HH:mm" from ISO or time string
  const getHHMM = (isoOrTime: string) => {
    const date = new Date(isoOrTime);
    if (!isNaN(date.getTime())) {
      return date.toISOString().substr(11, 5);
    }
    const match = isoOrTime.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      return `${match[1].padStart(2, "0")}:${match[2]}`;
    }
    return "";
  };

  const getSlotStartHHMM = (slot: string) => {
    const match = slot.match(/^(\d{1,2}):(\d{2})/);
    if (!match) return "";
    let hour = parseInt(match[1], 10);
    const minute = match[2];
    if (slot.includes("PM") && hour !== 12) hour += 12;
    if (slot.includes("AM") && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  };

  // Calculate pending units for each professor (including local assignments)
  const getPendingUnits = (prof: Professor) => {
    let pending = 0;
    scheduleData.forEach((s) => {
      if (
        s.ProfessorID === prof.ProfessorID &&
        String(s.SectionID) === String(sectionId) // Only count for this section
      ) {
        // If Lab type, units = LabHours / 3 (or as per subject's Units if only Lab)
        if (s.isLab) {
          // If both Lec and Lab exist, use the Lab allocation formula
          // If LabHours is 0, units is 0
          // If Units is split, Lab units = LabHours / 3 (rounded to nearest 0.5 or 1)
          // But if subject is only Lab (no Lec), Units is the total units
          if (s.LabHours > 0 && s.LectureHours > 0) {
            // Split units: Lab units = LabHours / 3
            pending += s.LabHours / 3;
          } else if (s.LabHours > 0 && s.LectureHours === 0) {
            // Pure Lab subject
            pending += s.Units;
          }
        } else {
          // Lecture type: Lec units = LectureHours
          if (s.LectureHours > 0 && s.LabHours > 0) {
            // Split units: Lec units = Units - (LabHours / 3)
            pending += s.Units - s.LabHours / 3;
          } else if (s.LectureHours > 0 && s.LabHours === 0) {
            // Pure Lecture subject
            pending += s.Units;
          }
        }
      }
    });
    return pending;
  };

  // Drag handlers
  const onDragStart = (prof: Professor) => setDraggedProfessor(prof);
  const onDragEnd = () => setDraggedProfessor(null);

  // Assign professor to a schedule cell (local only)
  const onDrop = (scheduleId: number) => {
    if (!draggedProfessor) return;
    setScheduleData((sd) =>
      sd.map((s) =>
        s.ScheduleID === scheduleId
          ? {
              ...s,
              ProfessorID: draggedProfessor.ProfessorID,
              FullName: draggedProfessor.FullName,
            }
          : s
      )
    );
    setDraggedProfessor(null);
  };

  // Remove professor from a schedule cell (local only)
  const removeProfessor = (scheduleId: number) => {
    setScheduleData((sd) =>
      sd.map((s) =>
        s.ScheduleID === scheduleId
          ? { ...s, ProfessorID: null, FullName: "" }
          : s
      )
    );
  };

  // Save all assignments for this section (persist to backend)
  const saveAssignments = async () => {
    try {
      // Only send assignments that have a ProfessorID (not null)
      const assignments = scheduleData
        .filter((s) => s.ProfessorID)
        .map((s) => ({
          ScheduleID: s.ScheduleID,
          ProfessorID: s.ProfessorID,
          SectionID: s.SectionID,
        }));

      const response = await fetch(
        "http://localhost:3000/api/profassign/assign-bulk",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assignments }),
        }
      );

      if (!response.ok) throw new Error("Failed to save assignments.");
      alert("Professor assignments saved!");
      // Optionally, refresh professors to update CurrentUnits
      fetch(`http://localhost:3000/api/profassign/professors`)
        .then((res) => res.json())
        .then(setProfessors);

      // After save, reload scheduleData to clear pending
      fetch(
        `http://localhost:3000/api/profassign/schedules/section/${sectionId}`
      )
        .then((res) => res.json())
        .then((data) => {
          setScheduleData(data);
          if (data.length > 0) setSectionName(data[0].SectionName);
        });
    } catch (err) {
      alert("Failed to save assignments.");
    }
  };

  // Build mergedCells map for rendering
  const mergedCells: {
    [key: string]: { rowSpan: number; entry: ScheduleEntry };
  } = {};

  scheduleData.forEach((entry) => {
    const startHHMM = getHHMM(entry.StartTime);
    const endHHMM = getHHMM(entry.EndTime);
    const startIndex = timeSlots.findIndex(
      (slot) => getSlotStartHHMM(slot) === startHHMM
    );
    if (startIndex === -1) return;
    // Calculate span by time difference (in minutes) between StartTime and EndTime
    const [startHour, startMin] = startHHMM.split(":").map(Number);
    const [endHour, endMin] = endHHMM.split(":").map(Number);
    const startTotal = startHour * 60 + startMin;
    const endTotal = endHour * 60 + endMin;
    const span = Math.round((endTotal - startTotal) / 30);
    const finalSpan = span > 0 ? span : 1;
    for (let i = 0; i < finalSpan; i++) {
      const key = `${entry.DayOfWeek}_${startIndex + i}`;
      mergedCells[key] = {
        entry,
        rowSpan: i === 0 ? finalSpan : 0,
      };
    }
  });

  // Compute local pending units for each professor (only for this section)
  const professorPendingUnits: { [profId: number]: number } = {};
  professors.forEach((prof) => {
    professorPendingUnits[prof.ProfessorID] = scheduleData
      .filter(
        (s) =>
          s.ProfessorID === prof.ProfessorID &&
          String(s.SectionID) === String(sectionId) // Only count for this section
      )
      .reduce((pending, s) => {
        if (s.isLab) {
          if (s.LabHours > 0 && s.LectureHours > 0) {
            pending += s.LabHours / 3;
          } else if (s.LabHours > 0 && s.LectureHours === 0) {
            pending += s.Units;
          }
        } else {
          if (s.LectureHours > 0 && s.LabHours > 0) {
            pending += s.Units - s.LabHours / 3;
          } else if (s.LectureHours > 0 && s.LabHours === 0) {
            pending += s.Units;
          }
        }
        return pending;
      }, 0);
  });

  return (
    <Box display="flex">
      {/* Professors sidebar */}
      <Box sx={{ width: 250, p: 2, borderRight: "1px solid #ccc" }}>
        <h3>Professors</h3>
        {professors.map((prof) => {
          const pendingUnits = getPendingUnits(prof);
          const avail = professorAvailability[prof.ProfessorID];
          const realUnits = avail ? avail.currentUnits : prof.CurrentUnits;
          // Only check if realUnits (from DB) has reached max, pendingUnits is for this section only
          const isMaxed = realUnits >= prof.MaxUnits;
          return (
            <div
              key={prof.ProfessorID}
              draggable={!isMaxed}
              onDragStart={() => !isMaxed && onDragStart(prof)}
              onDragEnd={onDragEnd}
              style={{
                border: "1px solid #aaa",
                padding: "8px",
                marginBottom: "8px",
                background: isMaxed ? "#eee" : "#e6f7ff",
                borderRadius: "6px",
                cursor: isMaxed ? "not-allowed" : "grab",
                opacity: isMaxed ? 0.5 : 1,
              }}
              title={
                isMaxed
                  ? "Professor has reached max units"
                  : `Current Units: ${realUnits} + Pending: ${pendingUnits}`
              }
            >
              <strong>{prof.FullName}</strong>
              <br />
              Current Units:
              <br />
              {realUnits} / {prof.MaxUnits}
              <br />
              Pending:
              <br />
              {pendingUnits} / {prof.MaxUnits}
              {isMaxed && (
                <span style={{ color: "red", fontSize: "0.85em" }}> (Max)</span>
              )}
            </div>
          );
        })}
      </Box>
      {/* Main content */}
      <Box sx={{ flexGrow: 1, p: 2 }}>
        {/* Section name and buttons in one row */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box fontWeight="bold" fontSize={20}>
            {sectionName ? `Assign Professors for ${sectionName}` : ""}
          </Box>
          <Box display="flex" gap={2}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={saveAssignments}
            >
              Save Assignments
            </Button>
          </Box>
        </Box>
        <Box sx={{ overflowX: "auto" }}>
          <table
            border={1}
            cellPadding={4}
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
            <thead>
              <tr>
                <th style={{ width: "100px" }}>Time</th>
                {days.map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time, rowIndex) => (
                <tr key={rowIndex}>
                  <td style={{ fontSize: "0.75rem", padding: "4px" }}>
                    {time}
                  </td>
                  {days.map((day) => {
                    const key = `${day}_${rowIndex}`;
                    const cellInfo = mergedCells[key];
                    if (cellInfo && cellInfo.rowSpan > 0) {
                      const { entry, rowSpan } = cellInfo;
                      // Calculate hours from rowSpan (each slot is 0.5 hr)
                      const hours = rowSpan * 0.5;
                      // Check professor eligibility before allowing drop
                      const canDrop =
                        draggedProfessor &&
                        professorAvailability[draggedProfessor.ProfessorID] &&
                        professorAvailability[
                          draggedProfessor.ProfessorID
                        ].eligibleSubjects.includes(entry.SubjectID);
                      return (
                        <td
                          key={key}
                          rowSpan={rowSpan}
                          onDragOver={(e) => {
                            e.preventDefault();
                          }}
                          onDrop={() => {
                            if (canDrop) {
                              onDrop(entry.ScheduleID);
                            } else if (draggedProfessor) {
                              alert(
                                "This professor is not eligible to teach this subject."
                              );
                            }
                          }}
                          style={{
                            backgroundColor: "#d5f0d5",
                            minWidth: 120,
                            verticalAlign: "top",
                          }}
                        >
                          <div style={{ padding: "6px", fontSize: "0.85rem" }}>
                            <strong>
                              {entry.CourseCode} - {entry.CourseName} (
                              {entry.isLab ? "Lab" : "Lecture"})
                            </strong>
                            <br />
                            Room: {entry.RoomName}
                            <br />
                            {hours} hrs
                            <br />
                            Professor:{" "}
                            <span
                              style={{
                                color: entry.FullName ? "black" : "red",
                              }}
                            >
                              {entry.FullName || "Unassigned"}
                            </span>
                            <br />
                            {entry.ProfessorID && (
                              <button
                                style={{
                                  marginLeft: 8,
                                  background: "#ffcccc",
                                  border: "none",
                                  borderRadius: "4px",
                                  padding: "2px 8px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  removeProfessor(entry.ScheduleID)
                                }
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </td>
                      );
                    } else if (cellInfo && cellInfo.rowSpan === 0) {
                      return null;
                    } else {
                      return <td key={key}></td>;
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    </Box>
  );
};

export default AssigningProfessors;
