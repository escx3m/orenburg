import React from 'react';
import { Route } from 'react-router-dom';
import { Header, Divider } from 'semantic-ui-react';
import SearchPage from './containers/SearchPage';
import PersonInfoPage from './containers/PersonInfoPage';

function App() {
  return (
    <div className="ui container" style={{ marginTop: '1em' }}>
      <Header as="h1" textAlign="center">Альфа-Тур</Header>
      <Divider />
      <Route path="/" exact component={SearchPage} />
      <Route path="/personInfo" component={PersonInfoPage} />
    </div>
  );
}

export default App;
