import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import { MatrizActivity } from "./components/MatrizActivity";
import { JhonsonActivity } from "./components/JhonsonActivity";
import { AsignacionActivity } from "./components/AsignacionActivity";

function App() {

  return (
    <Router>
      <Switch>
        <Route path='/' exact component={MatrizActivity}></Route>
        <Route path='/jhonson' exact component={JhonsonActivity}></Route>
        <Route path='/asignacion' exact component={AsignacionActivity}></Route>
      </Switch>
    </Router>
  )
}

export default App