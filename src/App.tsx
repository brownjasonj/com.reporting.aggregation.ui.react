import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-blue.css';
import 'ag-grid-community/dist/styles/ag-theme-fresh.css';
import { LicenseManager } from 'ag-grid-enterprise';
import * as React from 'react';
import './App.css';
import { ServerSideGroupingGridComponent } from './serversidegrouping/ServerSideGroupingGridComponent';


console.log(process.env);

LicenseManager.setLicenseKey(`${process.env.REACT_APP_AG_GRID_LICENSE}`);


class App extends React.Component<any,any> {
  

  public render() {
    return (
      // tslint:disable-next-line:jsx-self-close
      <ServerSideGroupingGridComponent>
        
      </ServerSideGroupingGridComponent>
    );
  }
}

export default App;
