import React from "react";
import axios from "axios";
import copy from "copy-to-clipboard";
import "amis/lib/themes/default.css";

import { render as renderAmis } from "amis";
// import { alert, confirm } from "amis/lib/components/Alert";
import { toast } from "amis/lib/components/Toast";

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

// amis 环境配置
const env = {
  // 下面三个接口必须实现
  fetcher: ({
    url, // 接口地址
    method, // 请求方法 get、post、put、delete
    data, // 请求数据
    responseType,
    config, // 其他配置
    headers, // 请求头
  }: any) => {
    config = config || {};
    config.withCredentials = true;
    responseType && (config.responseType = responseType);

    if (config.cancelExecutor) {
      config.cancelToken = new (axios as any).CancelToken(
        config.cancelExecutor
      );
    }

    config.headers = headers || {};

    if (method !== "post" && method !== "put" && method !== "patch") {
      if (data) {
        config.params = data;
      }
      return (axios as any)[method](url, config);
    } else if (data && data instanceof FormData) {
      config.headers = config.headers || {};
      config.headers["Content-Type"] = "multipart/form-data";
    } else if (
      data &&
      typeof data !== "string" &&
      !(data instanceof Blob) &&
      !(data instanceof ArrayBuffer)
    ) {
      data = JSON.stringify(data);
      config.headers = config.headers || {};
      config.headers["Content-Type"] = "application/json";
    }

    return (axios as any)[method](url, data, config);
  },
  isCancel: (value: any) => (axios as any).isCancel(value),
  copy: (content: string) => {
    copy(content);
    toast.success("内容已复制到粘贴板");
  },

  // 后面这些接口可以不用实现

  // 默认是地址跳转
  // jumpTo: (
  //   location: string /*目标地址*/,
  //   action: any /* action对象*/
  // ) => {
  //   // 用来实现页面跳转, actionType:link、url 都会进来。
  // },

  // updateLocation: (
  //   location: string /*目标地址*/,
  //   replace: boolean /*是replace，还是push？*/
  // ) => {
  //   // 地址替换，跟 jumpTo 类似
  // },

  // isCurrentUrl: (
  //   url: string /*url地址*/,
  // ) => {
  //   // 用来判断是否目标地址当前地址
  // },

  // notify: (
  //   type: 'error' | 'success' /**/,
  //   msg: string /*提示内容*/
  // ) => {
  //   toast[type]
  //     ? toast[type](msg, type === 'error' ? '系统错误' : '系统消息')
  //     : console.warn('[Notify]', type, msg);
  // },
  // alert,
  // confirm,
};

class OverView extends React.PureComponent<any, any> {
  render() {
    return <div>{renderAmis(schemeObject, {}, env)}</div>;
  }
}

export default OverView;
