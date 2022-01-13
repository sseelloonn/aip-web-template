import React from "react";

import axios from "axios";
import "amis/lib/themes/default.css";

import { render as renderAmis, ToastComponent, AlertComponent } from "amis";
import { defaultEnv as env } from "../Consts";

interface AMISComponentProps {
  data: any;
}

class AMISComponent extends React.Component<AMISComponentProps, any> {
  render() {
    return renderAmis(
      this.props.data,
      {
        // props...
      },
      env
    );
  }
}

class JsonSchema extends React.Component<any, any> {
  state = {
    jsonSchema: {},
  };

  componentDidMount() {
    (axios as any)
      .get("/schema.json")
      .then((resp: any) => {
        let json = resp.data;
        this.setState({
          jsonSchema: json,
        });
      });
  }

  render() {
    return (
      <>
        <ToastComponent key="toast" position={"top-right"} />
        <AlertComponent key="alert" />
        <AMISComponent data={this.state.jsonSchema} />
      </>
    );
  }
}

export default JsonSchema;
