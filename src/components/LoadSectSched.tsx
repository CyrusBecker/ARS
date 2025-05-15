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

  // Helper: Extract "HH:mm" from ISO or time string
  const getHHMM = (isoOrTime: string) => {
    // If ISO string, parse as date
    const date = new Date(isoOrTime);
    if (!isNaN(date.getTime())) {
      return date.toISOString().substr(11, 5); // "HH:mm"
    }
    // If already a time string, try to extract "HH:mm"
    const match = isoOrTime.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      return `${match[1].padStart(2, "0")}:${match[2]}`;
    }
    return "";
  };

  // Helper: Extract "HH:mm" from start of a timeSlot string
  const getSlotStartHHMM = (slot: string) => {
    // e.g. "7:00 AM - 7:30 AM" -> "07:00"
    const match = slot.match(/^(\d{1,2}):(\d{2})/);
    if (!match) return "";
    let hour = parseInt(match[1], 10);
    const minute = match[2];
    if (slot.includes("PM") && hour !== 12) hour += 12;
    if (slot.includes("AM") && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  };

  if (loading) return <p>Loading schedule...</p>;

  // Build mergedCells map for rendering
  const mergedCells: {
    [key: string]: { rowSpan: number; entry: ScheduleEntry };
  } = {};

  scheduleData.forEach((entry, idx) => {
    const startHHMM = getHHMM(entry.StartTime);
    const endHHMM = getHHMM(entry.EndTime);

    // Find the starting index in timeSlots by comparing "HH:mm"
    const startIndex = timeSlots.findIndex(
      (slot) => getSlotStartHHMM(slot) === startHHMM
    );

    // Logging for debug
    console.log(
      `[${idx}] Entry:`,
      entry.CourseCode,
      "| Day:",
      entry.DayOfWeek,
      "| StartTime:",
      entry.StartTime,
      "| EndTime:",
      entry.EndTime,
      "| startHHMM:",
      startHHMM,
      "| endHHMM:",
      endHHMM,
      "| startIndex:",
      startIndex,
      entry
    );

    if (startIndex === -1) {
      console.warn(
        `Could not find startIndex for ${entry.CourseCode} (startHHMM: ${startHHMM})`
      );
      return;
    }

    // Calculate how many slots this entry spans
    const units = entry.isLab ? entry.LabHours : entry.LectureHours;
    const span = Math.round(units * 2); // 30 mins per slot
    console.log(
      `  -> startIndex: ${startIndex}, span: ${span}, units: ${units}, isLab: ${entry.isLab}`
    );

    for (let i = 0; i < span; i++) {
      const key = `${entry.DayOfWeek}_${startIndex + i}`;
      mergedCells[key] = {
        entry,
        rowSpan: i === 0 ? span : 0,
      };
      console.log(
        `    - Setting mergedCells[${key}] = { rowSpan: ${
          i === 0 ? span : 0
        }, entry: ... }`
      );
    }
  });

  console.log("Final mergedCells:", mergedCells);

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
                  const key = `${day}_${rowIndex}`;
                  const cellInfo = mergedCells[key];

                  if (cellInfo && cellInfo.rowSpan > 0) {
                    const { entry, rowSpan } = cellInfo;
                    console.log(
                      `Rendering cell for ${entry.CourseCode} at ${key} with rowSpan ${rowSpan}`
                    );
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
