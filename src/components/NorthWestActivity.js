import React, { Component } from 'react';
import '../App.css';
//import CytoscapeComponent from 'react-cytoscapejs';
import { NorthWest } from "../models/NorthWest";
import { useTable } from "react-table";

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
        r: 0,
        warehouse: [],
        factories: [],
        stock: [],
        requirement: [],
        setData: [],
        verSegundaMatriz: false,
        feasible: [],
        final: [],
    }

    handleSubmit(event) {
        var r = event.target.requirement.value;
        var s = event.target.stock.value;
        event.preventDefault();
        var warehouse = new Array(parseInt(r));
        var requirement = new Array(parseInt(r));
        var costs = this.createArray(parseInt(s), parseInt(r));
        var factories = new Array(parseInt(s));
        var stock = new Array(parseInt(s));

        for (let i = 0; i < r; i++) {
            warehouse[i] = i
            requirement[i] = i
        }
        for (let i = 0; i < s; i++) {
            factories[i] = i;
            stock[i] = i;
        }
        this.setState({
            r: r,
            s: s,
            warehouse: warehouse,
            factories: factories,
            stock: stock,
            requirement: requirement,
            setData: costs
        })
    }

    changeFactories(i, event) {
        let factor = this.state.factories;
        factor[i] = event.target.value
        this.setState({
            factories: factor
        })
    }
    changeWarehouses(i, event) {
        let ware = this.state.warehouse;
        ware[i] = event.target.value
        this.setState({
            warehouse: ware
        })
    }
    changeRequired(i, event) {
        let req = this.state.requirement;
        req[i] = parseInt(event.target.value)
        this.setState({
            requirement: req
        })
    }
    changeStock(i, event) {
        let stock = this.state.stock;
        stock[i] = parseInt(event.target.value)
        this.setState({
            stock: stock
        })
    }
    changeCost(i, j, event) {
        let costs = this.state.setData
        costs[i][j] = parseInt(event.target.value)
        this.setState({
            setData: costs
        })
    }

    createArray = (r, s) => {
        let newArray = new Array(r);
        for (let i = 0; i < r; i++) {
            newArray[i] = new Array(s).fill(0);
        }
        return newArray;
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
        this.setState({
            verSegundaMatriz: true
        })
        if (this.state.r != 0 && this.state.s != 0) {
            if (opc === 'min') {
                var test = new NorthWest(this.state.s, this.state.r);
                //var stock = [7, 9, 6] 
                var stock = this.state.stock
                for (let i = 0; i < test.stockSize; i++) {
                    const element = stock[i];
                    test.setStock(element, i);
                }
                //var requirements = [5, 10, 8, 2]
                var requirements = this.state.requirement
                for (let i = 0; i < test.requiredSize; i++) {
                    const element = requirements[i];
                    test.setRequired(element, i);
                }
                //var costs = [[3, 5, 9, 6], [4, 1, 5, 7], [8, 5, 6, 2]]
                var costs = this.state.setData
                for (let i = 0; i < test.stockSize; i++) {
                    for (let j = 0; j < test.requiredSize; j++) {
                        test.setCost(costs[i][j], i, j)
                    }
                }
                test.minNorthWest()
                this.setState({
                    feasible: test
                })

                var final = new Array()
                for (let i = 0; i < this.state.factories.length; i++) {
                    final[i] = new Array()
                    const x = this.state.factories[i];
                    for (let j = 0; j < this.state.warehouse.length; j++) {
                        var count = 0;
                        const y = this.state.warehouse[j];
                        for (let index = 0; index < test.feasible.length; index++) {
                            const elem = test.feasible[index];
                            if (elem['stock'] === i && elem['required'] === j) {
                                if (elem['value'] !== 0) {
                                    count++;
                                    final[i].push(elem['value'])
                                }
                            }
                            else {
                                if (count === 0 && index === test.feasible.length - 1) {
                                    final[i].push('')
                                }
                            }
                        }
                    }
                }

                this.setState({
                    final: final
                })

            } else {
                var test = new NorthWest(this.state.s, this.state.r);
                //var stock = [7, 9, 6] 
                var stock = this.state.stock
                for (let i = 0; i < test.stockSize; i++) {
                    const element = stock[i];
                    test.setStock(element, i);
                }
                //var requirements = [5, 10, 8, 2]
                var requirements = this.state.requirement
                for (let i = 0; i < test.requiredSize; i++) {
                    const element = requirements[i];
                    test.setRequired(element, i);
                }
                //var costs = [[3, 5, 9, 6], [4, 1, 5, 7], [8, 5, 6, 2]]
                var costs = this.state.setData
                for (let i = 0; i < test.stockSize; i++) {
                    for (let j = 0; j < test.requiredSize; j++) {
                        test.setCost(costs[i][j], i, j)
                    }
                }
                test.maxNorthWest()
                this.setState({
                    feasible: test
                })
                var final = new Array()
                for (let i = 0; i < this.state.factories.length; i++) {
                    final[i] = new Array()
                    const x = this.state.factories[i];
                    for (let j = 0; j < this.state.warehouse.length; j++) {
                        var count = 0;
                        const y = this.state.warehouse[j];
                        for (let index = 0; index < test.feasible.length; index++) {
                            const elem = test.feasible[index];
                            if (elem['stock'] === i && elem['required'] === j) {
                                if (elem['value'] !== 0) {
                                    count++;
                                    final[i].push(elem['value'])
                                }
                            }
                            else {
                                if (count === 0 && index === test.feasible.length - 1) {
                                    final[i].push('')
                                }
                            }
                        }
                    }
                }

                this.setState({
                    final: final
                })
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
                                <label >Disponibilidad: </label>
                                <input type="number" name="stock" className='form-control' required />
                            </div>
                            <div className='form-group mx-sm-3 mb-2'>
                                <label>Demanda: </label>
                                <input type="number" name="requirement" className='form-control' required />
                            </div>
                            <input type="submit" value="Submit" className="btn btn-outline-success mb-2" />
                        </form>
                        {
                            this.state.r != 0 ?
                                <div className='container' >
                                    <div className='row'>
                                        <div className='col'>
                                            <table className='table table-borderless'>
                                                <tbody>
                                                    <tr>
                                                        <th>
                                                            <div className='form-group'>
                                                                <input type='number' className='form-control' placeHolder='---' readOnly ></input>
                                                            </div>
                                                        </th>
                                                    </tr>
                                                    {
                                                        this.state.factories.map((x, index) => (
                                                            <tr>
                                                                <th scope='row' >
                                                                    <div className='form-group'>
                                                                        <input type='text' className='form-control' value={x} onChange={(e) => this.changeFactories(index, e)} ></input>
                                                                    </div>
                                                                </th>
                                                            </tr>
                                                        ))
                                                    }
                                                    <tr>
                                                        <th>
                                                            <div className='form-group'>
                                                                <input type='number' className='form-control' placeHolder='Demanda' readOnly ></input>
                                                            </div>
                                                        </th>
                                                    </tr>
                                                </tbody>

                                            </table>
                                        </div>

                                        <div className='col'>

                                            <div className='row'>
                                                <table className='table mb-0 table-borderless'>
                                                    <thead>
                                                        <tr>
                                                            {
                                                                this.state.warehouse.map((x, index) => (
                                                                    <th>
                                                                        <div className='form-group'>
                                                                            <input type='text' className='form-control' value={x} onChange={(e) => this.changeWarehouses(index, e)} ></input>
                                                                        </div>
                                                                    </th>
                                                                ))
                                                            }
                                                        </tr>
                                                    </thead>
                                                </table>
                                            </div>

                                            <div className='row'>

                                                <table className='table mt-0 mb-0 table-borderless'>
                                                    <tbody>
                                                        {
                                                            this.state.factories.map((x, i) => (
                                                                <tr>
                                                                    {
                                                                        this.state.warehouse.map((y, j) => (
                                                                            <td>
                                                                                <div className='form-group'>
                                                                                    <input type='number' className='form-control' value={this.state.setData[i][j]} onChange={(e) => this.changeCost(i, j, e)} ></input>
                                                                                </div>
                                                                            </td>
                                                                        ))
                                                                    }
                                                                </tr>
                                                            ))
                                                        }

                                                    </tbody>

                                                </table>



                                            </div>

                                            <div className='row'>
                                                <table className='table mt-0 table-borderless'>
                                                    <thead>
                                                        <tr>
                                                            {
                                                                this.state.requirement.map((x, index) => (
                                                                    <th>
                                                                        <div className='form-group'>
                                                                            <input type='number' className='form-control' value={x} onChange={(e) => this.changeRequired(index, e)} ></input>
                                                                        </div>
                                                                    </th>
                                                                ))
                                                            }
                                                        </tr>
                                                    </thead>
                                                </table>
                                            </div>


                                        </div>

                                        <div className='col'>
                                            <table className='table table-borderless'>
                                                <tbody>
                                                    <tr>
                                                        <th>
                                                            <div className='form-group'>
                                                                <input type='number' className='form-control' placeHolder='Disponibilidad' readOnly ></input>
                                                            </div>
                                                        </th>
                                                    </tr>
                                                    {
                                                        this.state.stock.map((x, index) => (
                                                            <tr>
                                                                <th>
                                                                    <div className='form-group'>
                                                                        <input type='number' className='form-control' value={x} onChange={(e) => this.changeStock(index, e)} ></input>
                                                                    </div>
                                                                </th>
                                                            </tr>
                                                        ))
                                                    }

                                                </tbody>

                                            </table>
                                        </div>

                                    </div>

                                    <div className='row'>
                                        <div className='col'>
                                            <button className='btn btn-outline-primary' onClick={() => this.solucion('min')}>
                                                Minimizar
                                        </button>
                                        </div>

                                        <div className='col'>
                                            <button className='btn btn-outline-primary' onClick={() => this.solucion('max')}>
                                                Maximizar
                                        </button>
                                        </div>
                                    </div>
                                </div>

                                : null
                        }
                        {
                            this.state.verSegundaMatriz ?

                                <div className='container' >
                                    <div className='row'>
                                        <div className='col'>
                                            <table className='table'>
                                                <tbody>
                                                    <tr>
                                                        <th>
                                                            ---
                                                        </th>
                                                    </tr>
                                                    {
                                                        this.state.factories.map((x, index) => (
                                                            <tr>
                                                                <th scope='row' >
                                                                    {x}
                                                                </th>
                                                            </tr>
                                                        ))
                                                    }
                                                    <tr>
                                                        <th>
                                                            Demanda
                                                        </th>
                                                    </tr>
                                                </tbody>

                                            </table>
                                        </div>

                                        <div className='col'>

                                            <div className='row'>
                                                <table className='table mb-0'>
                                                    <thead>
                                                        <tr>
                                                            {
                                                                this.state.warehouse.map((x, index) => (
                                                                    <th>
                                                                        {x}
                                                                    </th>
                                                                ))
                                                            }
                                                        </tr>
                                                    </thead>
                                                </table>
                                            </div>

                                            <div className='row'>

                                                <table className='table mt-0 mb-0'>
                                                    <tbody>
                                                        {
                                                            this.state.factories.map((x, i) => (
                                                                <tr>
                                                                    {
                                                                        this.state.warehouse.map((y, j) => (
                                                                            <td>{this.state.final[i][j]}</td>
                                                                        ))
                                                                    }
                                                                </tr>
                                                            ))
                                                        }

                                                    </tbody>

                                                </table>



                                            </div>

                                            <div className='row'>
                                                <table className='table mt-0'>
                                                    <thead>
                                                        <tr>
                                                            {
                                                                this.state.requirement.map((x, index) => (
                                                                    <th>
                                                                        {x}
                                                                    </th>
                                                                ))
                                                            }
                                                        </tr>
                                                    </thead>
                                                </table>
                                            </div>


                                        </div>

                                        <div className='col'>
                                            <table className='table'>
                                                <tbody>
                                                    <tr>
                                                        <th>
                                                            Disponibilidad
                                                        </th>
                                                    </tr>
                                                    {
                                                        this.state.stock.map((x, index) => (
                                                            <tr>
                                                                <th>
                                                                    {x}
                                                                </th>
                                                            </tr>
                                                        ))
                                                    }

                                                </tbody>

                                            </table>
                                        </div>

                                    </div>
                                    <p>TOTAL: {this.state.feasible.getSolution()}</p>
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
