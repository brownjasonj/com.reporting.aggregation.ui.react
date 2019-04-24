import { IViewportDatasource, IViewportDatasourceParams, RowNode } from 'ag-grid-community';
import { DataServerRequestAllData } from 'src/viewport/DataServerRequestAllDate';
import { DataServerRequestWindowSizeChange } from './DataServerRequestWindowSizeChange';
import { DataServerResponse } from './DataServerResponse';
import { DataServerResponseColumnUpdate } from './DataServerResponseColumnUpdate';
import { DataServerResponseDataSet } from './DataServerResponseDataSet';
import { DataServerResponseDataSetSize } from './DataServerResponseDataSetSize';
import { EServerResponseEventType } from './EServerResponseEventType';


class ViewPortWebSocketDataSource<T> implements IViewportDatasource {
    private webSocket: WebSocket;
    private viewportDataSourceParams: IViewportDatasourceParams;

    // gets called by the grid, provides us with the callbacks we need
    public init(params: IViewportDatasourceParams) {
        this.viewportDataSourceParams = params;
        this.webSocket = new WebSocket("ws://localhost:8080/stockticker/viewport");

        this.webSocket.onmessage = (ev:Event) => {this.webSocketOnMessage(ev)};
        this.webSocket.onopen = (ev:Event):any => {this.webSocket.send(JSON.stringify(new DataServerRequestAllData()))};
    };

    // gets called by the grid, tells us what rows the grid is displaying, so time for
    // us to tell the server to give us the rows for that displayed range
    public setViewportRange(firstRow: number, lastRow: number) {
        this.webSocket.send(JSON.stringify(new DataServerRequestWindowSizeChange(firstRow, lastRow)));
    };

    // gets called by grid, when grid is destroyed or this datasource is swapped out for another one
    public destroy() {
        this.webSocket.close();
    };

    public webSocketOnMessage(event:any): void {
        const dsr: DataServerResponse = JSON.parse(event.data);
        switch (dsr.dataResponseType) {
            case EServerResponseEventType.DataSetSize:
                const dsrdss: DataServerResponseDataSetSize = JSON.parse(event.data);
                this.onRowCountChanged(dsrdss);
                break;
            case EServerResponseEventType.ColumnUpdate:
                const cu: DataServerResponseColumnUpdate = JSON.parse(event.data);
                this.onDataUpdated(cu);
                break;
            case EServerResponseEventType.DataSet:
                const rd: DataServerResponseDataSet<T> = JSON.parse(event.data);
                this.onRowData(rd);
                break;
        }
    }

    // process rowData event
    public onRowData(ds: DataServerResponseDataSet<T>) {
        const rowDataFromServer = ds.dataSet;
        this.viewportDataSourceParams.setRowData(rowDataFromServer);
    };

    // process dataUpdated event
    public onDataUpdated(cu: DataServerResponseColumnUpdate) {
        const that = this;
        const rowNode: RowNode = that.viewportDataSourceParams.getRow(cu.rowIndex);
        // if the rowNode is missing, it means the grid is not displaying that row.
        // if the data is missing, it means the rowNode is there, but that data has not
        // loaded into it yet, so to early to set delta changes.
        if (!rowNode || !rowNode.data) {
            return;
        }
        // rowNode.data[cu.columnName] = cu.value;
        // this is a trick, it gets the row to refresh
        rowNode.setDataValue(cu.columnName, cu.value);
    };

    // process rowCount event
    public onRowCountChanged(dssrdss: DataServerResponseDataSetSize) {
        this.viewportDataSourceParams.setRowCount(dssrdss.rowCount);
    };
}

export { ViewPortWebSocketDataSource };
