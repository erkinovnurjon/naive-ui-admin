import { h, type Component } from "vue";
import { NIcon } from "naive-ui";
import {
  BookOutline as BookIcon,
  VideocamOutline as VideocamIcon,
  SettingsOutline as SettingsIcon,
} from "@vicons/ionicons5";

import Dashboard from "@/views/Home/Home.vue";
import Course from "@/views/document/Course/index.vue";
import RolePage from "@/views/managment/Role/index.vue";
import UsersPage from "@/views/managment/Users/index.vue";

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

export const menuOptions = [
  {
    label: "Dashboard",
    key: "/",
    icon: renderIcon(BookIcon),
    component: Dashboard,
  },
  {
    label: "Kontent",
    key: "/course",
    icon: renderIcon(VideocamIcon),
    component: Course,
    children: [
      {
        label: "Kurslar",
        key: "/course/all",
        icon: renderIcon(VideocamIcon),
        component: Course,
      },
    ],
  },
  {
    label: "Boshqaruv",
    key: "/settings",
    icon: renderIcon(SettingsIcon),
    children: [
      {
        label: "Rollar",
        key: "/settings/role",
        component: RolePage,
      },
      {
        label: "Foydalanuvchi",
        key: "/settings/users",
        component: UsersPage,
      },
      {
        label: "Sinxronizatsiya",
        key: "/settings/organization",
        component: () => import("@/views/managment/Organization/index.vue"),
      },
    ],
  },
];
