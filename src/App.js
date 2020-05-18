import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { MatrizActivity } from "./components/MatrizActivity";
import { JhonsonActivity } from "./components/JhonsonActivity";
import { AsignacionActivity } from "./components/AsignacionActivity";
import { NorthWestActivity } from "./components/NorthWestActivity";
import { BinaryTreesActivity } from "./components/BinaryTreesActivity";
import { CompeteActivity } from "./components/CompeteActivity";

function App() {

  return (
    <Router>
      <Switch>
        <Route path='/' exact component={MatrizActivity}></Route>
        <Route path='/jhonson' exact component={JhonsonActivity}></Route>
        <Route path='/asignacion' exact component={AsignacionActivity}></Route>
        <Route path='/noroeste' exact component={NorthWestActivity}></Route>
        <Route path='/binaryTrees' exact component={BinaryTreesActivity}></Route>
        <Route path='/compete' exact component={CompeteActivity}></Route>
      </Switch>
    </Router>
  )
}

export default App