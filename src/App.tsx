import React, { useState } from "react";
import "./App.scss";

function App() {
  const [hour, setHour] = useState(0);
  const [fraction, setFraction] = useState(0);
  const [person, setPerson] = useState("");
  const [project, setProject] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const peopleOptions = ["Laurie", "Michelle", "Dylan"];
  const projectOptions = [
    "Las Palmas",
    "Kauai - Cabin",
    "Kauai - Remodel",
    "Kauai - Guest House",
    "Sohnen",
    "Neil-Fisher",
  ];
  const hourOptions = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23,
  ];
  const fractionOptions = [0, 0.25, 0.5, 0.75];

  var formComplete =
    (hour || fraction) && person && project && !err && !success && !loading;
  var submitBttnLabel = "Log Hours";
  if (loading) submitBttnLabel = "Logging Hours...";
  if (err) submitBttnLabel = "Try Again";
  if (success) submitBttnLabel = "Logged Hours ✓";

  const submitForm = async () => {
    if (!formComplete) return;
    setLoading(false); // set to true
    setErr("");
    setSuccess(false);
    //send to firestore
    //get request
    //if request bad
    setLoading(false);
    setSuccess(false);
    setErr(""); //error msg
    //if request goo
    setLoading(false);
    setErr("");
    setSuccess(true); //set to true
    setTimeout(() => {
      setSuccess(false);
      setHour(0);
      setFraction(0);
      setPerson("");
      setProject("");
    }, 5000);
  };

  return (
    <div className="App">
      <h1>ClockSnap</h1>
      <div className="Form">
        <h3>Hours</h3>
        <div className="Hours">
          <select
            value={hour.toString()}
            onChange={(e) => setHour(Number(e.target.value))}
          >
            {hourOptions.map((option) => (
              <option key={option}>{option.toString()}</option>
            ))}
          </select>
          <select
            value={fraction.toString()}
            onChange={(e) => setFraction(Number(e.target.value))}
          >
            {fractionOptions.map((option) => (
              <option key={option}>{option.toString()}</option>
            ))}
          </select>
        </div>

        <h3>Team Member</h3>
        <select value={person} onChange={(e) => setPerson(e.target.value)}>
          <option value={""}>Select Team Member</option>
          {peopleOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <h3>Project</h3>
        <select value={project} onChange={(e) => setProject(e.target.value)}>
          <option>Select Project</option>
          {projectOptions.map((option) => (
            <option key={option}>{option.toString()}</option>
          ))}
        </select>
        <div
          className={
            success
              ? "Submit Success"
              : !formComplete
              ? "Submit Disabled"
              : "Submit"
          }
          onClick={() => submitForm()}
        >
          {submitBttnLabel}
        </div>
        {err ? (
          <div>
            <p>
              {`Error: "${err.slice(0, 24)}..." - `}
              <a
                href={`mailto:dylan.modell@gmail.com?subject=ClockSnap Submission Error&body=${err}`}
                aria-label="Email Admin"
              >
                Contact Administrator
              </a>
            </p>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default App;
