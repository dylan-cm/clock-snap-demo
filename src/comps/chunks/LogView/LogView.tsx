import React, { useEffect, useState } from "react";
import "./LogView.css";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../../context/firebase";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { formatCurrency } from "../../../utils/helper";
import { MdArrowBack } from "react-icons/md";
import { useData } from "../../../context/DataContext";

interface LogViewProps {}
const LogView = ({ ...props }: LogViewProps) => {
  const [loading, setLoading] = useState(true);
  const [logData, setLogData] = useState<Log | undefined>();
  const { logId } = useParams();
  const navigate = useNavigate();
  const { refresh } = useData();

  useEffect(() => {
    const getLog = async () => {
      const docSnap = await getDoc(doc(db, "timeLog", logId || ""));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLogData({
          name: data.userName,
          date: data.date.toDate(),
          time: data.time,
          note: data.note,
          drafting: data.drafting,
          designAssistant: data.designAssistant,
          mileage: data.mileage,
          parking: data.parking,
          project: data.project,
          id: docSnap.id,
        });
      }
      setLoading(false);
    };
    getLog();
  }, [logId]);

  const editLog = () => {
    console.log("edit");
  };

  const deleteLog = async () => {
    if (!logData) return;
    if (window.confirm("Are you sure you want to delete this item?")) {
      await deleteDoc(doc(db, "timeLog", logData.id));
      await refresh();
      navigate(-1);
    }
  };

  return (
    <div className="LogView">
      <button className="BackButton" onClick={() => navigate(-1)}>
        <MdArrowBack size={24} color="black" />
        Back
      </button>
      {loading ? (
        <h1>Loading...</h1>
      ) : !logData ? (
        <h1>No Such Document Exists</h1>
      ) : (
        <div className="Content">
          <div className="Row">
            <h2>{logData.name}</h2>
            <h2>{logData.project.name}</h2>
          </div>
          <div className="Row">
            <p>{logData.date.toDateString()}</p>
            <div className="Combine">
              <h4>{`${logData.time}`}</h4>
              <p>hrs</p>
            </div>
          </div>
          <div className="Row">
            <div className="Combine">
              <h4>Mileage:</h4>
              <p>{`${logData.mileage}`}</p>
            </div>
            <div className="Combine">
              <h4>Parking:</h4>
              <p>{`${formatCurrency(logData.parking)}`}</p>
            </div>
          </div>
          <div className="Row">
            <div className="Combine">
              <h4>Drafting:</h4>
              <p>{`${logData.drafting ? "Yes" : "No"}`}</p>
            </div>
            <div className="Combine">
              <h4>Design Assistant:</h4>
              <p>{`${logData.designAssistant ? "Yes" : "No"}`}</p>
            </div>
          </div>
          <div className="Row">
            <h4>Note:</h4>
            <p>{logData.note}</p>
          </div>
          <div className="Row">
            <button className="Delete" onClick={deleteLog}>
              Delete
            </button>
            <button className="Edit" onClick={editLog}>
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogView;
