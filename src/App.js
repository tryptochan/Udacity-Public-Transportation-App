import React, {Component} from 'react';
import {AppBar} from 'react-toolbox';
import {Grid, Row, Col} from 'react-flexbox-grid/lib/index';
import Schedule from './Schedule';
import './App.css';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';

class App extends Component {
  constructor() {
    super();
    if ('serviceWorker' in navigator) {
      runtime.register();
    }
  }

  render() {
    return (
      <div>
        <AppBar title='WMATA Blue Line'></AppBar>
        <Grid>
        <Row style={{marginTop: 24}}>
          <Col xs={12} sm={8} md={8} lg={8}>
            <img src='https://upload.wikimedia.org/wikipedia/commons/3/37/WMATA_system_map.svg'
              style={{maxWidth: '100%'}} alt='WMATA-map'/>
          </Col>
          <Col xs={12} sm={4} md={4} lg={4}>
          <Schedule />
          </Col>
        </Row>
        </Grid>

      </div>
    );
  }
}

export default App;
