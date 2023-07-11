import React, { useState } from "react";
import "./Dashboard.css";
import {
  MdTableChart,
  MdBarChart,
  MdCalendarMonth,
  MdOutlinePunchClock,
  MdLogout,
  MdHolidayVillage,
  MdMenu,
  MdAdd,
} from "react-icons/md";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useData } from "../../../context/DataContext";
import { useAuth } from "../../../context/UserContext";
import Loading from "../../chunks/Loading/Loading";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const openMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const onNavigate = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div className="Dashboard">
      <div className="TopNav">
        <div onClick={openMenu}>
          <MdMenu size={28} />
        </div>
        <div onClick={() => onNavigate("/")}>⏰</div>
        <div onClick={() => onNavigate("/log")}>
          <MdAdd size={28} />
        </div>
      </div>
      <div className={`SideNav${menuOpen ? " MenuOpen" : ""}`}>
        <div className="Logo" onClick={() => onNavigate("")}>
          <div className="LogoIcon">⏰</div> ClockSnap
        </div>
        <div
          className={getNavButtonClass("log")}
          onClick={() => onNavigate("log")}
        >
          <MdOutlinePunchClock size={28} /> New Log
        </div>
        <div
          className={getNavButtonClass("list")}
          onClick={() => onNavigate("list")}
        >
          <MdTableChart size={28} /> List View
        </div>
        <div
          className={getNavButtonClass("calendar")}
          onClick={() => onNavigate("calendar")}
        >
          <MdCalendarMonth size={28} /> Calendar
        </div>
        <div
          className={getNavButtonClass("summary")}
          onClick={() => onNavigate("summary")}
        >
          <MdBarChart size={28} /> Reports
        </div>
        <div
          className={getNavButtonClass("projects")}
          onClick={() => onNavigate("projects")}
        >
          <MdHolidayVillage size={28} /> Projects
        </div>
        <div className="SideNavButton SignOut" onClick={signOut}>
          <MdLogout size={28} /> Sign Out
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="DashContainer">
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
