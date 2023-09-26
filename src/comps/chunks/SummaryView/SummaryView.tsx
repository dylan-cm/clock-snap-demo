import React, { useEffect, useState } from "react";
import "./SummaryView.css";
import { useData } from "../../../context/DataContext";
import { calculateContrast, formatCurrency } from "../../../utils/helper";

interface MonthlySummary {
  month: string;
  hours: number;
  miles: number;
  parking: number;
  designAssistantHours: number;
  drafts: number;
  userSummaries: UserSummary[];
}

interface UserSummary {
  name: string;
  hours: number;
  miles: number;
  parking: number;
  designAssistantHours: number;
  drafts: number;
  compiledNotes: string;
}

interface SummaryViewProps {}
const SummaryView = ({ ...props }: SummaryViewProps) => {
  const { projects, users, logs } = useData();

  const [project, setProject] = useState<Project | null>(null);
  const [employee, setEmployee] = useState<string | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const [summary, setSummary] = useState<MonthlySummary[]>([]);

  useEffect(() => {
    setFilteredLogs(
      logs.filter((log) => {
        // Check for the year first
        if (log.date.getFullYear() !== year) {
          return false;
        }

        // If both employee and project are specified, only logs for that employee and project are included.
        if (employee !== null && project !== null) {
          return log.name === employee && log.project.id === project.id;
        }

        // If only employee is specified, logs for all projects for that employee are included.
        if (employee !== null) {
          return log.name === employee;
        }

        // If only project is specified, logs for all employees for that project are included.
        if (project !== null) {
          return log.project.id === project.id;
        }

        // If neither employee nor project is specified, no logs are included.
        return false;
      })
    );
  }, [project, year, employee, logs]);

  useEffect(() => {
    const months = Array.from({ length: 12 }, (_, i) =>
      new Date(1970, i, 1).toLocaleString("default", { month: "long" })
    );

    const summaries: MonthlySummary[] = months
      .map((month) => {
        const logsByMonth = filteredLogs.filter(
          (log) =>
            log.date.toLocaleString("default", { month: "long" }) === month
        );
        if (logsByMonth.length < 1) {
          return {
            month: month,
            hours: 0,
            miles: 0,
            parking: 0,
            designAssistantHours: 0,
            drafts: 0,
            userSummaries: [],
          };
        }

        const uniqueNames = Array.from(
          new Set(logsByMonth.map((log) => log.name))
        );

        const userSummaries: UserSummary[] = uniqueNames
          .map((name) => {
            const logsByUser = logsByMonth.filter((log) => log.name === name);

            return {
              name: name,
              hours: logsByUser
                .filter((log) => !log.designAssistant)
                .map((log) => log.time)
                ?.reduce((prev, curr) => prev + curr, 0),
              miles: logsByUser
                .map((log) => log.mileage)
                ?.reduce((prev, curr) => prev + curr, 0),
              parking: logsByUser
                .map((log) => log.parking)
                ?.reduce((prev, curr) => prev + curr, 0),
              designAssistantHours: logsByUser
                .filter((log) => log.designAssistant)
                .map((log) => log.time)
                ?.reduce((prev, curr) => prev + curr, 0),
              drafts: logsByUser.filter((log) => log.drafting).length,
              compiledNotes: logsByUser.map((log) => log.note).join("<br/>"),
            };
          })
          .filter((s) => s.hours > 0);

        return {
          month: month,
          hours: logsByMonth
            .filter((log) => !log.designAssistant)
            .map((log) => log.time)
            ?.reduce((prev, curr) => prev + curr, 0),
          miles: logsByMonth
            .map((log) => log.mileage)
            ?.reduce((prev, curr) => prev + curr, 0),
          parking: logsByMonth
            .map((log) => log.parking)
            ?.reduce((prev, curr) => prev + curr, 0),
          designAssistantHours: logsByMonth
            .filter((log) => log.designAssistant)
            .map((log) => log.time)
            ?.reduce((prev, curr) => prev + curr, 0),
          drafts: logsByMonth.filter((log) => log.drafting).length,
          userSummaries: userSummaries,
        };
      })
      .filter((s) => s.hours > 0);
    setSummary(summaries);
  }, [filteredLogs, users]);

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selection = e.target.value;
    if (selection === "") {
      setProject(null);
    } else {
      setProject(projects.find((p) => p.id === selection) || null);
    }
  };

  const handleEmployeeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selection = e.target.value;
    if (selection === "") {
      setEmployee(null);
    } else {
      setEmployee(selection);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(Number(e.target.value));
  };

  return (
    <div className="SummaryView">
      <div className="SummaryControls">
        <select value={year} onChange={handleYearChange}>
          {Array.from(
            { length: new Date().getFullYear() - 2022 },
            (_, i) => i + 2023
          ).map((y) => (
            <option value={y} key={y}>
              {y}
            </option>
          ))}
        </select>
        <select
          value={project?.id || ""}
          onChange={handleProjectChange}
          style={{
            backgroundColor: project?.color,
            color: calculateContrast(project?.color || "#fff"),
          }}
        >
          <option value={""}>All Projects</option>
          {projects
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
        </select>
        <select value={employee || ""} onChange={handleEmployeeSelect}>
          <option value={""}>All Employees</option>
          {users
            .sort((a, b) => a.localeCompare(b))
            .map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
        </select>
      </div>

      {summary.length < 1 ? (
        employee || project ? (
          <div className="EmptyText">No logs for the given selection.</div>
        ) : (
          <div className="EmptyText">Select a project or an employee.</div>
        )
      ) : (
        summary.map((month) => (
          <div className="SummaryListItem" key={month.month}>
            <div className="ListItemHeader">
              <h3>{month.month}</h3>
              <div className="LabeledValue">
                <h4>{Math.round(month.hours * 100) / 100}</h4>
                <span>Hours</span>
              </div>
              <div className="LabeledValue">
                <h4>{month.miles}</h4>
                <span>Miles</span>
              </div>
              <div className="LabeledValue">
                <h4>{formatCurrency(month.parking)}</h4>
                <span>Parking</span>
              </div>
              <div className="LabeledValue">
                <h4>{Math.round(month.designAssistantHours * 100) / 100}</h4>
                <span>Design Assistant Hours</span>
              </div>
              <div className="LabeledValue">
                <h4>{month.drafts}</h4>
                <span>Drafts</span>
              </div>
            </div>
            {month.userSummaries.map((user) => (
              <div className="SummaryListItem" key={user.name}>
                <div className="ListItemHeader">
                  <h3>{user.name}</h3>
                  <div className="LabeledValue">
                    <h4>{Math.round(user.hours * 100) / 100}</h4>
                    <span>Hours</span>
                  </div>
                  <div className="LabeledValue">
                    <h4>{user.miles}</h4>
                    <span>Miles</span>
                  </div>
                  <div className="LabeledValue">
                    <h4>{formatCurrency(user.parking)}</h4>
                    <span>Parking</span>
                  </div>
                  <div className="LabeledValue">
                    <h4>{Math.round(user.designAssistantHours * 100) / 100}</h4>
                    <span>Design Assistant Hours</span>
                  </div>
                  <div className="LabeledValue">
                    <h4>{user.drafts}</h4>
                    <span>Drafts</span>
                  </div>
                </div>
                <p>
                  {user.compiledNotes.split("<br/>").map((string, index) => (
                    <React.Fragment key={index}>
                      {string}
                      <br />
                    </React.Fragment>
                  ))}{" "}
                </p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default SummaryView;
