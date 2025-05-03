import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { JSX } from "@emotion/react/jsx-runtime";

interface DroppedSubject {
  id: number;
  subjectId: number; // NEW: the actual SubjectID from DB
  name: string;
  hours: number;
  units: number;
  professor: {
    id: number;
    name: string;
  } | null;
  room: string;
  sectionId: number;
  academicYear: string;
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

interface ProfessorData {
  ProfessorID: number;
  FullName: string;
  MaxUnits: number;
  CurrentUnits: number;
}

interface ProfessorSubjectMap {
  ProfessorID: number;
  SubjectID: number;
  FullName: string;
  CourseCode: string;
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
  const [schedule, setSchedule] = useState<
    Record<string, { subject: DroppedSubject; rowSpan: number }>
  >({});
  const [subjects, setSubjects] = useState<DroppedSubject[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [professors, setProfessors] = useState<ProfessorData[]>([]);
  const [professorSubjects, setProfessorSubjects] = useState<
    ProfessorSubjectMap[]
  >([]);
  const { sectionName } = useParams();
  // console.log("Section name from URL:", sectionName);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!sectionName) {
        console.warn("No sectionName found");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/sched/subjects/${sectionName}`
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
              professor: "",
              room: "",
              sectionId: subject.SectionId,
              academicYear: "",
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
              professor: "",
              room: "",
              sectionId: subject.SectionId,
              academicYear: "",
              semester: subject.Semester,
              yearLevel: subject.YearLevel,
              isLab: true,
            });
          }

          return subjectsArray;
        });

        setSubjects(transformed);
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
        console.log("Rooms fetched:", roomData);
        setRooms(roomData);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };
    const fetchProfessors = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/sched/professors"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Professors fetched:", data);
        setProfessors(data);
      } catch (err) {
        console.error("Failed to fetch professors:", err);
      }
    };
    const fetchProfessorSubjects = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/sched/professor-subjects"
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setProfessorSubjects(data);
      } catch (err) {
        console.error("Failed to fetch professor-subject mappings:", err);
      }
    };

    fetchRooms();
    fetchSubjects();
    fetchProfessors();
    fetchProfessorSubjects();
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

        const occupiedKeys = Array.from({ length: duration }, (_, i) => {
          return `${day}_${startIndex + i}`;
        });

        return {
          SubjectID: cell.subject.subjectId,
          SectionID: cell.subject.sectionId,
          ProfessorID: cell.subject.professor?.id,
          RoomID: rooms.find((r) => r.RoomName === cell.subject.room)?.RoomID,
          DayOfWeek: day,
          StartTime: startTime,
          EndTime: endTime,
          OccupiedKeys: occupiedKeys.join(","),
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
    } catch (error) {
      console.error(error);
      alert("Error saving schedule.");
    }
  };

  const onDragStart = (e: React.DragEvent, subject: DroppedSubject) => {
    e.dataTransfer.setData("subject", JSON.stringify(subject));
  };

  const onDrop = (e: React.DragEvent, day: string, timeIndex: number) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("subject");
    const subject = JSON.parse(data) as DroppedSubject;
    const key = `${day}_${timeIndex}`;

    const hours = subject.hours;
    const subjectSlots = Math.round(hours * 2);

    for (let i = 0; i < subjectSlots; i++) {
      const checkKey = `${day}_${timeIndex + i}`;
      if (schedule[checkKey]) {
        alert("Time slot is already occupied!");
        return;
      }
    }

    const newSchedule = { ...schedule };
    newSchedule[key] = { subject, rowSpan: subjectSlots };
    for (let i = 1; i < subjectSlots; i++) {
      newSchedule[`${day}_${timeIndex + i}`] = { subject, rowSpan: 0 }; // Mark as covered
    }

    setSchedule(newSchedule);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
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

  const updateProfessor = (subjectId: string | number, professorId: number) => {
    const selected = professors.find((p) => p.ProfessorID === professorId);
    if (!selected) return;

    setSchedule((prev) => {
      const updated = { ...prev };
      for (const key in updated) {
        if (updated[key].subject.id === subjectId) {
          updated[key] = {
            ...updated[key],
            subject: {
              ...updated[key].subject,
              professor: { id: selected.ProfessorID, name: selected.FullName },
            },
          };
        }
      }
      return updated;
    });
  };

  const renderProfessorOptions = (subject: DroppedSubject) => {
    const available: JSX.Element[] = [];
    const full: JSX.Element[] = [];

    const matchingProfessors = professorSubjects.filter(
      (ps) => ps.SubjectID === subject.subjectId
    );

    if (matchingProfessors.length === 0) {
      return <option disabled>No professors qualified</option>;
    }

    matchingProfessors.forEach((ps) => {
      const prof = professors.find((p) => p.ProfessorID === ps.ProfessorID);
      if (!prof) return;

      const exceedsUnits = prof.CurrentUnits + subject.units > prof.MaxUnits;

      const option = (
        <option
          key={prof.ProfessorID}
          value={prof.ProfessorID}
          disabled={exceedsUnits}
        >
          {prof.FullName} ({prof.CurrentUnits}/{prof.MaxUnits} units)
          {exceedsUnits ? " ❌ Max Load" : ""}
        </option>
      );

      if (exceedsUnits) full.push(option);
      else available.push(option);
    });

    return (
      <>
        {available.length > 0 && (
          <optgroup label="Available">{available}</optgroup>
        )}
        {full.length > 0 && <optgroup label="Fully Loaded">{full}</optgroup>}
      </>
    );
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          padding: "10px",
          borderRight: "1px solid #ccc",
        }}
      >
        <h3>Subjects</h3>
        {subjects.length === 0 ? (
          <p>Loading subjects...</p>
        ) : (
          subjects.map((subj) => (
            <div
              key={subj.id}
              draggable
              onDragStart={(e) => onDragStart(e, subj)}
              style={{
                border: "1px solid #aaa",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#e6f7ff",
                cursor: "grab",
              }}
            >
              <strong>{subj.name}</strong> <br />
              {subj.hours * 1} hrs
            </div>
          ))
        )}
      </div>

      {/* Schedule Table */}
      <div style={{ overflowX: "auto", padding: "10px", flexGrow: 1 }}>
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
                <td>{time}</td>
                {days.map((day) => {
                  const key = `${day}_${rowIndex}`;
                  const cell = schedule[key];

                  if (cell) {
                    if (cell.rowSpan === 0) return null;
                    return (
                      <td
                        key={key}
                        rowSpan={cell.rowSpan}
                        style={{ backgroundColor: "#d0f0d0" }}
                      >
                        <div>
                          <strong>{cell.subject.name}</strong>
                          <br />
                          Room: {/*cell.subject.room*/}
                          <select
                            value={cell.subject.room}
                            onChange={(e) =>
                              updateRoom(cell.subject.id, e.target.value)
                            }
                          >
                            {rooms
                              .filter(
                                (room) =>
                                  room.RoomType ===
                                  (cell.subject.isLab
                                    ? "Laboratory"
                                    : "Lecture")
                              )
                              .map((room) => (
                                <option key={room.RoomID} value={room.RoomName}>
                                  {room.RoomName}{" "}
                                  {room.Notes ? ` - ${room.Notes}` : ""}
                                </option>
                              ))}
                          </select>
                          <br />
                          Prof: {/*cell.subject.professor?.name*/}
                          <select
                            value={cell.subject.professor?.id ?? ""}
                            onChange={(e) =>
                              updateProfessor(
                                cell.subject.id,
                                parseInt(e.target.value)
                              )
                            }
                          >
                            {renderProfessorOptions(cell.subject)}
                          </select>
                          <br />
                          {cell.subject.hours * 1} hrs
                        </div>
                      </td>
                    );
                  } else {
                    return (
                      <td
                        key={key}
                        onDragOver={onDragOver}
                        onDrop={(e) => onDrop(e, day, rowIndex)}
                        style={{ height: "40px", minWidth: "100px" }}
                      />
                    );
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}
      >
        <button
          onClick={handleSaveSchedule}
          style={{ width: "150px", height: "100px" }}
        >
          Save Schedule
        </button>
      </div>
    </div>
  );
};

export default ScheduleCreation;
