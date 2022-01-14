import React from "react";
import { Renderer, Spinner } from "amis";
import { INVALID_HEIGHT } from "../Consts";
import { IFrameRenderer } from "amis/lib/renderers/IFrame";
export interface IFrameProps {
  src: string;
  height?: number;
  title: string;
}

interface IFrameState {
  loading: boolean;
}

class FrameComp extends React.Component<IFrameProps, IFrameState> {
  state = {
    loading: true,
  };
  getHeight = () => {
    let vh = window.innerHeight - INVALID_HEIGHT;
    return vh;
  };

  hideSpinner = () => {
    this.setState({
      loading: false,
    });
  };

  render() {
    return (
      <div className="container rsvp-wrapper">
        {this.state.loading ? (
          <div style={{ margin: "0 auto", width: 30 }}>
            <Spinner
              className="loading text-center"
              name="three-bounce"
              color="white"
              fadeIn="none"
              size="lg"
            />
          </div>
        ) : null}
        <iframe
          title={this.props.title}
          src={this.props.src}
          style={{
            width: "100%",
            border: "none",
            height: this.props.height ? this.props.height : this.getHeight(),
          }}
          onLoad={this.hideSpinner}
          frameBorder={0}
          marginHeight={0}
          marginWidth={0}
        ></iframe>
      </div>
    );
  }
}

class FrameCompRenderer extends React.Component<
  IFrameRenderer & IFrameProps,
  any
> {
  constructor(props: IFrameRenderer & IFrameProps, context: any) {
    super(props);

    const scoped = context;
    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    const scoped = this.context as any;
    scoped.unRegisterComponent(this);
  }

  render() {
    return (
      <FrameComp
        title={(this.props as any).title}
        src={(this.props as any).src}
        height={(this.props as any).height}
      ></FrameComp>
    );
  }
}

// Renderer({type: "audit-iframe"})()

// export default Renderer({
//   type: "audit-iframe",
// })(FrameCompRenderer);
export default FrameComp;