import * as React from 'react';
import './App.css';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-blue.css';
import 'ag-grid-community/dist/styles/ag-theme-fresh.css';

import { LicenseManager } from 'ag-grid-enterprise';

LicenseManager.setLicenseKey("Evaluation_License-_Not_For_Production_Valid_Until_25_May_2019__MTU1ODczODgwMDAwMA==156057ec2a5212d3fc17b2c425718067");

import { ServerSideGroupingGridComponent } from './serversidegrouping/ServerSideGroupingGridComponent';

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
