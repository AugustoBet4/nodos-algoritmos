import React, { Component } from 'react';
import '../App.css';
import cytoscape from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
import edgehandles from 'cytoscape-edgehandles';
import { Router, Route, BrowserHistory, IndexRoute } from 'react-router';

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

    var nodos = this.cy.filter('node').length
    var aristas = this.cy.filter('edge').length
    var temp_nodo = ""
    var temp_arit = ""

    var nodos_dia = []
    var id_dia = []
    var nodos_posix = []
    var nodos_posiy = []

    for (const node of this.cy.filter('node')) {
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
  asigMini = () => {
    this.setState({ asigOpcion: 1 })
    this.asignacion()
  }
  asigMax = () => {
    this.setState({ asigOpcion: 0 })
    this.asignacion()
  }
  asignacion = () => {
    const opc = this.state.asigOpcion
    var aux_m = this.actualizar_mat()
    var aux_m2 = aux_m
    var iniciales = this.origen(aux_m)
    var finales = this.destino(aux_m)
    var valores = this.modificar_mat(aux_m2, iniciales, finales)
    aux_m = this.modificar_mat(aux_m2, iniciales, finales)
    var matriz = aux_m;
    var mensaje = "";
    var palabra = "";
    if (iniciales.length == finales.length) {
      if (opc == 1) {
        palabra = " máximo ";
        var max = this.max_mat(matriz, true);
        for (var i = 0; i < max.length; i++) {
          for (var j = 0; j < max.length; j++) {
            matriz[i][j] = matriz[i][j] - max[j];
          }
        }
        max = this.max_mat(matriz, false);
        for (var i = 0; i < max.length; i++) {
          for (var j = 0; j < max.length; j++) {
            matriz[j][i] = matriz[j][i] - max[j];
          }
        }
      }
      else {
        palabra = " mínimo ";
        var max = this.min_mat(matriz, true);
        for (var i = 0; i < max.length; i++) {
          for (var j = 0; j < max.length; j++) {
            matriz[i][j] = matriz[i][j] - max[j];
          }
        }
        max = this.min_mat(matriz, false);
        for (var i = 0; i < max.length; i++) {
          for (var j = 0; j < max.length; j++) {
            matriz[j][i] = matriz[j][i] - max[j];
          }
        }
      }
      mensaje = "";
      console.log(matriz)
      var mat_resultado = this.resultado(matriz);
      mat_resultado.sort();
      var attr = 0;
      var nod = new Array();
      for (const node of this.cy.filter('node')) {
        var temp_node = node['_private'].data
        nod.push(temp_node.name)
      }
      nod.sort();
      console.log(valores)
      for (j = 0; j < mat_resultado.length; j++) {
        mensaje = mensaje + "Del Nodo " + nod[iniciales[mat_resultado[j][0]]] + " al nodo " + nod[finales[mat_resultado[j][1]]] + " \n";
        attr += valores[mat_resultado[j][0]][mat_resultado[j][1]];
        console.log(valores[mat_resultado[j][0]][mat_resultado[j][1]])
      }
      alert("Las asignaciones es de:\n" + mensaje + "El valor" + palabra + "es de : " + attr);
    } else {
      alert("La matriz no es n*n")
    }
    //funcion para ver aristas que convergen y sacar el maximo de acuerdo a cada fila de la matriz
  }
  actualizar_mat() {
    var temp_nodo
    var temp_arista

    var nodos = this.cy.filter('node').length;
    var aristas = this.cy.filter('edge').length;
    var matriz = new Array(nodos);
    var nod = [];
    var ar_id = [];
    var i = 0
    for (const node of this.cy.filter('node')) {
      temp_nodo = node['_private'].data
      nod.push(temp_nodo.id)
      matriz[i] = new Array(nodos).fill(0);
      i++;
    }
    nod.sort();
    for (const arista of this.cy.filter('edge')) {
      temp_arista = arista['_private'].data
      ar_id.push(temp_arista.id)
    }
    for (var i = 0; i < nodos; i++) {
      for (var j = 0; j < nodos; j++) {
        matriz[i][j] = this.obten_val(nod[i], nod[j], ar_id);
      }
    }
    return matriz;
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
  origen(matriz) {
    var a = matriz[0].length;
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
  destino(matriz) {
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
  modificar_mat(matriz, origen, destino) {
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
  min_mat(m, opc) {
    var min;
    var mins = [];
    if (opc) {
      for (var i = 0; i < m[0].length; i++) {
        min = m[0][i];
        for (var j = 0; j < m[0].length; j++) {
          if (m[j][i] < min)
            min = m[j][i];
        }
        mins.push(min);
      }
    }
    else {
      for (var i = 0; i < m[0].length; i++) {
        min = m[i][0];
        for (var j = 0; j < m[0].length; j++) {
          if (m[i][j] < min)
            min = m[i][j];
        }
        mins.push(min);
      }
    }
    return mins;
  }
  max_mat(m, opc) {
    var max;
    var maxes = [];
    if (opc) {
      for (var i = 0; i < m[0].length; i++) {
        max = m[0][i];
        for (var j = 0; j < m[0].length; j++) {
          if (m[j][i] > max)
            max = m[j][i];
        }
        maxes.push(max);
      }
    }
    else {
      for (var i = 0; i < m[0].length; i++) {
        max = m[i][0];
        for (var j = 0; j < m[0].length; j++) {
          if (m[i][j] > max)
            max = m[i][j];
        }
        maxes.push(max);
      }
    }
    return maxes;
  }
  resultado(matriz) {
    var punto
    var i = this.contar_cero(matriz);
    var len_mat = matriz.length;
    i = this.actualiza_contador(i, len_mat);
    var res = new Array();
    do {
      punto = [i[0][1], i[0][2]];
      res.push(punto);
      i = this.elimina(i, i[0][1], i[0][2]);
      i = this.actualiza_contador(i, len_mat);
    }
    while (i.length > 1);
    punto = [i[0][1], i[0][2]];
    res.push(punto);
    return res;
  }
  contar_cero(matriz) {
    var c = new Array();
    for (var i = 0; i < matriz.length; i++) {
      for (var j = 0; j < matriz[0].length; j++) {
        if (matriz[i][j] == 0) {
          var x = new Array();
          x.push(0);
          x.push(i);
          x.push(j);
          c.push(x);
        }
      }
    }
    return c;
  }
  actualiza_contador(i, l) {
    var x = new Array(l);
    x.fill(0);
    for (var a = 0; a < i.length; a++) {
      x[i[a][1]] += 1;
    }
    var conta = 0;
    for (var b = 0; b < x.length; b++) {
      var aux = x[b];
      for (var c = 0; c < aux; c++) {
        i[conta][0] = aux;
        conta++;
      }
    }
    i.sort();
    return i;
  }
  elimina(mat, x, y) {
    var res = new Array();
    for (var i = 0; i < mat.length; i++) {
      if (mat[i][1] != x && mat[i][2] != y)
        res.push(mat[i]);
    }
    if (res.length == 0) {
      res = [];
      for (var i = 0; i < mat.length; i++) {
        if (mat[i][0] == mat[i][1]) {
          res.push(mat[i])

        }
      }
    }
    return res;
  }

  /* RENDER DE LA PANTALLA */
  render() {
    return (
      <div className="App">

        <div className='row'>
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

              </ul>
            </div>
          </nav>
        </div>
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