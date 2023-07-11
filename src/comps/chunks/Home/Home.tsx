import React from "react";
import "./Home.css";
import {
  MdCalendarMonth,
  MdHolidayVillage,
  MdPunchClock,
  MdSummarize,
  MdTableChart,
} from "react-icons/md";
import { Link } from "react-router-dom";

interface HomeProps {}

const Home = ({ ...props }: HomeProps) => {
  return (
    <div className="Home">
      <h1>Welcome to ClockSnap</h1>
      <div className="Grid">
        <Link to="/log" className="Card">
          <MdPunchClock size={48} />
          <h2>Log</h2>
          <p>Fill out a time card and submit a new log.</p>
        </Link>
        <Link to="/list" className="Card">
          <MdTableChart size={48} />
          <h2>List</h2>
          <p>
            {
              "View all the logs in one place. Search, filter, and sort to find the log you're looking for. Click on any row of the list to see details and make edits."
            }
          </p>
        </Link>
        <Link to="/calendar" className="Card">
          <MdCalendarMonth size={48} />
          <h2>Calendar</h2>
          <p>
            View all the logs in a calendar view. Filter by employee or by
            project. Click on any log shown on the calendar to see details and
            make edits.
          </p>
        </Link>
        <Link to="/summary" className="Card">
          <MdSummarize size={48} />
          <h2>Reports</h2>
          <p>
            Generate reports organized by year, project, and employee for easy
            transferring to QuickBooks.
          </p>
        </Link>
        <Link to="/projects" className="Card">
          <MdHolidayVillage size={48} />
          <h2>Projects</h2>
          <p>
            {
              "Manage you're projects. You can assign a color to see what log is for project at a glance."
            }
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
