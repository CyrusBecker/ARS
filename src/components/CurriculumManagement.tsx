import React from 'react';

const CurriculumManagement: React.FC = () => {
  return (
    <div className="Curriculum_List">
      <h1>Academic Programs</h1>
      {/*There will be a table-like structure for the Prorams' name, code, and a button to view its contents and a button for creating new curriculums*/}
      {/* E.g. BSCS, BSIT, BSTM */}
    </div>
  );
};

export default CurriculumManagement;

/*
import React from 'react';
import CoursesForCurriculum from './CoursesForCurriculum';

export const CurriculumManagement: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      { Header }
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-4">
            <img 
              src="/web-8-1.png" 
              alt="Logo" 
              className="h-16" 
            />
          </div>
          <h1 className="text-xl font-semibold">Academic Resource Management</h1>
        </div>
        <div className="flex items-center">
          <button className="p-2 mr-4">
            <img 
              src="/group.png" 
              alt="Notifications" 
              className="h-6 w-6" 
            />
          </button>
          <div className="flex items-center">
            <img 
              src="/ix-user-profile-filled.svg" 
              alt="Profile" 
              className="h-6 w-6 mr-2" 
            />
            <span>Admin</span>
          </div>
        </div>
      </header>

      { Main content }
      <main className="container mx-auto p-6">
        <div className="mb-6 flex items-center">
          <a href="#" className="flex items-center text-blue-600">
            <img
              src="/vector.svg"
              alt="Back"
              className="w-6 h-6 mr-2"
            />
          </a>
          <h2 className="text-2xl font-bold">Add Curriculum</h2>
        </div>

        <CoursesForCurriculum />
      </main>
    </div>
  );
};

export default CurriculumManagement;
*/