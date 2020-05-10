import React, { Component } from 'react';
import '../App.css';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import dagre from "cytoscape-dagre";

import { BinarySearchTree } from '../models/BinarySearchTree';
import { Node } from '../models/NodeB';

cytoscape.use(dagre);

export class BinaryTreesActivity extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.BST = new BinarySearchTree();
    }

    state = {
        w: 0,
        h: 0,
        elements: [],
        numeros: [],
        inorder: [],
        postorder: [],
        preorder: [],
        root: null
    }

    componentDidMount = () => {
        this.setState({
            w: window.innerWidth,
            h: window.innerHeight / 2,
        })

        this.setUpListeners()
    }

    handleSubmit(event) {
        const nuevoNum = parseInt(event.target.number.value);
        var numeros = this.state.numeros;
        var root = this.BST.getRootNode()

        numeros.push(nuevoNum);
        this.BST.insert(nuevoNum);

        var inorder = this.BST.bigInorder(root);
        var postorder = this.BST.bigPostorder(root);
        var preorder = this.BST.bigPreorder(root);

        this.setState({
            inorder: inorder,
            postorder: postorder,
            preorder: preorder,
            numeros: numeros
        })

        //this.BST.insert(1)

        /* actualNum.push(nuevoNum)
        this.setState({
            numeros: actualNum
        }) */

        /* const nodos = this.cy.filter('node')
        if (nodos.length === 0) {
            this.cy.add({
                group: 'nodes',
                data: {
                    id: nuevoNum
                }
            })
        } else {
            for (const nodo of nodos) {
                var nd = nodo['_private']
                console.log('Nodo: ' + nd['data'].id)
                if (nuevoNum < parseInt(nd['data'].id) ) {
                    this.cy.add({
                        group: 'nodes',
                        data: {
                            id: nuevoNum
                        },
                        position: {
                            x: nd['position'].x - 50 ,
                            y: nd['position'].y + 50
                        }
                    })
                    this.cy.add({
                        group:'edges',
                        data: {
                            id: nd['data'].id+nuevoNum.toString(),
                            source: nd['data'].id,
                            target: nuevoNum.toString(),
                        }
                    })
                } else {
                    this.cy.add({
                        group: 'nodes',
                        data: {
                            id: nuevoNum
                        },
                        position: {
                            x: nd['position'].x + 50 ,
                            y: nd['position'].y + 50
                        }
                    })
                    this.cy.add({
                        group:'edges',
                        data: {
                            id: nd['data'].id+nuevoNum.toString(),
                            source: nd['data'].id,
                            target: nuevoNum.toString(),
                        }
                    })
                }
            }
        } */
        event.preventDefault();
        event.target.number.value = '';
    }

    setUpListeners = () => {
        this.cy.unbind('click')
        this.cy.unbind('tap')
        this.cy.unbind('cxttap')
    }

    atras = (url) => {
        this.props.history.push(url)
    }

    render() {
        return (
            <div className="App">
                <div className='card'>
                    <div className='card-header text-center'>
                        <strong><h2>Arboles Binarios</h2></strong>
                        <h3>Solucion</h3>
                    </div>

                    <div className='card-body'>
                        <form className='form-inline' onSubmit={this.handleSubmit} >
                            <div className='form-group mb-2'>
                                <label >Agregar numero: </label>
                                <input type="number" name="number" className='form-control' required />
                            </div>
                            <input type="submit" value="Submit" className="btn btn-outline-success mb-2" />
                        </form>

                        <CytoscapeComponent
                            elements={this.state.elements}
                            style={{ width: this.state.w, height: this.state.h }}
                            cy={(cy) => { this.cy = cy }}
                            layout={{ name: 'dagre' }}
                            stylesheet={[
                                {
                                    selector: 'node',
                                    css: {
                                        label: 'data(id)',
                                        'text-valign': 'center',
                                        'text-halign': 'center',
                                        'text-wrap': 'wrap'
                                    }
                                },

                                {
                                    selector: 'edge',
                                    style: {
                                        'curve-style': 'bezier',
                                        'target-arrow-shape': 'triangle',
                                        'label': 'data(value)',
                                        'text-wrap': 'wrap'
                                    }
                                }
                            ]}
                        />
                    </div>

                    <div className='my-2'>
                        <p className='h5'>
                            Inorder:
                                {
                                this.state.inorder.map((num, index) => (
                                    <b> {num}   </b>
                                ))
                            }
                        </p>
                    </div>
                    <div className='my-2'>
                        <p className='h5'>
                            Postorder:
                                {
                                this.state.postorder.map((num, index) => (
                                    <b> {num}   </b>
                                ))
                            }
                        </p>
                    </div>
                    <div className='my-2'>
                        <p className='h5'>
                            Preorder:
                                {
                                this.state.preorder.map((num, index) => (
                                    <b> {num}   </b>
                                ))
                            }
                        </p>
                    </div>

                </div>
                <div className='card-footer'>
                    <button className='btn btn-outline-primary' onClick={() => this.atras('/')}>
                        Atras
                    </button>
                </div>
            </div>
        );
    }
}