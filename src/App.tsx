import * as React from 'react';
import './App.css';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AgGridReact } from 'ag-grid-react';
import logo from './logo.svg';

import { MockServer } from './MockServer';
import { ViewPortDataSource } from './ViewPortDataSource';

class App extends React.Component<any,any> {
  constructor(props: any) {
    super(props)
    this.state = {
      columnDefs: [
        {
          cellRenderer: "rowIdRenderer",
          headerName: "#",
          width: 50
        },
        {
          field: "code",
          headerName: "Code",
          width: 70
        },
        {
          field: "name",
          headerName: "Name",
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
          width: 100
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
        }
      },
      defaultColDef: { resizable: true },
      getRowNodeId: (data:any) =>  {
        return data.code;
      },
      rowModelType: "viewport",
      rowSelection: "multiple",
    };
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
      const mockServer: MockServer = new MockServer();
      mockServer.init(data);
      const viewportDatasource: ViewPortDataSource = new ViewPortDataSource(mockServer);
      params.api.setViewportDatasource(viewportDatasource);
      setTimeout(() =>  {
        params.api.sizeColumnsToFit();
      }, 100);
    };

    httpRequest.open("GET", "https://rawgit.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/stocks.json");
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
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>

        <div 
        className="ag-theme-balham"
        style={{ 
        height: '500px', 
        width: '600px' }} 
      >
        <AgGridReact
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            debug={true}
            rowSelection={this.state.rowSelection}
            rowModelType={this.state.rowModelType}
            getRowNodeId={this.state.getRowNodeId}
            components={this.state.components}
            onGridReady={this.onGridReady}
          />
      </div>
      </div>
    );
  }
}

export default App;
