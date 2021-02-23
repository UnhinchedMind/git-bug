import React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import Themer from './components/Themer';
import Layout from './layout';
import BugPage from './pages/bug';
import ListPage from './pages/list';

export default function App() {
  return (
    <Themer>
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route path="/" exact component={ListPage} />
            <Route path="/bug/:id" exact component={BugPage} />
          </Switch>
        </Layout>
      </BrowserRouter>
    </Themer>
  );
}
