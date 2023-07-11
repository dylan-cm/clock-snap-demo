import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getDocs, collection, DocumentSnapshot } from "firebase/firestore";
import { db } from "./firebase";

interface DataContextProps {
  projects: Project[];
  logs: Log[];
  users: string[];
  loading: boolean;
  error: any;
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | undefined>(undefined);

  const refresh = async () => {
    try {
      const projectSnapshot = await getDocs(collection(db, "projects"));
      const logSnapshot = await getDocs(collection(db, "timeLog"));
      const userSnapshot = await getDocs(collection(db, "people"));

      setProjects(
        projectSnapshot.docs.map((project: DocumentSnapshot) => {
          return {
            name: project.data()?.name,
            color: project.data()?.color,
            id: project.id,
          };
        })
      );
      setLogs(
        logSnapshot.docs.map((log: DocumentSnapshot) => {
          const associatedProject = projectSnapshot.docs.find(
            (project: DocumentSnapshot) =>
              project?.data()?.name === log.data()?.project.name
          );
          var time: number | undefined = log.data()?.time;
          if (!time) time = log.data()?.hour + log.data()?.fraction;
          return {
            name: log.data()?.userName,
            date: log.data()?.date.toDate(),
            time: time || 0,
            note: log.data()?.note,
            drafting: log.data()?.drafting,
            designAssistant: log.data()?.designAssistant,
            mileage: log.data()?.mileage || 0,
            parking: log.data()?.parking || 0,
            id: log.id,
            project: {
              name: associatedProject?.data()?.name,
              color: associatedProject?.data()?.color,
              id: associatedProject?.id ?? "",
            },
          };
        })
      );
      setUsers(
        userSnapshot.docs.map((user: DocumentSnapshot) => user?.data()?.name)
      );
      setLoading(false);
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <DataContext.Provider
      value={{ projects, logs, users, loading, error, refresh }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataContext Provider");
  }
  return context;
};
