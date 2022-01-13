import { LinkItem } from "amis/lib/components/AsideNav";
import FrameComp from "./pages/FrameComp";
import JsonSchema from "./pages/JsonSchema";
import JsonDebug from "./pages/JsonDebug";

export function PersionBlog() {
  return <FrameComp title="个人博客" src="https://www.tufeiping.cn" />;
}

export function YonyouAud() {
  return <FrameComp title="用友审计" src="https://www.yonyouaud.com" />;
}

export function JSONSchema() {
  return <JsonSchema />;
}

export function JsonDebugger() {
  return <JsonDebug/>
}

export function Overview() {
  let currentPath = window.location.protocol + "//" + window.location.host + window.location.pathname;
  return (
    <FrameComp title="单独页面" src={currentPath + "iframe.html#/overview"} />
  );
}


const menus: Array<LinkItem> = [
  {
    label: "Ract组件测试",
    children: [
      {
        label: "用友审计",
        path: "/#/yonyouaud",
        children: [],
      },
      {
        label: "个人网站",
        path: "/#/personblog",
        children: [],
      }
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
      {
        label: "JSON组件调试",
        path: "/#/jsondebug",
        children: [],
      }
    ],
  },
  {
    label: "单独页面",
    children: [
      {
        label: "JSON组件测试",
        path: "http://localhost:3000/iframe.html#/overview",
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
  {
    path: "/jsondebug",
    component: JsonDebugger,
  },
  {
    path: "/overview",
    component: Overview,
  }
];

export default menus;
