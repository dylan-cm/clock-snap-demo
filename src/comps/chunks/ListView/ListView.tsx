import React from "react";
import "./ListView.css";
import Table from "../../bits/Table/Table";

interface ListViewProps {
  projects: Project[];
  logs: Log[];
}

const ListView = ({ logs, ...props }: ListViewProps) => {
  if (logs.length < 1) return <h1>Loading...</h1>;
  return (
    <div className="ListView">
      <Table logs={logs} />
    </div>
  );
};

export default ListView;
