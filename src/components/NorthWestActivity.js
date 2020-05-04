import React, { Component } from 'react';
import '../App.css';
import CytoscapeComponent from 'react-cytoscapejs';
import { NorthWest } from "../models/NorthWest";


export class NorthWestActivity extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    state = {
        w: 0,
        h: 0,
        /* elements: [], */
        s: 0,
        r: 0
    }

    handleSubmit(event) {
        var r = event.target.requirement.value;
        var s = event.target.stock.value;
        event.preventDefault();
        this.setState({
            r: r,
            s: s
        })
    }

    componentDidMount = () => {
        /* const elementos = localStorage.getItem('asignacion') ? JSON.parse(localStorage.getItem('asignacion')) : [] */
        this.setState({
            w: window.innerWidth,
            h: window.innerHeight / 2,
            /* elements: elementos */
        })
    }
    /* setUpListeners = () => {
        this.cy.unbind('click')
        this.cy.unbind('tap')
        this.cy.unbind('cxttap')
    } */
    atras = (url) => {
        this.props.history.push(url)
    }

    solucion = (opc) => {
        if (this.state.r != 0 && this.state.s != 0) {
            if (opc === 'min') {
                var test = new NorthWest(this.state.r, this.state.s);
                var stock = [7, 9, 6]
                for (let i = 0; i < test.stockSize; i++) {
                    const element = stock[i];
                    test.setStock(element, i);
                }
                var requirements = [5, 10, 8, 2]
                for (let i = 0; i < test.requiredSize; i++) {
                    const element = requirements[i];
                    test.setRequired(element, i);
                }
                var costs = [[3, 5, 9, 6], [4, 1, 5, 7], [8, 5, 6, 2]]
                for (let i = 0; i < test.stockSize; i++) {
                    for (let j = 0; j < test.requiredSize; j++) {
                        test.setCost(costs[i][j], i, j)
                    }
                }
                test.minNorthWest()
                //console.log(test)
                for (const t of test.feasible) {
                    console.log(t)
                }
                console.log("Target function: " + test.getSolution());
            } else {
                var test = new NorthWest(this.state.r, this.state.s);
                var stock = [7, 9, 6]
                for (let i = 0; i < test.stockSize; i++) {
                    const element = stock[i];
                    test.setStock(element, i);
                }
                var requirements = [5, 10, 8, 2]
                for (let i = 0; i < test.requiredSize; i++) {
                    const element = requirements[i];
                    test.setRequired(element, i);
                }
                var costs = [[3, 5, 9, 6], [4, 1, 5, 7], [8, 5, 6, 2]]
                for (let i = 0; i < test.stockSize; i++) {
                    for (let j = 0; j < test.requiredSize; j++) {
                        test.setCost(costs[i][j], i, j)
                    }
                }
                test.maxNorthWest()
                for (const t of test.feasible) {
                    console.log(t)
                }
                console.log("Target function: " + test.getSolution());
            }
        }
    }

    render() {
        return (
            <div className="App">
                <div className='card'>
                    <div className='card-header text-center'>
                        <strong><h2>ALGORITMO</h2></strong>
                        <h3>NORESTE</h3>
                    </div>
                    <div className='card-body'>
                        <form className='form-inline' onSubmit={this.handleSubmit} >
                            <div className='form-group mb-2'>
                                <label >Demanda: </label>
                                <input type="number" name="requirement" className='form-control' required />
                            </div>
                            <div className='form-group mx-sm-3 mb-2'>
                                <label>Disponibilidad: </label>
                                <input type="number" name="stock" className='form-control' required />
                            </div>
                            <input type="submit" value="Submit" className="btn btn-outline-success mb-2" />
                        </form>
                        {
                            this.state.r != 0 ?
                                <div>
                                    Aqui va la matriz


                                <button className='btn btn-outline-primary' onClick={() => this.solucion('min')}>
                                        Minimizar
                                </button>
                                <button className='btn btn-outline-primary' onClick={() => this.solucion('max')}>
                                        Maximizar
                                </button>
                                </div>


                                : null
                        }

                    </div>
                </div>
                <div className='card-footer'>
                    <button className='btn btn-outline-primary' onClick={() => this.atras('/')}>
                        Atras
                    </button>
                </div>
            </div >
        );
    }
}