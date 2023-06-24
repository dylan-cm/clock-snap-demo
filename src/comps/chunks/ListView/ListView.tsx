import React from "react";
import "./ListView.css";
import Table from "../../bits/Table/Table";
import { useData } from "../../../context/DataContext";

interface ListViewProps {}

const ListView = ({ ...props }: ListViewProps) => {
  const { logs } = useData();
  if (logs.length < 1) return <h1>Loading...</h1>;
  return (
    <div className="ListView">
      <Table
        logs={logs.sort(
          (logA, logB) => logB.date.getTime() - logA.date.getTime()
        )}
      />
    </div>
  );
};

export default ListView;
