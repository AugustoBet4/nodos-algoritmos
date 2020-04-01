import React, { Component } from 'react';
import '../App.css';
import CytoscapeComponent from 'react-cytoscapejs';


export class JhonsonActivity extends Component {

    state = {
        w: 0,
        h: 0,
        elements: [],
    }

    componentDidMount = () => {
        const elementos = localStorage.getItem('jhonson') ? JSON.parse(localStorage.getItem('jhonson')) : []
        this.setState({
            w: window.innerWidth,
            h: window.innerHeight / 2,
            elements: elementos
        })

        this.setUpListeners()
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
                        <strong><h2>Jhonson</h2></strong>
                        <h3>Solucion</h3>
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
                </div>
                <div className='card-footer'>
                    <button className='btn btn-outline-primary' onClick={ () => this.atras('/') }>
                        Atras
                    </button>
                </div>
            </div>
        );
    }
}