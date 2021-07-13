import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

window.onerror = function(errorMsg, url, lineNumber, columnNumber, errorObj) {
  var errorStack = errorObj ? errorObj.stack : null;
  // siftAndMakeUpMessage("on_error", errorMsg, url, lineNumber, columnNumber, errorStack);
  // console.log("on_error", errorMsg, url, lineNumber, columnNumber, errorStack);
  console.log("on_error",  errorStack);
};

adddlert("Welcome");
// try {
//   adddlert("Welcome");
// }
// catch(err) {
//   document.getElementById("demo").innerHTML =
//   err.name + "<br>" + err.message;
// }

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
