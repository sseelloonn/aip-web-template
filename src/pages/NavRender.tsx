import React from "react";
import { AsideNav } from "amis";

/**
export interface AsideNavProps {
  id?: string;
  className?: string;
  classPrefix: string;
  classnames: ClassNamesFn;
  renderLink: Function;
  isActive: Function;
  isOpen: (link: LinkItemProps) => boolean;
  navigations: Array<Navigation>;
  renderSubLinks: (
    link: LinkItemProps,
    renderLink: Function,
    depth: number,
    props: AsideNavProps
  ) => React.ReactNode;
}

export interface Navigation {
  label: string;
  children?: Array<LinkItem>;
  prefix?: JSX.Element;
  affix?: JSX.Element;
  className?: string;
  [propName: string]: any;
}
 */

const menus = [
  {
    label: "百度",
    path: "https://www.baidu.com",
  },
  {
    label: "用友审计",
    path: "https://www.yonyouaud.com",
  },
];

class NavRender extends React.Component {
  render() {
    return (
      <AsideNav
        navigations={menus}
        renderLink={(param: any) => {
          let { link, active, toggleExpand, classnames: cx, depth } = param;
          console.log(link);
          return <li>{link.label}</li>;
        }}
        isActive={()=>false}
        renderSubLinks={()=><></>}
      />
    );
  }
}

export default NavRender;
