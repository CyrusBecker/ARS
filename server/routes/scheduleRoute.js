const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../config/db");

/* POST: Save a new schedule block with overlap checking || Just a fallback copy paste.
router.post("/schedules", async (req, res) => {
  try {
    const pool = await poolPromise;
    const { SubjectID, ProfessorID, RoomID, Day, StartTime, EndTime, Section } =
      req.body;

    if (
      !SubjectID ||
      !ProfessorID ||
      !RoomID ||
      !Day ||
      !StartTime ||
      !EndTime ||
      !Section
    ) {
      return res.status(400).json({ message: "Missing required data" });
    }

    // Check for conflicts (overlap in section, professor, or room)
    const conflictQuery = `
      SELECT * FROM Schedules
      WHERE Day = @Day
        AND (
          (Section = @Section)
          OR (ProfessorID = @ProfessorID)
          OR (RoomID = @RoomID)
        )
        AND (
          (StartTime < @EndTime AND EndTime > @StartTime) -- Overlap condition
        )
    `;

    const conflicts = await pool
      .request()
      .input("Day", Day)
      .input("StartTime", StartTime)
      .input("EndTime", EndTime)
      .input("Section", Section)
      .input("ProfessorID", ProfessorID)
      .input("RoomID", RoomID)
      .query(conflictQuery);

    if (conflicts.recordset.length > 0) {
      return res.status(409).json({
        message: "Schedule conflict detected",
        conflicts: conflicts.recordset,
      });
    }

    // No conflict, proceed to insert
    await pool
      .request()
      .input("SubjectID", SubjectID)
      .input("ProfessorID", ProfessorID)
      .input("RoomID", RoomID)
      .input("Day", Day)
      .input("StartTime", StartTime)
      .input("EndTime", EndTime)
      .input("Section", Section).query(`
        INSERT INTO Schedules (SubjectID, ProfessorID, RoomID, Day, StartTime, EndTime, Section)
        VALUES (@SubjectID, @ProfessorID, @RoomID, @Day, @StartTime, @EndTime, @Section)
      `);

    await pool.request().input("ProfessorID", ProfessorID).query(`
      UPDATE Professors
      SET CurrentUnits = (
          SELECT ISNULL(SUM(sub.Units), 0)
          FROM Schedules sch
          JOIN Subjects sub ON sch.SubjectID = sub.SubjectID
          WHERE sch.ProfessorID = @ProfessorID
      )
      WHERE ProfessorID = @ProfessorID;
    `);

    res.json({ success: true, message: "Schedule created successfully" });
  } catch (err) {
    console.error("Error creating schedule:", err);
    res.status(500).send("Server error while creating schedule");
  }
});

Cut from /schedules from AH's side:
// Update professor's CurrentUnits
      await pool.request().input("ProfessorID", ProfessorID).query(`
        UPDATE Professors
        SET CurrentUnits = (
            SELECT ISNULL(SUM(sub.Units), 0)
            FROM Schedules sch
            JOIN Subjects sub ON sch.SubjectID = sub.SubjectID
            WHERE sch.ProfessorID = @ProfessorID
        )
        WHERE ProfessorID = @ProfessorID;
      `);

*/

// POST: Save a new schedule block with overlap checking || For the AH's side
router.post("/schedules", async (req, res) => {
  try {
    const pool = await poolPromise;
    const scheduleArray = req.body.schedule;

    for (const entry of scheduleArray) {
      console.log("Incoming schedule entry:", entry);
      const { SubjectID, SectionID, RoomID, DayOfWeek, StartTime, EndTime } =
        entry;

      // Check required values (❌ No ProfessorID check)
      if (
        !SubjectID ||
        !SectionID ||
        !RoomID ||
        !DayOfWeek ||
        !StartTime ||
        !EndTime
      ) {
        console.log("❌ Missing required data:", {
          SubjectID,
          SectionID,
          RoomID,
          DayOfWeek,
          StartTime,
          EndTime,
        });
        return res.status(400).json({ message: "Missing required data" });
      }

      const conflicts = await pool
        .request()
        .input("DayOfWeek", DayOfWeek)
        .input("StartTime", StartTime)
        .input("EndTime", EndTime)
        .input("SectionID", SectionID)
        .input("RoomID", RoomID).query(`
          SELECT * FROM Schedules
          WHERE DayOfWeek = @DayOfWeek
            AND (
              SectionID = @SectionID
              OR RoomID = @RoomID
            )
            AND (
              StartTime < @EndTime AND EndTime > @StartTime
            )
        `);

      if (conflicts.recordset.length > 0) {
        return res.status(409).json({
          message: "Schedule conflict detected",
          conflicts: conflicts.recordset,
        });
      }

      await pool
        .request()
        .input("SubjectID", SubjectID)
        .input("SectionID", SectionID)
        .input("RoomID", RoomID)
        .input("DayOfWeek", DayOfWeek)
        .input("StartTime", StartTime)
        .input("EndTime", EndTime).query(`
          INSERT INTO Schedules 
            (SubjectID, SectionID, RoomID, DayOfWeek, StartTime, EndTime)
          VALUES 
            (@SubjectID, @SectionID, @RoomID, @DayOfWeek, @StartTime, @EndTime)
        `);
    }

    res.json({ success: true, message: "All schedules saved successfully." });
  } catch (err) {
    console.error("Error creating schedule:", err);
    res.status(500).send({
      message: "Server error while creating schedule.",
      error: err.message,
    });
  }
});

// GET: Fetch all schedules
router.get("/schedules", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT s.*, 
             subj.CourseCode, subj.CourseName,
             prof.FullName AS ProfessorName,
             r.RoomName
      FROM Schedules s
      JOIN Subjects subj ON s.SubjectID = subj.SubjectID
      JOIN Professors prof ON s.ProfessorID = prof.ProfessorID
      JOIN Rooms r ON s.RoomID = r.RoomID
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching schedules:", err);
    res.status(500).send("Server error while fetching schedules");
  }
});

// GET: Fetch all subjects -- SHOULD BE UPDATED TO INCLUDE FILTERING THE SUBJECTS ACCORDING TO THE SECTION'S YEAR AND SEMESTER
router.get("/subjects/:sectionId", async (req, res) => {
  const { sectionId } = req.params;
  //console.log("Received sectionName:", sectionName);

  try {
    const pool = await poolPromise;
    const result = await pool.request().input("SectionID", sectionId).query(`
        SELECT 
          sec.SectionID,
          sec.SectionName,
          s.SubjectID,
          s.CourseCode,
          s.CourseName,
          s.Units,
          s.LectureHours,
          s.LabHours,
          s.IsLab,
          cs.YearLevel,
          cs.Semester
        FROM Sections sec
        JOIN Curriculums c ON sec.CurriculumID = c.CurriculumID
        JOIN CurriculumSubjects cs ON cs.CurriculumID = c.CurriculumID
        JOIN Subjects s ON cs.SubjectID = s.SubjectID
        WHERE sec.SectionID = @SectionID
      `); // Update the Where line to this WHERE sec.SectionName = @SectionName AND IsArchived = 0

    // console.log("Queried results: ", result.recordset);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching section-specific subjects:", err);
    res.status(500).send("Server error while fetching section subjects");
  }
});

// GET: Fetch all professors
router.get("/professors", async (req, res) => {
  //console.log("Get /professors called");
  try {
    const pool = await poolPromise;
    //console.log("Connection to pool");
    const result = await pool.request().query(`
      SELECT ProfessorID, FullName, MaxUnits, CurrentUnits FROM Professors
    `);
    //console.log("Professors fetched:", result.recordset.length);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching professors:", err);
    res.status(500).send("Server error while fetching professors");
  }
});

// GET: Fetch all rooms
router.get("/rooms", async (req, res) => {
  //console.log("Get /rooms called");
  try {
    const pool = await poolPromise;
    //console.log("Connection to pool");
    const result = await pool.request().query(`
      SELECT RoomID, RoomName, RoomType, RoomNotes FROM Rooms
    `);
    //console.log("Rooms fetched:", result.recordset.length); // ✅ See results
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).send("Server error while fetching rooms");
  }
});

// GET: Fetch rooms already used during a given day and time range
router.get("/rooms/occupied", async (req, res) => {
  const { day, start, end } = req.query;
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("day", day)
      .input("start", start)
      .input("end", end).query(`
        SELECT RoomName
        FROM Schedules
        WHERE Day = @day
          AND (
            (StartTime < @end AND EndTime > @start)
          )
      `);

    const usedRooms = result.recordset.map((row) => row.RoomName);
    res.json(usedRooms);
  } catch (err) {
    console.error("Error fetching occupied rooms:", err);
    res.status(500).send("Server error");
  }
});

// GET: Fetch curriculum subjects based on section ID
router.get("/curriculum-subjects/:sectionId", async (req, res) => {
  const { sectionId } = req.params;
  try {
    const pool = await poolPromise;

    // Get section details (year level, semester, curriculum ID)
    const sectionResult = await pool.request().input("SectionID", sectionId)
      .query(`
        SELECT YearLevel, Semester, CurriculumID
        FROM Sections
        WHERE SectionID = @SectionID
      `);

    if (sectionResult.recordset.length === 0) {
      return res.status(404).json({ message: "Section not found" });
    }

    const { YearLevel, Semester, CurriculumID } = sectionResult.recordset[0];

    // Get subjects from CurriculumSubjects that match section context
    const subjectResult = await pool
      .request()
      .input("CurriculumID", CurriculumID)
      .input("YearLevel", YearLevel)
      .input("Semester", Semester).query(`
        SELECT cs.SubjectID, s.CourseCode, s.CourseName, s.Units
        FROM CurriculumSubjects cs
        JOIN Subjects s ON cs.SubjectID = s.SubjectID
        WHERE cs.CurriculumID = @CurriculumID
          AND cs.YearLevel = @YearLevel
          AND cs.Semester = @Semester
      `);

    res.json(subjectResult.recordset);
  } catch (err) {
    console.error("Error fetching curriculum subjects:", err);
    res.status(500).send("Server error while fetching curriculum subjects");
  }
});

router.get("/curriculums", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT CurriculumID, CurriculumName, AcademicYear FROM Curriculums
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching curriculums:", err);
    res.status(500).send("Server error while fetching curriculums");
  }
});

router.get("/professor-subjects", async (req, res) => {
  //console.log("Get /professor-subjects called");
  try {
    const pool = await poolPromise;
    //console.log("Connection to pool");
    const result = await pool.request().query(`
      SELECT ps.ProfessorID, ps.SubjectID, p.FullName, s.CourseCode
      FROM ProfessorSubjects ps
      JOIN Professors p ON ps.ProfessorID = p.ProfessorID
      JOIN Subjects s ON ps.SubjectID = s.SubjectID
    `);
    //console.log("Professor-Subject Mappings fetched:", result.recordset.length);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching professor-subject mappings:", err);
    res
      .status(500)
      .send("Server error while fetching professor-subject mappings");
  }
});

// Retreiving the data of saved schedules

// GET: Fetch schedules by sectionId
router.get("/schedules/section/:sectionId", async (req, res) => {
  const sectionId = req.params.sectionId;
  console.log("Requested section ID:", sectionId);
  try {
    const pool = await poolPromise;
    // Add this to query: s.LectureHours, s.LabHours,
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

    console.log("Query result:", result.recordset);

    if (result.recordset.length === 0) {
      console.log("No schedules found for section ID:", sectionId);
    }

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching section schedules:", err);
    res
      .status(500)
      .send(`Server error while fetching section schedules:  ${err.message}`);
  }
});

// GET: Fetch teaching schedules for a professor (for ProfessorSchedModification)
router.get("/schedules/professor/:professorId", async (req, res) => {
  try {
    const pool = await poolPromise;
    const professorId = parseInt(req.params.professorId, 10);
    const result = await pool.request().input("ProfessorID", professorId).query(`
      SELECT 
        s.ScheduleID,
        s.DayOfWeek,
        FORMAT(s.StartTime, 'HH:mm:ss') AS StartTime,
        FORMAT(s.EndTime, 'HH:mm:ss') AS EndTime,
        subj.CourseCode,
        subj.CourseName,
        r.RoomName,
        sec.SectionName
      FROM Schedules s
      LEFT JOIN Subjects subj ON s.SubjectID = subj.SubjectID
      LEFT JOIN Rooms r ON s.RoomID = r.RoomID
      LEFT JOIN Sections sec ON s.SectionID = sec.SectionID
      WHERE s.ProfessorID = @ProfessorID
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching professor teaching schedules:", err);
    res.status(500).send("Server error while fetching professor teaching schedules");
  }
});

module.exports = router;
