import { AgGridReact } from 'ag-grid-react/lib/agGridReact';
import * as React from 'react';
import { StockSymbol } from 'src/model/StockSymbol';
import { ServerSideGroupingDataSource } from './ServerSideGroupingDataSource';

import { LicenseManager } from 'ag-grid-enterprise';

LicenseManager.setLicenseKey(`${process.env.REACT_APP_AG_GRID_LICENSE}`);

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

class ServerSideGroupingGridComponent extends React.Component<any,any> {
    private gridOptions: any = {
        autoGroupColumnDef: {
          cellRendererParams: { checkbox: true },
          editable: true,
          field: "exchangesectorgroup",
          headerName: "Exchange/Sector",
          width: 250
        },
        cacheBlockSize: 10,
        columnDefs: [
          {
            field: "exchange",
            headerName: "Exchange",
            hide: true,
            rowGroup: true,
            width: 100
          },
          {
            field: "sector",
            headerName: "Sector",
            hide: true,
            rowGroup: true,
            width: 100
          },
          {
            field: "code",
            headerName: "Code",
            width: 100
          },
          {
            field: "name",
            headerName: "Name",
            width: 100
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
            width: 120
          }
        ],
        defaultColDef: {
          checkboxSelection: (params:any) => {
            const isGrouping = params.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
          },
          resizable: true
        },
        getChildCount: (data:any) => {
          return Math.round(Math.random() * 100 + 1);
        },
        getRowNodeId: (data:any) =>  {
          return data.code;
        },
        groupDefaultExpanded: -1,
        maxBlocksInCache: 2,
        rowGroupPanelShow: "always",
        rowModelType: "serverSide",
        rowSelection: "multiple",
        sideBar: {
          defaultToolPanel: "columns",
          toolPanels: [
            {
              iconKey: "columns",
              id: "columns",
              labelDefault: "Columns",
              labelKey: "columns",
              toolPanel: "agColumnsToolPanel",
              toolPanelParams: {
                suppressPivotMode: true,
                suppressPivots: true
              }
            }
          ]
        }
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
        const groupByServerName: string = `${process.env.REACT_APP_GROUPBYSERVER_NAME}`;
        const groupByServerPort: string = `${process.env.REACT_APP_GROUPBYSERVER_PORT}`;
        const groupByServerAddress: string = "ws://" + groupByServerName + ":"+ groupByServerPort + "/stockticker/groupby";
        const httpDataService = "http://" + groupByServerName + ":"+ groupByServerPort + "/stocksymbols";
    

        const httpRequest = new XMLHttpRequest();
        httpRequest.open("GET", httpDataService, true);
        httpRequest.send();
        httpRequest.onreadystatechange = () => {
          if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            console.log(JSON.parse(httpRequest.responseText))
          }
        };
        const serverSideGroupingDataSource: ServerSideGroupingDataSource<StockSymbol> = new ServerSideGroupingDataSource(params.api, groupByServerAddress);
        params.api.setServerSideDatasource(serverSideGroupingDataSource);
      };
    
      public render() {
        return (
          <div className="App">
              <div 
              className="ag-theme-balham"
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
                  sideBar={this.gridOptions.sideBar}
                  components={this.gridOptions.components}
                  onGridReady={this.onGridReady}
                  purgeClosedRowNodes={true}
                />
            </div>
          </div>
        );
      }
}

export { ServerSideGroupingGridComponent };
