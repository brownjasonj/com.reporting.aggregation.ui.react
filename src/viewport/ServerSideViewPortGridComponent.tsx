import { AgGridReact } from 'ag-grid-react/lib/agGridReact';
import { Component } from 'react';
import * as React from 'react';
import { StockSymbol } from 'src/model/StockSymbol';
import { SimpleCellRenderer } from 'src/renderers/SimpleCellRenderer';
import { ViewPortWebSocketDataSource } from './ViewPortWebSocketDataSource';

class ServerSideViewPortPortGridComponent extends Component<any,any> {
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
        const httpRequest = new XMLHttpRequest();
        const updateData = (data: any) => {
            const viewPortWebSocketDataSource: ViewPortWebSocketDataSource<StockSymbol> = new ViewPortWebSocketDataSource();
            params.api.setViewportDatasource(viewPortWebSocketDataSource);
          setTimeout(() =>  {
            params.api.sizeColumnsToFit();
          }, 100);
        };
    
        httpRequest.open("GET", "http://localhost:8080/stocksymbols", true);
        httpRequest.send();
        httpRequest.onreadystatechange = () => {
          if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            updateData(JSON.parse(httpRequest.responseText));
          }
        };
      };

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

export { ServerSideViewPortPortGridComponent }