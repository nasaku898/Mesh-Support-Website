import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Testa from "./Components/Test/Testa"
import NavBar from "./Components/NavBar/NavBar"
import Home from './Pages/Home/Home';
import Footer from './Components/Footer/Footer';
import STLCanvas from './Components/STLCanvas/STLCanvas';

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/test" component={Testa} />
          <Route exact path="/supportGeneration" component={STLCanvas}/>
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
