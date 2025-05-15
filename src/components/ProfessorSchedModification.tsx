import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

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

interface OtherSchedBlock {
  OtherSchedID?: number;
  ProfessorID: number;
  Type: "Administration" | "Consultation";
  DayOfWeek: string;
  StartTime: string;
  EndTime: string;
}

interface TeachingSchedBlock {
  ScheduleID: number;
  DayOfWeek: string;
  StartTime: string;
  EndTime: string;
  CourseCode: string;
  CourseName: string;
  RoomName: string;
  SectionName: string;
}

const ADMIN_BLOCK_SLOTS = 3; // 1.5 hours = 3 slots
const CONSULT_BLOCK_SLOTS = 2; // 1 hour = 2 slots
const ADMIN_MAX_SLOTS = 20; // 10 hours = 20 slots
const CONSULT_MAX_SLOTS = 12; // 6 hours = 12 slots

// Extract "HH:mm" from ISO or time string
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

const slotToTime = (slotIdx: number) => {
  // Use the start of the slot in "HH:mm:ss"
  const slot = timeSlots[slotIdx];
  const hhmm = getSlotStartHHMM(slot);
  return `${hhmm}:00`;
};

const ProfessorSchedModification: React.FC = () => {
  const { id } = useParams();
  console.log("Professor ID from URL:", id);
  // Convert id to number or undefined
  const professorId = id ? Number(id) : undefined;
  console.log("Parsed Professor ID:", professorId);
  const navigate = useNavigate();
  const [professor, setProfessor] = useState<{
    FullName: string;
    EmploymentStatus: string;
  }>({ FullName: "", EmploymentStatus: "" });
  const [otherScheds, setOtherScheds] = useState<OtherSchedBlock[]>([]);
  const [teachingScheds, setTeachingScheds] = useState<TeachingSchedBlock[]>(
    []
  );
  const [dragType, setDragType] = useState<
    "Administration" | "Consultation" | null
  >(null);
  const [dragSlots, setDragSlots] = useState<number>(0);
  const [dragBlockId, setDragBlockId] = useState<number | undefined>(undefined);
  const [hoverHighlight, setHoverHighlight] = useState<{
    day: string;
    startIdx: number;
    length: number;
  } | null>(null);

  useEffect(() => {
    if (!professorId) {
      console.error("No professorId in route params");
      return;
    }
    // Fetch all professors and filter by ID
    fetch(`http://localhost:3000/api/profassign/professors`)
      .then(async (r) => {
        if (!r.ok) {
          const msg = await r.text();
          throw new Error(msg);
        }
        return r.json();
      })
      .then((data) => {
        const prof = data.find(
          (p: any) => Number(p.ProfessorID) === Number(professorId)
        );
        if (prof) {
          setProfessor({
            FullName: prof.FullName,
            EmploymentStatus: prof.EmploymentStatus,
          });
        } else {
          setProfessor({ FullName: "Not found", EmploymentStatus: "" });
        }
      })
      .catch((err) => {
        console.error("Failed to fetch professor info", err);
        setProfessor({ FullName: "Not found", EmploymentStatus: "" });
      });

    // Fetch teaching schedules
    fetch(
      `http://localhost:3000/api/profassign/schedules/professor/${professorId}`
    )
      .then(async (r) => {
        if (!r.ok) {
          const msg = await r.text();
          throw new Error(msg);
        }
        return r.json();
      })
      .then((data) => {
        console.log("Fetched teaching schedules:", data);
        setTeachingScheds(data);
      })
      .catch((err) => {
        console.error("Failed to fetch teaching schedules", err);
        setTeachingScheds([]);
      });

    // Fetch other schedules
    fetch(`http://localhost:3000/api/profassign/other-schedules/${professorId}`)
      .then(async (r) => {
        if (!r.ok) {
          const msg = await r.text();
          throw new Error(msg);
        }
        return r.json();
      })
      .then((data) => {
        console.log("Fetched other schedules:", data);
        setOtherScheds(data);
      })
      .catch((err) => {
        console.error("Failed to fetch other schedules", err);
        setOtherScheds([]);
      });
  }, [professorId]);

  // Build mergedCells for both other and teaching schedules
  const mergedCells: {
    [key: string]: { rowSpan: number; type: "other" | "teaching"; block: any };
  } = {};

  otherScheds.forEach((block) => {
    const startHHMM = getHHMM(block.StartTime);
    const endHHMM = getHHMM(block.EndTime);
    const startIdx = timeSlots.findIndex(
      (slot) => getSlotStartHHMM(slot) === startHHMM
    );
    const endIdx = timeSlots.findIndex(
      (slot) => getSlotStartHHMM(slot) === endHHMM
    );
    const span = endIdx > startIdx ? endIdx - startIdx : 1;
    for (let i = 0; i < span; i++) {
      const key = `${block.DayOfWeek}_${startIdx + i}`;
      mergedCells[key] = {
        type: "other",
        block,
        rowSpan: i === 0 ? span : 0,
      };
    }
  });

  teachingScheds.forEach((schedBlock) => {
    const startHHMM = getHHMM(schedBlock.StartTime);
    const endHHMM = getHHMM(schedBlock.EndTime);
    const startIdx = timeSlots.findIndex(
      (slot) => getSlotStartHHMM(slot) === startHHMM
    );
    const endIdx = timeSlots.findIndex(
      (slot) => getSlotStartHHMM(slot) === endHHMM
    );
    const span = endIdx > startIdx ? endIdx - startIdx : 1;
    for (let i = 0; i < span; i++) {
      const key = `${schedBlock.DayOfWeek}_${startIdx + i}`;
      mergedCells[key] = {
        type: "teaching",
        block: schedBlock,
        rowSpan: i === 0 ? span : 0,
      };
    }
  });

  // Drag handlers
  const onDragStart = (
    type: "Administration" | "Consultation",
    slots: number
  ) => {
    setDragType(type);
    setDragSlots(slots);
    setDragBlockId(undefined);
  };

  const onDragBlockStart = (
    blockId: number,
    type: "Administration" | "Consultation",
    slots: number
  ) => {
    setDragType(type);
    setDragSlots(slots);
    setDragBlockId(blockId);
  };

  const onDragEnd = () => {
    setDragType(null);
    setDragSlots(0);
    setDragBlockId(undefined);
    setHoverHighlight(null);
  };

  const onDragOver = (e: React.DragEvent, day: string, slotIdx: number) => {
    e.preventDefault();
    if (dragType && dragSlots) {
      setHoverHighlight({ day, startIdx: slotIdx, length: dragSlots });
    }
  };

  const onDragLeave = () => setHoverHighlight(null);

  // Drop handler for new or moved block
  const onDrop = (e: React.DragEvent, day: string, slotIdx: number) => {
    e.preventDefault();
    setHoverHighlight(null);
    if (!dragType || !dragSlots) return;
    // Check for overlap
    for (let i = 0; i < dragSlots; i++) {
      const key = `${day}_${slotIdx + i}`;
      if (
        mergedCells[key] &&
        (!dragBlockId ||
          mergedCells[key].type !== "other" ||
          mergedCells[key].block.OtherSchedID !== dragBlockId)
      ) {
        alert("Cannot allocate: Overlaps with existing schedule.");
        return;
      }
    }
    // Count current slots for type
    const currentSlots = otherScheds
      .filter(
        (b) =>
          b.Type === dragType &&
          (!dragBlockId || b.OtherSchedID !== dragBlockId)
      )
      .reduce((sum, b) => {
        const startHHMM = getHHMM(b.StartTime);
        const endHHMM = getHHMM(b.EndTime);
        const startIdx = timeSlots.findIndex(
          (slot) => getSlotStartHHMM(slot) === startHHMM
        );
        const endIdx = timeSlots.findIndex(
          (slot) => getSlotStartHHMM(slot) === endHHMM
        );
        return sum + (endIdx > startIdx ? endIdx - startIdx : 1);
      }, 0);
    const maxSlots =
      dragType === "Administration" ? ADMIN_MAX_SLOTS : CONSULT_MAX_SLOTS;
    if (currentSlots + dragSlots > maxSlots) {
      alert(`Cannot allocate: Exceeds max ${dragType} hours.`);
      return;
    }
    const startTime = slotToTime(slotIdx);
    const endTime = slotToTime(slotIdx + dragSlots);
    if (dragBlockId) {
      setOtherScheds((prev) =>
        prev.map((b) =>
          b.OtherSchedID === dragBlockId
            ? { ...b, DayOfWeek: day, StartTime: startTime, EndTime: endTime }
            : b
        )
      );
    } else {
      setOtherScheds((prev) => [
        ...prev,
        {
          ProfessorID: Number(professorId),
          Type: dragType,
          DayOfWeek: day,
          StartTime: startTime,
          EndTime: endTime,
        },
      ]);
    }
    setDragType(null);
    setDragSlots(0);
    setDragBlockId(undefined);
  };

  // Remove block
  const removeBlock = (blockId?: number, idx?: number) => {
    setOtherScheds((prev) =>
      blockId
        ? prev.filter((b) => b.OtherSchedID !== blockId)
        : prev.filter((_, i) => i !== idx)
    );
  };

  // Save handler
  const handleSave = async () => {
    try {
      const response = await fetch(
        `/api/profassign/other-schedules/${professorId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ schedules: otherScheds }),
        }
      );
      if (!response.ok) throw new Error("Failed to save schedules");
      alert("Other schedules saved!");
      navigate(-1);
    } catch (err) {
      alert("Failed to save schedules.");
    }
  };

  // Count blocks for admin/consult
  const adminSlots = otherScheds
    .filter((b) => b.Type === "Administration")
    .reduce((sum, b) => {
      const startHHMM = getHHMM(b.StartTime);
      const endHHMM = getHHMM(b.EndTime);
      const startIdx = timeSlots.findIndex(
        (slot) => getSlotStartHHMM(slot) === startHHMM
      );
      const endIdx = timeSlots.findIndex(
        (slot) => getSlotStartHHMM(slot) === endHHMM
      );
      return sum + (endIdx > startIdx ? endIdx - startIdx : 1);
    }, 0);

  const consultSlots = otherScheds
    .filter((b) => b.Type === "Consultation")
    .reduce((sum, b) => {
      const startHHMM = getHHMM(b.StartTime);
      const endHHMM = getHHMM(b.EndTime);
      const startIdx = timeSlots.findIndex(
        (slot) => getSlotStartHHMM(slot) === startHHMM
      );
      const endIdx = timeSlots.findIndex(
        (slot) => getSlotStartHHMM(slot) === endHHMM
      );
      return sum + (endIdx > startIdx ? endIdx - startIdx : 1);
    }, 0);

  return (
    <Box p={3} display="flex">
      {/* Sidebar for drag blocks */}
      <Box
        sx={{
          width: 220,
          minWidth: 180,
          mr: 3,
          borderRight: "1px solid #ddd",
          pr: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Other Schedules
        </Typography>
        {professor.EmploymentStatus === "Full-Time" && (
          <Box mb={2}>
            <Typography fontSize={14} mb={1}>
              Administration ({adminSlots / 2} / 10 hrs)
            </Typography>
            <Button
              variant="contained"
              draggable
              disabled={adminSlots + ADMIN_BLOCK_SLOTS > ADMIN_MAX_SLOTS}
              onDragStart={() =>
                onDragStart("Administration", ADMIN_BLOCK_SLOTS)
              }
              sx={{ mb: 1, width: "100%" }}
            >
              Administration
            </Button>
          </Box>
        )}
        <Box>
          <Typography fontSize={14} mb={1}>
            Consultation ({consultSlots / 2} / 6 hrs)
          </Typography>
          <Button
            variant="contained"
            draggable
            disabled={consultSlots + CONSULT_BLOCK_SLOTS > CONSULT_MAX_SLOTS}
            onDragStart={() => onDragStart("Consultation", CONSULT_BLOCK_SLOTS)}
            sx={{ mb: 1, width: "100%" }}
          >
            Consultation
          </Button>
        </Box>
      </Box>
      {/* Main content */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5" gutterBottom>
          Edit Other Schedules for {professor.FullName || "Not found"} (
          {professor.EmploymentStatus || "Unknown"})
        </Typography>
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
              {timeSlots.map((time, rowIdx) => (
                <tr key={rowIdx}>
                  <td style={{ fontSize: "0.75rem", padding: "4px" }}>
                    {time}
                  </td>
                  {days.map((day) => {
                    const key = `${day}_${rowIdx}`;
                    const cell = mergedCells[key];
                    if (cell && cell.rowSpan > 0) {
                      if (cell.type === "teaching") {
                        const { block, rowSpan } = cell;
                        return (
                          <td
                            key={key}
                            rowSpan={rowSpan}
                            style={{
                              backgroundColor: "#d5f0d5",
                              minWidth: 120,
                              verticalAlign: "top",
                            }}
                          >
                            <div style={{ fontSize: "0.85rem" }}>
                              <strong>
                                {block.CourseCode} - {block.CourseName}
                              </strong>
                              <br />
                              Room: {block.RoomName}
                              <br />
                              Section: {block.SectionName}
                            </div>
                          </td>
                        );
                      } else {
                        const { block, rowSpan } = cell;
                        const startHHMM = getHHMM(block.StartTime);
                        const endHHMM = getHHMM(block.EndTime);
                        const startIdx = timeSlots.findIndex(
                          (slot) => getSlotStartHHMM(slot) === startHHMM
                        );
                        const endIdx = timeSlots.findIndex(
                          (slot) => getSlotStartHHMM(slot) === endHHMM
                        );
                        const slots = endIdx > startIdx ? endIdx - startIdx : 1;
                        return (
                          <td
                            key={key}
                            rowSpan={rowSpan}
                            draggable
                            onDragStart={() =>
                              onDragBlockStart(
                                block.OtherSchedID!,
                                block.Type,
                                slots
                              )
                            }
                            onDragEnd={onDragEnd}
                            style={{
                              backgroundColor:
                                block.Type === "Administration"
                                  ? "#ffe6cc"
                                  : "#e6f7ff",
                              minWidth: 120,
                              verticalAlign: "top",
                              cursor: "grab",
                            }}
                          >
                            <div style={{ fontSize: "0.85rem" }}>
                              <strong>{block.Type}</strong>
                              <br />
                              {getHHMM(block.StartTime)} -{" "}
                              {getHHMM(block.EndTime)}
                              <br />
                              <Button
                                size="small"
                                color="error"
                                onClick={() => removeBlock(block.OtherSchedID)}
                                sx={{ mt: 1 }}
                              >
                                Remove
                              </Button>
                            </div>
                          </td>
                        );
                      }
                    } else if (cell && cell.rowSpan === 0) {
                      return null;
                    } else {
                      return (
                        <td
                          key={key}
                          onDragOver={(e) => onDragOver(e, day, rowIdx)}
                          onDrop={(e) => onDrop(e, day, rowIdx)}
                          onDragLeave={onDragLeave}
                          style={{
                            height: "40px",
                            minWidth: "100px",
                            backgroundColor:
                              hoverHighlight &&
                              hoverHighlight.day === day &&
                              rowIdx >= hoverHighlight.startIdx &&
                              rowIdx <
                                hoverHighlight.startIdx + hoverHighlight.length
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
        <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfessorSchedModification;
