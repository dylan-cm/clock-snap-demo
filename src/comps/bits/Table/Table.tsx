import React, { FC } from "react";
import "./Table.css";
import { useNavigate } from "react-router-dom";
import { calculateContrast, formatCurrency } from "../../../utils/helper";

interface TableProps {
  logs: Log[];
}

const Table: FC<TableProps> = ({ logs }) => {
  const navigate = useNavigate();
  const handleLineClick = (logId: string) => navigate(`/log/${logId}`);

  const headers = [
    "Date",
    "Team Member",
    "Project",
    "Hours",
    "Parking",
    "Miles",
    "Design Asst",
    "Drafting",
    "Note",
  ];
  return (
    <div className="Table">
      <div className="TableColumn">
        <div className="TableRow">Date</div>
        {logs.map((log, i) => (
          <div
            key={"date" + i}
            onClick={() => handleLineClick(log.id)}
            className="TableRow"
            style={{ backgroundColor: i + (1 % 2) ? "#fff" : "#eee" }}
          >
            {log.date.toLocaleDateString()}
          </div>
        ))}
      </div>
      <div className="TableColumn">
        <div className="TableRow">Employee</div>
        {logs.map((log, i) => (
          <div
            key={"name" + i}
            onClick={() => handleLineClick(log.id)}
            className="TableRow"
            style={{ backgroundColor: i + (1 % 2) ? "#fff" : "#eee" }}
          >
            {log.name}
          </div>
        ))}
      </div>
      <div className="TableColumn">
        <div className="TableRow">Project</div>
        {logs.map((log, i) => (
          <div
            key={"name" + i}
            onClick={() => handleLineClick(log.id)}
            className="TableRow"
            style={{ backgroundColor: i + (1 % 2) ? "#fff" : "#eee" }}
          >
            <div
              className="Chip"
              style={{
                backgroundColor: log.project.color,
                color: calculateContrast(log.project.color),
              }}
            >
              {log.project.name}
            </div>
          </div>
        ))}
      </div>
      <div className="TableColumn">
        <div className="TableRow">Hours</div>
        {logs.map((log, i) => (
          <div
            key={"time" + i}
            onClick={() => handleLineClick(log.id)}
            className="TableRow"
            style={{ backgroundColor: i + (1 % 2) ? "#fff" : "#eee" }}
          >
            {log.time?.toFixed(2)}
          </div>
        ))}
      </div>
      <div className="TableColumn">
        <div className="TableRow">Miles</div>
        {logs.map((log, i) => (
          <div
            key={"mile" + i}
            onClick={() => handleLineClick(log.id)}
            className="TableRow"
            style={{ backgroundColor: i + (1 % 2) ? "#fff" : "#eee" }}
          >
            {log.mileage?.toFixed(0)}
          </div>
        ))}
      </div>
      <div className="TableColumn">
        <div className="TableRow">Parking</div>
        {logs.map((log, i) => (
          <div
            key={"park" + i}
            onClick={() => handleLineClick(log.id)}
            className="TableRow"
            style={{ backgroundColor: i + (1 % 2) ? "#fff" : "#eee" }}
          >
            {formatCurrency(log.parking)}
          </div>
        ))}
      </div>
      <div className="TableColumn">
        <div className="TableRow">Design Asst</div>
        {logs.map((log, i) => (
          <div
            key={"da" + i}
            onClick={() => handleLineClick(log.id)}
            className="TableRow"
            style={{ backgroundColor: i + (1 % 2) ? "#fff" : "#eee" }}
          >
            <div
              className={`Checkbox ${log.designAssistant ? "Checked" : ""}`}
            />
          </div>
        ))}
      </div>
      <div className="TableColumn">
        <div className="TableRow">Draft</div>
        {logs.map((log, i) => (
          <div
            key={"dr" + i}
            onClick={() => handleLineClick(log.id)}
            className="TableRow"
            style={{ backgroundColor: i + (1 % 2) ? "#fff" : "#eee" }}
          >
            <div className={`Checkbox ${log.drafting ? "Checked" : ""}`} />
          </div>
        ))}
      </div>
      <div className="TableColumn">
        <div className="Head TableRow Note">
          <span>Note</span>
        </div>
        {logs.map((log, i) => (
          <div
            key={"note" + i}
            onClick={() => handleLineClick(log.id)}
            className="TableRow Note"
            style={{ backgroundColor: i + (1 % 2) ? "#fff" : "#eee" }}
          >
            <span>{log.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
