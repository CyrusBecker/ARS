import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ScheduleCreation from './components/ScheduleCreation'; // AH Side
import LoadSectSched from './components/LoadSectSched'; // Loading the Section's Side
import CurriculumManagement from './components/CurriculumManagement';
import CoursesForCurriculum from './components/CoursesForCurriculum';
import AddCourses from './components/AddCourses';
import CurriculumList from './components/CurriculumLists';
import SectionList from './components/SectionLists';
import Navigation from './components/common/Navigation';
import AddingCourses from './components/AddingCourses';
import FacultyLoading from './components/ProfessorManagement';
import AddProf from './components/AddProfessor';
import EditProfessorSubjects from './components/EditProfessorCourses';
import CreateNewCurriculum from './components/CreateNewCurriculum';
import Dashboard from './components/Dashboard';

import FigmaAddCurriculum from './components/FigmaAddCurriculum';
import FigmaCurriculumArchiveList from './components/FigmaCurriculumArchiveList';
import FigmaCurriculumArchiveView from './components/FigmaCurriculumArchiveView';
import FigmaCurriculumListWAlertMSG from './components/FigmaCurriculumListWAlertMSG';
import FigmaEditExistingCurriculum from './components/FigmaEditExistingCurriculum'
import FigmaViewCurriculumThenEdit from './components/FigmaViewCurriculumThenEdit';
import { Create } from '@mui/icons-material';

const App: React.FC = () => {
  return (        
    //<div>
    //  <CurriculumList /> {/* Directly render ScheduleCreation */}
    //</div>
    <Router>
      {/* Optional: place Navigation here to be global across pages */}
      {/* <Navigation /> */}
      <Routes>
        <Route path="/" element={<Dashboard /* Main Page || Hub */ />} />
        <Route path="/curriculumOverview" element={<CurriculumList /* Listing Existing Curriculums */ />} />
        <Route path="/curriculum-management" element={<CurriculumManagement /> /* Planned for later || The selection for Programs */ } />         
        <Route path="/curriculum/add" element={<CreateNewCurriculum /* Curriculum Creation, some load are still missing */ />} />
        <Route path="/curriculum/edit/:id" element={<CoursesForCurriculum /* Curricculum Edit, some load are still missing */ />} />
        <Route path="/curriculum/view/:id" element={<AddCourses /> /* Almost done */ } />              
        <Route path="/scheduleOverview" element={<SectionList /*  */ /> }  />  
        <Route path="/schedule/view/:sectionId" element={<LoadSectSched /> /*  */ } />
        <Route path="/schedule/create/:sectionId" element={<ScheduleCreation /> /*  */} /> 
        <Route path="/facultyOverview" element={<FacultyLoading /> /*  */} />
        <Route path="/faculty/add" element={<AddProf />} /*  */ />
        <Route path="/faculty/edit/:id" element={<EditProfessorSubjects /> /*  */ } />
        <Route path="/login" element={<Login /> /* Too Bare || Non-functional */} /> 
      </Routes>
    </Router>
  );
}

export default App;