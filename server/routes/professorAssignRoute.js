const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../config/db");

// GET: Fetch schedules by professor
router.get("/schedules/professor/:id", async (req, res) => {
  console.log(
    "GET /api/profassign/schedules/professor/:id called with id:",
    req.params.id
  );
  try {
    const pool = await poolPromise;
    const professorID = parseInt(req.params.id, 10);

    const result = await pool.request().input("ProfessorID", professorID)
      .query(`
        SELECT 
          s.ScheduleID, s.SectionID, s.SubjectID,
          s.ProfessorID, s.RoomID,
          s.DayOfWeek, s.StartTime, s.EndTime,
          subj.CourseCode, subj.CourseName, subj.IsLab,
          prof.FullName AS ProfessorName,
          prof.CurrentUnits,
          r.RoomName
        FROM Schedules s
        JOIN Subjects subj ON s.SubjectID = subj.SubjectID
        JOIN Professors prof ON s.ProfessorID = prof.ProfessorID
        JOIN Rooms r ON s.RoomID = r.RoomID
        WHERE s.ProfessorID = @ProfessorID
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching professor schedules:", err);
    res.status(500).send("Server error while fetching professor schedules");
  }
});

// GET: Fetch all professors (reuse if needed)
router.get("/professors", async (req, res) => {
  console.log("GET /api/profassign/professors called");
  console.log("Request query:", req.query);
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT ProfessorID, FullName, EmploymentStatus, MaxUnits, CurrentUnits FROM Professors
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching professors:", err);
    res.status(500).send("Server error while fetching professors");
  }
});

/* POST: Assign professor to a schedule
router.post("/assign", async (req, res) => {
  try {
    const pool = await poolPromise;
    const { ScheduleID, ProfessorID } = req.body;
    if (!ScheduleID) {
      return res.status(400).json({ message: "Missing ScheduleID" });
    }
    await pool
      .request()
      .input("ScheduleID", ScheduleID)
       .input("ProfessorID", ProfessorID)
       .query(`
         UPDATE Schedules
         SET ProfessorID = @ProfessorID
         WHERE ScheduleID = @ScheduleID
       `);
     res.json({ success: true, message: "Professor assigned successfully" });
   } catch (err) {
     console.error("Error assigning professor:", err);
     res.status(500).send("Server error while assigning professor");
   }
 }); */

// Helper: Recalculate CurrentUnits for a professor
async function recalcCurrentUnits(pool, professorId) {
  await pool.request().input("ProfessorID", professorId).query(`
    UPDATE Professors
    SET CurrentUnits = (
      SELECT ISNULL(SUM(subj.Units), 0)
      FROM Schedules sch
      JOIN Subjects subj ON sch.SubjectID = subj.SubjectID
      WHERE sch.ProfessorID = @ProfessorID
    )
    WHERE ProfessorID = @ProfessorID
  `);
}

// POST: Bulk assign professors and update CurrentUnits
router.post("/assign-bulk", async (req, res) => {
  console.log("POST /api/profassign/assign-bulk called");
  console.log("Request body:", req.body);
  try {
    const pool = await poolPromise;
    const { assignments } = req.body;
    if (!Array.isArray(assignments) || assignments.length === 0) {
      return res.status(400).json({ message: "Missing assignments array" });
    }

    // Get the sectionId from the first assignment (all assignments are for the same section)
    const sectionId =
      assignments[0].SectionID ||
      assignments[0].SectionId ||
      assignments[0].sectionId;
    if (!sectionId) {
      return res
        .status(400)
        .json({ message: "Missing sectionId in assignments" });
    }

    // Remove all professor assignments for this section (set ProfessorID to NULL)
    await pool.request().input("SectionID", sectionId).query(`
        UPDATE Schedules
        SET ProfessorID = NULL
        WHERE SectionID = @SectionID
      `);

    // Insert/update new assignments
    for (const { ScheduleID, ProfessorID } of assignments) {
      await pool
        .request()
        .input("ScheduleID", ScheduleID)
        .input("ProfessorID", ProfessorID).query(`
          UPDATE Schedules
          SET ProfessorID = @ProfessorID
          WHERE ScheduleID = @ScheduleID
        `);
    }

    // Recalculate CurrentUnits for ALL professors (not just those assigned)
    // Find all professors who have any schedule
    const profResult = await pool.request().query(`
      SELECT DISTINCT ProfessorID FROM Schedules WHERE ProfessorID IS NOT NULL
    `);
    for (const row of profResult.recordset) {
      await recalcCurrentUnits(pool, row.ProfessorID);
    }

    res.json({
      success: true,
      message:
        "Bulk professor assignments saved, removed missing, and CurrentUnits updated.",
    });
  } catch (err) {
    console.error("Error in bulk professor assignment:", err);
    res.status(500).send("Server error while saving assignments");
  }
});

// GET: Fetch schedules by sectionId with Units for AssigningProfessors.tsx
router.get("/schedules/section/:sectionId", async (req, res) => {
  console.log(
    "GET /api/profassign/schedules/section/:sectionId called with id:",
    req.params.sectionId
  );
  console.log("Request query:", req.query);
  const sectionId = req.params.sectionId;
  try {
    const pool = await poolPromise;
    // Include subj.Units for each schedule entry
    const result = await pool.request().input("SectionID", sql.Int, sectionId)
      .query(`
        SELECT 
          s.ScheduleID,
          s.SubjectID,
          s.SectionID,
          s.RoomID,
          s.ProfessorID,
          s.DayOfWeek,
          s.StartTime,
          s.EndTime,
          subj.CourseCode,
          subj.CourseName,
          subj.LectureHours,
          subj.LabHours,
          subj.isLab,
          subj.Units, -- This is the key for correct unit allocation
          prof.FullName,
          r.RoomName,
          sec.SectionName
        FROM Schedules s
        LEFT JOIN Subjects subj ON s.SubjectID = subj.SubjectID
        LEFT JOIN Professors prof ON s.ProfessorID = prof.ProfessorID
        LEFT JOIN Rooms r ON s.RoomID = r.RoomID
        LEFT JOIN Sections sec ON s.SectionID = sec.SectionID
        WHERE s.SectionID = @SectionID;
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching section schedules with units:", err);
    res
      .status(500)
      .send("Server error while fetching section schedules with units");
  }
});

// GET: Professor's current units, occupied slots, and eligible subjects
router.get("/professor-availability/:professorId", async (req, res) => {
  // console.log("GET /api/profassign/professor-availability/:professorId called with id:", req.params.professorId);
  // console.log("Request query:", req.query);
  try {
    const pool = await poolPromise;
    const professorId = parseInt(req.params.professorId, 10);

    // Get current units
    const unitsResult = await pool.request().input("ProfessorID", professorId)
      .query(`
        SELECT CurrentUnits FROM Professors WHERE ProfessorID = @ProfessorID
      `);

    // Get all occupied slots (day, start, end) for this professor
    const slotsResult = await pool.request().input("ProfessorID", professorId)
      .query(`
        SELECT ScheduleID, DayOfWeek, StartTime, EndTime, SectionID
        FROM Schedules
        WHERE ProfessorID = @ProfessorID
      `);

    // Get eligible subjects
    const eligibleResult = await pool
      .request()
      .input("ProfessorID", professorId).query(`
        SELECT SubjectID FROM ProfessorSubjects WHERE ProfessorID = @ProfessorID
      `);

    res.json({
      currentUnits: unitsResult.recordset[0]?.CurrentUnits ?? 0,
      occupiedSlots: slotsResult.recordset,
      eligibleSubjects: eligibleResult.recordset.map((r) => r.SubjectID),
    });
  } catch (err) {
    console.error("Error fetching professor availability:", err);
    res.status(500).send("Server error while fetching professor availability");
  }
});

// GET: Fetch all other schedules for a professor
router.get("/other-schedules/:professorId", async (req, res) => {
  console.log(
    "GET /api/profassign/other-schedules/:professorId called with id:",
    req.params.professorId
  );
  try {
    const pool = await poolPromise;
    const professorId = parseInt(req.params.professorId, 10);
    const result = await pool.request().input("ProfessorID", professorId)
      .query(`
      SELECT OtherSchedID, ProfessorID, Type, DayOfWeek, StartTime, EndTime
      FROM ProfessorOtherSchedules
      WHERE ProfessorID = @ProfessorID
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching other schedules:", err);
    res.status(500).send("Server error while fetching other schedules");
  }
});

// POST: Save all other schedules for a professor (delete all and insert new)
router.post("/other-schedules/:professorId", async (req, res) => {
  console.log(
    "POST /api/profassign/other-schedules/:professorId called with id:",
    req.params.professorId
  );
  try {
    const pool = await poolPromise;
    const professorId = parseInt(req.params.professorId, 10);
    const { schedules } = req.body;
    console.log("Received schedules array:", schedules);
    if (!Array.isArray(schedules)) {
      console.log("Missing schedules array in request body:", req.body);
      return res.status(400).json({ message: "Missing schedules array" });
    }
    // Delete all existing for this professor
    await pool.request().input("ProfessorID", professorId).query(`
      DELETE FROM ProfessorOtherSchedules WHERE ProfessorID = @ProfessorID
    `);
    // Insert new
    for (const sched of schedules) {
      console.log("Inserting schedule:", sched);
      await pool
        .request()
        .input("ProfessorID", professorId)
        .input("Type", sched.Type)
        .input("DayOfWeek", sched.DayOfWeek)
        .input("StartTime", sched.StartTime)
        .input("EndTime", sched.EndTime).query(`
          INSERT INTO ProfessorOtherSchedules
            (ProfessorID, Type, DayOfWeek, StartTime, EndTime)
          VALUES
            (@ProfessorID, @Type, @DayOfWeek, @StartTime, @EndTime)
        `);
    }
    res.json({ success: true, message: "Other schedules saved" });
  } catch (err) {
    console.error("Error saving other schedules:", err);
    res.status(500).send("Server error while saving other schedules");
  }
});

// GET: Fetch CurrentUnits for a professor (simple, single value)
router.get("/professor-current-units/:professorId", async (req, res) => {
  try {
    const pool = await poolPromise;
    const professorId = parseInt(req.params.professorId, 10);
    const result = await pool
      .request()
      .input("ProfessorID", professorId)
      .query(
        `SELECT CurrentUnits FROM Professors WHERE ProfessorID = @ProfessorID`
      );
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Professor not found" });
    }
    res.json({ CurrentUnits: result.recordset[0].CurrentUnits });
  } catch (err) {
    console.error("Error fetching professor CurrentUnits:", err);
    res.status(500).send("Server error while fetching professor CurrentUnits");
  }
});

module.exports = router;
