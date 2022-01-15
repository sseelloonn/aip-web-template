import React from "react";
import { Renderer, RendererProps } from "amis/lib/factory";
import FrameComp, { IFrameProps } from "../pages/FrameComp";

type IAuditFrameProps = RendererProps & IFrameProps;

@Renderer({
  type: "audit-iframe",
})
export class FrameCompRenderer extends React.Component<RendererProps> {
  render() {
    const { render, body, src, title, height, ...rest } = this
      .props as IAuditFrameProps;
    return (
      <FrameComp src={src} title={title} height={height} {...rest}></FrameComp>
    );
  }
}
