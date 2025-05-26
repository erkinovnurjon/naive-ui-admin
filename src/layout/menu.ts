import { h, type Component } from "vue";
import { NIcon } from "naive-ui";
import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
  SettingsOutline as SettingsIcon,
} from "@vicons/ionicons5";

import Dashboard from "@/views/Home/Home.vue";
import Course from "@/views/document/Course/index.vue";
import GeneralSettings from "@/views/Settings/General.vue";
import SecuritySettings from "@/views/Settings/Security.vue";

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
    icon: renderIcon(PersonIcon),
    component: Course,
    children: [
      {
        label: "Kurslar",
        key: "/course/all",
        component: Course,
      },
    ],
  },
  {
    label: "Settings",
    key: "/settings",
    icon: renderIcon(SettingsIcon),
    children: [
      {
        label: "General",
        key: "/settings/general",
        component: GeneralSettings,
      },
      {
        label: "Security",
        key: "/settings/security",
        component: SecuritySettings,
      },
    ],
  },
];
