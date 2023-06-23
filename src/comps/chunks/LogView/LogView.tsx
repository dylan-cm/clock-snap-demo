import React, { useEffect, useState } from "react";
import "./LogView.css";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../../context/firebase";
import { doc, getDoc } from "firebase/firestore";
import { formatCurrency } from "../../../utils/helper";
import { MdArrowBack } from "react-icons/md";

interface LogViewProps {}
const LogView = ({ ...props }: LogViewProps) => {
  const [loading, setLoading] = useState(true);
  const [logData, setLogData] = useState<Log | undefined>();
  const { logId } = useParams();
  const navigate = useNavigate();

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
  return (
    <div className="LogView">
      <button className="BackButton" onClick={() => navigate(-1)}>
        <MdArrowBack size={24} color="black" />
        Back
      </button>
      <LogViewContent loading={loading} logData={logData} />
    </div>
  );
};

const LogViewContent = ({
  logData,
  loading,
}: {
  logData?: Log;
  loading: boolean;
}) => {
  if (loading) return <h1>Loading...</h1>;
  if (!logData) return <h1>No Such Document Exists</h1>;
  return (
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
    </div>
  );
};

export default LogView;
