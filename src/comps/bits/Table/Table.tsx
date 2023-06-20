import React, { FC } from "react";
import "./Table.css";
import { MdCheckCircle } from "react-icons/md";

type TableRowData = {
  date: Date;
  teamMember: string;
  hours: number;
  parking: number;
  miles: number;
  designAssist: boolean;
  drafting: boolean;
  note: string;
};

interface TableProps {
  data: TableRowData[];
}

const Table: FC<TableProps> = ({ data }) => {
  return (
    <table className="Table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Team Member</th>
          <th>Hours</th>
          <th>Parking</th>
          <th>Miles</th>
          <th>Design Assist</th>
          <th>Drafting</th>
          <th className="Note">Note</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr
            key={index}
            style={{ backgroundColor: index % 2 !== 0 ? "#eee" : "#fff" }}
          >
            <td>{row.date.toLocaleDateString()}</td>
            <td>{row.teamMember}</td>
            <td>{row.hours.toFixed(2)}</td>
            <td>{`$${row.parking.toFixed(2)}`}</td>
            <td>{row.miles.toFixed(0)}</td>
            <td className="CheckboxCenter">
              <div className={`Checkbox ${row.designAssist ? "Checked" : ""}`}>
                <center style={{ width: "100%", height: "100%" }}>
                  <MdCheckCircle
                    color="#fff"
                    size={13}
                    style={{ display: row.designAssist ? "inherit" : "none" }}
                  />
                </center>
              </div>
            </td>
            <td className="CheckboxCenter">
              <div className={`Checkbox ${row.drafting ? "Checked" : ""}`}>
                <center style={{ width: "100%", height: "100%" }}>
                  <MdCheckCircle
                    color="#fff"
                    size={13}
                    style={{ display: row.drafting ? "inherit" : "none" }}
                  />
                </center>
              </div>
            </td>
            <td className="Note">{row.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
