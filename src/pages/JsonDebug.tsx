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

// 该schema定义了一个审友UI扩展组件-来自tinper的表格组件
const defaultJsonCode: string = `
{
  "type": "page",
  "body": {
    "type": "form",
    "body": [
      {
        "type": "au-handtable",
        "name": "test",
        "label": "Text",
        "colHeaders": ["姓名", "等级", "性别", "时间"],
        "cdata": [
          {
            "id": 1,
            "name": "张小贝",
            "level": 19,
            "gender": "1",
            "time": "09:20:30"
          },
          {
            "id": 2,
            "name": "张小贝",
            "level": 10,
            "gender": "1",
            "time": "09:20:30"
          },
          {
            "id": 3,
            "name": "张小贝",
            "level": 20,
            "gender": "0",
            "time": "09:20:30"
          },
          {
            "id": 4,
            "name": "张小贝",
            "level": 20,
            "gender": "0",
            "time": "09:20:30"
          }
        ],
        "rowKey": "id",
        "colWidths": [150, 100, 100, 220, null],
        "columnHeaderHeight": 30,
        "width": 520,
        "height": 400,
        "columns": [
          {
            "data": "name",
            "textTooltip": true
          },
          {
            "data": "level",
            "type": "numeric"
          },
          {
            "data": "gender",
            "type": "select",
            "source": [
              {
                "value": "请选择",
                "key": ""
              },
              {
                "value": "男",
                "key": "1"
              },
              {
                "value": "女",
                "key": "0"
              }
            ],
            "dropdownMenu": true
          },
          {
            "data": "time",
            "type": "time",
            "timeFormat": "hh:mm:ss",
            "correctFormat": true
          }
        ]
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
