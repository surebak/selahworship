import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

if (process.env.NODE_ENV === 'production') {
  console.log('console.log disabled in production mode: ', process.env.NODE_ENV);
  console.log = () => null;
}

const Root = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path={`/`}>
        <App />
      </Route>
    </Switch>
  </BrowserRouter>
);

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
