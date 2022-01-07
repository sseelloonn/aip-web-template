import React from "react";

export interface IFrameProps {
  src: string;
  height?: number;
  title: string;
}

class FrameComp extends React.Component<IFrameProps, {}> {
  getHeight = () => {
    let vh = window.innerHeight - 120;
    return vh;
  };

  render() {
    return (
      <iframe
        title={this.props.title}
        src={this.props.src}
        style={{
          width: "100%",
          border: "none",
          height: this.props.height ? this.props.height : this.getHeight(),
        }}
      ></iframe>
    );
  }
}

export default FrameComp;
