import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../context/firebase";
import { useAuth } from "../../../context/UserContext";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import "./LogForm.css";
import { calculateContrast } from "../../../utils/helper";

function LogForm() {
  const [date, setDate] = useState(new Date());
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [time, setTime] = useState(0);
  const [mileage, setMileage] = useState(0);
  const [parking, setParking] = useState(0);
  const [formattedParking, setFormattedParking] = useState("$0.00");
  const [drafting, setDrafting] = useState(false);
  const [designAssistant, setDesignAssistant] = useState(false);
  const [userName, setUserName] = useState("");
  const [note, setNote] = useState("");
  const [project, setProject] = useState<Project | undefined>();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [projectOptions, setProjectOptions] = useState<Project[]>([]);

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleParking = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    let numeric = input.replace(/\D/g, "");
    if (!input) numeric = "000";
    let formatted = `$${(parseInt(numeric, 10) / 100).toFixed(2)}`;
    setParking(parseInt(numeric, 10) / 100);
    setFormattedParking(formatted);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
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
            color: doc.data().color,
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

  let formComplete =
    time > 0 && project && !success && !loading && mileage >= 0 && parking >= 0;
  let submitButtonLabel = "Log Time";
  if (loading) submitButtonLabel = "Logging Time...";
  if (err) submitButtonLabel = "Try Again";
  if (success) submitButtonLabel = "Logged Time ✓";

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
        minute,
        time,
        date,
        userName,
        project,
        note,
        drafting,
        mileage,
        parking,
        designAssistant,
      });
      setLoading(false);
      setErr("");
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setHour(0);
        setMinute(0);
        setProject(undefined);
        setNote("");
        setDrafting(false);
        setDesignAssistant(false);
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

  const handleMileage = (val: string) => {
    const mileageVal = Number(val);
    if (mileageVal < 0) {
      setMileage(0);
      return;
    }
    setMileage(mileageVal);
  };

  const handleHour = (val: string) => {
    const hourVal = Number(val);
    if (hourVal > 23) {
      setHour(23);
      return;
    }
    if (hourVal < 0) {
      setHour(0);
      return;
    }
    setHour(hourVal);
  };

  const handleMinute = (val: string) => {
    const minuteVal = Number(val);
    if (minuteVal > 59) {
      setMinute(59);
      return;
    }
    if (minuteVal < 0) {
      setMinute(0);
      return;
    }
    setMinute(minuteVal);
  };

  useEffect(() => {
    setTime(hour + minute / 60);
  }, [hour, minute]);

  return (
    <div className="LogForm">
      <div className="TitleArea">
        <h2>{userName}</h2>
      </div>
      <div className="Form">
        <div className="Row">
          <label>
            Hours
            <input
              className="Number"
              type="number"
              value={hour.toString()}
              onChange={(e) => handleHour(e.target.value)}
            />
          </label>
          <label>
            Minutes
            <input
              className="Number"
              type="number"
              value={minute.toString()}
              onChange={(e) => handleMinute(e.target.value)}
            />
          </label>
        </div>
        <label>
          Date
          <input
            type="date"
            className="DateSelector"
            onChange={(e) => setDate(new Date(e.target.value))}
            value={date ? date.toISOString().split("T")[0] : ""}
          />
        </label>
        <label>
          Project
          <select
            value={project?.id || ""}
            onChange={handleProjectChange}
            style={{
              backgroundColor: project?.color,
              color: calculateContrast(project?.color || "#fff"),
            }}
          >
            <option value="" disabled>
              Select a project
            </option>
            {projectOptions
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(({ name, id }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
          </select>
        </label>
        <div className="Row">
          <label className="Checkbox">
            Drafting:
            <input
              type="checkbox"
              checked={drafting}
              onChange={() => setDrafting(!drafting)}
            />
          </label>
          <label className="Checkbox">
            Design Assistant:
            <input
              type="checkbox"
              checked={designAssistant}
              onChange={() => setDesignAssistant(!designAssistant)}
            />
          </label>
        </div>
        <div className="Row">
          <label>
            Mileage
            <input
              className="Number"
              type="number"
              value={mileage}
              onChange={(e) => handleMileage(e.target.value)}
            />
          </label>
          <label>
            Parking
            <input
              className="Number"
              type="text"
              value={formattedParking}
              onChange={(e) => handleParking(e)}
            />
          </label>
        </div>
        <label>
          Note
          <textarea
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
            }}
          />
        </label>
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

export default LogForm;
