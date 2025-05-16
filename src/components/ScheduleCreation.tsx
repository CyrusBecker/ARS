import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { JSX } from "@emotion/react/jsx-runtime";
import { Box, Button } from "@mui/material";

interface DroppedSubject {
  id: string;
  subjectId: number;
  name: string;
  hours: number;
  units: number;
  room: string;
  sectionID: number;
  semester: number;
  yearLevel: number;
  isLab: boolean;
  sectionName: string;
}

interface Room {
  RoomID: number;
  RoomName: string;
  RoomType: "Lecture" | "Laboratory";
  Notes?: string;
}

interface HoverHighlight {
  day: string;
  startIndex: number;
  length: number;
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

const ScheduleCreation: React.FC = () => {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<
    Record<string, { subject: DroppedSubject; rowSpan: number }>
  >({});
  const [subjects, setSubjects] = useState<DroppedSubject[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [draggedSubject, setDraggedSubject] = useState<DroppedSubject | null>(
    null
  );
  const [scheduledSubjects, setScheduledSubjects] = useState<string[]>([]);
  const [hoverHighlight, setHoverHighlight] = useState<HoverHighlight | null>(
    null
  );
  const [sectionName, setSectionName] = useState<string>("");
  const { sectionId } = useParams();
  // console.log("SectionID from URL:", sectionId);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!sectionId) {
        console.warn("No sectionName found");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/sched/subjects/${sectionId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const transformed = data.flatMap((subject: any) => {
          const subjectsArray = [];

          if (subject.LectureHours > 0) {
            subjectsArray.push({
              id: `${subject.SubjectID}-lec`,
              subjectId: subject.SubjectID,
              name: `${subject.CourseCode} - ${subject.CourseName} (Lecture)`,
              hours: subject.LectureHours,
              units: subject.Units,
              room: "",
              sectionID: subject.SectionID,
              semester: subject.Semester,
              yearLevel: subject.YearLevel,
              isLab: false,
            });
          }

          if (subject.LabHours > 0) {
            subjectsArray.push({
              id: `${subject.SubjectID}-lab`,
              subjectId: subject.SubjectID,
              name: `${subject.CourseCode} - ${subject.CourseName} (Lab)`,
              hours: subject.LabHours,
              units: subject.Units,
              room: "",
              sectionID: subject.SectionID,
              semester: subject.Semester,
              yearLevel: subject.YearLevel,
              isLab: true,
            });
          }

          return subjectsArray;
        });

        setSubjects(transformed);
        console.log("Subjects: ", transformed);
      } catch (err) {
        console.error("Failed to load subjects:", err);
      }
    };
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/sched/rooms");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const roomData = await response.json();
        // console.log("Rooms fetched:", roomData);
        setRooms(roomData);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };
    const handleDragEnd = () => {
      setHoverHighlight(null);
      setDraggedSubject(null);
    };

    const fetchSectionName = async () => {
      if (!sectionId) return;
      try {
        const response = await fetch(
          `http://localhost:3000/api/sched/schedules/section/${sectionId}`
        );
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0 && data[0].SectionName) {
          setSectionName(data[0].SectionName);
        }
      } catch (err) {
        // ignore
      }
    };

    fetchRooms();
    fetchSubjects();
    fetchSectionName();
    window.addEventListener("dragend", handleDragEnd);
    return () => window.removeEventListener("dragend", handleDragEnd);
  }, []);

  const handleSaveSchedule = async () => {
    const timeIndexDBTime = [
      "07:00:00",
      "07:30:00",
      "08:00:00",
      "08:30:00",
      "09:00:00",
      "09:30:00",
      "10:00:00",
      "10:30:00",
      "11:00:00",
      "11:30:00",
      "12:00:00",
      "12:30:00",
      "13:00:00",
      "13:30:00",
      "14:00:00",
      "14:30:00",
      "15:00:00",
      "15:30:00",
      "16:00:00",
      "16:30:00",
      "17:00:00",
      "17:30:00",
      "18:00:00",
      "18:30:00",
      "19:00:00",
      "19:30:00",
      "20:00:00",
    ];

    const formattedSchedule = Object.entries(schedule)
      .filter(([_, cell]) => cell.rowSpan > 0)
      .map(([key, cell]) => {
        const [day, startIndexStr] = key.split("_");
        const startIndex = Number(startIndexStr);
        const duration = cell.rowSpan;
        const startTime = timeIndexDBTime[startIndex];
        const endTime = timeIndexDBTime[startIndex + duration];

        return {
          SubjectID: cell.subject.subjectId,
          SectionID: cell.subject.sectionID,
          RoomID: rooms.find((r) => r.RoomName === cell.subject.room)?.RoomID,
          DayOfWeek: day,
          StartTime: startTime,
          EndTime: endTime,
        };
      });

    try {
      console.log("Formatted schedule to send:", formattedSchedule);
      formattedSchedule.forEach((entry, index) => {
        console.log(`Entry ${index}:`, entry);
      });

      const response = await fetch(
        "http://localhost:3000/api/sched/schedules",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ schedule: formattedSchedule }),
        }
      );

      if (!response.ok) throw new Error("Failed to save schedule.");
      alert("Schedule saved successfully!");
      navigate(`/scheduleOverview`);
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert("Error saving schedule.");
    }
  };

  const onDragStart = (
    e: React.DragEvent,
    subject: DroppedSubject,
    origin?: { day: string; timeIndex: number }
  ) => {
    const dragData = {
      ...subject,
      sourcePosition: origin || null,
    };
    e.dataTransfer.setData("subject", JSON.stringify(dragData)); // Carrying the data
    setDraggedSubject(subject); // Tracking subjject for hover highlight
  };

  const onDrop = (e: React.DragEvent, day: string, timeIndex: number) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("subject");
    const subject = JSON.parse(data) as DroppedSubject & {
      sourcePosition?: { day: string; timeIndex: number } | null;
    };

    const subjectSlots = Math.round(subject.hours * 2);

    // Track scheduled subject
    setScheduledSubjects((prev) => {
      // Previous sole line prev.filter((id) => id !== cell.subject.id)
      const alreadyScheduled = prev.includes(subject.id);
      console.log("Currently scheduled:", prev);
      console.log("Trying to schedule:", subject.id);
      if (alreadyScheduled) {
        console.log(`Subject ${subject.id} is already scheduled.`);
        return prev;
      } else {
        const updated = [...prev, subject.id];
        console.log(`Subject ${subject.id} added. New list:`, updated);
        return updated;
      }
    });

    // Checking for overlap
    for (let i = 0; i < subjectSlots; i++) {
      const checkKey = `${day}_${timeIndex + i}`;
      if (schedule[checkKey]) {
        alert(
          "Slot Unavailable!\nEither the slot or its allocation range is occupied!"
        );
        return;
      }
    }

    const newSchedule = { ...schedule };

    // If plotted down and moved, clear old position
    if (subject.sourcePosition) {
      const { day: oldDay, timeIndex: oldTimeIndex } = subject.sourcePosition;
      // const oldKey = `${oldDay}_${oldTimeIndex}`; || No uses found yet.
      const oldSubjectSlots = Math.round(subject.hours * 2);

      for (let i = 0; i < oldSubjectSlots; i++) {
        delete newSchedule[`${oldDay}_${oldTimeIndex + i}`];
      }
    }

    // Dropping/plotting the subject
    const newKey = `${day}_${timeIndex}`;
    newSchedule[newKey] = { subject, rowSpan: subjectSlots };
    for (let i = 1; i < subjectSlots; i++) {
      newSchedule[`${day}_${timeIndex + i}`] = { subject, rowSpan: 0 };
    }

    setDraggedSubject(null);
    setSchedule(newSchedule);
    setHoverHighlight(null);
  };

  const onDragOver = (
    e: React.DragEvent,
    day: string,
    timeIndex: number,
    hours?: number
  ) => {
    e.preventDefault();
    if (hours) {
      setHoverHighlight({
        day,
        startIndex: timeIndex,
        length: Math.round(hours * 2),
      });
    }
  };

  const onDragLeave = () => {
    setHoverHighlight(null);
  };

  const onDragHL = () => {
    setDraggedSubject(null);
    setHoverHighlight(null);
  };

  const updateRoom = (subjectId: string | number, newRoom: string) => {
    setSchedule((prevSchedule) => {
      const newSchedule = { ...prevSchedule };
      for (const key in newSchedule) {
        if (newSchedule[key].subject.id === subjectId) {
          newSchedule[key] = {
            ...newSchedule[key],
            subject: {
              ...newSchedule[key].subject,
              room: newRoom,
            },
          };
        }
      }
      return newSchedule;
    });
  };

  const removeSubject = (day: string, timeIndex: number, hours: number) => {
    const subjectSlots = Math.round(hours * 2);
    const updatedSchedule = { ...schedule };

    for (let i = 0; i < subjectSlots; i++) {
      delete updatedSchedule[`${day}_${timeIndex + i}`];
    }

    setSchedule(updatedSchedule);
  };

  return (
    <Box display="flex">
      {/* Sidebar */}
      <Box
        sx={{
          width: 250,
          padding: 2,
          borderRight: "1px solid #ccc",
        }}
      >
        <h3>Subjects</h3>
        {subjects.length === 0 ? (
          <p>Loading subjects...</p>
        ) : (
          subjects.map((subj) => {
            const isScheduled = scheduledSubjects.includes(subj.id);
            return (
              <div
                key={subj.id}
                draggable={!isScheduled}
                onDragStart={(e) => !isScheduled && onDragStart(e, subj)}
                style={{
                  border: "1px solid #aaa",
                  padding: "10px",
                  marginBottom: "10px",
                  backgroundColor: isScheduled
                    ? "#f0f0f0"
                    : subj.isLab
                    ? "#fff0f6"
                    : "#e6f7ff",
                  cursor: isScheduled ? "not-allowed" : "grab",
                  opacity: isScheduled ? 0.5 : 1,
                  borderRadius: "6px",
                  overflow: "hidden",
                }}
              >
                <strong>{subj.name}</strong> <br />
                {subj.hours} hr{subj.hours > 1 ? "s" : ""} (
                {subj.isLab ? "Lab" : "Lec"})
              </div>
            );
          })
        )}
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
            {sectionName ? `Schedule for ${sectionName}` : ""}
          </Box>
          <Box display="flex" gap={2}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleSaveSchedule}
            >
              Save Schedule
            </Button>
          </Box>
        </Box>
        {/* Schedule Table */}
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
                    const cell = schedule[key];

                    if (cell) {
                      if (cell.rowSpan === 0) return null;
                      return (
                        <td
                          key={key}
                          onDragOver={(e) =>
                            onDragOver(e, day, rowIndex, draggedSubject?.hours)
                          }
                          onDragLeave={onDragLeave}
                          onDrop={(e) => onDrop(e, day, rowIndex)}
                          rowSpan={cell.rowSpan}
                          style={{
                            backgroundColor: cell.subject.isLab
                              ? "#ffe6cc" // Example lab color (light orange)
                              : "#d0f0d0", // Example lecture color (light green)
                          }}
                        >
                          <div
                            draggable
                            onDragStart={(e) =>
                              onDragStart(e, cell.subject, {
                                day,
                                timeIndex: rowIndex,
                              })
                            }
                            onDragEnd={onDragHL}
                            style={{
                              cursor: "grab",
                              backgroundColor: "#transparent",
                              borderRadius: "6px",
                              padding: "6px",
                            }}
                          >
                            <strong>{cell.subject.name}</strong>
                            <br />
                            Room:
                            <select
                              value={cell.subject.room}
                              onChange={(e) =>
                                updateRoom(cell.subject.id, e.target.value)
                              }
                            >
                              <option
                                value=""
                                disabled
                                selected
                                hidden
                              ></option>
                              {rooms
                                .filter(
                                  (room) =>
                                    room.RoomType ===
                                    (cell.subject.isLab
                                      ? "Laboratory"
                                      : "Lecture")
                                )
                                .map((room) => (
                                  <option
                                    key={room.RoomID}
                                    value={room.RoomName}
                                  >
                                    {room.RoomName}{" "}
                                    {room.Notes ? ` - ${room.Notes}` : ""}
                                  </option>
                                ))}
                            </select>
                            <br />
                            {cell.subject.hours} hrs
                            <br />
                            <button
                              onClick={() =>
                                removeSubject(day, rowIndex, cell.subject.hours)
                              }
                              style={{
                                marginTop: "4px",
                                fontSize: "0.8rem",
                                backgroundColor: "tomato",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                padding: "2px 6px",
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      );
                    } else {
                      return (
                        <td
                          key={key}
                          onDragOver={(e) =>
                            onDragOver(e, day, rowIndex, draggedSubject?.hours)
                          }
                          onDrop={(e) => onDrop(e, day, rowIndex)}
                          style={{
                            height: "40px",
                            minWidth: "100px",
                            backgroundColor:
                              hoverHighlight &&
                              hoverHighlight.day === day &&
                              rowIndex >= hoverHighlight.startIndex &&
                              rowIndex <
                                hoverHighlight.startIndex +
                                  hoverHighlight.length
                                ? "#cbe4ff"
                                : "white",
                          }}
                        />
                      );
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

export default ScheduleCreation;
