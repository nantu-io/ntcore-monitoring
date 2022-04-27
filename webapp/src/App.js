import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';

const loading = () => <div></div>;

const Workspaces = React.lazy(() => import('./views/workspaces'));
const Monitoring = React.lazy(() => import('./views/monitoring'));
const Applications = React.lazy(() => import('./views/applications'));
const ModelMonitor = React.lazy(() => import('./views/monitoring/modelMonitor'));

class App extends Component {

  render() {
    return (
      <BrowserRouter>
          <React.Suspense fallback={loading()}>
            <Switch>
              <Route exact path="/dsp/console/workspaces" name="Workspaces" render={props => <Workspaces {...props}/>} />
              <Route exact path="/dsp/console/deployments" name='Deployments' render={props => <Applications {...props} />} />
              <Route exact path="/dsp/console/monitoring" name='Monitoring' render={props => <Monitoring {...props} />} />
              <Route exact path="/dsp/console/monitoring/:id" name='ModelMonitor' render={props => <ModelMonitor {...props} />} />
            </Switch>
          </React.Suspense>
      </BrowserRouter>
    );
  }
}

export default App;
