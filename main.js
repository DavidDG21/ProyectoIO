const formulario1=document.getElementById('formulario1');
const inputs1=document.getElementById('nameNodo');

const formulario2=document.getElementById('formulario2');
const input2=document.querySelectorAll('#formulario2 input')
const dateilNodes=document.getElementById('detailNodes')

const runBtn=document.getElementById('runBtn')

//capturamos la cantidad de nodos a tener
formulario1.addEventListener('submit', (e)=>{
    e.preventDefault();
    //obtenemos el valor del input
    let valor=inputs1.value;        
    crearArray(valor);
    //limipamos el valor del input
    formulario1.reset();
    console.log(valor);
})       

//creamos el array bidimensional vacio
let matrizAD;
function crearArray(valor) {
    valor=parseInt(valor)
    matrizAD=new Array(valor);
    for(let i=0;i<matrizAD.length;i++){
    matrizAD[i]= new Array(valor);
    }           
}

let cantidadAristas=0;
//capturamos las aristas
formulario2.addEventListener('submit', (e)=>{
    e.preventDefault();

    let nodoOrigen,nodoDestino,pesoNodo;
    input2.forEach(val=>{
        if(val.name==="nodoOrigen"){
            nodoOrigen =val.value;                    
        };
        if(val.name==="nodoDestino"){
            nodoDestino=val.value;
        };
        if(val.name==="pesoNodo"){
            pesoNodo=val.value;                    
        }                                         
    })
    
    //llenamos la matriz con los datos ingresados por los inputs
    matrizAD[parseInt(nodoOrigen)][parseInt(nodoDestino)]=parseInt(pesoNodo); 
    cantidadAristas++;
    formulario2.reset();
})

//empezamos a correr los graficos y tambien el camino mas corto
runBtn.addEventListener('click',(e)=>{           
    //llamamos al metodo rellenar matriz para completar con 0 y el infinito(9999999)
    matrizAD=rellenarMatriz(matrizAD);
    //Armamos los datos mediante el metodo armarDatos para mandar a la libreria de cytoscape
    let cadenaDatos=armarDatos(matrizAD);

    graficarGrafo(cadenaDatos);

    //Llamamos al metodo de floys para encontrar el camino mas corto, este retorna un string
    let resultadoFloyd=MetodoFloyd(matrizAD)
     
    //creamos un nuevo elemento 
    const ParrafoData=document.createElement("P");
    //Colocamos el resutaldo que nos devuelve el metodo de floyd 
    ParrafoData.textContent=resultadoFloyd;
    detailNodes.append(ParrafoData);
    
    console.log(resultadoFloyd)
})

let gua=[
{
"group": "nodes",
"data": {
    "id": "n0"
}
},
{
"group": "nodes",
"data": {
    "id": "n1"
}
},
{
"group": "nodes",
"data": {
    "id": "n2"
}
},
{
"group": "nodes",
"data": {
    "id": "n3"
}
},
{
"group": "nodes",
"data": {
    "id": "n4"
}
},
{
"group": "edges",
"data": {
    "id": "e0",
    "source": "n1",
    "target": "n2",
    "label": 321
}
},
{
"group": "edges",
"data": {
    "id": "e1",
    "source": "n1",
    "target": "n4",
    "label": 32
}
},
{
"group": "edges",
"data": {
    "id": "e2",
    "source": "n3",
    "target": "n2",
    "label": 12
}
} 
] 



function rellenarMatriz(matrizAD){
    for (let i=0; i<matrizAD.length; i++){
       for(let j=0;j<matrizAD.length;j++){
        if(i==j){
            matrizAD[i][j]=0;
        }
        if(matrizAD[i][j]==null){
            matrizAD[i][j]=99999999
        }
       }     
    }
    console.log(matrizAD);
    return matrizAD;
    
}

function armarDatos(matrizAD){
    let dataNodes=new Array(matrizAD.length);
    let dataEdges=new Array(cantidadAristas);
    let k=0;
    for(let i=0;i<matrizAD.length;i++){
        dataNodes[i]={
            group:"nodes",
            data:{id:`n${i}`}
        };
        for(let j=0;j<matrizAD.length;j++){
            if(matrizAD[i][j]!=null && matrizAD[i][j]!=99999999 && matrizAD[i][j]!=0){
                dataEdges[k]={
                    group: "edges",
                    data: { id:`e${k}`, source: `n${i}`, target: `n${j}`, label: matrizAD[i][j] } 
                };                    
            k++;                    
            }
        }
    }
    return dataNodes.concat(dataEdges);
}

let prueba=[[0,3,4,99999999,8,99999999],[99999999,0,99999999,99999999,5,99999999],[99999999,99999999,0,99999999,3,99999999],[99999999,99999999,99999999,0,99999999,99999999],[99999999,99999999,99999999,7,0,3],[99999999,99999999,99999999,2,99999999,0]]

function MetodoFloyd(array) {
    let vertices=parseInt(array.length);
    let matrizAdyacencia=array;
    let caminos=new Array(vertices);
    for(let i=0;i<caminos.length;i++){
        caminos[i]= new Array(vertices);
    } 
    let caminosAuxiliares=new Array(vertices);
    for(let i=0;i<caminosAuxiliares.length;i++){
        caminosAuxiliares[i]= new Array(vertices);
    }
    let i,j,k,caminoRecorrido="", cadena="", caminitos="", temporal1, temporal2, temporal3, temporal4, minimo;
    //inicializamos con String vacio
    i=parseInt(i);
    j=parseInt(j);
    k=parseInt(k);
    for(i=0;i<vertices;i++){
        for(j=0;j<vertices;j++){
            caminos[i][j]="";
            caminosAuxiliares[i][j]="";
        }
    }

    for(k=0;k<vertices;k++){
        for(i=0;i<vertices;i++){
            for(j=0;j<vertices;j++){
                //asignamos los valores a nuestras variables temporales 
                temporal1=matrizAdyacencia[i][j];
                temporal2=matrizAdyacencia[i][k];
                temporal3=matrizAdyacencia[k][j];
                temporal4=temporal2+temporal3;
                //encontramos el valor minimo
                minimo=Math.min(temporal1,temporal4)
                if(temporal1!=temporal4){
                    if(minimo==temporal4){
                        caminoRecorrido="";
                        caminosAuxiliares[i][j]=k+"";
                        //asignamos un metodo recursivo caminosR, recibe 4 parametros
                        caminos[i][j]=caminosR(i,k,caminosAuxiliares, caminoRecorrido)+(k+1);
                    }
                }
                matrizAdyacencia[i][j]=parseInt(minimo);
            }
        }
    }

    //Agregando el camino minimo a la cadena concatenandolo
    for(i=0;i<vertices;i++){
        for(j=0;j<vertices;j++){
            cadena+="["+matrizAdyacencia[i][j]+"]";
        }
        cadena+="\n";
    }

    //mostrar el recorrido
    for(i=0;i<vertices;i++){
        for(j=0;j<vertices;j++){
            //aqui comprobamos si existe la ruta adyacente, sino no se mostrara
            if(matrizAdyacencia[i][j]!=1000000000){
                //saber si estan en posiciones diferentes
                if(i!=j){
                    //comprobamos si esta vacio la cadena
                    if(caminos[i][j]==""){
                        caminitos+="De ("+(i+1)+"--->"+(j+1)+") Irse por...("+(i+1)+","+(j+1)+")\n"; 
                    }else{
                        caminitos+="De ("+(i+1)+"--->"+(j+1)+") Irse por...("+(i+1)+","+caminos[i][j]+","+(j+1)+")\n"; 
                    }
                }
            }
        }
    }
    
    return "La matriz de caminos más cortos entre los diferentes vértices es:\n"+cadena+
        "\nLos diferentes caminos mas cortos entre vertices son:\n"+caminitos;

}

function caminosR(i,k,caminosAuxiliares,caminoRecorrido) {
    //comprobamos si la matriz caminosauxiliares esta vacio
    if(caminosAuxiliares[i][k]==""){
        return "";//no retorna nada
    }else{
        caminoRecorrido+=caminosR(i,parseInt(caminosAuxiliares[i][k]), caminosAuxiliares, caminoRecorrido)+(parseInt(caminosAuxiliares[i][k])+1)+", ";//convertimos a entero
        return caminoRecorrido;
    }
}

//console.log(MetodoFloyd(prueba));


/*************************************
    Dibujar el grafo t_t        
  ************************************************************************************************/
function graficarGrafo(cadenaDatos){
    let cy = cytoscape({
    container: document.getElementById("cy"), // container to render in

    elements: [   
    ],

    style: [    
        {
        selector: "node",
        style: {
            "background-color": "#69e",
            label: "data(id)"
        }
        },

        {
        selector: "edge",
        style: {
            width: 1,
            "line-color": "#369",
            "target-arrow-color": "#369",
            "target-arrow-shape": "triangle",
            label: "data(label)",
            "font-size": "14px",
            color: "#777"
        }
        }
    ],

    style: cytoscape
        .stylesheet()
        .selector("edge")
        .css({
        width: 3,
        "line-color": "#369",
        "target-arrow-color": "#369",
        "target-arrow-shape": "triangle",
        label: "data(label)",
        "font-size": "14px",
        color: "#777"
        })
        .selector("node")
        .css({
        content: "data(id)",
        "text-valign": "center",
        color: "white",
        "text-outline-width": 2,
        "text-outline-color": "#888",
        "background-color": "#888"
        })
        .selector(":selected")
        .css({
        "background-color": "black",
        "line-color": "black",
        "target-arrow-color": "black",
        "source-arrow-color": "black",
        "text-outline-color": "black"
        })
    });

    cy.add(cadenaDatos);

    var layout = cy.elements().layout({
    name: 'random'
    });

    layout.run();
    }

    cy.on("click", "node", function (evt) {
    var node = evt.target;
    console.clear();
    console.log(node.position());
    });

    var dijkstra = cy.elements().dijkstra("#n1", function (edge) {
    return edge.data("label");
    });
    console.log(dijkstra.pathTo(cy.$("#n5")));
    console.log(dijkstra.distanceTo(cy.$("#n5")));
    var p = dijkstra.pathTo(cy.$("#n5"));

    let i = 0,
    tick = 250;

    (function () {
    if (i < p.length) {
        cy.$("#" + p[i]._private.data.id).select();
        i++;
        setTimeout(arguments.callee, tick);
    }
    })();                   
