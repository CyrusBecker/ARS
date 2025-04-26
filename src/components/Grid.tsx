import React from 'react';
import { Fragment } from 'react';
import '../assets/Grid.css';

interface GridProps {
  subjects: any[];  // Define the structure of subjects based on the API response
}

const times = [
  '7:00 - 7:30 AM', '7:30 - 8:00 AM', '8:00 - 8:30 AM', '8:30 - 9:00 AM',
  '9:00 - 9:30 AM', '9:30 - 10:00 AM', '10:00 - 10:30 AM', '10:30 - 11:00 AM',
  '11:00 - 11:30 AM', '11:30 - 12:00 PM', '12:00 - 12:30 PM', '12:30 - 1:00 PM',
  '1:00 - 1:30 PM', '1:30 - 2:00 PM', '2:00 - 2:30 PM', '2:30 - 3:00 PM', 
  '3:00 - 3:30 PM', '3:30 - 4:00 PM', '4:00 - 4:30 PM', '4:30 - 5:00 PM', 
  '5:00 - 5:30 PM', '5:30 - 6:00 PM', '6:00 - 6:30 PM', '6:30 - 7:00 PM',
  '7:00 - 7:30 PM', '7:30 - 8:00 PM', '8:00 - 8:30 PM', '8:30 - 9:00 PM',
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Grid: React.FC<GridProps> = ({ subjects }) => {
  return (
    <div className="grid-container">
      <div className="grid-header">
        <div>Time</div>
        {days.map((day, idx) => (
          <div key={idx}>
            {day}
          </div>
        ))}
      </div>

      <div className="grid-rows">
        {times.map((time, timeIdx) => (
          <Fragment key={timeIdx}>
            <div className="time-column">
              {time}
            </div>
            {days.map((_, dayIdx) => (
              <div
                key={`${timeIdx}-${dayIdx}`}
                className="time-slot"
              >
                {/* Empty slot - you can drop items here later */}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Grid;