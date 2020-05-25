import React, { Component } from 'react';
import '../App.css';
import CytoscapeComponent from 'react-cytoscapejs';

export class CompeteActivity extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    state = {
        w: 0,
        h: 0,
        elements: [],
        pares: []
    }

    componentDidMount = () => {
        this.setState({
            w: window.innerWidth,
            h: window.innerHeight / 2,
        })

        this.setUpListeners()
    }

    handleSubmit(event) {
        const x = parseInt(event.target.x.value);
        const y = parseInt(event.target.y.value);

        var pares = this.state.pares;

        var parNuevo = new Array();
        parNuevo.push({
            x: x,
            y: y
        })

        pares.push(parNuevo)

        this.setState({
            pares: pares
        })
        event.preventDefault();
        event.target.x.value = '';
        event.target.y.value = '';
    }

    setUpListeners = () => {
        this.cy.unbind('click')
        this.cy.unbind('tap')
        this.cy.unbind('cxttap')
    }

    atras = (url) => {
        this.props.history.push(url)
    }

    graficar = () => {
        var nodos = new Array();
        var pares = this.state.pares;

        this.cy.elements().remove();

        for (let i = 0; i < pares.length; i++) {
            const par = pares[i][0];
            nodos.push({
                group: 'nodes',
                data: {
                    id: par.x + ',' + par.y
                },
                position: {
                    x: par.x * 100,
                    y: par.y * 100
                }
            })
        }
        for (let i = 0; i < pares.length; i++) {
            const par = pares[i][0];
            if (i === pares.length - 1) {
                const par2 = pares[0][0]
                nodos.push({
                    group: 'edges',
                    data: {
                        source: par2.x + ',' + par2.y,
                        target: par.x + ',' + par.y
                    }
                })
            } else {
                const par2 = pares[i + 1][0]
                nodos.push({
                    group: 'edges',
                    data: {
                        source: par.x + ',' + par.y,
                        target: par2.x + ',' + par2.y
                    }
                })
            }
        }

        var pasada = 0;
        var iguales = 0;

        while (true) {
            for (let i = 0; i < pares.length; i++) {
                //console.log(pasada)
                if (i === pares.length - 1) {
                    const par1 = pares[i][pasada];
                    const par2 = pares[0][pasada];

                    if (par1.x === par2.x && par1.y === par2.y) {
                        iguales++;
                    }

                    var newX = parseFloat(((par2.x + par1.x) / 2).toFixed(2));
                    var newY = parseFloat(((par2.y + par1.y) / 2).toFixed(2));

                    pares[i].push({
                        x: newX,
                        y: newY
                    })
                } else {
                    const par1 = pares[i][pasada];
                    const par2 = pares[i + 1][pasada];

                    if (par1.x == par2.x && par1.y == par2.y)
                        iguales++;

                    var newX = parseFloat(((par2.x + par1.x) / 2).toFixed(2));
                    var newY = parseFloat(((par2.y + par1.y) / 2).toFixed(2));

                    pares[i].push({
                        x: newX,
                        y: newY
                    })
                }
            }
            console.log(iguales)
            if (pasada === 400 || iguales === pares.length)
                break;

            iguales = 0;
            pasada++;
        }
        console.log(pares);
        var lastLength;
        for (let i = 0; i < pares.length; i++) {
            const elem = pares[i];
            lastLength = elem.length
        }
        var last = pares[0][lastLength - 1]
        nodos.push({
            group: 'nodes',
            data: {
                id: last.x + ',' + last.y
            },
            position: {
                x: last.x * 100,
                y: last.y * 100
            },
            style: {
                'background-color': 'blue',
                color: 'white',
                'width': 75,
                'height': 75
            }
        })

        this.cy.add(nodos)

    }

    render() {
        return (
            <div className="App">
                <div className='card'>
                    <div className='card-header text-center'>
                        <strong><h2>Algoritmo Compete</h2></strong>
                        <h3>Solucion</h3>
                    </div>

                    <div className='card-body'>
                        <form className='form-inline' onSubmit={this.handleSubmit} >
                            <div className='form-group mb-2'>
                                <label >X: </label>
                                <input type="number" name="x" className='form-control' required />
                                <label >Y: </label>
                                <input type="number" name="y" className='form-control' required />
                            </div>
                            <input type="submit" value="Submit" className="btn btn-outline-success mb-2" />
                        </form>

                        <div className='my-2'>
                            <p className='h5'>
                                Pares ordenados:
                                {
                                    this.state.pares.map((elem, index) => (
                                        elem.map(par => (
                                            <b> {par.x},{par.y}   </b>
                                        ))
                                    ))
                                }
                            </p>
                        </div>


                        {
                            this.state.pares.length > 0 ? <button className='btn btn-secondary' onClick={() => this.graficar()} >Calcular</button> : null
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
                                        'text-wrap': 'wrap',
                                        'width': 50,
                                        'height': 50
                                    }
                                },
                            ]}
                        />
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