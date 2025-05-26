import type { RouteRecordRaw } from "vue-router";

export function generateRoutesFromMenu(menu: any[]): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = [];

  for (const item of menu) {
    const route: RouteRecordRaw = {
      path: item.key,
      name: item.label?.replace(/\s+/g, ""),
      component: item.component,
    };

    if (item.children && item.children.length > 0) {
      // @ts-ignore
      route.children = generateRoutesFromMenu(item.children);
    }

    routes.push(route);
  }

  return routes;
}
