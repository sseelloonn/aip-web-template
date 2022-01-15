import { LinkItem } from "amis/lib/components/AsideNav";
import FrameComp from "./pages/FrameComp";

export function BuildTabFrame(url: string, title?: string) {
  return ()=>{
  return <FrameComp title={title || '新增页面'} src={url} />;
  }
}

const menus: Array<LinkItem> = [
  {
    label: "Ract组件测试",
    children: [
      {
        label: "用友审计",
        path: "https://www.yonyouaud.com",
        children: [],
      },
      {
        label: "个人网站",
        path: "https://www.tufeiping.cn",
        children: [],
      }
    ],
  },
  {
    label: "单独页面",
    children: [
      {
        label: "JSON组件测试",
        path: "./iframe.html#/overview",
        children: [],
      },
      {
        label: "JSON在线测试",
        path: "./debugger.html",
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
    path: "https://www.tufeiping.cn",
    component: BuildTabFrame("https://www.tufeiping.cn", "个人网站"),
  },
  {
    path: "https://www.yonyouaud.com",
    component: BuildTabFrame("https://www.yonyouaud.com", "用友审计"),
  },
  {
    path: "./iframe.html#/overview",
    component: BuildTabFrame("./iframe.html#/overview", "JSON组件测试"),
  }
];

export default menus;
