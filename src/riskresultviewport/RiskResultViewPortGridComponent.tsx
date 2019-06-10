import { AgGridReact } from 'ag-grid-react/lib/agGridReact';
import * as React from 'react';
import { Component } from 'react';
import { DataServerRequestAllData } from 'src/model/DataServerRequestAllDate';
import { DataServerRequestConnectionParameters } from 'src/model/DataServerRequestConnectionParamaters';
import { DataServerRequestWindowSizeChange } from 'src/model/DataServerRequestWindowSizeChange';
import { DataServerResponse } from 'src/model/DataServerResponse';
import { DataServerResponseColumnUpdate } from 'src/model/DataServerResponseColumnUpdate';
import { DataServerResponseDataSet } from 'src/model/DataServerResponseDataSet';
import { DataServerResponseDataSetSize } from 'src/model/DataServerResponseDataSetSize';
import { DataServerResponseRowUpdate } from 'src/model/DataServerResponseRowUpdate';
import { EServerResponseEventType } from 'src/model/EServerResponseEventType';
import { RiskResult } from 'src/model/RiskResult';
import { StockSymbol } from 'src/model/StockSymbol';
import { SimpleCellRenderer } from 'src/renderers/SimpleCellRenderer';
import { RiskResultViewPortWebSocketDataSource } from './RiskResultViewPortWebSocketDataSource';

class RiskResultViewPortGridComponent extends Component<any,any> {
    private gridOptions: any = {
        columnDefs: [
          {
            cellRenderer: "agGroupCellRenderer",
            cellRendererParams: {
              checkbox: false,
              innerRenderer: "simpleCellRenderer",
              suppressCount: false,
              suppressDoubleClickExpand: true
            },
            field: "name",
            headerName: "Group Renderer C",
            showRowGroup: true
          },
          {
            cellRenderer: "rowIdRenderer",
            headerName: "#",
            width: 50
          },
    
          {
            field: "code",
            headerName: "Code",
            rowGroup: true,
            width: 70
          },
          {
            field: "name",
            headerName: "Name",
            rowGroup: true,
            width: 300
          },
          {
            cellClass: "cell-number",
            cellRenderer: "agAnimateShowChangeCellRenderer",
            field: "bid",
            headerName: "Bid",
            valueFormatter: this.numberFormatter,
            width: 100
          },
          {
            cellClass: "cell-number",
            cellRenderer: "agAnimateShowChangeCellRenderer",
            field: "mid",
            headerName: "Mid",
            valueFormatter: this.numberFormatter,
            width: 100,
          },
          {
            cellClass: "cell-number",
            cellRenderer: "agAnimateShowChangeCellRenderer",
            field: "ask",
            headerName: "Ask",
            valueFormatter: this.numberFormatter,
            width: 100
          },
          {
            cellClass: "cell-number",
            cellRenderer: "agAnimateSlideCellRenderer",
            field: "volume",
            headerName: "Volume",
            width: 80
          }
        ],
        components: {
          rowIdRenderer: (params:any) => {
            return "" + params.rowIndex;
          },
          simpleCellRenderer: SimpleCellRenderer
        },
        defaultColDef: { resizable: true },
        getRowNodeId: (data:any) =>  {
          return data.code;
        },
        groupDefaultExpanded: 0,
        rowModelType: "viewport",
        rowSelection: "multiple",
      };
    
      constructor(props: any) {
        super(props)
      }
    
      public numberFormatter(params: any) {
        if (typeof params.value === "number") {
          return params.value.toFixed(2);
        } else {
          return params.value;
        }
      }
    
      public onGridReady(params: any) {
        let webSocket: WebSocket;
        webSocket = new WebSocket("ws://localhost:8082/riskresults/viewport");

        webSocket.onmessage = (ev:any) => {
          const dsr: DataServerResponse = JSON.parse(ev.data);
        switch (dsr.dataResponseType) {
          case EServerResponseEventType.DataSetSize:
              const dsrdss: DataServerResponseDataSetSize = JSON.parse(ev.data);
              console.info(JSON.stringify(dsrdss));
              break;
          case EServerResponseEventType.ColumnUpdate:
              const cu: DataServerResponseColumnUpdate = JSON.parse(ev.data);
              console.info(JSON.stringify(cu));
              break;
          case EServerResponseEventType.DataSet:
              const rd: DataServerResponseDataSet<RiskResult<any>> = JSON.parse(ev.data);
              console.info(JSON.stringify(rd));
              break;
          case EServerResponseEventType.RowUpdate:
              const updateRow: DataServerResponseRowUpdate<RiskResult<any>> = JSON.parse(ev.data);
              console.info(JSON.stringify(updateRow));
              break;
        }
        };
        webSocket.onopen = (ev:Event):any => {
            webSocket.send(JSON.stringify(new DataServerRequestConnectionParameters("fxoptiondesk", "a0699e05-5df6-4d92-929b-90e20beaaffd")));
            webSocket.send(JSON.stringify(new DataServerRequestAllData()))
            webSocket.send(JSON.stringify(new DataServerRequestWindowSizeChange(1, 10)));
        };

        const viewPortWebSocketDataSource: RiskResultViewPortWebSocketDataSource<StockSymbol> = new RiskResultViewPortWebSocketDataSource("ws://localhost:8082/riskresults/viewport","fxoptiondesk", "875a05e4-5bed-44ca-8c9b-4fd11b250b1f");
        params.api.setViewportDatasource(viewPortWebSocketDataSource);
        setTimeout(() =>  {
          params.api.sizeColumnsToFit();
        });
      };

      public webSocketOnMessage(event:any): void {
        const dsr: DataServerResponse = JSON.parse(event.data);
        switch (dsr.dataResponseType) {
          case EServerResponseEventType.DataSetSize:
              const dsrdss: DataServerResponseDataSetSize = JSON.parse(event.data);
              console.info(JSON.stringify(dsrdss));
              break;
          case EServerResponseEventType.ColumnUpdate:
              const cu: DataServerResponseColumnUpdate = JSON.parse(event.data);
              console.info(JSON.stringify(cu));
              break;
          case EServerResponseEventType.DataSet:
              console.info("Got a dataset response");
              break;
        }
      }

      public render() {
        return (
          <div className="App">
              <div 
              className="ag-theme-fresh"
              style={{ 
              height: '500px',
              width: '95%',
              }} 
            >
              <AgGridReact
                  columnDefs={this.gridOptions.columnDefs}
                  defaultColDef={this.gridOptions.defaultColDef}
                  debug={true}
                  rowSelection={this.gridOptions.rowSelection}
                  rowModelType={this.gridOptions.rowModelType}
                  getRowNodeId={this.gridOptions.getRowNodeId}
                  components={this.gridOptions.components}
                  onGridReady={this.onGridReady}
                />
            </div>
          </div>
        );
      }
}

export { RiskResultViewPortGridComponent };

