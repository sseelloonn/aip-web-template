import React, { useState, useEffect } from "react";
import { HashRouter as Router } from "react-router-dom";
import { Layout, Button, Avatar } from "amis";
import { Link as AmisLink } from "amis/lib/components/Link";
import NavRender from "./pages/NavRender";
import menus from "./Menus";
import { INVALID_HEIGHT } from "./Consts";
import FrameComp from "./pages/FrameComp";
import { Tabs, Tab } from "amis/lib/components/Tabs";

import "amis/lib/themes/default.css";
// import "amis/lib/ helper.css";
import "amis/sdk/helper.css";

// const Tab = Tabs.Tab;

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

function PortalMain(props: any) {
  const [currentKey, setCurrentKey] = useState("tab1");
  return (
    <div style={{ ...props.style }}>
      <Tabs
        mode="line"
        classPrefix={"cxd"}
        // classnames={(...classes: any) => ""}
        key={"tabs"}
        classnames={function (...classes: any): string {
          console.log(classes);
          let k = classes[0] as string;
          if (k === "Tabs" || k === "Tabs-links") return "cxd-Tabs-links";
          else if (k === "Tabs-link") return "cxd-Tabs-link";
          return "";
        }} // className="cxd-Tabs-links"
        // className=""
        activeKey={currentKey}
        onSelect={(e: string | number) => {
          setCurrentKey(e as string);
        }}
      >
        <Tab
          title="首页"
          // classPrefix={"cxd"}
          // classnames={(...classes: any) => "cxd-Tabs-link"}
          className="cxd-Tabs-link"
          key={"tab1"}
          eventKey={"tab1"}
        >
          <FrameComp title="" src="https://www.yonyouaud.com" />
        </Tab>
        <Tab
          title="博客"
          className="cxd-Tabs-link"
          key={"tab2"}
          eventKey={"tab2"}
        >
          <FrameComp title="" src="https://www.tufeiping.cn/" />
        </Tab>
      </Tabs>
    </div>
  );
}

function App() {
  const [show, setShow] = useState(true);
  const [mainHeight, setMainHeight] = useState(
    window.innerHeight - INVALID_HEIGHT
  );
  const switcher = () => {
    setShow(!show);
  };

  const onResize = () => {
    let innerHeight = window.innerHeight - INVALID_HEIGHT;
    setMainHeight(innerHeight);
  };

  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <Router>
      <Layout
        header={
          <div>
            <h2 style={{ paddingRight: 20, float: "left" }}>审友UI示例</h2>
            <div style={{ marginTop: 18, float: "left" }}>
              <Button onClick={switcher}>切换</Button>
            </div>
            <div style={{ float: "right", marginRight: 20, paddingTop: 2 }}>
              <AmisLink
                href="https://github.dev/tufeiping/aip-web-template"
                htmlTarget="_blank"
                title="代码仓库"
                classPrefix={"amis"}
                classnames={(...classes: any) => ""}
              >
                <span style={{ paddingRight: 10 }}>代码仓库</span>
              </AmisLink>
              <AmisLink
                href="https://aisuda.bce.baidu.com/amis/zh-CN/docs/index"
                htmlTarget="_blank"
                title="AMIS在线文档"
                classPrefix={"amis"}
                classnames={(...classes: any) => ""}
              >
                <span style={{ paddingRight: 10 }}>AMIS在线文档</span>
              </AmisLink>
              {/* <Avatar src="https://suda.cdn.bcebos.com/images/amis/ai-fake-face.jpg"></Avatar> */}
              <Avatar src="http://www.tufeiping.cn/Header.svg"></Avatar>
              <span>欢迎Admin</span>
            </div>
          </div>
        }
        aside={
          show ? (
            <div style={{ width: 200, color: "white", height: "100%" }}>
              <NavRender menus={menus} />
            </div>
          ) : (
            false
          )
        }
        // folded={true}
        footer={
          <div style={{ textAlign: "center" }}>
            <h1>Copyright&copy;2022 用友审计</h1>
          </div>
        }
        offScreen={true}
      >
        <PortalMain style={{ height: mainHeight, padding: "10px 10px" }} />
      </Layout>
    </Router>
  );
}

export default App;
