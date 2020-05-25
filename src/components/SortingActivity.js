import React, { Component } from 'react';
import '../App.css';


export class SortingActivity extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    state = {
        w: 0,
        h: 0,
        numeros: [],
        num2: [],
        shell: [],
        shellFinished: false,
        shellTime: 0,
        insertion: [],
        insertionFinished: false,
        insertionTime: 0,
        selection: [],
        selectionFinished: false,
        selectionTime: 0,
        merge: [],
        mergeFinished: false,
        mergeTime: 0
    }

    componentDidMount = () => {
        this.setState({
            w: window.innerWidth,
            h: window.innerHeight / 2,
        })
    }

    handleSubmit(event) {
        const nuevoNum = event.target.number.value;
        var numeros = this.state.numeros;
        var num2 = this.state.num2;
        numeros.push(nuevoNum);
        num2.push(nuevoNum);

        this.setState({
            numeros: numeros,
            num2: num2
        })

        event.preventDefault();
        event.target.number.value = '';
    }

    solucion = async () => {
        const numeros = this.state.numeros;
        await (this.shell(numeros))
        await (this.selection(numeros, function (a, b) { return b - a; }))
        await (this.insertion(numeros))
        
        const startTime = performance.now()
        
        const merge = this.mergeSort(numeros)
        
        const endTime = performance.now()

        var timeDiff = endTime - startTime;

        this.setState({
            merge: merge,
            mergeFinished: true,
            mergeTime: timeDiff
        })
    }

    shell = async (arr) => {
        const startTime = performance.now()
        var increment = arr.length / 2;
        while (increment > 0) {
            for (let i = increment; i < arr.length; i++) {
                var j = i;
                var temp = arr[i];

                while (j >= increment && arr[j - increment] > temp) {
                    arr[j] = arr[j - increment];
                    j = j - increment;
                }

                arr[j] = temp;
            }

            if (increment == 2) {
                increment = 1;
            } else {
                increment = parseInt(increment * 5 / 11);
            }
        }
        const endTime = performance.now()

        var timeDiff = endTime - startTime;

        this.setState({
            shell: arr,
            shellFinished: true,
            shellTime: timeDiff
        })
    }
    selection = async (arr, compare_Function) => {
        const startTime = performance.now()

        function compare(a, b) {
            return a - b;
        }
        var min = 0;
        var index = 0;
        var temp = 0;

        //{Function} compare_Function Compare function
        compare_Function = compare_Function || compare;

        for (var i = 0; i < arr.length; i += 1) {
            index = i;
            min = arr[i];

            for (var j = i + 1; j < arr.length; j += 1) {
                if (compare_Function(min, arr[j]) > 0) {
                    min = arr[j];
                    index = j;
                }
            }

            temp = arr[i];
            arr[i] = min;
            arr[index] = temp;
        }

        const endTime = performance.now()

        var timeDiff = endTime - startTime;

        this.setState({
            selection: arr,
            selectionFinished: true,
            selectionTime: timeDiff
        })
    }
    insertion = async (nums) => {
        const startTime = performance.now()

        for (let i = 1; i < nums.length; i++) {
            let j = i - 1
            let temp = nums[i]
            while (j >= 0 && nums[j] > temp) {
                nums[j + 1] = nums[j]
                j--
            }
            nums[j + 1] = temp
        }

        const endTime = performance.now()

        var timeDiff = endTime - startTime;

        this.setState({
            insertion: nums,
            insertionFinished: true,
            insertionTime: timeDiff
        })

    }
    mergeSort = (arr) => {
        if (arr.length === 1) {
            // return once we hit an array with a single item
            return arr
        }

        const middle = Math.floor(arr.length / 2) // get the middle item of the array rounded down
        const left = arr.slice(0, middle) // items on the left side
        const right = arr.slice(middle) // items on the right side

        return this.merge(
            this.mergeSort(left),
            this.mergeSort(right)
        )
    }
    merge = (left, right) => {

        let result = []
        let indexLeft = 0
        let indexRight = 0

        while (indexLeft < left.length && indexRight < right.length) {
            if (left[indexLeft] < right[indexRight]) {
                result.push(left[indexLeft])
                indexLeft++
            } else {
                result.push(right[indexRight])
                indexRight++
            }
        }
        return result.concat(left.slice(indexLeft)).concat(right.slice(indexRight))
    }

    atras = (url) => {
        this.props.history.push(url)
    }

    render() {
        return (
            <div className="App">
                <div className='card'>
                    <div className='card-header text-center'>
                        <strong><h2>SORTING</h2></strong>
                        <h3>Solucion</h3>
                    </div>

                    <div className='card-body'>
                        <form className='form-inline' onSubmit={this.handleSubmit} >
                            <div className='form-group mb-2'>
                                <label >Agregar elemento: </label>
                                <input type="text" name="number" className='form-control' required />
                            </div>
                            <input type="submit" value="Submit" className="btn btn-outline-success mb-2" />
                        </form>

                        <div className='my-2'>
                            <p className='h5'>
                                Elementos:
                                {
                                    this.state.num2.map(num => (
                                        <b> {num}   </b>
                                    ))
                                }
                            </p>
                        </div>

                        {
                            this.state.numeros.length > 0 ? <button className='btn btn-secondary' onClick={() => this.solucion()} >Ordenar</button> : null
                        }
                        <table className='table table-borderless table-hover table-responsive'>
                            <tbody>
                                {
                                    this.state.shellFinished ?
                                        <tr>
                                            <th scope='row'>
                                                Shell:
                                            </th>
                                            <td>
                                                {
                                                    this.state.shell.map(num => (
                                                        <b> {num} </b>
                                                    ))
                                                }
                                            </td>
                                            <td>
                                                Tiempo: {parseFloat(this.state.shellTime).toFixed(6)}  ms.
                                            </td>

                                        </tr>
                                        : null
                                }

                                {
                                    this.state.insertionFinished ?
                                        <tr>
                                            <th scope='row'>
                                                Insertion:
                                            </th>
                                            <td>
                                                {
                                                    this.state.insertion.map(num => (
                                                        <b> {num}   </b>
                                                    ))
                                                }
                                            </td>
                                            <td>
                                                Tiempo: {parseFloat(this.state.insertionTime).toFixed(6)}  ms.
                                            </td>

                                        </tr>
                                        : null
                                }

                                {
                                    this.state.selectionFinished ?
                                        <tr>
                                            <th scope='row'>
                                                Selection:
                                            </th>
                                            <td>
                                                {
                                                    this.state.selection.map(num => (
                                                        <b> {num}   </b>
                                                    ))
                                                }
                                            </td>
                                            <td>
                                                Tiempo: {parseFloat(this.state.selectionTime).toFixed(6)}  ms.
                                            </td>

                                        </tr>
                                        : null
                                }

                                {
                                    this.state.mergeFinished ?
                                        <tr>
                                            <th scope='row'>
                                                Mergesort:
                                            </th>
                                            <td>
                                                {
                                                    this.state.merge.map(num => (
                                                        <b> {num}   </b>
                                                    ))
                                                }
                                            </td>
                                            <td>
                                                Tiempo: {parseFloat(this.state.mergeTime).toFixed(6)}  ms.
                                            </td>

                                        </tr>
                                        : null
                                }
                            </tbody>
                        </table>

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