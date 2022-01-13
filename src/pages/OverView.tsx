import React from "react";
import "amis/lib/themes/default.css";

import { render as renderAmis } from "amis";
import {defaultEnv as env} from "../Consts";

const schemeObject = {
  title: "浏览器内核对 CSS 的支持情况",
  remark: "嘿，不保证数据准确性",
  type: "page",
  body: {
    type: "crud",
    draggable: true,
    syncLocation: false,
    api: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/sample",
    keepItemSelectionOnPageChange: true,
    autoGenerateFilter: true,
    bulkActions: [
      {
        type: "button",
        label: "批量删除",
        actionType: "ajax",
        api: "delete:https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/sample/${ids|raw}",
        confirmText: "确定要批量删除?",
      },
      {
        type: "button",
        label: "批量修改",
        actionType: "dialog",
        dialog: {
          title: "批量编辑",
          name: "sample-bulk-edit",
          body: {
            type: "form",
            api: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/sample/bulkUpdate2",
            body: [
              {
                type: "hidden",
                name: "ids",
              },
              {
                type: "input-text",
                name: "engine",
                label: "Engine",
              },
            ],
          },
        },
      },
    ],
    quickSaveApi:
      "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/sample/bulkUpdate",
    quickSaveItemApi:
      "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/sample/$id",
    headerToolbar: [
      "bulkActions",
      {
        type: "button",
        label: "重置测试数据",
        actionType: "ajax",
        size: "sm",
        api: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/sample/reset",
      },
      "export-excel",
      {
        type: "tpl",
        tpl: "一共有 ${count} 行数据。",
        className: "v-middle",
      },
      {
        type: "columns-toggler",
        align: "right",
        draggable: true,
      },
      {
        type: "drag-toggler",
        align: "right",
      },
    ],
    footerToolbar: ["statistics", "switch-per-page", "pagination"],
    columns: [
      {
        name: "id",
        label: "ID",
        width: 20,
        sortable: true,
        type: "text",
        searchable: {
          type: "input-text",
          name: "id",
          label: "主键",
          placeholder: "输入id",
        },
      },
      {
        name: "browser",
        label: "Browser",
        searchable: {
          type: "select",
          name: "browser",
          label: "浏览器",
          placeholder: "选择浏览器",
          options: [
            {
              label: "Internet Explorer ",
              value: "ie",
            },
            {
              label: "AOL browser",
              value: "aol",
            },
            {
              label: "Firefox",
              value: "firefox",
            },
          ],
        },
      },
      {
        name: "platform",
        label: "平台",
        popOver: {
          trigger: "hover",
          body: {
            type: "tpl",
            tpl: "就是为了演示有个叫 popOver 的功能",
          },
        },
        sortable: true,
        type: "text",
      },
      {
        name: "grade",
        label: "CSS 等级",
        type: "select",
        options: ["A", "B", "C", "D", "X"],
      },
      {
        type: "operation",
        label: "操作",
        width: 100,
        buttons: [
          {
            type: "button",
            actionType: "ajax",
            label: "删除",
            confirmText: "您确认要删除?",
            api: "delete:https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/sample/$id",
          },
        ],
      },
    ],
  },
};

class OverView extends React.PureComponent<any, any> {
  render() {
    return <div>{renderAmis(schemeObject, {}, env)}</div>;
  }
}

export default OverView;
