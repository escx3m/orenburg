import React from 'react';
import { Route } from 'react-router-dom';
import SearchPage from './components/pages/SearchPage';
import PersonInfoPage from './components/pages/PersonInfoPage';

function App() {
  return (
    <div className="ui container">
      <Route path="/" exact component={SearchPage} />
      <Route path="/personInfo" component={PersonInfoPage} />
    </div>
  );
}

export default App;
