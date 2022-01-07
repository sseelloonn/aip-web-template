import React, { useState, useEffect } from "react";
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Layout, Button, Avatar } from "amis";
import Index from "./pages/Index";
import LeftSide from "./pages/LeftSide";
import NavRender from "./pages/NavRender";
import menus, { linkRouters } from "./Menus";
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
  return (
    <div style={{ ...props.style }}>
      <div>
        <Link to="/left">Left</Link> <Link to="/">Home</Link>
      </div>

      <Switch>
        {linkRouters.map((menu) => (
          <Route path={menu.path} component={menu.component}></Route>
        ))}
        <Route path="/left" component={LeftSide}></Route>
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

  const onResize = () => {
    let innerHeight = window.innerHeight - 120;
    setMainHeight(innerHeight);
  };

  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    }
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
              <Avatar src="https://suda.cdn.bcebos.com/images/amis/ai-fake-face.jpg"></Avatar>
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
