export {};
declare global {
  interface Log {
    project: Project;
    name: string;
    date: Date;
    id: string;
    parking: number;
    time: number;
    mileage: number;
    drafting: boolean;
    designAssistant: boolean;
    note: string;
  }

  interface Project {
    name: string;
    id: string;
    color: string;
  }
}
