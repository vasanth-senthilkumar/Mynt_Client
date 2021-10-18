import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import './App.css';
import { Provider } from 'react-redux';
import store from './Components/Redux/Redux';
ReactDOM.render(
     <Provider store = {store}>
     <App />
     </Provider>
  ,
  document.getElementById('root')
);

