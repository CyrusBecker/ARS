require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const subjectRoutes = require("./routes/CurrSubjectRet");
app.use("/api/subj", subjectRoutes);
const scheduleRoutes = require("./routes/scheduleRoute");
app.use("/api/sched", scheduleRoutes);
const professorAssignRoutes = require("./routes/professorAssignRoute");
app.use("/api/profassign", professorAssignRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
