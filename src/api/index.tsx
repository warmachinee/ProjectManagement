import * as AppHooks from "./AppHooks";
import * as Handler from "./Handler";
import AppButton from "./AppButton";

const webURL = "https://brnbycat.ml" /*"https://brn.thai-pga.com"*/;

const api: any = {
  /**---------- /user ----------*/
  session: "/user/session",
  login: "/user/login",
  logout: "/user/logout",
  forgotpassword: "/user/forgotpassword",
  register: "/user/register",
  loadusersystem: "/user/loadusersystem",
  usersystem: "/user/usersystem",
  /**---------- /project ----------*/
  loadproject: "/project/loadproject",
  projectsystem: "/project/projectsystem",
  costmanagement: "/project/costmanagement",
  phasesystem: "/project/phasesystem",
  /**---------- /task ----------*/
  loadtask: "/task/loadtask",
  tasksystem: "/task/tasksystem",
  /**---------- /subtask ----------*/
  subtasksystem: "/subtask/subtasksystem",
  /**---------- /session ----------*/
  userinfo: "/session/userinfo",
  views: "/session/views"
};

const apiUrl = (url: string) => {
  // return `${webURL}${api[url]}`;
  return api[url];
};

export const exportApi = {
  ...AppHooks,
  ...Handler,
  AppButton,
  apiUrl,
  webURL
};
