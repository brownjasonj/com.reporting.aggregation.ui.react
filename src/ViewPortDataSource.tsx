import { IViewportDatasource, IViewportDatasourceParams } from 'ag-grid-community';

import { MockServer } from './MockServer';


// client code (ie your code) will call this constructor, pass in whatever you need for the
// viewport to do its job
class ViewPortDataSource implements IViewportDatasource {
    private mockServer: MockServer;
    private connectionId: any;
    private params: IViewportDatasourceParams;

    constructor(mockServer: MockServer) {
        this.mockServer = mockServer;
        this.connectionId = this.mockServer.connect(this.eventListener.bind(this));
    }

    // gets called by the grid, tells us what rows the grid is displaying, so time for
    // us to tell the server to give us the rows for that displayed range
    public setViewportRange(firstRow: number, lastRow: number) {
        // console.log('setViewportRange: ' + firstRow + ' to ' + lastRow);
        this.mockServer.setViewportRange(this.connectionId, firstRow, lastRow);
    };

    // gets called by the grid, provides us with the callbacks we need
    public init(params: IViewportDatasourceParams) {
        this.params = params;
    };

    // gets called by grid, when grid is destroyed or this datasource is swapped out for another one
    public destroy() {
        this.mockServer.disconnect(this.connectionId);
    };

    // manages events back from the server
    public eventListener(event: any) {
        switch (event.eventType) {
            case 'rowCountChanged':
                this.onRowCountChanged(event);
                break;
            case 'rowData':
                this.onRowData(event);
                break;
            case 'dataUpdated':
                this.onDataUpdated(event);
                break;
        }
    };

    // process rowData event
    public onRowData(event: any) {
        const rowDataFromServer = event.rowDataMap;
        this.params.setRowData(rowDataFromServer);
    };

    // process dataUpdated event
    public onDataUpdated(event: any) {
        const that = this;
        event.changes.forEach((change:any) => {
            const rowNode = that.params.getRow(change.rowIndex);
            // if the rowNode is missing, it means the grid is not displaying that row.
            // if the data is missing, it means the rowNode is there, but that data has not
            // loaded into it yet, so to early to set delta changes.
            if (!rowNode || !rowNode.data) {
                return;
            }
            // rowNode.data[change.columnId] = change.newValue;
            // this is a trick, it gets the row to refresh
            rowNode.setDataValue(change.columnId, change.newValue);
        });
    };

    // process rowCount event
    public onRowCountChanged(event: any) {
        const rowCountFromServer = event.rowCount;
        // this will get the grid to make set the height of the row container, so we can scroll vertically properly
        this.params.setRowCount(rowCountFromServer);
    };

}

export {ViewPortDataSource}