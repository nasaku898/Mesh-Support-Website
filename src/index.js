import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from "react-router-dom";
import theme from './Assets/Style/theme'
import { ThemeProvider } from '@material-ui/core/styles'
import { Paper, CssBaseline } from '@material-ui/core';
ReactDOM.render(

  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Paper style={{ minHeight: "100vh", background: "rgb(33,33,33)" }}>
          <App />
        </Paper>
      </CssBaseline>

    </ThemeProvider>
  </BrowserRouter>
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
