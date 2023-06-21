import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { MdTableChart, MdBarChart, MdCalendarMonth } from "react-icons/md";
import Summary from "../../chunks/Summary/Summary";
import Calendar from "../../chunks/Calendar/Calendar";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import LogView from "../../chunks/LogView/LogView";
import ListView from "../../chunks/ListView/ListView";
interface DashboardProps {}

const Dashboard = ({ ...props }: DashboardProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const getNavButtonClass = (path: string) => {
    return location.pathname.split("/")[2] === path
      ? "SideNavButton OnPath"
      : "SideNavButton";
  };
  useEffect(() => {
    const initialFetch = async () => {
      await getDocs(collection(db, "projects")).then(async (querySnapshot) => {
        let projectData: Project[] = [];
        let logData: Log[] = [];
        querySnapshot.forEach((doc) => {
          projectData.push({
            name: doc.data().name,
            color: doc.data().color || "#fff",
            id: doc.id,
          });
        });
        await getDocs(collection(db, "timeLog")).then((logQuery) => {
          logQuery.forEach((docSnap) => {
            const logProject = projectData.find(
              (p) => p.name === docSnap.data().project.name
            );
            if (!logProject) return;
            const data = docSnap.data();
            logData.push({
              name: data.userName,
              date: data.date.toDate(),
              time: data.time,
              note: data.note,
              drafting: data.drafting,
              designAssistant: data.designAssistant,
              mileage: data.mileage,
              parking: data.parking,
              project: logProject,
              id: docSnap.id,
            });
          });
        });
        setProjects(projectData);
        setLogs(logData);
      });
      setLoading(false);
    };
    initialFetch();
  }, []);

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
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="DashContainer">
          <Routes>
            <Route path="/" element={<Summary />} />
            <Route path="/log/:logId" element={<LogView />} />
            <Route path="summary" element={<Summary />} />

            <Route
              path="calendar/:year?/:month?"
              element={<Calendar projects={projects} logs={logs} />}
            />
            <Route
              path="list"
              element={<ListView projects={projects} logs={logs} />}
            />
          </Routes>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
