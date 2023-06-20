import React from "react";
import "./Dashboard.css";
import { MdTableChart, MdBarChart, MdCalendarMonth } from "react-icons/md";
import Summary from "../../chunks/Summary/Summary";
import Table from "../../bits/Table/Table";
import Calendar from "../../chunks/Calendar/Calendar";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

interface DashboardProps {}

const Dashboard = ({ ...props }: DashboardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const getNavButtonClass = (path: string) => {
    return location.pathname.split("/")[2] === path
      ? "SideNavButton OnPath"
      : "SideNavButton";
  };
  return (
    <div className="Dashboard">
      <div className="SideNav">
        <div className="Logo" onClick={() => navigate("")}>
          <div className="LogoIcon">⏰</div> ClockSnap
        </div>
        <div
          className={getNavButtonClass("list")}
          onClick={() => navigate("list")}
        >
          <MdTableChart size={28} /> List View
        </div>
        <div
          className={getNavButtonClass("calendar")}
          onClick={() => navigate("calendar")}
        >
          <MdCalendarMonth size={28} /> Calendar View
        </div>
        <div
          className={getNavButtonClass("summary")}
          onClick={() => navigate("summary")}
        >
          <MdBarChart size={28} /> Summary View
        </div>
      </div>
      <div className="DashContainer">
        <Routes>
          <Route path="summary" element={<Summary />} />
          <Route path="calendar" element={<Calendar />} />
          <Route
            path="list"
            element={
              <Table
                data={[
                  {
                    date: new Date(Date.now()),
                    teamMember: "Dylan Cortez-Modell",
                    hours: 2,
                    parking: 2,
                    miles: 123,
                    designAssist: false,
                    drafting: true,
                    note: "note...",
                  },
                  {
                    date: new Date(Date.now()),
                    teamMember: "Tyler Vaughn",
                    hours: 2.75,
                    parking: 0,
                    miles: 0,
                    designAssist: true,
                    drafting: false,
                    note: "note...",
                  },
                ]}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
