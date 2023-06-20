import React, { useState } from "react";
import "./Calendar.css";
import { MdOutlineTimer } from "react-icons/md";

interface CalendarProps {}
const Calendar = ({ ...props }: CalendarProps) => {
  const [date, setDate] = useState(new Date());

  const nextMonth = () => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + 1);
      return newDate;
    });
  };

  const previousMonth = () => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() - 1);
      return newDate;
    });
  };

  const selectDate = (eventId: string) => {
    console.log(eventId);
  };

  return (
    <div className="CalendarView">
      <div className="TopBar">
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
            key={calDate.date.toLocaleDateString()}
            date={calDate.date}
            events={calDate.events}
            onClick={(eventId) => selectDate(eventId)}
            style={{
              borderRadius: `${i === 0 ? "8px" : 0} ${i === 6 ? "8px" : 0} ${
                i === 34 ? "8px" : 0
              } ${i === 28 ? "8px" : 0}`,
              backgroundColor:
                calDate.date.getMonth() === date.getMonth() ? "#fff" : "#ddd",
              color:
                calDate.date.getMonth() !== date.getMonth()
                  ? "#777"
                  : calDate.date.getDate() === new Date().getDate()
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
  onClick: (eventId: string) => void;
  events: { name: string; color: string; hrs: number; id: string }[];
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
      {props.events.map((event) => (
        <div
          className="EventChip"
          key={`${event.name}${event.hrs}${props.date}`}
          onClick={() => props.onClick(event.id)}
          style={{ background: event.color }}
        >
          <MdOutlineTimer />
          {`${event.name
            .split(" ")
            .map((word) => word[0])
            .slice(0, 2)
            .join("")} - ${event.hrs}`}
        </div>
      ))}
    </div>
  );
};

const getCalendar = (
  currentDate: Date
): {
  date: Date;
  events: { name: string; color: string; hrs: number; id: string }[];
}[] => {
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
    dayArr.length === 0 ||
    day.getDay() !== 0
  ) {
    // Add the current day to the dayArr.
    dayArr.push(new Date(day));
    // Move on to the next day.
    day.setDate(day.getDate() + 1);
  }
  const range = { from: dayArr[0], to: dayArr[dayArr.length - 1] };
  const eventsArray: {
    name: string;
    color: string;
    hrs: number;
    id: string;
  }[] = []; //search for all dates within range

  return dayArr.map((date) => ({
    date,
    // events: eventsArray,
    events:
      date.getDate() === 1
        ? [
            {
              name: "Tyler Vaughn",
              color: "#9e9",
              hrs: 12.75,
              id: "lsjdn8h9hno",
            },
            {
              name: "Dylan Cortez-Modell",
              color: "#ea5",
              hrs: 3,
              id: "sadfajgh56543f",
            },
          ]
        : [],
  }));
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
