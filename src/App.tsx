import React, { useState, useEffect } from "react";
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Layout, Button, Avatar, AsideNav } from "amis";
import Index from "./pages/Index";
import LeftSide from "./pages/LeftSide";
import NavRender from "./pages/NavRender";
import FrameComp from "./pages/FrameComp";
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

const menus = [
  {
    label: "测试菜单",
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
];

function PersionBlog() {
  return <FrameComp title="个人博客" src="https://www.tufeiping.cn" />;
}

function YonyouAud() {
  return <FrameComp title="用友审计" src="https://www.yonyouaud.com" />;
}

function PortalMain(props: any) {
  return (
    <div style={{ ...props.style }}>
      <div>
        <Link to="/left">Left</Link> <Link to="/">Home</Link>
      </div>

      <Switch>
        <Route path="/left" component={LeftSide}></Route>
        <Route path="/personblog" component={PersionBlog}></Route>
        <Route path="/yonyouaud" component={YonyouAud}></Route>
        <Route path="/" component={Index}></Route>
      </Switch>
    </div>
  );
}

function App() {
  const [show, setShow] = useState(true);
  const [mainHeight, setMainHeight] = useState(window.innerHeight - 120);
  const switcher = () => {
    setShow(!show);
  };

  const goToUrl = (url: string) => {
    window.location.href = url;
  };

  const renderNav = () => {
    return (
      <AsideNav
        navigations={menus}
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
  };

  const onResize = () => {
    let innerHeight = window.innerHeight - 120;
    setMainHeight(innerHeight);
  };

  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
  }, []);

  return (
    <Router>
      <Layout
        header={
          <div>
            <h1 style={{ paddingRight: 20, float: "left" }}>审友UI示例</h1>
            <div style={{ marginTop: 18, float: "left" }}>
              <Button onClick={switcher}>切换</Button>
            </div>
            <div style={{ float: "right", marginRight: 20, paddingTop: 2 }}>
              <Avatar src="https://suda.cdn.bcebos.com/images/amis/ai-fake-face.jpg"></Avatar>
              <span>欢迎Admin</span>
            </div>
          </div>
        }
        aside={
          show ? (
            <div style={{ width: 200, color: "white", height: "100%" }}>
              {renderNav()}
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
