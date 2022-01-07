import React from "react";
import { render as renderAmis } from "amis";
import CodeMirror from "amis/lib/components/CodeMirror";
import ReactDOM from "react-dom";
import { INVALID_HEIGHT } from "../Consts";

import "../index.css";

/**
export interface CodeMirrorEditorProps {
    className?: string;
    value?: string;
    onChange?: (value: string) => void;
    onFocus?: (e: any) => void;
    onBlur?: (e: any) => void;
    editorFactory?: (dom: HTMLElement, cm: typeof CodeMirror, props?: any) => CodeMirror.Editor;
    editorDidMount?: (cm: typeof CodeMirror, editor: CodeMirror.Editor) => void;
    editorWillUnMount?: (cm: typeof CodeMirror, editor: CodeMirror.Editor) => void;
} 
 */

const defaultJsonCode: string = `
{
    "type": "page",
    "body": {
      "type": "form",
      "body": [
        {
          "type": "input-text",
          "name": "test",
          "label": "Text"
        },
        {
          "type": "button-toolbar",
          "label": "按钮组",
          "buttons": [
            {
              "type": "button",
              "label": "按钮",
              "actionType": "dialog",
              "dialog": {
                "title": "提示",
                "body": "对，你刚点击了！"
              }
            },
            {
              "type": "submit",
              "label": "提交"
            },
            {
              "type": "reset",
              "label": "重置"
            }
          ]
        }
      ]
    }
  }
`;

class JsonDebug extends React.Component<any, any> {
  state = {
    height: 400,
  };

  onChange = (value: string) => {
    let json: any = JSON.parse(value);
    let comp = renderAmis(json);
    ReactDOM.render(comp, document.querySelector("#amis-prevew"));
  };

  onResize = () => {
    let innerHeight = window.innerHeight - INVALID_HEIGHT - 50;
    this.setState({
      height: innerHeight,
    });
  };

  componentDidMount() {
    this.onChange(defaultJsonCode);
    this.onResize();
    window.addEventListener("resize", this.onResize);
  }

  componentDidUnMount() {
    window.removeEventListener("resize", this.onResize);
  }

  render() {
    return (
      <div>
        <div>
          <h3>
            <span>
              <i className="fa fa-code" />
            </span>
            <span>JSON-Schema在线调试</span>
          </h3>
        </div>
        <div
          style={{ width: "48%", float: "left", height: this.state.height }}
          id="amis-prevew"
        ></div>
        <div
          className="json-debug"
          style={{ width: "48%", float: "left", height: this.state.height }}
        >
          <CodeMirror
            className="json-debug"
            value={defaultJsonCode}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}

export default JsonDebug;
