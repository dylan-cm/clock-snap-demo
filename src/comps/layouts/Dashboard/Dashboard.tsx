import React from "react";
import "./Dashboard.css";
import {
  MdTableChart,
  MdBarChart,
  MdCalendarMonth,
  MdOutlinePunchClock,
  MdLogout,
} from "react-icons/md";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useData } from "../../../context/DataContext";
import { useAuth } from "../../../context/UserContext";
interface DashboardProps {}

const Dashboard = ({ ...props }: DashboardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { loading } = useData();
  const getNavButtonClass = (path: string) => {
    return location.pathname.split("/")[1] === path
      ? "SideNavButton OnPath"
      : "SideNavButton";
  };
  return (
    <div className="Dashboard">
      <div className="SideNav">
        <div className="Logo" onClick={() => navigate("")}>
          <div className="LogoIcon">⏰</div> ClockSnap
        </div>
        <div className={getNavButtonClass("")} onClick={() => navigate("/")}>
          <MdOutlinePunchClock size={28} /> New Log
        </div>
        <div
          className={getNavButtonClass("logs")}
          onClick={() => navigate("logs")}
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
        <div className="SideNavButton SignOut" onClick={signOut}>
          <MdLogout size={28} /> Sign Out
        </div>
      </div>

      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="DashContainer">
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
