import React, { useEffect, useState } from "react";
import "./Projects.css";
import { calculateContrast } from "../../../utils/helper";
import { db } from "../../../context/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { HexColorPicker } from "react-colorful";
import { useData } from "../../../context/DataContext";
interface ProjectsProps {}

const Projects = ({ ...props }: ProjectsProps) => {
  const [newProject, setNewProject] = useState({ name: "", color: "" });
  const [addError, setAddError] = useState<undefined | string>();
  const [projects, setProjects] = useState<{ name: string; color: string }[]>(
    []
  );
  const { refresh } = useData();

  const fetchOptions = async () => {
    try {
      const projectsCollection = collection(db, "projects");
      const projectsSnapshot = await getDocs(projectsCollection);
      const fetchedProjects: { name: string; color: string }[] =
        projectsSnapshot.docs.map((doc) => {
          return {
            name: doc.data().name.toString(),
            color: doc.data().color.toString(),
          };
        });

      setProjects(fetchedProjects);
    } catch (error: any) {
      console.log("Error: ", error.toString());
      // setErr(error.toString());
      return;
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const submit = async () => {
    setAddError(undefined);
    if (!newProject.name || !newProject.color) {
      setAddError("Please choose a name and a color");
      return;
    }
    //send to firestore
    else {
      try {
        await addDoc(collection(db, "projects"), {
          name: newProject.name,
          color: newProject.color,
        });
        setNewProject({ name: "", color: "" });
        await fetchOptions();
        await refresh();
      } catch (error: any) {
        setAddError(error.toString());
      }
    }
  };

  return (
    <div className="Projects">
      <h2>Add New Project</h2>
      <div className="Form">
        <label>Project Name:</label>
        <input
          value={newProject.name}
          type="text"
          placeholder="Project A"
          onChange={(e) =>
            setNewProject({ ...newProject, name: e.target.value })
          }
        />
        <label>Project Color:</label>
        <HexColorPicker
          color={newProject.color}
          onChange={(color) => setNewProject({ ...newProject, color })}
        />
        <button onClick={submit}>Add</button>
        <span>{addError}</span>
      </div>
      <h2>All Projects</h2>
      <div className="Grid">
        {projects.map((project) => (
          <div
            key={project.name}
            className="Card"
            style={{
              background: `linear-gradient(225deg, ${project.color}99 0%, ${project.color} 100%)`,
              borderColor: project.color,
              color: calculateContrast(project.color),
            }}
          >
            <h3>{project.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
