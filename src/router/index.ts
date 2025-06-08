import { createRouter, createWebHistory } from "vue-router";
import { generateRoutesFromMenu } from "./helper";
import { menuOptions } from "@/layout/menu";

import NotFound from "@/views/Error/404.vue";
import Forbidden from "@/views/Error/403.vue";
import Login from "@/views/Login/login.vue";
import EditCoursePage from "@/views/document/Course/edit.vue";
import ViewCoursePage from "@/views/document/Course/view.vue";
import CourseVideoViewPage from "@/views/document/Course/CourseVideo.vue";
import CourseTestResultPage from "@/views/document/Course/TestResult.vue";

const routes = [
  {
    path: "/",
    component: () => import("@/layout/defaultLayout.vue"),
    children: [
      ...generateRoutesFromMenu(menuOptions), // Keep your generated routes
      {
        path: "courses/all/edit/:id",
        name: "EditCourse",
        component: EditCoursePage,
      },
      {
        path: "courses/all/view/:id",
        name: "ViewCoursePage",
        component: ViewCoursePage,
      },
      {
        path: "courses/all/:id/video-view",
        name: "CourseVideoViewPage",
        component: CourseVideoViewPage,
      },
      {
        path: "/courses/edit/result/:id",
        name: "CourseTestResultPage",
        component: CourseTestResultPage,
      },
      {
        path: "/role/edit/:id",
        name: "RoleEdit",
        component: () => import("@/views/managment/Role/edit.vue"),
      },
      {
        path: "/users/edit/:id",
        name: "UsersEdit",
        component: () => import("@/views/managment/Users/edit.vue"),
      },
      {
        path: "/organization/edit/:id",
        name: "OrganizationEdit",
        component: () => import("@/views/managment/Organization/edit.vue"),
      },
    ],
  },
  {
    path: "/403",
    component: Forbidden,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
