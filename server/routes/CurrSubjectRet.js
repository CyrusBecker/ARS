const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../config/db");

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
      .input("Notes", notes).query(`
        INSERT INTO Curriculums (AcademicYear, ProgramCode, Notes)
        OUTPUT INSERTED.CurriculumID
        VALUES (@AcademicYear, @ProgramCode, @Notes)
      `);

    const curriculumID = result.recordset[0].CurriculumID;

    // Insert each subject into the CurriculumSubjects table
    for (const subject of subjects) {
      const {
        Course_Code,
        Course_Name,
        Level,
        Semester,
        Lec,
        Lab,
        Units,
        Boolean,
      } = subject;

      // Get SubjectID for the given Course_Code
      const subjectRes = await pool
        .request()
        .input("CourseCode", Course_Code)
        .query("SELECT SubjectID FROM Subjects WHERE CourseCode = @CourseCode");

      let subjectID;

      if (subjectRes.recordset.length === 0) {
        // 2. If not found, insert it into the Subjects table
        const insertSubject = await pool
          .request()
          .input("CourseCode", Course_Code)
          .input("CourseName", Course_Name)
          .input("Units", Units)
          .input("LectureHours", Lec)
          .input("LabHours", Lab)
          .input("IsLab", Boolean ? 1 : 0)
          .input("ProgramCode", "BSIT") // default program
          .query(`
            INSERT INTO Subjects (CourseCode, CourseName, Units, LectureHours, LabHours, IsLab, ProgramCode)
            OUTPUT INSERTED.SubjectID
            VALUES (@CourseCode, @CourseName, @Units, @LectureHours, @LabHours, @IsLab, @ProgramCode)
          `);

        subjectID = insertSubject.recordset[0].SubjectID;
      } else {
        subjectID = subjectRes.recordset[0].SubjectID;
      }

      // Insert the subjects into CurriculumSubjects
      await pool
        .request()
        .input("CurriculumID", curriculumID)
        .input("SubjectID", subjectID)
        .input("YearLevel", parseInt(Level)) // Assuming `Level` is a string, convert to number
        .input("Semester", Semester.includes("1") ? 1 : 2) // 1st Semester = 1, 2nd Semester = 2
        .query(`
          INSERT INTO CurriculumSubjects (CurriculumID, SubjectID, YearLevel, Semester)
          VALUES (@CurriculumID, @SubjectID, @YearLevel, @Semester)
        `);
    }

    res.json({
      success: true,
      message: "Curriculum created successfully",
      curriculumID,
    });
  } catch (err) {
    console.error("Error creating curriculum:", err);
    res.status(500).send("Server error while creating curriculum");
  }
});

// For the autotype || suggestions when typing on the Course Code text box
router.get("/subjects", async (req, res) => {
  try {
    const pool = await poolPromise;
    const search = (req.query.search || "").trim(); // || const search = req.query.search || '';

    if (search === "") {
      return res.json([]); // Or return message like "No term provided"
    }

    const result = await pool.request().input("search", `%${search}%`).query(`
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
      const subjRes = await pool
        .request()
        .input("CourseCode", row.Course_Code)
        .query(`SELECT SubjectID FROM Subjects WHERE CourseCode = @CourseCode`);

      if (!subjRes.recordset.length) continue;

      const subjectID = subjRes.recordset[0].SubjectID;
      const yearLevel = parseInt(row.Level); // assuming Level is in '1st Year' format
      const semester = row.Semester.includes("1") ? 1 : 2;

      await pool
        .request()
        .input("CurriculumID", curriculumID)
        .input("SubjectID", subjectID)
        .input("YearLevel", yearLevel)
        .input("Semester", semester).query(`
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

// Load all the existing curriculums for CurriculumLists.tsx
router.get("/curriculums", async (req, res) => {
  try {
    const pool = await poolPromise;
    const program = req.query.program || "BSIT";

    const result = await pool.request().input("ProgramCode", program).query(`
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

// Retreiving the Id of a curriculum record
router.get("/curriculum/:id", async (req, res) => {
  try {
    console.log("Received curriculum ID:", req.params.id); // Log the incoming ID
    const curriculumID = req.params.id;

    const pool = await poolPromise; // The appended fix
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

// Loads all the subjects for an existing curriculum when editing an existing curriculum
router.get("/curriculum-subjects/:curriculumId", async (req, res) => {
  try {
    const pool = await poolPromise;
    const { curriculumId } = req.params;

    const result = await pool.request().input("CurriculumID", curriculumId)
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

// Load all professors for FacultyLoading from ProfessorManagement
router.get("/professors", async (req, res) => {
  console.log("GET /api/subj/professors called");
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query(`SELECT ProfessorID, FullName, EmploymentStatus FROM Professors`);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching professors:", err);
    res.status(500).send("Server error while loading professors");
  }
});

// Debug endpoint: List all professors (for manual testing)
router.get("/professors/all", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT ProfessorID, FullName, EmploymentStatus FROM Professors
    `);
    console.log("All professors:", result.recordset);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching all professors:", err);
    res.status(500).send("Server error while loading all professors");
  }
});

// Create new professor
router.post("/professors", async (req, res) => {
  try {
    const pool = await poolPromise;
    const { fullName, employmentStatus } = req.body;

    if (!fullName || !employmentStatus) {
      return res.status(400).json({ message: "Missing professor details" });
    }

    const maxUnits = employmentStatus === "Full-Time" ? 24.0 : 15.0;

    const result = await pool
      .request()
      .input("FullName", fullName)
      .input("EmploymentStatus", employmentStatus)
      .input("MaxUnits", maxUnits).query(`
        INSERT INTO Professors (FullName, EmploymentStatus, MaxUnits, CurrentUnits)
        OUTPUT INSERTED.ProfessorID
        VALUES (@FullName, @EmploymentStatus, @MaxUnits, 0.00)
      `);

    const professorID = result.recordset[0].ProfessorID;

    res.json({
      success: true,
      message: "Professor added successfully",
      professorID,
    });
  } catch (err) {
    console.error("Error adding professor:", err);
    res.status(500).send("Server error while adding professor");
  }
});

// Saving the subjects assigned to the new professor
router.post("/professor-subjects/add", async (req, res) => {
  try {
    const pool = await poolPromise;
    const { professorID, subjects } = req.body;

    console.log("Received professorID:", professorID);
    console.log("Received subjects array:", subjects);

    if (!professorID || !Array.isArray(subjects)) {
      return res
        .status(400)
        .json({ message: "Missing professorID or subjects array" });
    }

    for (const subjectID of subjects) {
      console.log("Processing subjectID:", subjectID);

      // Check if the professor already has this subject assigned
      const checkExistence = await pool
        .request()
        .input("ProfessorID", professorID)
        .input("SubjectID", subjectID).query(`
          SELECT 1 FROM ProfessorSubjects
          WHERE ProfessorID = @ProfessorID AND SubjectID = @SubjectID
        `);

      if (checkExistence.recordset.length > 0) {
        console.log(`Professor already assigned to SubjectID: ${subjectID}`);
        continue; // Skip insertion if already exists
      }

      // Insert new professor-subject relationship
      const insertResult = await pool
        .request()
        .input("ProfessorID", professorID)
        .input("SubjectID", subjectID).query(`
          BEGIN TRY
            INSERT INTO ProfessorSubjects (ProfessorID, SubjectID)
            VALUES (@ProfessorID, @SubjectID);
          END TRY
          BEGIN CATCH
            SELECT ERROR_MESSAGE() AS ErrorMessage;
          END CATCH;
        `);

      console.log("Insert result:", insertResult);
    }

    res.json({ success: true, message: "Professor subjects created!" });
  } catch (err) {
    console.error("Error adding professor subjects:", err);
    res.status(500).send("Server error while adding professor subjects");
  }
});

router.post("/professor-subjects/update", async (req, res) => {
  try {
    const pool = await poolPromise;
    const { professorID, subjects } = req.body;

    console.log("Received professorID:", professorID);
    console.log("Received subjects array:", subjects);

    if (!professorID || !Array.isArray(subjects)) {
      return res
        .status(400)
        .json({ message: "Missing professorID or subjects array" });
    }

    // First, remove all existing
    const deleteResult = await pool
      .request()
      .input("ProfessorID", professorID)
      .query(`DELETE FROM ProfessorSubjects WHERE ProfessorID = @ProfessorID`);

    console.log("Delete result:", deleteResult);

    // Now insert fresh
    for (const courseCode of subjects) {
      console.log("Processing courseCode:", courseCode);

      const result = await pool
        .request()
        .input("CourseCode", courseCode)
        .query(`SELECT SubjectID FROM Subjects WHERE CourseCode = @CourseCode`);

      console.log("Query result:", result);

      if (result.recordset.length === 0) {
        console.log(`No Subject found for CourseCode: ${courseCode}`);
        continue;
      }

      const subjectID = result.recordset[0].SubjectID;
      console.log("Found SubjectID:", subjectID);

      const insertResult = await pool
        .request()
        .input("ProfessorID", professorID)
        .input("SubjectID", subjectID).query(`
          INSERT INTO ProfessorSubjects (ProfessorID, SubjectID)
          VALUES (@ProfessorID, @SubjectID)
        `);

      console.log("Insert result:", insertResult);
    }

    res.json({ success: true, message: "Professor subjects updated!" });
  } catch (err) {
    console.error("Error updating professor subjects:", err);
    res.status(500).send("Server error while updating professor subjects");
  }
});

// Load professor info and eligible subjects
router.get("/professor/:id", async (req, res) => {
  console.log("GET /subj/professor/:id called with id:", req.params.id);
  try {
    const pool = await poolPromise;
    // Accept both string and number for id
    let id = req.params.id;
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ message: "Invalid professor ID" });
    }
    id = parseInt(id, 10);

    // Log all professors for debugging
    const allProfs = await pool.request().query(`
      SELECT ProfessorID, FullName, EmploymentStatus FROM Professors
    `);
    console.log("Current Professors in DB:", allProfs.recordset);

    // Fetch professor details
    const profResult = await pool.request().input("ProfessorID", id).query(`
        SELECT ProfessorID, 
               FullName, 
               EmploymentStatus, 
               MaxUnits, 
               CurrentUnits
        FROM Professors
        WHERE ProfessorID = @ProfessorID
      `);

    // Fetch the subjects the professor is teaching
    const subjectsResult = await pool.request().input("ProfessorID", id).query(`
        SELECT ps.SubjectID, s.CourseCode, s.CourseName, s.Units
        FROM ProfessorSubjects ps
        JOIN Subjects s ON ps.SubjectID = s.SubjectID
        WHERE ps.ProfessorID = @ProfessorID
      `);

    console.log("Professor result:", profResult.recordset);
    console.log("Subjects result:", subjectsResult.recordset);

    if (!profResult.recordset[0]) {
      return res.status(404).json({ message: "Professor not found" });
    }

    res.json({
      professor: profResult.recordset[0], // Single professor data
      eligibleSubjects: subjectsResult.recordset, // List of subjects the professor teaches
    });
  } catch (err) {
    console.error("Error fetching professor details:", err);
    res.status(500).send("Server error while fetching professor details");
  }
});

// Update professor basic info
router.put("/professor/:id", async (req, res) => {
  try {
    const pool = await poolPromise;
    const id = parseInt(req.params.id, 10);
    const { fullName, employmentStatus } = req.body;

    if (!id || !fullName || !employmentStatus) {
      return res
        .status(400)
        .json({ message: "Missing required professor info" });
    }

    const maxUnits = employmentStatus === "Full-Time" ? 24.0 : 15.0;

    await pool
      .request()
      .input("ProfessorID", id)
      .input("FullName", fullName)
      .input("EmploymentStatus", employmentStatus)
      .input("MaxUnits", maxUnits).query(`
        UPDATE Professors
        SET FullName = @FullName,
            EmploymentStatus = @EmploymentStatus,
            MaxUnits = @MaxUnits
        WHERE ProfessorID = @ProfessorID
      `);

    res.json({ success: true, message: "Professor info updated" });
  } catch (err) {
    console.error("Error updating professor:", err);
    res.status(500).send("Server error while updating professor");
  }
});

// GET /api/sections?program=BSIT
router.get("/sections", async (req, res) => {
  // console.log("🔥 /api/subj/sections route hit with query:", req.query);
  try {
    const pool = await poolPromise;
    const program = req.query.program || "BSIT"; // default to BSIT

    const result = await pool.request().input("ProgramCode", program).query(`
      SELECT 
        s.SectionID, 
        s.SectionName, 
        s.CurriculumID, 
        s.ProgramCode, 
        s.YearLevel, 
        s.Semester,
        CASE 
          WHEN NOT EXISTS (
            SELECT 1 FROM Schedules sc WHERE sc.SectionID = s.SectionID
          ) THEN 'No Schedule'
          WHEN EXISTS (
            SELECT 1 FROM Schedules sc 
            WHERE sc.SectionID = s.SectionID AND sc.ProfessorID IS NULL
          ) THEN 'Partially Completed'
          ELSE 'Completed'
        END AS ScheduleStatus
      FROM Sections s
      WHERE s.ProgramCode = @ProgramCode
      ORDER BY s.YearLevel ASC, s.Semester ASC, s.SectionName ASC;
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching sections:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
