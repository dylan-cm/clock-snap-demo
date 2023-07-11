import React, { useEffect, useState } from "react";
import "./ListView.css";
import Table from "../../bits/Table/Table";
import { useData } from "../../../context/DataContext";
import { calculateContrast } from "../../../utils/helper";

interface Filters {
  to?: Date;
  from?: Date;
  employee?: string;
  project?: Project;
}

const SORT = {
  DD: "Date Descending",
  DA: "Date Ascending",
  EMP: "Employee",
  HRS: "Hours",
  PRK: "Parking",
  MI: "Miles",
};

interface ListViewProps {}
const ListView = ({ ...props }: ListViewProps) => {
  const { logs, projects, users } = useData();
  const [filters, setFilters] = useState<Filters>({
    from: undefined,
    to: undefined,
    employee: undefined,
    project: undefined,
  });
  const [sort, setSort] = useState<string>(SORT.DD);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);

  useEffect(() => {
    setFilteredLogs(
      logs.sort((logA, logB) => logB.date.getTime() - logA.date.getTime())
    );
  }, [logs]);

  useEffect(() => {
    // Start with all logs from the original data
    let filtered = [...logs];

    // Apply filters
    if (filters.from) {
      let d = new Date(filters.from);
      let fromFilter = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
      filtered = filtered.filter((log) => log.date >= fromFilter);
    }

    if (filters.to) {
      let d = new Date(filters.to);
      let toFilter = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate() + 1,
        23,
        59,
        59,
        999
      );
      filtered = filtered.filter((log) => log.date <= toFilter);
    }

    if (filters.employee) {
      filtered = filtered.filter((log) => log.name === filters.employee);
    }
    if (filters.project) {
      filtered = filtered.filter(
        (log) => log.project.id === filters.project?.id
      );
    }

    // Apply sort
    switch (sort) {
      case SORT.DA:
        filtered.sort(
          (logA, logB) => logA.date.getTime() - logB.date.getTime()
        );
        break;
      case SORT.EMP:
        filtered.sort((logA, logB) => logA.name.localeCompare(logB.name));
        break;
      case SORT.HRS:
        filtered.sort((logA, logB) => logB.time - logA.time);
        break;
      case SORT.MI:
        filtered.sort((logA, logB) => logB.mileage - logA.mileage);
        break;
      case SORT.PRK:
        filtered.sort((logA, logB) => logB.parking - logA.parking);
        break;
      default:
        filtered.sort(
          (logA, logB) => logB.date.getTime() - logA.date.getTime()
        );
    }

    setFilteredLogs(filtered);
  }, [logs, filters, sort]); // Rerun effect when logs, filters, or sort changes

  const clearFilters = () =>
    setFilters({
      from: undefined,
      to: undefined,
      employee: undefined,
      project: undefined,
    });
  if (logs.length < 1) return <h1>Loading...</h1>;

  return (
    <div className="ListView">
      <div className="ControlsWrapper">
        <label>Sort By</label>
        <div className="Controls">
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value={SORT.DD}>{SORT.DD}</option>
            <option value={SORT.DA}>{SORT.DA}</option>
            <option value={SORT.EMP}>{SORT.EMP}</option>
            <option value={SORT.HRS}>{SORT.HRS}</option>
            <option value={SORT.PRK}>{SORT.PRK}</option>
            <option value={SORT.MI}>{SORT.MI}</option>
          </select>
          <select
            value={filters.project?.name || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                project: projects.find((p) => p.name === e.target.value),
              })
            }
            style={{
              backgroundColor: filters.project?.color,
              color: calculateContrast(filters.project?.color || "#fff"),
            }}
          >
            <option value={""}>All Projects</option>
            {projects.map((p) => (
              <option value={p.name} key={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <select
            value={filters.employee || ""}
            onChange={(e) =>
              setFilters({ ...filters, employee: e.target.value })
            }
          >
            <option value={""}>All Employees</option>
            {users.map((u) => (
              <option value={u} key={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        <label>From - To</label>
        <div className="Controls">
          <input
            type="date"
            value={filters.from ? filters.from.toISOString().split("T")[0] : ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                from: e.target.value ? new Date(e.target.value) : undefined,
              })
            }
          />
          <input
            type="date"
            value={filters.to ? filters.to.toISOString().split("T")[0] : ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                to: e.target.value ? new Date(e.target.value) : undefined,
              })
            }
          />
          <button onClick={clearFilters}>Clear Filters</button>
        </div>
      </div>
      <Table logs={filteredLogs} />
    </div>
  );
};

export default ListView;
