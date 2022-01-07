import React from "react";
import { AsideNav } from "amis";
import { LinkItem } from "amis/lib/components/AsideNav";

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

const goToUrl = (url: string) => {
  window.location.href = url;
};

export interface NavRenderProps {
  menus: Array<LinkItem>;
}
class NavRender extends React.Component<NavRenderProps, {}> {
  render() {
    return (
      <AsideNav
        navigations={this.props.menus}
        renderLink={(param: any) => {
          let { link } = param;
          return (
            <li
              style={{ cursor: "pointer" }}
              onClick={() => goToUrl(link.path)}
            >
              {link.label}
            </li>
          );
        }}
        isActive={() => false}
        renderSubLinks={() => <></>}
      />
    );
  }
}

export default NavRender;
