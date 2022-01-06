import React from "react";
import * as amis from "amis";
import { Layout, Button } from "amis";
import "amis/lib/themes/cxd.css";

/**
interface LayoutProps {
    header?: boolean | React.ReactNode;
    headerClassName?: string;
    aside?: boolean | React.ReactNode;
    asideClassName: string;
    boxed?: boolean;
    folded?: boolean;
    asideFixed: boolean;
    headerFixed: boolean;
    className?: string;
    contentClassName?: string;
    footer: boolean | React.ReactNode;
    offScreen: boolean;
    classPrefix: string;
    classnames: ClassNamesFn;
    size?: 'sm' | 'base' | 'md' | 'lg';
    children?: React.ReactNode;
    bodyClassName?: string;
}
 */

class Index extends React.PureComponent<{}, {}> {
  render() {
    return (
      <div>
        <Button onClick={() => amis.alert("您好！")}>点击</Button>
      </div>
    );
  }
}

export default Index;
