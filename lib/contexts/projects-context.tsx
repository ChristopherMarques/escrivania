"use client";

import type React from "react";
import { createContext, useContext, useReducer, useEffect } from "react";
import type { IProjectSummary } from "../types";

export type Project = IProjectSummary;

interface ProjectsState {
  projects: Project[];
  loading: boolean;
}

type ProjectsAction =
  | { type: "SET_PROJECTS"; payload: Project[] }
  | { type: "ADD_PROJECT"; payload: Project }
  | { type: "UPDATE_PROJECT"; payload: Project }
  | { type: "DELETE_PROJECT"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: ProjectsState = {
  projects: [],
  loading: true,
};

function projectsReducer(
  state: ProjectsState,
  action: ProjectsAction
): ProjectsState {
  switch (action.type) {
    case "SET_PROJECTS":
      return { ...state, projects: action.payload, loading: false };
    case "ADD_PROJECT":
      return { ...state, projects: [action.payload, ...state.projects] };
    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case "DELETE_PROJECT":
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.payload),
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

interface ProjectsContextType {
  state: ProjectsState;
  addProject: (
    project: Omit<Project, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(
  undefined
);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(projectsReducer, initialState);

  // Load projects from localStorage on mount
  useEffect(() => {
    const loadProjects = () => {
      try {
        const stored = localStorage.getItem("escrivania-projects");
        if (stored) {
          const projects = JSON.parse(stored);
          dispatch({ type: "SET_PROJECTS", payload: projects });
        } else {
          // Initialize with sample projects if none exist
          const sampleProjects: Project[] = [
            {
              id: "1",
              title: "O Último Guardião",
              description: "Uma aventura épica em um mundo de magia e mistério",
              progress: 65,
              wordCount: 45000,
              characters: 8,
              chapters: 12,
              createdAt: "2024-01-15",
              updatedAt: "2024-01-15",
            },
            {
              id: "2",
              title: "Memórias de Verão",
              description: "Romance contemporâneo sobre segundas chances",
              progress: 30,
              wordCount: 18000,
              characters: 5,
              chapters: 6,
              createdAt: "2024-02-20",
              updatedAt: "2024-02-20",
            },
            {
              id: "3",
              title: "A Cidade Perdida",
              description: "Thriller arqueológico com elementos sobrenaturais",
              progress: 85,
              wordCount: 72000,
              characters: 12,
              chapters: 18,
              createdAt: "2024-01-08",
              updatedAt: "2024-01-08",
            },
          ];
          dispatch({ type: "SET_PROJECTS", payload: sampleProjects });
          localStorage.setItem(
            "escrivania-projects",
            JSON.stringify(sampleProjects)
          );
        }
      } catch (error) {
        console.error("Error loading projects:", error);
        dispatch({ type: "SET_PROJECTS", payload: [] });
      }
    };

    loadProjects();
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (!state.loading) {
      localStorage.setItem(
        "escrivania-projects",
        JSON.stringify(state.projects)
      );
    }
  }, [state.projects, state.loading]);

  const addProject = (
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt">
  ) => {
    const now = new Date().toISOString().split("T")[0];
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: "ADD_PROJECT", payload: newProject });
  };

  const updateProject = (project: Project) => {
    const updatedProject = {
      ...project,
      updatedAt: new Date().toISOString().split("T")[0],
    };
    dispatch({ type: "UPDATE_PROJECT", payload: updatedProject });
  };

  const deleteProject = (id: string) => {
    dispatch({ type: "DELETE_PROJECT", payload: id });
    // Also remove project data from localStorage
    localStorage.removeItem(`escrivania-project-${id}`);
  };

  const getProject = (id: string) => {
    return state.projects.find((p) => p.id === id);
  };

  return (
    <ProjectsContext.Provider
      value={{
        state,
        addProject,
        updateProject,
        deleteProject,
        getProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
}
