// My Suggestion

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

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

const labRoomNames = [
  "101",
  "601",
  "602",
  "603",
  "604",
  "605",
  "606",
  "607",
  "609",
];

interface OtherSchedBlock {
  OtherSchedID?: number;
  ProfessorID: number;
  Type: "Administration" | "Consultation";
  DayOfWeek: string;
  StartTime: string;
  EndTime: string;
  _autoLabAdmin?: boolean; // <-- Add this line
}

// Add an interface for the fetched other schedules
interface OtherSchedFetched {
  OtherSchedID: number;
  ProfessorID: number;
  Type: "Administration" | "Consultation";
  DayOfWeek: string;
  StartTime: string; // "HH:mm:ss"
  EndTime: string; // "HH:mm:ss"
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
  isLab?: boolean; // <-- Add this line
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
  const [currentUnits, setCurrentUnits] = useState<number | null>(null);

  useEffect(() => {
    if (!professorId) return;
    fetch(
      `http://localhost:3000/api/profassign/professor-current-units/${professorId}`
    )
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((data) => {
        setCurrentUnits(data.CurrentUnits ?? null);
      })
      .catch((err) => {
        console.error("Failed to fetch professor CurrentUnits", err);
        setCurrentUnits(null);
      });
  }, [professorId]);

  // Combo box state for admin/consult input
  const [adminType, setAdminType] = useState<"Administration" | "Consultation">(
    "Administration"
  );
  const [adminDay, setAdminDay] = useState<string>(days[0]);
  const [adminStart, setAdminStart] = useState<string>("");
  const [adminEnd, setAdminEnd] = useState<string>("");

  useEffect(() => {
    if (!professorId) {
      console.error("No professorId in route params");
      return;
    }

    // Fetch professor info
    fetch(`http://localhost:3000/api/profassign/professors`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
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

    // Fetch teaching schedules and process lab/admin blocks
    fetch(
      `http://localhost:3000/api/profassign/schedules/professor/${professorId}`
    )
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((data) => {
        // Identify lab by room name (no hardcoded slot count)
        const patched: TeachingSchedBlock[] = data.map((sched: any) => {
          let isLab = false;
          if (typeof sched.isLab === "boolean") isLab = sched.isLab;
          else if (typeof sched.IsLab === "boolean") isLab = sched.IsLab;
          else if (sched.IsLab === 1) isLab = true;
          if (
            sched.RoomName &&
            labRoomNames.includes(String(sched.RoomName).replace(/\s/g, ""))
          ) {
            isLab = true;
          }
          if (sched.CourseName && typeof sched.CourseName === "string") {
            if (/\(Lab\)/i.test(sched.CourseName)) isLab = true;
            if (/\(Lecture\)/i.test(sched.CourseName)) isLab = false;
          }
          return { ...sched, isLab } as TeachingSchedBlock;
        });
        setTeachingScheds(patched);

        // Process lab split and auto admin blocks
        if (professor.EmploymentStatus === "Full-Time") {
          const newTeaching: TeachingSchedBlock[] = [];
          const newAutoAdmins: OtherSchedBlock[] = [];
          patched.forEach((sched: TeachingSchedBlock) => {
            const isLab =
              typeof sched.isLab === "boolean" ? sched.isLab : false;
            const isLabRoom =
              sched.RoomName &&
              labRoomNames.includes(String(sched.RoomName).replace(/\s/g, ""));
            if (isLab && isLabRoom) {
              const startHHMM = getHHMM(sched.StartTime);
              const endHHMM = getHHMM(sched.EndTime);
              const startIdx = timeSlots.findIndex(
                (slot) => getSlotStartHHMM(slot) === startHHMM
              );
              const endIdx = timeSlots.findIndex(
                (slot) => getSlotStartHHMM(slot) === endHHMM
              );
              const totalSlots = endIdx > startIdx ? endIdx - startIdx : 1;
              const halfSlots = Math.floor(totalSlots / 2);
              if (halfSlots > 0) {
                newTeaching.push({
                  ...sched,
                  StartTime: sched.StartTime,
                  EndTime: slotToTime(startIdx + halfSlots),
                });
                newAutoAdmins.push({
                  ProfessorID: Number(professorId),
                  Type: "Administration",
                  DayOfWeek: sched.DayOfWeek,
                  StartTime: slotToTime(startIdx + halfSlots),
                  EndTime: slotToTime(endIdx),
                  _autoLabAdmin: true,
                });
              } else {
                newTeaching.push(sched);
              }
            } else {
              newTeaching.push(sched);
            }
          });
          setProcessedTeachingScheds(newTeaching);
          setAutoLabAdminBlocks(newAutoAdmins);
        } else {
          setProcessedTeachingScheds(patched);
          setAutoLabAdminBlocks([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch teaching schedules", err);
        setTeachingScheds([]);
        setProcessedTeachingScheds([]);
        setAutoLabAdminBlocks([]);
      });

    // Fetch other schedules (Administration/Consultation) from backend
    fetch(`http://localhost:3000/api/profassign/other-schedules/${professorId}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((data: OtherSchedFetched[]) => {
        const loadedBlocks: OtherSchedBlock[] = data.map((block) => ({
          OtherSchedID: block.OtherSchedID,
          ProfessorID: block.ProfessorID,
          Type: block.Type,
          DayOfWeek: block.DayOfWeek,
          StartTime: block.StartTime,
          EndTime: block.EndTime,
          _autoLabAdmin: false,
        }));
        setOtherScheds(loadedBlocks);
      })
      .catch((err) => {
        console.error("Failed to fetch other schedules", err);
        setOtherScheds([]);
      });
    // eslint-disable-next-line
  }, [professorId, professor.EmploymentStatus]);

  // State for processed teaching schedules and auto admin blocks
  const [processedTeachingScheds, setProcessedTeachingScheds] = useState<
    TeachingSchedBlock[]
  >([]);
  const [autoLabAdminBlocks, setAutoLabAdminBlocks] = useState<
    OtherSchedBlock[]
  >([]);

  useEffect(() => {
    // Only process for Full-Time professors
    if (professor.EmploymentStatus !== "Full-Time") {
      setProcessedTeachingScheds(teachingScheds);
      setAutoLabAdminBlocks([]);
      return;
    }
    const newTeaching: TeachingSchedBlock[] = [];
    const newAutoAdmins: OtherSchedBlock[] = [];

    teachingScheds.forEach((sched) => {
      // Use isLab property directly if available
      const isLab = typeof sched.isLab === "boolean" ? sched.isLab : false;

      // Only treat as lab if isLab is true AND RoomName matches labRoomNames
      const isLabRoom =
        sched.RoomName &&
        labRoomNames.includes(String(sched.RoomName).replace(/\s/g, ""));

      if (isLab && isLabRoom) {
        // Calculate slot span
        const startHHMM = getHHMM(sched.StartTime);
        const endHHMM = getHHMM(sched.EndTime);
        const startIdx = timeSlots.findIndex(
          (slot) => getSlotStartHHMM(slot) === startHHMM
        );
        const endIdx = timeSlots.findIndex(
          (slot) => getSlotStartHHMM(slot) === endHHMM
        );
        const totalSlots = endIdx > startIdx ? endIdx - startIdx : 1;
        const halfSlots = Math.floor(totalSlots / 2);

        // First half: Lab (shortened)
        if (halfSlots > 0) {
          newTeaching.push({
            ...sched,
            StartTime: sched.StartTime,
            EndTime: slotToTime(startIdx + halfSlots),
          });
          // Second half: Admin (auto, not removable)
          newAutoAdmins.push({
            ProfessorID: Number(professorId),
            Type: "Administration",
            DayOfWeek: sched.DayOfWeek,
            StartTime: slotToTime(startIdx + halfSlots),
            EndTime: slotToTime(endIdx),
            _autoLabAdmin: true,
          });
        } else {
          // If not enough slots to split, just keep as is
          newTeaching.push(sched);
        }
      } else {
        newTeaching.push(sched);
      }
    });

    setProcessedTeachingScheds(newTeaching);
    setAutoLabAdminBlocks(newAutoAdmins);
    // eslint-disable-next-line
  }, [teachingScheds, professor.EmploymentStatus, professorId]);

  // Merge auto-generated admin blocks with user-added otherScheds
  // Fix: Only merge autoLabAdmin blocks that do NOT overlap with loaded otherScheds
  const allOtherScheds = [
    ...otherScheds.filter((b) => !b._autoLabAdmin),
    ...autoLabAdminBlocks.filter(
      (auto) =>
        !otherScheds.some(
          (b) =>
            !b._autoLabAdmin &&
            b.Type === auto.Type &&
            b.DayOfWeek === auto.DayOfWeek &&
            b.StartTime === auto.StartTime &&
            b.EndTime === auto.EndTime
        )
    ),
  ];

  // Debug: Log what will be rendered as "other" blocks
  console.log("Rendering allOtherScheds:", allOtherScheds);
  console.log("Rendering processedTeachingScheds:", processedTeachingScheds);

  // Build mergedCells using processedTeachingScheds and allOtherScheds
  const mergedCells: {
    [key: string]: { rowSpan: number; type: "other" | "teaching"; block: any };
  } = {};

  allOtherScheds.forEach((block) => {
    // Always normalize StartTime/EndTime using getHHMM for both teaching and other schedules
    const startHHMM = getHHMM(block.StartTime);
    const endHHMM = getHHMM(block.EndTime);
    const startIdx = timeSlots.findIndex(
      (slot) => getSlotStartHHMM(slot) === startHHMM
    );
    const endIdx = timeSlots.findIndex(
      (slot) => getSlotStartHHMM(slot) === endHHMM
    );
    // Only render if both startIdx and endIdx are valid (>= 0)
    if (startIdx === -1 || endIdx === -1) {
      console.warn(
        "Skipping OTHER block with invalid time:",
        block.Type,
        block.DayOfWeek,
        block.StartTime,
        block.EndTime,
        "startIdx:",
        startIdx,
        "endIdx:",
        endIdx
      );
      return;
    }
    const span = endIdx > startIdx ? endIdx - startIdx : 1;
    // Debug: Log each block's placement
    console.log(
      "Placing OTHER block:",
      block.Type,
      block.DayOfWeek,
      block.StartTime,
      block.EndTime,
      "startIdx:",
      startIdx,
      "endIdx:",
      endIdx,
      "span:",
      span
    );
    for (let i = 0; i < span; i++) {
      const key = `${block.DayOfWeek}_${startIdx + i}`;
      mergedCells[key] = {
        type: "other",
        block,
        rowSpan: i === 0 ? span : 0,
      };
    }
  });

  processedTeachingScheds.forEach((schedBlock) => {
    const startHHMM = getHHMM(schedBlock.StartTime);
    const endHHMM = getHHMM(schedBlock.EndTime);
    const startIdx = timeSlots.findIndex(
      (slot) => getSlotStartHHMM(slot) === startHHMM
    );
    const endIdx = timeSlots.findIndex(
      (slot) => getSlotStartHHMM(slot) === endHHMM
    );
    // Fix: Only render if both startIdx and endIdx are valid (>= 0)
    if (startIdx === -1 || endIdx === -1) {
      console.warn(
        "Skipping TEACHING block with invalid time:",
        schedBlock.CourseCode,
        schedBlock.DayOfWeek,
        schedBlock.StartTime,
        schedBlock.EndTime,
        "startIdx:",
        startIdx,
        "endIdx:",
        endIdx
      );
      return;
    }
    const span = endIdx > startIdx ? endIdx - startIdx : 1;
    // Debug: Log each teaching block's placement
    console.log(
      "Placing TEACHING block:",
      schedBlock.CourseCode,
      schedBlock.DayOfWeek,
      schedBlock.StartTime,
      schedBlock.EndTime,
      "startIdx:",
      startIdx,
      "endIdx:",
      endIdx,
      "span:",
      span
    );
    for (let i = 0; i < span; i++) {
      const key = `${schedBlock.DayOfWeek}_${startIdx + i}`;
      mergedCells[key] = {
        type: "teaching",
        block: schedBlock,
        rowSpan: i === 0 ? span : 0,
      };
    }
  });

  // Debug: Log the final mergedCells map
  console.log("Final mergedCells for rendering:", mergedCells);

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
      // Only save user-plotted Administration/Consultation blocks (not autoLabAdmin)
      const toSave = otherScheds.filter((b) => !b._autoLabAdmin);
      console.log("Saving other schedules for professor:", professorId, toSave);
      const response = await fetch(
        `http://localhost:3000/api/profassign/other-schedules/${professorId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ schedules: toSave }),
        }
      );
      console.log(
        "POST /api/profassign/other-schedules response:",
        response.status
      );
      if (!response.ok) {
        const errText = await response.text();
        console.error("Failed to save schedules, server response:", errText);
        throw new Error("Failed to save schedules");
      }
      alert("Other schedules saved!");
      navigate(-1);
    } catch (err) {
      console.error("Error in handleSave:", err);
      alert("Failed to save schedules.");
    }
  };

  // Count blocks for admin/consult
  const adminSlots = allOtherScheds
    .filter((b) => b.Type === "Administration")
    .reduce((sum, b) => {
      const startHHMM = getHHMM(b.StartTime);
      const endHHMM = getHHMM(b.EndTime);
      const startIdx = timeSlots.findIndex(
        (slot) => getSlotStartHHMM(slot) === startHHMM
      );
      const endIdx = timeSlots.findIndex(
        (slot) => getSlotStartHHMM(slot) === getHHMM(b.EndTime)
      );
      return sum + (endIdx > startIdx ? endIdx - startIdx : 1);
    }, 0);

  const consultSlots = allOtherScheds
    .filter((b) => b.Type === "Consultation")
    .reduce((sum, b) => {
      const startHHMM = getHHMM(b.StartTime);
      const endHHMM = getHHMM(b.EndTime);
      const startIdx = timeSlots.findIndex(
        (slot) => getSlotStartHHMM(slot) === startHHMM
      );
      const endIdx = timeSlots.findIndex(
        (slot) => getSlotStartHHMM(slot) === getHHMM(b.EndTime)
      );
      return sum + (endIdx > startIdx ? endIdx - startIdx : 1);
    }, 0);

  // Helper: Get available time slots for the selected type and day (excluding occupied)
  function getAvailableTimeSlots(
    type: "Administration" | "Consultation",
    day: string
  ) {
    const maxSlots =
      type === "Administration" ? ADMIN_MAX_SLOTS : CONSULT_MAX_SLOTS;
    // Get all occupied slots (otherScheds + teachingScheds)
    const occupied = new Set<number>();
    otherScheds.forEach((b) => {
      if (b.DayOfWeek === day) {
        const s = timeSlots.findIndex(
          (slot) => getSlotStartHHMM(slot) === getHHMM(b.StartTime)
        );
        const e = timeSlots.findIndex(
          (slot) => getSlotStartHHMM(slot) === getHHMM(b.EndTime)
        );
        for (let i = s; i < e; i++) occupied.add(i);
      }
    });
    teachingScheds.forEach((b) => {
      if (b.DayOfWeek === day) {
        const s = timeSlots.findIndex(
          (slot) => getSlotStartHHMM(slot) === getHHMM(b.StartTime)
        );
        const e = timeSlots.findIndex(
          (slot) => getSlotStartHHMM(slot) === getHHMM(b.EndTime)
        );
        for (let i = s; i < e; i++) occupied.add(i);
      }
    });
    // Only allow slots that are not occupied
    return timeSlots
      .map((slot, idx) => ({ slot, idx }))
      .filter(({ idx }) => !occupied.has(idx));
  }

  // Helper: Get valid End times based on Start, type, and occupied slots
  function getAvailableEndTimes(
    type: "Administration" | "Consultation",
    day: string,
    start: string
  ) {
    const available = getAvailableTimeSlots(type, day);
    const startIdx = available.find(
      ({ slot }) => slot.slice(0, 7) === start
    )?.idx;
    if (startIdx === undefined) return [];
    // Calculate max slots left for this type
    const maxSlots =
      type === "Administration" ? ADMIN_MAX_SLOTS : CONSULT_MAX_SLOTS;
    const currentSlots = otherScheds
      .filter((b) => b.Type === type)
      .reduce((sum, b) => {
        const s = timeSlots.findIndex(
          (slot) => getSlotStartHHMM(slot) === getHHMM(b.StartTime)
        );
        const e = timeSlots.findIndex(
          (slot) => getSlotStartHHMM(slot) === getHHMM(b.EndTime)
        );
        return sum + (e > s ? e - s : 1);
      }, 0);
    const slotsLeft = maxSlots - currentSlots;
    // End times must be after start, contiguous, not occupied, and not exceed slotsLeft
    const validEnds: { slot: string; idx: number }[] = [];
    for (let i = 1; i <= slotsLeft; ++i) {
      const endIdx = startIdx + i;
      // All slots between startIdx and endIdx must be available
      if (
        endIdx <= timeSlots.length &&
        Array.from({ length: i }, (_, k) => startIdx + k).every((idx) =>
          available.some((a) => a.idx === idx)
        )
      ) {
        if (endIdx < timeSlots.length) {
          validEnds.push({ slot: timeSlots[endIdx].slice(0, 7), idx: endIdx });
        }
      }
    }
    return validEnds;
  }

  // Add handler for Administration/Consultation
  const handleAddAdminConsult = () => {
    const startIdx = timeSlots.findIndex((slot) => slot.startsWith(adminStart));
    const endIdx = timeSlots.findIndex((slot) => slot.startsWith(adminEnd));
    if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
      alert("Invalid time range.");
      return;
    }
    // Check for overlap
    for (let i = startIdx; i < endIdx; i++) {
      const key = `${adminDay}_${i}`;
      if (mergedCells[key]) {
        alert("Cannot allocate: Overlaps with existing schedule.");
        return;
      }
    }
    // Check max hours
    const slotsToAdd = endIdx - startIdx;
    const currentSlots = otherScheds
      .filter((b) => b.Type === adminType)
      .reduce((sum, b) => {
        const s = timeSlots.findIndex(
          (slot) => getSlotStartHHMM(slot) === getHHMM(b.StartTime)
        );
        const e = timeSlots.findIndex(
          (slot) => getSlotStartHHMM(slot) === getHHMM(b.EndTime)
        );
        return sum + (e > s ? e - s : 1);
      }, 0);
    const maxSlots =
      adminType === "Administration" ? ADMIN_MAX_SLOTS : CONSULT_MAX_SLOTS;
    if (currentSlots + slotsToAdd > maxSlots) {
      alert(`Cannot allocate: Exceeds max ${adminType} hours.`);
      return;
    }
    setOtherScheds((prev) => [
      ...prev,
      {
        ProfessorID: Number(professorId),
        Type: adminType,
        DayOfWeek: adminDay,
        StartTime: slotToTime(startIdx),
        EndTime: slotToTime(endIdx),
      },
    ]);
  };

  // Automatically add 1.5-hour admin block for each Lab schedule (Full-Time only)
  useEffect(() => {
    if (professor.EmploymentStatus !== "Full-Time") return;
    const labAdminBlocks: OtherSchedBlock[] = [];
    teachingScheds.forEach((sched) => {
      // Mark as lab if CourseName or other property indicates it, or add a flag in your backend
      if (sched.CourseName && sched.CourseName.toLowerCase().includes("lab")) {
        const startIdx = timeSlots.findIndex(
          (slot) => getSlotStartHHMM(slot) === getHHMM(sched.EndTime)
        );
        if (startIdx !== -1 && startIdx + 3 <= timeSlots.length) {
          labAdminBlocks.push({
            ProfessorID: Number(professorId),
            Type: "Administration",
            DayOfWeek: sched.DayOfWeek,
            StartTime: slotToTime(startIdx),
            EndTime: slotToTime(startIdx + 3),
            _autoLabAdmin: true,
          });
        }
      }
    });
    setOtherScheds((prev) => [
      ...prev.filter((b) => !b._autoLabAdmin),
      ...labAdminBlocks,
    ]);
  }, [teachingScheds, professorId, professor.EmploymentStatus]);

  return (
    <Box p={3} display="flex">
      {/* Sidebar for professor info and summary */}
      <Box
        sx={{
          width: 260,
          minWidth: 200,
          mr: 3,
          borderRight: "1px solid #ddd",
          pr: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Professor Info
        </Typography>
        <Typography fontSize={16} mb={1}>
          <strong>Name:</strong> {professor.FullName}
        </Typography>
        <Typography fontSize={15} mb={1}>
          <strong>Status:</strong> {professor.EmploymentStatus}
        </Typography>
        <Typography fontSize={15} mb={1}>
          <strong>Current Units:</strong>{" "}
          {currentUnits !== null ? currentUnits : "Loading..."}
        </Typography>
        {professor.EmploymentStatus === "Full-Time" && (
          <>
            <Typography fontSize={15} mb={1}>
              <strong>Administration:</strong> {adminSlots / 2} / 10 hrs
            </Typography>
            <Typography fontSize={15} mb={1}>
              <strong>Consultation:</strong> {consultSlots / 2} / 6 hrs
            </Typography>
          </>
        )}
      </Box>
      {/* Main content */}
      <Box sx={{ flexGrow: 1 }}>
        {/* Conditional heading */}
        {professor.EmploymentStatus === "Full-Time" ? (
          <Typography variant="h5" gutterBottom>
            Edit Other Schedules for {professor.FullName || "Not found"} (
            {professor.EmploymentStatus || "Unknown"})
          </Typography>
        ) : (
          <Typography variant="h5" gutterBottom>
            Viewing Schedule for {professor.FullName || "Not found"} (
            {professor.EmploymentStatus || "Unknown"})
          </Typography>
        )}
        {/* Controls for Full-Time Professors */}
        {professor.EmploymentStatus === "Full-Time" && (
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={adminType}
                label="Type"
                onChange={(e) =>
                  setAdminType(
                    e.target.value as "Administration" | "Consultation"
                  )
                }
              >
                <MenuItem value="Administration">Administration</MenuItem>
                <MenuItem value="Consultation">Consultation</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 110 }}>
              <InputLabel>Day</InputLabel>
              <Select
                value={adminDay}
                label="Day"
                onChange={(e) => setAdminDay(e.target.value as string)}
              >
                {days.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 110 }}>
              <InputLabel>Start</InputLabel>
              <Select
                value={adminStart}
                label="Start"
                onChange={(e) => setAdminStart(e.target.value as string)}
              >
                {getAvailableTimeSlots(adminType, adminDay).map(({ slot }) => (
                  <MenuItem key={slot} value={slot.slice(0, 7)}>
                    {slot.slice(0, 7)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 110 }}>
              <InputLabel>End</InputLabel>
              <Select
                value={adminEnd}
                label="End"
                onChange={(e) => setAdminEnd(e.target.value as string)}
              >
                {getAvailableEndTimes(adminType, adminDay, adminStart).map(
                  ({ slot }) => (
                    <MenuItem key={slot} value={slot}>
                      {slot}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
            <Button variant="contained" onClick={handleAddAdminConsult}>
              Add
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Box>
        )}
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Box mt={2} display="flex" justifyContent="flex-end" gap={2}></Box>
          <Button variant="contained" onClick={() => navigate(-1)}>
            Back
          </Button>
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
                            style={{
                              backgroundColor:
                                block.Type === "Administration"
                                  ? "#ffe6cc"
                                  : "#e6f7ff",
                              minWidth: 120,
                              verticalAlign: "top",
                            }}
                          >
                            <div style={{ fontSize: "0.85rem" }}>
                              <strong>{block.Type}</strong>
                              <br />
                              {getHHMM(block.StartTime)} -{" "}
                              {getHHMM(block.EndTime)}
                              {/* Remove button inside the cell, only for non-autoLabAdmin */}
                              {!block._autoLabAdmin && (
                                <Button
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    setOtherScheds((prev) =>
                                      prev.filter(
                                        (b) =>
                                          !(
                                            b.Type === block.Type &&
                                            b.DayOfWeek === block.DayOfWeek &&
                                            b.StartTime === block.StartTime &&
                                            b.EndTime === block.EndTime
                                          )
                                      )
                                    );
                                  }}
                                  sx={{ mt: 1 }}
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          </td>
                        );
                      }
                    } else if (cell && cell.rowSpan === 0) {
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

export default ProfessorSchedModification;
