import React, { Component } from 'react';
import '../App.css';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import dagre from "cytoscape-dagre";

import { BinarySearchTree } from '../models/BinarySearchTree';
import { forEach } from 'p-iteration';

//cytoscape.use(dagre);

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

        event.preventDefault();
        event.target.number.value = '';
    }

    setUpListeners = () => {
        this.cy.unbind('click')
        this.cy.unbind('tap')
        this.cy.on('cxttap', (event) => {
            var root = this.BST.getRootNode();
            if (event.target !== this.cy) {
                var aBorrar = parseInt(event.target[0]['_private']['data'].id)
                this.cy.remove(event.target)
                var numerosOld = this.state.numeros;
                var numerosNew = [];
                for (let i = 0; i < numerosOld.length; i++) {
                    const element = numerosOld[i];
                    if (element !== aBorrar) {
                        numerosNew.push(element)
                    }
                }

                this.BST.removeNode(root, aBorrar)
                var inorder = this.BST.bigInorder(root);
                var postorder = this.BST.bigPostorder(root);
                var preorder = this.BST.bigPreorder(root);

                this.setState({
                    inorder: inorder,
                    postorder: postorder,
                    preorder: preorder,
                    numeros: numerosNew
                })
                this.graficar();
            }
        })
    }

    atras = (url) => {
        this.props.history.push(url)
    }

    graficar = () => {
        this.cy.elements().remove();
        var root = this.BST.getRootNode()

        var numeros = this.state.numeros;
        let unique = [...new Set(numeros)];
        console.log(numeros)
        var prueba = [];

        for (let i = 0; i < unique.length; i++) {
            const elem = unique[i];
            var anterior = Math.min();
            for (let j = 0; j < i; j++) {
                let node = this.BST.search(root, unique[j])
                if (node.right !== null) {
                    if (elem === node.right.data)
                        anterior = node.data
                }
                if (node.left !== null) {
                    if (elem === node.left.data)
                        anterior = node.data
                }
            }
            if (anterior === Math.min()) {
                prueba.push({
                    id: elem,
                    anterior: null,
                    x: 0,
                    y: 0
                })
            } else {
                prueba.push({
                    id: elem,
                    anterior: anterior,
                    x: 0,
                    y: 0
                })
            }
        }
        console.log(prueba)
        var final = [];
        for (let i = 1; i < prueba.length; i++) {
            const elem = prueba[i];
            console.log(elem)
            //console.log(elem)
            var previous = this.BST.search(root, elem['anterior'])
            //console.log(previous)
            if (previous.right !== null) {
                if (previous.right.data === elem['id']) {
                    for (let j = 0; j < prueba.length; j++) {
                        const element = prueba[j];
                        if (element.id === elem['anterior']) {
                            console.log('aqui')
                            prueba[i] = {
                                id: elem['id'],
                                anterior: elem['anterior'],
                                x: element['x'] + 100,
                                y: element['y'] + 50
                            }
                        }
                    }
                }
            }
            if (previous.left !== null) {
                if (previous.left.data === elem['id']) {
                    for (let j = 0; j < prueba.length; j++) {
                        const element = prueba[j];
                        if (element.id === elem['anterior']) {
                            console.log('aqui2')
                            prueba[i] = {
                                id: elem['id'],
                                anterior: elem['anterior'],
                                x: element['x'] - 100,
                                y: element['y'] + 50
                            }
                        }
                    }
                }
            }
        }
        console.log(prueba)
        for (let i = 0; i < prueba.length; i++) {
            const elem = prueba[i];
            if (i === 0) {
                final.push({
                    group: 'nodes',
                    data: {
                        id: elem['id']
                    },
                    position: {
                        x: elem['x'],
                        y: elem['y']
                    }
                })
            } else {
                final.push({
                    group: 'nodes',
                    data: {
                        id: elem['id']
                    },
                    position: {
                        x: elem['x'],
                        y: elem['y']
                    }
                })
            }
        }
        for (let i = 1; i < prueba.length; i++) {
            const elem = prueba[i];
            final.push({
                group: 'edges',
                data: {
                    id: elem['anterior'] + '-' + elem['id'],
                    source: elem['anterior'],
                    target: elem['id']
                }
            })
        }
        console.log(final)
        this.cy.add(final);
        /* for (const elem of this.cy.filter('nodes')) {
            console.log(elem['_private']['data'])
            console.log(elem['_private']['position'])
        } */
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

                        <div className='my-2'>
                            <p className='h5'>
                                Numeros:
                                {
                                    this.state.numeros.map((num, index) => (
                                        <b> {num}   </b>
                                    ))
                                }
                            </p>
                        </div>


                        {
                            this.state.numeros.length > 0 ? <button className='btn btn-secondary' onClick={() => this.graficar()} >Graficar</button> : null
                        }


                        <CytoscapeComponent
                            elements={this.state.elements}
                            style={{ width: this.state.w, height: this.state.h }}
                            cy={(cy) => { this.cy = cy }}
                            pan={{ x: 100, y: 200 }}
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
                                        'target-arrow-shape': 'triangle',
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