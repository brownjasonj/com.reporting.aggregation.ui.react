import { IViewportDatasource, IViewportDatasourceParams, RowNode } from 'ag-grid-community';
import { DataServerRequestAllData } from 'src/model/DataServerRequestAllDate';
import { DataServerRequestConnectionParameters } from 'src/model/DataServerRequestConnectionParamaters';
import { DataServerResponseRowUpdate } from 'src/model/DataServerResponseRowUpdate';
import { RiskResult } from 'src/model/RiskResult';
import { DataServerRequestWindowSizeChange } from '../model/DataServerRequestWindowSizeChange';
import { DataServerResponse } from '../model/DataServerResponse';
import { DataServerResponseColumnUpdate } from '../model/DataServerResponseColumnUpdate';
import { DataServerResponseDataSet } from '../model/DataServerResponseDataSet';
import { DataServerResponseDataSetSize } from '../model/DataServerResponseDataSetSize';
import { EServerResponseEventType } from '../model/EServerResponseEventType';


class RiskResultViewPortWebSocketDataSource<T> implements IViewportDatasource {
    private viewPortServerWebSocketURL: string;
    private pricingGroupName: string;
    private marketIdName: string;
    private webSocket: WebSocket;
    private viewportDataSourceParams: IViewportDatasourceParams;
    
    constructor(viewPortServerWebSocketURL: string, pricingGroupName: string, marketIdName: string) {
        this.viewPortServerWebSocketURL = viewPortServerWebSocketURL;
        this.pricingGroupName = pricingGroupName;
        this.marketIdName = marketIdName;
    }

    // gets called by the grid, provides us with the callbacks we need
    public init(params: IViewportDatasourceParams) {
        this.viewportDataSourceParams = params;
        this.webSocket = new WebSocket(this.viewPortServerWebSocketURL);

        this.webSocket.onmessage = (ev:Event) => {this.webSocketOnMessage(ev)};
        this.webSocket.onopen = (ev:Event):any => {
            this.webSocket.send(JSON.stringify(new DataServerRequestConnectionParameters(this.pricingGroupName, this.marketIdName)));
            this.webSocket.send(JSON.stringify(new DataServerRequestAllData()))
        };
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
            case EServerResponseEventType.RowUpdate:
                const updateRow: DataServerResponseRowUpdate<RiskResult<any>> = JSON.parse(event.data);
                this.onRowUpdate(updateRow);
                break;
        }
    }

    public onRowUpdate(rowUpdate: DataServerResponseRowUpdate<RiskResult<any>>): void{
        console.info(rowUpdate);
    }
    
    // process rowData event
    public onRowData(ds: DataServerResponseDataSet<T>): void {
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

export { RiskResultViewPortWebSocketDataSource };

