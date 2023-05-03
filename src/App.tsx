import React, { useEffect, useState } from "react";
import db from "./firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import "./App.css";

function App() {
  const [date, setDate] = useState(new Date());
  const [hour, setHour] = useState(0);
  const [fraction, setFraction] = useState(0);
  const [person, setPerson] = useState<
    { name: string; id: string } | undefined
  >();
  const [project, setProject] = useState<
    { name: string; id: string } | undefined
  >();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [peopleOptions, setPeopleOptions] = useState<
    Array<{ name: string; id: string }>
  >([]);
  const [projectOptions, setProjectOptions] = useState<
    Array<{ name: string; id: string }>
  >([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const peopleCollection = collection(db, "people");
        const peopleSnapshot = await getDocs(peopleCollection);
        const people = peopleSnapshot.docs.map((doc) => ({
          name: doc.data().name,
          id: doc.id,
        }));
        const projectsCollection = collection(db, "projects");
        const projectsSnapshot = await getDocs(projectsCollection);
        const projects = projectsSnapshot.docs.map((doc) => ({
          name: doc.data().name,
          id: doc.id,
        }));

        setPeopleOptions(people);
        setProjectOptions(projects);
      } catch (error: any) {
        console.log("Error: ", error.toString());
        setErr(error.toString());
        return;
      }
    };

    fetchOptions();
  }, []);

  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  const fractionOptions = [0, 0.25, 0.5, 0.75];

  let formComplete =
    (hour || fraction) && person && project && !success && !loading;
  let submitButtonLabel = "Log Hours";
  if (loading) submitButtonLabel = "Logging Hours...";
  if (err) submitButtonLabel = "Try Again";
  if (success) submitButtonLabel = "Logged Hours ✓";

  let submitClass = "Submit";
  if (success) {
    submitClass = "Submit Success";
  } else if (!formComplete) {
    submitClass = "Submit Disabled";
  }

  const submitForm = async () => {
    if (!formComplete) return;
    setLoading(true);
    setErr("");
    setSuccess(false);
    //send to firestore
    try {
      await addDoc(collection(db, "timeLog"), {
        hour: hour,
        fraction: fraction,
        date: date,
        person: person,
        project: project,
      });
      setLoading(false);
      setErr("");
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setHour(0);
        setFraction(0);
        setPerson(undefined);
        setProject(undefined);
      }, 5000);
    } catch (error: any) {
      console.log("Error: ", error.toString());
      setLoading(false);
      setSuccess(false);
      setErr(error.toString());
    }
  };

  const handlePersonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPerson = peopleOptions.find(
      (option) => option.id === event.target.value
    );
    setPerson(selectedPerson || undefined);
  };
  const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProject = projectOptions.find(
      (option) => option.id === event.target.value
    );
    setProject(selectedProject || undefined);
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
        <input
          type="date"
          className="DateSelector"
          onChange={(e) => setDate(new Date(e.target.value))}
          value={date ? date.toISOString().split("T")[0] : ""}
        />
        <h3>Team Member</h3>
        <select value={person?.id || ""} onChange={handlePersonChange}>
          <option value="" disabled>
            Select a person
          </option>
          {peopleOptions.map(({ name, id }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
        <h3>Project</h3>
        <select value={project?.id || ""} onChange={handleProjectChange}>
          <option value="" disabled>
            Select a project
          </option>
          {projectOptions.map(({ name, id }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
        <div className={submitClass} onClick={() => submitForm()}>
          {submitButtonLabel}
        </div>
        {err ? (
          <div>
            <p>
              {`An error occured, please `}
              <a
                href={`mailto:dylan.modell@gmail.com?subject=ClockSnap Submission Error&body=${err}`}
                aria-label="contact Admin by clicking this link."
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
