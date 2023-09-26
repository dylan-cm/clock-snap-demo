import React, { useEffect, useState } from "react";
import "./Calendar.css";
import { MdOutlineTimer } from "react-icons/md";
import Dropdown from "../../atoms/Dropdown/Dropdown";
import { useNavigate, useParams } from "react-router-dom";
import { calculateContrast } from "../../../utils/helper";
import { useData } from "../../../context/DataContext";

interface CalendarProps {}
const Calendar = ({ ...props }: CalendarProps) => {
  const navigate = useNavigate();
  const { year, month } = useParams();
  const [date, setDate] = useState(new Date());
  const [selectedProject, setSelectedProject] = useState<
    { name: string; color: string } | undefined
  >();
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const { projects, logs } = useData();

  useEffect(() => {
    if (year !== undefined && month !== undefined) {
      const newDate = new Date(Number(year), Number(month));
      setDate(newDate);
    }
  }, [year, month]);

  useEffect(() => {
    const filteredLogs = logs.filter((log) => {
      return (
        log.date.getMonth() === date.getMonth() &&
        log.date.getFullYear() === date.getFullYear() &&
        (!selectedProject || log.project.name === selectedProject.name)
      );
    });
    setFilteredLogs(filteredLogs);
  }, [logs, date, selectedProject]);

  const onAddLog = () => {
    navigate("/log");
  };

  const nextMonth = () => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + 1);
      window.history.replaceState(
        null,
        "Calendar",
        `/dashboard/calendar/${newDate.getFullYear()}/${newDate.getMonth()}`
      );
      return newDate;
    });
  };

  const previousMonth = () => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() - 1);
      window.history.replaceState(
        null,
        "Calendar",
        `/dashboard/calendar/${newDate.getFullYear()}/${newDate.getMonth()}`
      );
      return newDate;
    });
  };

  const selectLog = (log: Log) => {
    navigate(`/log/${log.id}`);
  };

  return (
    <div className="CalendarView">
      <div className="TopBar">
        <select
          value={selectedProject?.name || ""}
          onChange={(e) =>
            setSelectedProject(projects.find((p) => p.name === e.target.value))
          }
          style={{
            backgroundColor: selectedProject?.color,
            color: calculateContrast(selectedProject?.color || "#fff"),
          }}
        >
          <option value={""}>All Projects</option>
          {projects.map((p) => (
            <option value={p.name} key={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <div className="MonthSelector" onClick={previousMonth}>
          {"<"}
        </div>
        <h5>{getMonthName(date.getMonth())}</h5>
        <h5>{date.getFullYear()}</h5>
        <div className="MonthSelector" onClick={nextMonth}>
          {">"}
        </div>
      </div>
      <div className="DaysOfWeek">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <h6 key={day}>{day}</h6>
        ))}
      </div>
      <div className="Calendar">
        {getCalendar(date).map((calDate, i) => (
          <DaySquare
            key={calDate.toLocaleDateString()}
            date={calDate}
            logs={filteredLogs.filter((log) => {
              return (
                log.date.toLocaleDateString() === calDate.toLocaleDateString()
              );
            })}
            onClick={(selectedLog) => selectLog(selectedLog)}
            style={{
              borderRadius: `${i === 0 ? "8px" : 0} ${i === 6 ? "8px" : 0} ${
                i === 34 ? "8px" : 0
              } ${i === 28 ? "8px" : 0}`,
              backgroundColor:
                calDate.getMonth() === date.getMonth() ? "#fff" : "#ddd",
              color:
                calDate.getMonth() !== date.getMonth()
                  ? "#777"
                  : calDate.toLocaleDateString() ===
                    new Date().toLocaleDateString()
                  ? "rgb(46,123,238)"
                  : "#000",
            }}
          />
        ))}
      </div>
    </div>
  );
};

interface DaySquareProps {
  date: Date;
  style?: React.CSSProperties;
  onClick: (logId: Log) => void;
  logs: Log[];
}
const DaySquare = ({ ...props }: DaySquareProps) => {
  return (
    <div
      className="DaySquare"
      style={{
        border:
          props.date.toLocaleDateString() === new Date().toLocaleDateString()
            ? "1px solid rgb(46,123,238)"
            : "",
        fontWeight:
          props.date.toLocaleDateString() === new Date().toLocaleDateString()
            ? "500"
            : "200",
        ...props.style,
      }}
    >
      {props.date.getDate()}
      {props.logs.map((log) => {
        const name = log.name
          .split(" ")
          .map((word) => word[0])
          .slice(0, 2)
          .join("");
        return (
          <div
            className="LogChip"
            key={log.id}
            onClick={() => props.onClick(log)}
            style={{
              background: log.project.color,
              color: calculateContrast(log.project.color),
            }}
          >
            <MdOutlineTimer />
            <span id="logTime">{Math.round(log.time * 100) / 100}</span>
            <span id="logName">{`${name}`}</span>
          </div>
        );
      })}
    </div>
  );
};

const getCalendar = (currentDate: Date): Date[] => {
  // Prepare the dayArr array.
  const dayArr: Date[] = [];
  // Set the specified date.

  // Get the first day of the current month.
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  // Start the calendar on the previous Sunday if the first day of the month is not a Sunday.
  let day =
    firstDayOfMonth.getDay() === 0
      ? firstDayOfMonth
      : new Date(
          firstDayOfMonth.setDate(
            firstDayOfMonth.getDate() - firstDayOfMonth.getDay()
          )
        );

  // Add days until we've covered all the days in the current month and any remaining days in the week of the next month.
  while (
    day.getMonth() === currentDate.getMonth() ||
    day.getDay() !== 0 ||
    dayArr.length < 42 // Make sure we always have 6 weeks.
  ) {
    // Add the current day to the dayArr.
    dayArr.push(new Date(day));
    // Move on to the next day.
    day.setDate(day.getDate() + 1);
  }

  return dayArr;
};

const getMonthName = (month: number): string => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month];
};

export default Calendar;
