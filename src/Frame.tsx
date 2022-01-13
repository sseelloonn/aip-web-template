import React from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import FrameIndex from "./pages/FrameIndex";
import OverView from "./pages/OverView";

class Frame extends React.PureComponent<any, any> {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/overview" component={FrameIndex}></Route>
          <Route path="/" component={OverView}></Route>
        </Switch>
      </Router>
    );
  }
}

export default Frame;
