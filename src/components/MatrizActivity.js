import React, { Component } from 'react';
import '../App.css';
import cytoscape from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
import edgehandles from 'cytoscape-edgehandles';

edgehandles(cytoscape);

export class MatrizActivity extends Component {

  state = {
    w: 0,
    h: 0,
    elements: [],
    show: false,
    showMatrix: false,
    name: '',
    nodes: [],
    table: [],
    row: [],
    asigOpcion: -1,
    valoresasign: []
  }
  /* CREACION DE LA INTERFAZ DE CREACION DE NODOS Y ARISTAS */
  componentDidMount = () => {
    const elementos = localStorage.getItem('allInfo') ? JSON.parse(localStorage.getItem('allInfo')) : []
    this.setState({
      w: window.innerWidth / 2,
      h: window.innerHeight / 2,
      elements: elementos
    })

    this.setUpListeners()

    this.cy.edgehandles({
      preview: false,
      handleNodes: 'node',
      handleSize: 10,
      snap: false,
      handleInDrawMode: false,
      edgeType: function () {
        return 'flat'
      },
      loopAllowed: function () {
        return true;
      },
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
      if (event.target !== this.cy) {
        this.cy.remove(event.target)
        localStorage.removeItem('allInfo')
        localStorage.setItem('allInfo', JSON.stringify(this.cy.json(true)['elements']));
      }
    })

    // Asignacion de Valores a Edges
    this.cy.on('tap', 'edge', (event) => {
      //event.target.style({ 'line-color': 'red', 'target-arrow-color': 'red' })
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

  /* CREACION DE LA MATRIZ DE ADYACENCIA */
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
      console.log('nodes:', nodes)
      console.log('table:', table)
      console.log('row:', row)
      this.setState({ nodes: nodes, table: table, row: row, showMatrix: true });
    });
  }
  hideMatrix = () => {
    this.setState({ showMatrix: false });
  }

  /* ALGORITMO DE JHONSON */
  solucion = () => {
    var nodos_dia
    var id_dia

    var mostrar = '\t\t\t'

    var nodos = this.cy.filter('node[classes = eh-preview-active]').length
    var aristas = this.cy.filter('edge').length
    var temp_nodo = ""
    var temp_arit = ""

    var nodos_dia = []
    var id_dia = []
    var nodos_posix = []
    var nodos_posiy = []

    for (const node of this.cy.filter('node[classes = eh-preview-active]')) {
      temp_nodo = node['_private']
      id_dia.push(temp_nodo.data.id)
      nodos_dia.push(temp_nodo.data.name)
      nodos_posix.push(temp_nodo.position.x)
      nodos_posiy.push(temp_nodo.position.y)
    }

    var aristas_a = [];
    var aristas_a2 = [];
    var index = 0
    for (const arista of this.cy.filter('edge')) {
      aristas_a[index] = []

      temp_arit = arista['_private']
      var origen = this.indexofarray_b(temp_arit.data.source, id_dia);//ubicar_nodo(temp_arit.from);
      aristas_a[index].push(origen)
      var destino = this.indexofarray_b(temp_arit.data.target, id_dia); //ubicar_nodo(temp_arit.to);
      aristas_a2.push(temp_arit.data.id)
      aristas_a[index].push(destino)
      var valor = temp_arit.data.value
      aristas_a[index].push(valor)
      index += 1;
    }
    var nueva_matriz = this.construir_matriz(nodos_dia, id_dia, aristas_a, aristas);
    console.log(nueva_matriz)

    var inicio = this.def_ini(nueva_matriz.mat2, nodos);
    var fin = this.def_fin(nueva_matriz.mat2, nodos);
    var parti = this.array_inicio(nueva_matriz.mat1, nueva_matriz.mat2, inicio, fin, nodos);
    console.log(parti)
    this.recorrido(parti.h)
    this.redibujar(id_dia, nodos_dia, nodos_posix, nodos_posiy, parti.i, parti.l, nueva_matriz.mat1, parti.h, nueva_matriz.mat2)

    this.props.history.push('/jhonson')
  }
  indexofarray_b(val, arreglo) {
    for (var i = 0; i < arreglo.length; i++) {
      var n = val.localeCompare(arreglo[i])
      if (n == 0) {
        return i;
      }
    }
  }
  construir_matriz(nodos_dia, id_dia, aristas_a, aristas_a2) {
    //var tipo_g=document.getElementById('grafo').value;
    var matriz1 = [];
    var matriz_pos = [];
    for (var i = 0; i < nodos_dia.length; i++) {
      matriz1[i] = [];
      for (var j = 0; j < nodos_dia.length; j++) {
        matriz1[i][j] = 0;
      }
    }
    for (var i = 0; i < nodos_dia.length; i++) {
      matriz_pos[i] = [];
      for (var j = 0; j < nodos_dia.length; j++) {
        matriz_pos[i][j] = 0;
      }
    }

    for (var i = 0; i < aristas_a2; i++) {
      matriz1[aristas_a[i][0]][aristas_a[i][1]] = parseInt(aristas_a[i][2]);
      matriz_pos[aristas_a[i][0]][aristas_a[i][1]] = 1;
    }
    return {
      mat1: matriz1,
      mat2: matriz_pos
    };

  }
  def_ini(matriz, len) {
    var s;
    var inicios = new Array();
    for (var i = 0; i < len; i++) {
      s = 0;
      for (var j = 0; j < len; j++) {
        s += parseInt(matriz[j][i]);
      }
      if (s == 0) {
        inicios.push(i);
      }
    }
    return inicios;
  }
  def_fin(matriz, len) {
    var s;
    var fin = new Array();
    for (var i = 0; i < len; i++) {
      s = 0;
      for (var j = 0; j < len; j++) {
        s += parseInt(matriz[i][j]);
      }
      if (s == 0) {
        fin.push(i);
      }
    }
    return fin;
  }
  array_inicio(matriz, matriz_pos, inicio, fin, len) {
    //llena la cola
    var cola = [];
    //iniciar el vector de llegada
    var partida = new Array();
    for (var i = 0; i < len; i++) {
      partida[i] = -1;
    }
    var llega = new Array();
    for (var i = 0; i < len; i++) {
      llega[i] = Number.MAX_VALUE;
    }
    for (i = 0; i < inicio.length; i++) {
      partida[inicio[i]] = 0;
    }
    //console.log(partida);
    //recorrido del inicio para adelante
    for (var i = 0; i < inicio.length; i++) {
      for (var j = 0; j < len; j++) {
        if (matriz_pos[inicio[i]][j] == 1) {
          cola.push(inicio[i]);
          cola.push(j);
        }
      }
    }
    while (cola.length > 0) {

      var suma_temp = partida[cola[0]] + matriz[cola[0]][cola[1]];
      if (suma_temp > partida[cola[1]]) {
        partida[cola[1]] = suma_temp;
      }
      //console.log(partida);
      for (var i = 0; i < len; i++) {
        if (matriz_pos[cola[1]][i] != 0) {
          cola.push(cola[1]); cola.push(i);//almacenamos posiciones
          console.log(cola);
        }
      }

      cola.shift(); cola.shift();
    }
    llega[fin[0]] = partida[fin[0]];
    for (var i = 0; i < fin.length; i++) {
      for (var j = 0; j < len; j++) {
        if (matriz_pos[j][fin[i]] == 1) {
          cola.push(j);
          cola.push(fin[i]);
        }
      }
    }
    while (cola.length > 0) {

      var resta_temp = llega[cola[1]] - matriz[cola[0]][cola[1]];
      if (resta_temp < llega[cola[0]]) {
        llega[cola[0]] = resta_temp;
      }
      //console.log(llega);
      for (var i = 0; i < len; i++) {
        if (matriz_pos[i][cola[0]] != 0) {
          cola.push(i); cola.push(cola[0]);//almacenamos posiciones
          //console.log(cola);
        }
      }

      cola.shift(); cola.shift();
    }
    //matriz de holguras
    var mat_h = [];
    for (var i = 0; i < len; i++) {
      mat_h[i] = [];
      for (var j = 0; j < len; j++) {
        mat_h[i][j] = -1;
      }
    }
    for (var i = 0; i < len; i++) {
      for (var j = 0; j < len; j++) {
        if (matriz_pos[i][j] == 1) {
          mat_h[i][j] = llega[j] - partida[i] - matriz[i][j];
        }
      }
    }
    return { i: partida, l: llega, h: mat_h };
  }
  recorrido(matriz) {
    var dir = [];
    dir.push(1);
    var n = 0;
    var c = this.contarceros(matriz);
    for (var e = 0; e < c; e++) {
      for (var i = 0; i < matriz.length; i++) {
        if (matriz[n][i] == 0) {
          n = i;
          dir.push(i + 1);
          break;
        }
      }
    }
    //console.log(dir);
  }
  contarceros(matriz) {
    var n = 0;
    for (var i = 0; i < matriz.length; i++) {
      for (var j = 0; j < matriz.length; j++) {
        if (matriz[i][j] == 0)
          n++;
      }
    }
    return n;
  }
  redibujar(id_dia, nodos_dia, nodos_posix, nodos_posiy, partida, llega, matriz, matriz_h, matriz_p) {
    var len = id_dia.length;
    var array_datos = [];
    for (var i = 0; i < len; i++) {
      array_datos.push(
        {
          data: {
            name: nodos_dia[i] + "\n" + partida[i] + "|" + llega[i],
            id: id_dia[i]
          },
          position: {
            x: nodos_posix[i],
            y: nodos_posiy[i]
          },
          group: "nodes"
        });
    }
    for (var i = 0; i < len; i++) {
      for (var j = 0; j < len; j++) {
        if (matriz_p[i][j] == 1) {
          if (matriz_h[i][j] == 0) {
            array_datos.push(
              {
                data: {
                  source: id_dia[i],
                  target: id_dia[j],
                  value: "A=" + matriz[i][j] + "\nH=" + matriz_h[i][j]
                },
                position: {
                  x: '0',
                  y: '0'
                },
                group: "edges",
                style: {
                  'line-color': 'red',
                  'target-arrow-color': 'red'
                }
              });
          } else {
            array_datos.push(
              {
                data: {
                  source: id_dia[i],
                  target: id_dia[j],
                  value: "A=" + matriz[i][j] + "\nH=" + matriz_h[i][j]
                },
                position: {
                  x: '0',
                  y: '0'
                },
                group: "edges"
              });
          }
        }
      }
    }
    console.log(array_datos)
    localStorage.removeItem('jhonson')
    localStorage.setItem('jhonson', JSON.stringify(array_datos))
  }

  /* ALGORITMO DE ASIGNACION */
  asigMini = async () => {
    await this.asignacion(0)
  }
  asigMax = async () => {
    await this.asignacion(1)
  }
  asignacion = async (opc) => {
    var mensaje = ''
    var aux_m = await this.actualizar_mat()
    var aux_m2 = aux_m
    var finales = await this.origen(aux_m)
    var iniciales = await this.destino(aux_m)
    aux_m = await this.modificar_mat(aux_m2, finales, iniciales)
    var solucion = await this.asignarTareas(aux_m, opc)
    var nodos = this.cy.filter('nodes');
    var j = 0
    var id_nodos = new Array()
    var id_nodos2 = new Array()
    /* "Del Nodo " + nodos[iniciales[i]]['_private']['data']['name']
    " al nodo " + nodos[finales[elem]]['_private']['data']['name'] */
    for (let i = 0; i < solucion.length; i++) {
      var elem = solucion[i];
      var nodo = nodos[iniciales[i]]['_private']['data'];
      var nodo2 = nodos[finales[elem]]['_private']['data'];
      id_nodos.push(nodo.id)
      id_nodos2.push(nodo2.id)
    }
    console.log('Salen de:')
    console.log(id_nodos2)
    console.log('Llegan a:')
    console.log(id_nodos)
    var nuevos_datos = [];
    var i = 0;
    for (const node of this.cy.filter('nodes')) {
      var temp_node = node['_private']
      nuevos_datos.push(
        {
          data: {
            name: temp_node['data'].name,
            id: temp_node['data'].id
          },
          position: {
            x: temp_node['position'].x,
            y: temp_node['position'].y
          },
          group: "nodes"
        });
      i++;
    }
    for (const edge of this.cy.filter('edges')) {
      var temp_edge = edge['_private']
      var count = id_nodos.length - 1;
      console.log(count)
      for (let j = 0; j < id_nodos.length; j++) {
        if (temp_edge['data'].target == id_nodos[j] && temp_edge['data'].source == id_nodos2[j] ) {
          console.log(temp_edge['data'].target + ' - ' + id_nodos[j])
          nuevos_datos.push(
            {
              data: {
                source: temp_edge['data'].source,
                target: temp_edge['data'].target,
                value: temp_edge['data'].value
              },
              position: {
                x: '0',
                y: '0'
              },
              group: "edges",
              style: {
                'line-color': 'red',
                'target-arrow-color': 'red'
              }
            });
        } else {
          if(count == 0) {
            nuevos_datos.push(
              {
                data: {
                  source: temp_edge['data'].source,
                  target: temp_edge['data'].target,
                  value: temp_edge['data'].value
                },
                position: {
                  x: '0',
                  y: '0'
                },
                group: "edges"
              });
          } else {
            count--;
          }
        }
      }
      
      i++;
    }
    console.log(nuevos_datos)
    localStorage.removeItem('asignacion')
    localStorage.setItem('asignacion', JSON.stringify(nuevos_datos))
    this.props.history.push('/asignacion')

    
  }
  actualizar_mat = async () => {
    var temp_nodo
    var temp_arista

    var nodos = this.cy.filter('node[classes = eh-preview-active]').length;
    var aristas = this.cy.filter('edge').length;
    var matriz = new Array(nodos);
    var nod = [];
    var ar_id = [];
    var i = 0
    for (const node of this.cy.filter('node[classes = eh-preview-active]')) {
      temp_nodo = node['_private'].data
      nod.push(temp_nodo.id)
      matriz[i] = new Array(nodos).fill(0);
      i++;
    }
    for (const arista of this.cy.filter('edge')) {
      temp_arista = arista['_private'].data
      ar_id.push(temp_arista.id)
    }
    for (var i = 0; i < nodos; i++) {
      for (var j = 0; j < nodos; j++) {
        matriz[i][j] = await this.obten_val(nod[i], nod[j], ar_id);
      }
    }
    return matriz
  }
  origen = async (matriz) => {
    var a = matriz[0].length;
    console.log(matriz)
    var nodos = [];
    for (var i = 0; i < a; i++) {
      var s = 0;
      for (var j = 0; j < a; j++) {
        s = s + matriz[j][i];
      }
      if (s == 0)
        nodos.push(i);
    }
    return nodos;
  }
  destino = async (matriz) => {
    var a = matriz[0].length;
    var nodos = [];
    for (var i = 0; i < a; i++) {
      var s = 0;
      for (var j = 0; j < a; j++) {
        s = s + matriz[i][j];
      }
      if (s == 0)
        nodos.push(i);
    }
    return nodos;
  }
  obten_val(nodo_x, nodo_y, a) {
    var temp_arista
    for (const arista of this.cy.filter('edge')) {
      temp_arista = arista['_private'].data
      if (temp_arista.source == nodo_x && temp_arista.target == nodo_y) {
        return parseInt(temp_arista.value);
      }
    }
    return 0;
  }
  modificar_mat = async (matriz, origen, destino) => {
    var aux = new Array(destino.length);
    for (var i = 0; i < destino.length; i++) {
      aux[i] = (matriz[origen[i]]);
    }
    for (var i = 0; i < origen.length; i++) {
      for (var j = 0; j < matriz[0].length; j++) {
        if (aux[i][j] == 0) {
          aux[i].splice(j, 1);
          j--;
        }
      }
    }
    return aux;
  }
  asignarTareas = async (matriz, opc) => {
    var nodoSolucion = await this.generaSolucion(matriz); // Generamos una solución por defecto
    var solucion = new Array(matriz.length); // Solución que vdevolvemos
    var cota = await this.calculaCotaAsociada(nodoSolucion);
    var agentesDisponibles = await this.inicializaArrayList(matriz); // Tenemos el conjunto de agentes en una estructura de datos
    var j = 0; // Contador para guiarnos sobre el nodoSolucion y nuestra solucion
    while (agentesDisponibles.length != 0) { // Mientras que la pila no esté vacía
      var vectorCotas = new Array(agentesDisponibles.length); // Nos declaramos un array de cotas
      for (var i = 0; i < vectorCotas.length; i++) { // Rellenamos el array de cotas
        let temp = agentesDisponibles[i];
        nodoSolucion[j] = matriz[temp][j];
        vectorCotas[i] = await this.calculaCotaAsociada(nodoSolucion);
      }
      var posicion = await this.getPosicionMejorAgente(vectorCotas, opc); // Nos quedamos con el mejor valor (el que hace que la cota sea menor)
      nodoSolucion[j] = matriz[agentesDisponibles[posicion]][j];
      solucion[j] = agentesDisponibles[posicion]; // Lo incluimos en nuestra solución
      agentesDisponibles.splice(posicion, 1); // Lo eliminamos de la pila
      j++;
    }
    return solucion;
  }
  // Construimos un nodo solución para poder comprar los valores con él
  generaSolucion = async (matriz) => {
    var solucion = new Array(matriz.length);
    var j = 0;
    for (let i = 0; i < solucion.length; i++) {
      solucion[i] = matriz[i][j];
      j++;
    }
    return solucion;
  }
  // Generamos la pila con la información sobre los agentes
  inicializaArrayList = async (matriz) => {
    var solucion = new Array();
    for (var i = 0; i < matriz.length; i++)
      solucion.push(i);
    return solucion;
  }
  // Calculamos la cota asociada a un nodo
  calculaCotaAsociada = async (nodo) => {
    var sol = 0;
    for (var i = 0; i < nodo.length; i++)
      sol += nodo[i];
    return sol;
  }
  // Extraemos al mejor agente
  getPosicionMejorAgente = async (vectorCotas, opc) => {
    var posicion = 0;
    var valor = vectorCotas[0];
    for (var i = 1; i < vectorCotas.length; i++) {
      if (opc == 1) {
        if (valor < vectorCotas[i]) {
          valor = vectorCotas[i];
          posicion = i;
        }
      }
      else {
        if (valor > vectorCotas[i]) {
          valor = vectorCotas[i];
          posicion = i;
        }
      }
    }
    return posicion;
  }

  noroeste = () => {
    this.props.history.push('/noroeste')
  }


  /* RENDER DE LA PANTALLA */
  render() {
    return (
      <div className="App">

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <span className="navbar-brand">ALGORITMOS</span>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <span className="nav-link" onClick={this.showMatrix}>Ver Matriz<span className="sr-only">(current)</span></span>
              </li>
              <li className="nav-item">
                <span className="nav-link" onClick={this.solucion}>Solución Jhonson</span>
              </li>
              <li className="nav-item dropdown">
                <span className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Asignación
                  </span>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <span className="dropdown-item" onClick={this.asigMini}>Minimizar</span>
                  <span className="dropdown-item" onClick={this.asigMax}>Maximizar</span>
                </div>
              </li>
              <li className="nav-item">
                <span className="nav-link" onClick={this.noroeste}>Noroeste</span>
              </li>
            </ul>
          </div>
        </nav>
        <div className='container'>

          {/* CARD PARA PONER LOS NODOS Y LAS ARISTAS */}
          <div className='card my-3'>
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

            {/* MODAL PARA PEDIR EL CAMBIO DE LA VARIABLE DEL NODO O DE LA ARISTA */}
            <Modal show={this.state.show} handleClose={this.hideModal}>
              Ingrese el valor: <br /><br />
              <input type='text' onChange={this.onChange} ></input><br /><br />
            </Modal>

            {/* MODAL DE LA MATRIZ DE ADYACENCIA */}
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