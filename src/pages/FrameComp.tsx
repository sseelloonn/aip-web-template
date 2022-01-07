import React from "react";
import { Spinner } from "amis";
import { INVALID_HEIGHT } from "../Consts";
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

export default FrameComp;
