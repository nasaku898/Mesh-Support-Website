import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavBar from "./Components/NavBar/NavBar"
import Home from './Pages/Home/Home';
import Footer from './Components/Footer/Footer';
import SupportGenerator from './Pages/SupportGenerator/SupportGenerator';
import FileConverter from './Pages/FileConverter/FileConverter';

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
