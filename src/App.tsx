import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, UserAuth } from "./firebase";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { AriaTextFieldProps, useTextField } from "react-aria";
import "./App.css";

function TextArea(props: AriaTextFieldProps) {
  let { label } = props;
  let ref = React.useRef(null);
  let { labelProps, inputProps } = useTextField(
    {
      ...props,
      inputElementType: "textarea",
    },
    ref
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: 200,
      }}
    >
      <label
        style={{ fontSize: 20, margin: "24px 0px 8px 0px", fontWeight: "bold" }}
        {...labelProps}
      >
        {label}
      </label>
      <textarea
        style={{
          background: "transparent",
          color: "white",
          borderRadius: 8,
          padding: 12,
          fontSize: 14,
          fontFamily: "sans-serif",
          boxSizing: "border-box",
          width: "100%",
        }}
        {...inputProps}
        ref={ref}
      />
    </div>
  );
}

function App() {
  const [date, setDate] = useState(new Date());
  const [hour, setHour] = useState(0);
  const [fraction, setFraction] = useState(0);
  const [mileage, setMileage] = useState(0);
  const [parking, setParking] = useState(0);
  const [drafting, setDrafting] = useState(false);
  const [userName, setUserName] = useState("");
  const [note, setNote] = useState("");
  const [project, setProject] = useState<
    { name: string; id: string } | undefined
  >();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [projectOptions, setProjectOptions] = useState<
    Array<{ name: string; id: string }>
  >([]);

  const { user, signOut } = UserAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log("You are logged out");
      navigate("/login");
    } catch (e: any) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    if (!user) navigate("/login");
    const fetchOptions = async () => {
      try {
        const userDoc = await getDoc(doc(db, "people", user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
        } else {
          console.log("No such document!");
        }
        const projectsCollection = collection(db, "projects");
        const projectsSnapshot = await getDocs(projectsCollection);
        const projects = projectsSnapshot.docs.map((doc) => {
          return {
            name: doc.data().name,
            id: doc.id,
          };
        });

        setProjectOptions(projects);
      } catch (error: any) {
        console.log("Error: ", error.toString());
        setErr(error.toString());
        return;
      }
    };

    if (user?.uid) {
      fetchOptions();
    }
  }, [user, navigate]);

  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  const fractionOptions = [0, 0.25, 0.5, 0.75];

  let formComplete = (hour || fraction) && project && !success && !loading;
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
        hour,
        fraction,
        date,
        userName,
        project,
        note,
        drafting,
        mileage,
        parking,
      });
      setLoading(false);
      setErr("");
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setHour(0);
        setFraction(0);
        setProject(undefined);
        setNote("");
        setDrafting(false);
        setMileage(0);
        setParking(0);
      }, 5000);
    } catch (error: any) {
      console.log("Error: ", error.toString());
      setLoading(false);
      setSuccess(false);
      setErr(error.toString());
    }
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
      <h2>{userName}</h2>
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
        <label>
          Drafting:
          <input
            className="Checkbox"
            type="checkbox"
            checked={drafting}
            onChange={() => setDrafting(!drafting)}
          />
        </label>
        <div className="NumberRow">
          <label>
            Mileage
            <input
              className="Number"
              type="number"
              value={mileage}
              onChange={(e) => setMileage(Number(e.target.value))}
            />
          </label>
          <label>
            Parking
            <input
              className="Number"
              type="number"
              value={parking.toString()}
              onChange={(e) => setParking(Number(e.target.value))}
            />
          </label>
        </div>
        <TextArea
          value={note}
          label="Note"
          onChange={(value) => setNote(value)}
        />
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
      <span className="SignOut" onClick={() => handleSignOut()}>
        Sign Out
      </span>
    </div>
  );
}

export default App;
