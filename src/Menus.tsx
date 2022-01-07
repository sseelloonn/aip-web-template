import { LinkItem } from "amis/lib/components/AsideNav";
import FrameComp from "./pages/FrameComp";
import JsonSchema from "./pages/JsonSchema";

export function PersionBlog() {
  return <FrameComp title="个人博客" src="https://www.tufeiping.cn" />;
}

export function YonyouAud() {
  return <FrameComp title="用友审计" src="https://www.yonyouaud.com" />;
}

export function JSONSchema() {
  return <JsonSchema />;
}

const menus: Array<LinkItem> = [
  {
    label: "Ract组件测试",
    children: [
      {
        label: "个人网站",
        path: "/#/personblog",
        children: [],
      },
      {
        label: "用友审计",
        path: "/#/yonyouaud",
        children: [],
      },
    ],
  },
  {
    label: "JSON组件测试",
    children: [
      {
        label: "JSON组件测试",
        path: "/#/json",
        children: [],
      },
    ],
  },
];

export interface NavRouterItem {
  path: string;
  component: () => JSX.Element;
}

/**
 * 可以基于menus对象遍历出本数组，但demo比较简单，直接列出来吧
 */
export const linkRouters: Array<NavRouterItem> = [
  {
    path: "/personblog",
    component: PersionBlog,
  },
  {
    path: "/yonyouaud",
    component: YonyouAud,
  },
  {
    path: "/json",
    component: JSONSchema,
  },
];

export default menus;
