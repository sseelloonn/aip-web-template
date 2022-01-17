import React from "react";
import AcHandTable from "ac-hand-table";
// 样式
import "ac-hand-table/dist/index.css";
import { Renderer, RendererProps } from "amis/lib/factory";

/*
id	组件唯一id	string	-
data	表格数据数据	array	[]
columns	列的配置表，具体配置见下表	array	[]
language	表格语言	'zh-CN'或 'en-US'或 'zh-TW'	'zh-CN'
rowHeaders	表头信息	boolean或 array或 function (index)=>{}	true
colWidths	列宽	number 100或 string '100px'或 array [100,200]或 func (index)=>{}	-
rowHeights	列宽	number 100或 string '100px'或 array [100,200]或 func (index)=>{}	-
width	表格总宽度	'%' 或 'px'	-
height	表格总高度	'%' 或 'px' 或 'auto'	-
multiSelect	是否含有多选框	boolean	true
manualColumnResize	是否列宽可以拖动	boolean	true
manualColumnMove	是否列可以交换	boolean	false
manualRowResize	是否行高可以拖动	boolean	false
manualRowMove	是否行可以交换	boolean	false
fixedColumnsLeft	列左固定	number	-
fixedColumnsRight	列右固定	number	-
fixedRowsBottom	行头固定	number	-
fixedRowsTop	行头固定	number	-
manualColumnFreeze	是否开启固定列	boolean	true
copyPaste	是否可以复制粘贴	boolean	true
customBorders	是否开启边框设置	boolean	true
copyable	是否开启键盘复制	boolean	true
allowInsertColumn	是否开启插入列	boolean	true
allowInsertRow	是否开启插入行	boolean	true
multiColumnSorting	是否列可以排序	boolean	true
dropdownMenu	表上下文下拉菜单	boolean 或 array 见下表 dropdownMenu contextMenu	false
contextMenu	行上下文下拉菜单	boolean 或 array 见下表 dropdownMenu contextMenu	false
filters	表头下拉菜单中是否启动过滤器	boolean	false
stretchH	表宽度不等于所有列宽的计算总和时，列宽设置	'none'或 'all' 或'last'	'none'
rowStyle	行设置样式	func	-
activeHeaderClassName	选中列标题样式	strig	-
columnHeaderHeight	列表头高	number	25
fixedShadow	是否固定表格阴影	boolean	false
fixedColumnsLeft	固定表格列	number	-
fixedRowsTop	是否固定表格顶部	number	-
fixedRowsBottom	是否固定表格底部	number	-
nestedHeaders	多表头	array [['a','b']]或者[['a',{label:'b',colspan:2}]]	-
fillHandle
*/

export interface HandTableProps {
  id?: string;
  columns: any[];
  colWidths?: number[];
  rowHeaders?: any[] | boolean;
  width: number | string;
  height: number | string;
  multiSelect?: boolean;
  filters?: boolean;
  cdata: any[];
}

type IHandTableRendererProps = RendererProps & HandTableProps;

// 这里引入iUAP的ac-handle-table组件
@Renderer({
  type: "au-handtable",
})
export class HandTableRenderer extends React.Component<RendererProps, any> {
  render(): React.ReactNode {
    const {
      id,
      columns,
      colWidths,
      rowHeaders,
      height,
      multiSelect,
      filters,
      cdata,
      width,
      data, // 这里data为RendererProps的data，必须单独拿出来，不然，rest会覆盖cdata数据
    //   ...rest
    } = this.props as IHandTableRendererProps;
    console.log(`data: ${cdata}`);
    return (
      <AcHandTable
        id={id || "h-" + Math.random()}
        columns={columns}
        colWidths={colWidths}
        rowHeaders={rowHeaders}
        width={width}
        height={height}
        multiSelect={multiSelect}
        filters={filters}
        data={cdata}
      ></AcHandTable>
    );
  }
}
