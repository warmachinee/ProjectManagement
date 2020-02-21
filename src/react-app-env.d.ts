/// <reference types="react-scripts" />

declare module "apptype" {
  /** Dialog */
  export interface BooleanReducerState {
    [key: string]: boolean;
  }
  export interface BooleanReducerActions {
    type: string;
    key?: string;
  }

  /** Project */
  export type ProjectType = 1 | 2; //1: normal, 2: maintenance assistant
  export type ProjectStage = 1 | 2 | 3 | 4; //1: Proposal, 2: Contract, 3: Implement, 4: PM
  export type ProjectStatus =
    | "inprogress"
    | "pending"
    // | "pm"
    | "complete"
    | "fail";
  export type ProjectInformation = {
    projectid: number;
    projectname: String;
  };
  export type ProjectDuration = AppDuration;
  export type ProjectOperation = {
    op: number;
    op_percent: float;
  };
  export type ProjectManagementFee = {
    mf: number;
    mf_percent: float;
  };
  export type ProjectGuarantee = {
    guarantee_percent: float;
    guarantee_period: number;
  };
  export interface ProjectCost
    extends ProjectOperation,
      ProjectManagementFee,
      ProjectGuarantee {
    projectcost: number;
  }
  export interface ProjectPotential {
    potential: "LOW" | "MEDIUM" | "HIGH";
  }
  export interface ProjectTable {
    list: ProjectTableRow[];
    totalcost: number;
  }
  export interface ProjectTableRow extends ProjectInformation, ProjectDuration {
    projectcost: number;
    sequence: number;
    stage_current: ProjectStage;
    status: ProjectStatus;
  }
  export interface ProjectDetail {
    projectdetail: ProjectCost &
      ProjectDuration &
      ProjectPotential & {
        projectname: string;
        type: ProjectType;
        stage_current: ProjectStage;
        profitcost: number;
        summary: any | null;
        createdate: AppDate;
        contractbegin: AppDate;
        status: ProjectStatus;
      };
    tasklist: ProjectTask[];
  }

  /** Cost */
  export type ProjectCostType =
    | "hardware"
    | "software"
    | "customization"
    | "training"
    | "managementfee"
    | "entertain"
    | "travel";

  export interface CostOverview {
    projectcost: ProjectOperation &
      ProjectManagementFee &
      ProjectInformation & {
        totalest: number;
        totalact: number;
        projectcost: number;
      };
    detail: CostOverviewRow[];
  }
  export interface CostOverviewRow {
    type: ProjectCostType;
    sumest: number;
    sumact: number;
  }

  /** Task */
  export type TaskStatus = "inprogress" | "pending" | "complete";
  // export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
  export type TaskInformation = { taskid: number; taskname: string };
  export interface ProjectTask extends TaskInformation, AppDuration {
    sequence: number;
    ownerlist: any | null;
    attachmentfile: any | null;
    percent: number;
    note: any | null;
    contact: any | null;
    status: TaskStatus;
  }

  /** Subtask */
  export type SubtaskStatus = "inprogress" | "pending" | "complete";
  export type SubtaskInformation = { subtaskid: number; subtaskname: string };
  export interface Subtask extends SubtaskInformation, AppDuration {
    sequence: number;
    note: any | null;
    createdate: AppDate;
    status: SubtaskStatus;
    cost: any | null;
  }

  /** Other */
  export type Ref =
    | {
        children?: React.ReactNode;
      }
    | any
    | null;
  export type Session = {
    type: "user" | "manager";
    fullname: string;
    lastname: string;
    photopath: string | null;
  } | null;
  export type AppDate = string | null;
  export type AppDuration = {
    startdate: AppDate;
    enddate: AppDate;
  };
}
