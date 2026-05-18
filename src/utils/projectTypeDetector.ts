import * as fs from "fs";
import * as path from "path";
import type { ProjectType } from "../models/project";

export interface ProjectTypeResult {
  type: ProjectType;
  icon: string;
  iconSource: "codicon" | "devicon";
}

const PROJECT_TYPE_CONFIGS: Array<{
  type: ProjectType;
  icon: string;
  iconSource: "codicon" | "devicon";
  detect: (projectPath: string) => boolean;
}> = [
  {
    type: "java",
    icon: "devicon-java-plain",
    iconSource: "devicon",
    detect: (projectPath: string) => {
      try {
        const files = fs.readdirSync(projectPath);
        return files.some((file) => file.endsWith(".java"));
      } catch {
        return false;
      }
    },
  },
  {
    type: "javascript",
    icon: "devicon-javascript-plain",
    iconSource: "devicon",
    detect: (projectPath: string) => {
      try {
        const files = fs.readdirSync(projectPath);
        return files.includes("package.json");
      } catch {
        return false;
      }
    },
  },
  {
    type: "python",
    icon: "devicon-python-plain",
    iconSource: "devicon",
    detect: (projectPath: string) => {
      try {
        const files = fs.readdirSync(projectPath);
        return files.some((file) => file.endsWith(".py"));
      } catch {
        return false;
      }
    },
  },
];

export function detectProjectType(projectPath: string): ProjectTypeResult {
  for (const config of PROJECT_TYPE_CONFIGS) {
    if (config.detect(projectPath)) {
      return { type: config.type, icon: config.icon, iconSource: config.iconSource };
    }
  }
  return { type: "unknown", icon: "vscode", iconSource: "codicon" };
}

export function getProjectTypeIcon(projectType: ProjectType | undefined): ProjectTypeResult {
  if (!projectType || projectType === "unknown") {
    return { type: "unknown", icon: "vscode", iconSource: "codicon" };
  }
  const config = PROJECT_TYPE_CONFIGS.find((c) => c.type === projectType);
  return config
    ? { type: config.type, icon: config.icon, iconSource: config.iconSource }
    : { type: "unknown", icon: "vscode", iconSource: "codicon" };
}
