import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Calendar from "./comps/chunks/Calendar/Calendar";
import SummaryView from "./comps/chunks/SummaryView/SummaryView";
import ListView from "./comps/chunks/ListView/ListView";
import LogForm from "./comps/chunks/LogForm/LogForm";
import LogView from "./comps/chunks/LogView/LogView";
import Dashboard from "./comps/layouts/Dashboard/Dashboard";
import Login from "./comps/chunks/Login/Login";
import { DataProvider } from "./context/DataContext";
import RequireAuth from "./comps/RequireAuth";
import EditLog from "./comps/chunks/EditLog/EditLog";
import Home from "./comps/chunks/Home/Home";
import Projects from "./comps/chunks/Projects/Projects";
import NotFound from "./comps/chunks/NotFound/NotFound";

interface AppProps {}

const App = ({ ...props }: AppProps) => {
  return (
    <DataProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/" element={<Dashboard />}>
          {/* protected routes */}
          <Route element={<RequireAuth />}>
            <Route index element={<Home />} />
            <Route path="calendar/:year?/:month?" element={<Calendar />} />
            <Route path="summary" element={<SummaryView />} />
            <Route path="list" element={<ListView />} />
            <Route path="log">
              <Route index element={<LogForm />} />
              <Route path=":logId" element={<LogView />} />
              <Route path="edit/:logId" element={<EditLog />} />
            </Route>
            <Route path="projects" element={<Projects />} />
          </Route>
          {/* catch all */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </DataProvider>
  );
};

export default App;
