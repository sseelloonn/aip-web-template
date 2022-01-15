import React from "react";
import ReactDOM from "react-dom";

import JsonDebug from "./pages/JsonDebug";
import "./renderers/FrameCompRenderer"; // 注册组件，便于JsonDebug能直接使用 audit-iframe
import "amis/lib/themes/default.css";

ReactDOM.render(<JsonDebug />, document.getElementById("root"));
