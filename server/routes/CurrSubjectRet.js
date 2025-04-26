const express = require("express");
const router = express.Router();
const { poolPromise } = require("../config/db");

// POST to create a new curriculum
router.post("/curriculums", async (req, res) => {
  try {
    const pool = await poolPromise;
    const { academicYear, programCode, notes, subjects } = req.body;

    if (!academicYear || !programCode || !subjects || subjects.length === 0) {
      return res.status(400).json({ message: "Missing required data" });
    }

    // Insert the new curriculum record into the Curriculums table
    const result = await pool
      .request()
      .input("AcademicYear", academicYear)
      .input("ProgramCode", programCode)
      .input("Notes", notes)
      .query(`
        INSERT INTO Curriculums (AcademicYear, ProgramCode, Notes)
        OUTPUT INSERTED.CurriculumID
        VALUES (@AcademicYear, @ProgramCode, @Notes)
      `);

    const curriculumID = result.recordset[0].CurriculumID;

    // Insert each subject into the CurriculumSubjects table
    for (const subject of subjects) {
      const { Course_Code, Level, Semester, Lec, Lab, Units, Boolean } = subject;

      // Get SubjectID for the given Course_Code
      const subjectRes = await pool
        .request()
        .input("CourseCode", Course_Code)
        .query("SELECT SubjectID FROM Subjects WHERE CourseCode = @CourseCode");

      if (subjectRes.recordset.length === 0) continue;

      const subjectID = subjectRes.recordset[0].SubjectID;

      // Insert the subject into CurriculumSubjects
      await pool
        .request()
        .input("CurriculumID", curriculumID)
        .input("SubjectID", subjectID)
        .input("YearLevel", parseInt(Level))  // Assuming `Level` is a string, convert to number
        .input("Semester", Semester.includes("1") ? 1 : 2)  // 1st Semester = 1, 2nd Semester = 2
        .query(`
          INSERT INTO CurriculumSubjects (CurriculumID, SubjectID, YearLevel, Semester)
          VALUES (@CurriculumID, @SubjectID, @YearLevel, @Semester)
        `);
    }

    res.json({ success: true, message: "Curriculum created successfully", curriculumID });
  } catch (err) {
    console.error("Error creating curriculum:", err);
    res.status(500).send("Server error while creating curriculum");
  }
});

// For the autotype || suggestions when typing on the Course Code text box
router.get("/subjects", async (req, res) => {
  try {
    const pool = await poolPromise;
    const search = (req.query.search || '').trim(); // || const search = req.query.search || '';

    if (search === '') {
      return res.json([]); // Or return message like "No term provided"
    }

    const result = await pool
      .request()
      .input("search", `%${search}%`)
      .query(`
        SELECT * FROM Subjects
        WHERE ProgramCode = 'BSIT'
        AND (CourseCode LIKE @search OR CourseName LIKE @search)
      `);
      console.log("Searching:", search);

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// The save button that updates
router.post("/curriculum-subjects", async (req, res) => {
  try {
    const pool = await poolPromise;
    const { rows, curriculumID } = req.body;

    if (!curriculumID || !Array.isArray(rows)) {
      return res.status(400).json({ message: "Missing curriculumID or rows" });
    }

    console.log("Received curriculum ID:", curriculumID);
    console.log("Received rows:", rows);

    for (const row of rows) {
      const subjRes = await pool.request()
        .input("CourseCode", row.Course_Code)
        .query(`SELECT SubjectID FROM Subjects WHERE CourseCode = @CourseCode`);

      if (!subjRes.recordset.length) continue;

      const subjectID = subjRes.recordset[0].SubjectID;
      const yearLevel = parseInt(row.Level); // assuming Level is in '1st Year' format
      const semester = row.Semester.includes('1') ? 1 : 2;

      await pool.request()
        .input("CurriculumID", curriculumID)
        .input("SubjectID", subjectID)
        .input("YearLevel", yearLevel)
        .input("Semester", semester)
        .query(`
          IF EXISTS (SELECT 1 FROM CurriculumSubjects WHERE CurriculumID = @CurriculumID AND SubjectID = @SubjectID)
          BEGIN
            -- Update the existing record if it exists
            UPDATE CurriculumSubjects
            SET YearLevel = @YearLevel, Semester = @Semester
            WHERE CurriculumID = @CurriculumID AND SubjectID = @SubjectID
          END
          ELSE
          BEGIN
            -- Insert a new record if it doesn't exist
            INSERT INTO CurriculumSubjects (CurriculumID, SubjectID, YearLevel, Semester)
            VALUES (@CurriculumID, @SubjectID, @YearLevel, @Semester)
          END
        `);
    }

    res.json({ success: true, message: "Subjects saved/updated" });
  } catch (err) {
    console.error("Error in curriculum-subjects route:", err);
    res.status(500).send("Failed to save or update curriculum subjects");
  }
});

// Might be the method to load all the existing curriculums for CurriculumLists.tsx
router.get('/curriculums', async (req, res) => {
  try {
    const pool = await poolPromise;
    const program = req.query.program || 'BSIT';

    const result = await pool
      .request()
      .input("ProgramCode", program)
      .query(`
        SELECT CurriculumID, AcademicYear, ProgramCode, Notes
        FROM Curriculums
        WHERE ProgramCode = @ProgramCode
        ORDER BY AcademicYear DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading curriculums");
  }
});

// Definitely getting the Id of a curriculum record
router.get("/curriculum/:id", async (req, res) => {
  try {
    console.log('Received curriculum ID:', req.params.id); // Log the incoming ID
    const curriculumID = req.params.id;

    const pool = await poolPromise // The appended fix
    const result = await pool
      .request()
      .input("CurriculumID", curriculumID)
      .query("SELECT * FROM Curriculums WHERE CurriculumID = @CurriculumID");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Curriculum not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching curriculum:", err);
    res.status(500).send("Server Error");
  }
});

// I think this is the method to load all the subjects for an existing curriculum when editing an existing curriculum
router.get("/curriculum-subjects/:curriculumId", async (req, res) => {
  try {
    const pool = await poolPromise;
    const { curriculumId } = req.params;

    const result = await pool.request()
      .input("CurriculumID", curriculumId)
      .query(`
        SELECT 
          cs.YearLevel,
          cs.Semester,
          s.CourseCode,
          s.CourseName,
          s.Units,
          s.LectureHours,
          s.LabHours,
          s.IsLab
        FROM CurriculumSubjects cs
        JOIN Subjects s ON cs.SubjectID = s.SubjectID
        WHERE cs.CurriculumID = @CurriculumID
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Failed to load curriculum subjects:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;