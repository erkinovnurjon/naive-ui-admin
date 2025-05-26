import { createRouter, createWebHistory } from "vue-router";
import { generateRoutesFromMenu } from "./helper";
import { menuOptions } from "@/layout/menu";

import NotFound from "@/views/Error/404.vue";
import Forbidden from "@/views/Error/403.vue";
import Login from "@/views/Login/login.vue";

const routes = [
  {
    path: "/",
    component: () => import("@/layout/defaultLayout.vue"),
    children: generateRoutesFromMenu(menuOptions),
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
