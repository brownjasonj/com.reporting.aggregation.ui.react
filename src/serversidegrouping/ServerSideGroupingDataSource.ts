import { GridApi, IServerSideDatasource, IServerSideGetRowsParams, RowNode } from 'ag-grid-community';
import { DataServerResponse } from 'src/viewport/DataServerResponse';
import { DataServerResponseDataSetBlock } from 'src/viewport/DataServerResponseDataSetBlock';
import { EServerResponseEventType } from 'src/viewport/EServerResponseEventType';
import { DataServerResponseColumnUpdate } from 'src/viewport/DataServerResponseColumnUpdate';

class ServerSideGroupingDataSource<T> implements IServerSideDatasource {
    private gridApi: GridApi;
    private webSocket: WebSocket;
    private params: IServerSideGetRowsParams;

    constructor(gridapi: GridApi, url: string) {
        this.gridApi = gridapi;
        this.webSocket = new WebSocket(url);
        this.webSocket.onmessage = (ev:Event) => {this.webSocketOnMessage(ev)};
        // this.webSocket.onopen = (ev:Event):any => {this.webSocket.send(JSON.stringify(new DataServerRequestAllData()))};
    }


    public getRows(params: IServerSideGetRowsParams): void {
        this.webSocket.send(JSON.stringify(params.request));
        this.params = params;
    }

    public updateRowByPath(path: string[]) {
        // const rowModel: IRowModel = this.gridApi.getModel();
        this.gridApi.forEachNode((rowNode: RowNode, index: number) => {
            console.log(rowNode);
        });
    }


    public webSocketOnMessage(event:any): void {
        const dsr: DataServerResponse = JSON.parse(event.data);
        switch (dsr.dataResponseType) {
            case EServerResponseEventType.DataSetSize:
                // const dsrdss: DataServerResponseDataSetSize = JSON.parse(event.data);
                // this.onRowCountChanged(dsrdss);
                break;
            case EServerResponseEventType.ColumnUpdate:
                // const cu: DataServerResponseColumnUpdate = JSON.parse(event.data);
                // this.onDataUpdated(cu);
                // this.updateRowByPath();
                break;
            case EServerResponseEventType.DataSet:
                // const rd: DataServerResponseDataSet<T> = JSON.parse(event.data);
                // this.onRowData(rd);
                break;
            case EServerResponseEventType.DataSetBlock:
                const dsrdsb: DataServerResponseDataSetBlock<T> = JSON.parse(event.data);
                this.params.successCallback(dsrdsb.dataSet, dsrdsb.lastRow);
                break;
        }
    }
}

export { ServerSideGroupingDataSource }