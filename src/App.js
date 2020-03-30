import React, { Component } from 'react';
import './App.css';
import cytoscape from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
import edgehandles from 'cytoscape-edgehandles';

edgehandles(cytoscape);

export default class App extends Component {

  state = {
    w: 0,
    h: 0,
    elements: [],
    show: false,
    showMatrix: false,
    name: '',
    nodes: [],
    table: [],
    row: []
  }

  componentDidMount = () => {
    const elementos = localStorage.getItem('allInfo') ? JSON.parse(localStorage.getItem('allInfo')) : []
    this.setState({
      w: window.innerWidth,
      h: window.innerHeight / 2,
      elements: elementos
    })

    this.setUpListeners()

    this.cy.edgehandles({
      toogleOffOnLeave: true,
      handleNodes: 'node',
      handleSize: 10,
      edgeType: function () {
        return 'flat'
      },
      loopAllowed: function () {
        return true;
      }
    });
  }

  setUpListeners = () => {
    //Creacion de nodos si no se toca a otro nodo
    this.cy.on('tap', (event) => {

      if (event.target === this.cy) {
        this.cy.add({
          group: 'nodes',
          renderedPosition: {
            x: event.renderedPosition.x,
            y: event.renderedPosition.y
          },
          data: {
            name: ''
          }
        });
      }
      localStorage.removeItem('allInfo')
      localStorage.setItem('allInfo', JSON.stringify(this.cy.json(true)['elements']));
    });

    this.cy.on('cxttap', (event) => {
      if(event.target !== this.cy) {
        this.cy.remove(event.target)
        localStorage.removeItem('allInfo')
        localStorage.setItem('allInfo', JSON.stringify(this.cy.json(true)['elements']));
      }
    })

    // Asignacion de Valores a Edges
    this.cy.on('tap', 'edge', (event) => {
      this.showModal();
      event.target.data('value', this.state.name)
      localStorage.removeItem('allInfo')
      localStorage.setItem('allInfo', JSON.stringify(this.cy.json(true)['elements']));
    });

    this.cy.on('tap', 'node', (event) => {
      //Este cambia el valor
      /* event.target.data('value', 10) */
      this.showModal();
      event.target.data('name', this.state.name)
      localStorage.removeItem('allInfo')
      localStorage.setItem('allInfo', JSON.stringify(this.cy.json(true)['elements']));
    });
  }

  showModal = () => {
    this.setState({ show: true });
  }

  hideModal = () => {
    this.setState({ show: false });
  }
  onChange = (e) => {
    this.setState({ name: e.target.value })
  }

  showMatrix = () => {

    this.setState({}, () => {
      const elems = JSON.parse(localStorage.getItem('allInfo'));
      const nodes = [];
      const edges = [];
      const matrix = [];
      const row = [];
      var aux = [];
      var nodosLenght = 0;
      var matrixLenght = 0;
      for (const i of elems) {
        //Nodos
        if ((!('name' in i.data) == 0) && (i.group === 'nodes')) {
          nodes.push(i['data'])
        }
        if (i.group === 'edges') {
          edges.push(i['data'])
        }
      }
      for (const i of nodes) {
        aux = [];
        for (const j of nodes) {
          for (const k of edges) {
            if ((i.id === k.source) && (j.id === k.target)) {
              matrix.push(k.value)
              aux.push(k.value)
              matrixLenght = matrixLenght + 1;
            }
          }
          nodosLenght++;
          if (nodosLenght != matrix.length) {
            aux.push('0')
            matrix.push('0')
          }
        }
        row.push(aux)
      }
      var table = []

      for (let i = 0; i < nodes.length; i++) {
        table.push(
          <tr>
            <th>
              {
                nodes[i].name
              }
            </th>
            {
              row[i].map(elem => <td> {elem} </td>)
            }
          </tr>
        )

      }
      this.setState({ nodes: nodes, table: table, row: row, showMatrix: true });
    });
  }

  hideMatrix = () => {
    this.setState({ showMatrix: false });
  }

  solucion = () => {
    
  }


  render() {
    return (
      <div className="App">
        <div className='card'>
          <div className='card-header text-center'>
            <strong><h2>ALGORITMOS</h2></strong>
            <h3>Jhonson</h3>
        </div>

          <div className='card-body'>
            <CytoscapeComponent
              elements={this.state.elements}
              style={{ width: this.state.w, height: this.state.h }}
              cy={(cy) => { this.cy = cy }}
              stylesheet={[
                {
                  selector: 'node',
                  css: {
                    label: 'data(name)',
                    'text-valign': 'center',
                    'text-halign': 'center',
                  }
                },

                {
                  selector: 'edge',
                  style: {
                    'curve-style': 'bezier',
                    'target-arrow-shape': 'triangle',
                    'label': 'data(value)'
                  }
                },


                {
                  selector: '.eh-handle',
                  style: {
                    'background-color': 'red',
                    'width': 12,
                    'height': 12,
                    'shape': 'ellipse',
                    'overlay-opacity': 0,
                    'border-width': 12, // makes the handle easier to hit
                    'border-opacity': 0
                  },
                },

                {
                  selector: '.eh-source',
                  style: {
                    'border-width': 2,
                    'border-color': 'red'
                  }
                },

                {
                  selector: '.eh-target',
                  style: {
                    'border-width': 2,
                    'border-color': 'red'
                  }
                },

                {
                  selector: '.eh-preview, .eh-ghost-edge',
                  style: {
                    'background-color': 'red',
                    'line-color': 'red',
                    'target-arrow-color': 'red',
                    'source-arrow-color': 'red'
                  }
                },

                {
                  selector: '.eh-ghost-edge.eh-preview-active',
                  style: {
                    'opacity': 0
                  }
                }
              ]}
            />


            <Modal show={this.state.show} handleClose={this.hideModal}>
              Ingrese el valor: <br /><br />
              <input type='text' onChange={this.onChange} ></input><br /><br />
            </Modal>


            <button className='btn btn-block btn-outline btn-primary my-3' type='button' onClick={this.showMatrix}>Ver Matriz</button>

            <Matriz show={this.state.showMatrix} handleClose={this.hideMatrix}>
              <table className='table table-bordered table-responsive'>
                <thead>
                  <th></th>
                  {this.state.nodes.map(elem => <th> {elem.name} </th>)}
                </thead>
                <tbody>
                  {this.state.table}
                </tbody>
              </table>
            </Matriz>

            <button className='btn btn-block btn-outline btn-primary my-3' type='button' onClick={this.solucion}>Solución</button>

          </div>
        </div>
      </div>
    );
  }
}

const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <button onClick={handleClose} className='btn btn-block btn-success'>Guardar</button>
      </section>
    </div>
  );
};

const Matriz = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <button className='btn btn-block btn-primary' onClick={handleClose}>Cerrar</button>
      </section>
    </div>
  );
};