import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
}

const days = [
  "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
];

const timeSlots = [
  "7:00 AM - 7:30 AM", "7:30 AM - 8:00 AM", "8:00 AM - 8:30 AM",
  "8:30 AM - 9:00 AM", "9:00 AM - 9:30 AM", "9:30 AM - 10:00 AM",
  "10:00 AM - 10:30 AM", "10:30 AM - 11:00 AM", "11:00 AM - 11:30 AM",
  "11:30 AM - 12:00 PM", "12:00 PM - 12:30 PM", "12:30 PM - 1:00 PM",
  "1:00 PM - 1:30 PM", "1:30 PM - 2:00 PM", "2:00 PM - 2:30 PM",
  "2:30 PM - 3:00 PM", "3:00 PM - 3:30 PM", "3:30 PM - 4:00 PM",
  "4:00 PM - 4:30 PM", "4:30 PM - 5:00 PM", "5:00 PM - 5:30 PM", 
  "5:30 PM - 6:00 PM", "6:00 PM - 6:30 PM", "6:30 PM - 7:00 PM",
  "7:00 PM - 7:30 PM", "7:30 PM - 8:00 PM", "8:00 PM - 8:30 PM",
];

const LoadSectSched: React.FC = () => {
  const { sectionId } = useParams();
  const [scheduleData, setScheduleData] = useState<ScheduleEntry[]>([]);
  const [sectionName, setSectionName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  // console.log("Section ID from URL:", sectionId);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/sched/schedules/section/${sectionId}`
        );
        console.log("Response status:", response.status);
        const responseText = await response.text();

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = JSON.parse(responseText);
        console.log("Fetched Schedule Data:", data);

        setScheduleData(data);
        if (data.length > 0) {
          setSectionName(data[0].SectionName);
        }
      } catch (error) {
        console.error("Error loading schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [sectionId]);

  // Function to format time in HH:mm AM/PM
  const formatTime = (isoTime: string) => {
    const date = new Date(isoTime);
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  // Function to get formatted start and end time
  const getFormattedTimes = (startTime: string, endTime: string) => {
    const start = formatTime(startTime);
    const end = formatTime(endTime);
    return `${start} - ${end}`;
  };

  if (loading) return <p>Loading schedule...</p>;

  const mergedCells: {
    [key: string]: { rowSpan: number; entry: ScheduleEntry };
  } = {};

  scheduleData.forEach((entry) => {
    const day = entry.DayOfWeek;
    const startIndex = timeSlots.findIndex(
      (slot) =>
        slot ===
        getFormattedTimes(entry.StartTime, entry.EndTime).split(" - ")[0] +
          " - " +
          new Date(
            new Date(`1970-01-01T${entry.StartTime}`).getTime() + 30 * 60000
          ).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
    );

    if (startIndex === -1) return;

    const units = entry.isLab ? entry.LabHours : entry.LectureHours;
    const span = Math.round(units * 2); // 30 mins per slot

    for (let i = 0; i < span; i++) {
      const key = `${day}_${startIndex + i}`;
      mergedCells[key] = {
        entry,
        rowSpan: i === 0 ? span : 0,
      };
      console.log("Processing scheduleData...");
      scheduleData.forEach((entry) => {
        const startTime = new Date(entry.StartTime);
        const endTime = new Date(entry.EndTime);
        const formattedStart = startTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        const formattedEnd = endTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        const displayTime = `${formattedStart} - ${formattedEnd}`;
        console.log(`[${entry.DayOfWeek}] ${displayTime}`, entry);

        const key = `${day}_${startIndex + i}`;
        console.log("Marking key:", key, "for", entry.CourseCode);
      });
    }
  });

  return (
    <div>
      <h2>Schedule for {sectionName}</h2>
      {scheduleData.length === 0 ? (
        <p>No schedules found.</p>
      ) : (
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
                <td style={{ fontSize: "0.75rem", padding: "4px" }}>{time}</td>
                {days.map((day) => {
                  console.log(
                    "Checking cell for:",
                    day,
                    rowIndex,
                    "→ Key:",
                    `${day}_${rowIndex}`
                  );

                  const key = `${day}_${rowIndex}`;
                  const cellInfo = mergedCells[`${day}_${rowIndex}`];

                  if (cellInfo && cellInfo.rowSpan > 0) {
                    console.log(
                      "Rendering",
                      cellInfo.entry.CourseCode,
                      "at",
                      `${day}_${rowIndex}`,
                      "rowSpan:",
                      cellInfo.rowSpan
                    );
                    const { entry, rowSpan } = cellInfo;
                    return (
                      <td
                        key={key}
                        rowSpan={rowSpan}
                        style={{ backgroundColor: "#d5f0d5" }}
                      >
                        <div style={{ padding: "6px", fontSize: "0.85rem" }}>
                          <strong>
                            {entry.CourseCode} - {entry.CourseName} (
                            {entry.isLab ? "Lab" : "Lecture"})
                          </strong>
                          <br />
                          Room: {entry.RoomName}
                          <br />
                          {entry.LectureHours + entry.LabHours} hrs
                          <br />
                          Professor: {entry.FullName || "Unassigned"}
                        </div>
                      </td>
                    );
                  } else if (cellInfo && cellInfo.rowSpan === 0) {
                    return null; // Merged cell - skip
                  } else {
                    return <td key={key}></td>; // Empty slot
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LoadSectSched;
