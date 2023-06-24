import React, { FC } from "react";
import "./Table.css";
import { MdCheckCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { calculateContrast } from "../../../utils/helper";

interface TableProps {
  logs: Log[];
}

const Table: FC<TableProps> = ({ logs }) => {
  const navigate = useNavigate();
  const handleLineClick = (logId: string) => navigate(`/logs/${logId}`);
  return (
    <table className="Table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Team Member</th>
          <th>Project</th>
          <th>Hours</th>
          <th>Parking</th>
          <th>Miles</th>
          <th>Design Assist</th>
          <th>Drafting</th>
          <th className="Note">Note</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log, index) => (
          <tr
            key={index}
            style={{ backgroundColor: index % 2 !== 0 ? "#eee" : "#fff" }}
            onClick={() => handleLineClick(log.id)}
          >
            <td>{log.date.toLocaleDateString()}</td>
            <td>{log.name}</td>
            <td>
              <div
                className="Chip"
                style={{
                  backgroundColor: log.project.color,
                  color: calculateContrast(log.project.color),
                }}
              >
                {log.project.name}
              </div>
            </td>
            <td>{log.time?.toFixed(2)}</td>
            <td>{`$${log.parking?.toFixed(2)}`}</td>
            <td>{log.mileage?.toFixed(0)}</td>
            <td className="CheckboxCenter">
              <div
                className={`Checkbox ${log.designAssistant ? "Checked" : ""}`}
              >
                <center style={{ width: "100%", height: "100%" }}>
                  <MdCheckCircle
                    color="#fff"
                    size={13}
                    style={{
                      display: log.designAssistant ? "inherit" : "none",
                    }}
                  />
                </center>
              </div>
            </td>
            <td className="CheckboxCenter">
              <div className={`Checkbox ${log.drafting ? "Checked" : ""}`}>
                <center style={{ width: "100%", height: "100%" }}>
                  <MdCheckCircle
                    color="#fff"
                    size={13}
                    style={{ display: log.drafting ? "inherit" : "none" }}
                  />
                </center>
              </div>
            </td>
            <td className="Note">{log.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
