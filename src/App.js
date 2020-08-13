import React from 'react';
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import Footer from './Components/Footer/Footer';
import NavBar from "./Components/NavBar/NavBar";
import FileConverter from './Pages/FileConverter/FileConverter';
import Home from './Pages/Home/Home';
import SupportGenerator from './Pages/SupportGenerator/SupportGenerator';

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/supportGeneration" component={SupportGenerator}/>
          <Route exact path="/fileConverter" component={FileConverter}/>
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
