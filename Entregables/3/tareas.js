/**
 * ============================
 * Ejercicio entregable 3.
 * Funciones de orden superior.
 * ============================
 * 
 * Puedes ejecutar los tests ejecutando `mocha` desde el directorio en el que se encuentra
 * el fichero `tareas.js`.
 */
"use strict";

/*
  arrays de objetos dodne se van a aplicar las funciones
  tipos de variables: text,tags,done declarad o dentro del array {...}
*/
let listaTareas = [
  { text: "Preparar práctica PDAP", tags: ["pdap", "practica"] },
  { text: "Mirar fechas congreso", done: true, tags: [] },
  { text: "Ir al supermercado", tags: ["personal"] },
  { text: "Mudanza", done: false, tags: ["personal"] },
];

/**
 * 1.  Escribe una función getToDoTasks(tasks) que devuelva un array con los textos de aquellas tareas
    de la lista de tareas tasks que no estén 1nalizadas.

    utilizamso filter y map
 */
function getToDoTasks(tasks) {
    
    /*
        //Reduce los elementos que done!=true
        tasks=tasks.filter(function(elemento){ 
            return elemento.done!==true;});
        //Devuelve un array que tiene solo los text
        tasks=tasks.map(function(elemento){
            return(elemento.text);
        });

        return tasks;
    */

  var textoTarea = new Array();

  tasks = tasks.filter(function(tarea){ 
      return tarea.done !== true;
  });//filter

  tasks.map(function(tarea){   //map recorre cada elemento del array
    textoTarea.push(tarea.text);
  });//map

    return textoTarea; //devolvemos el array modificado, si no se devuelve no se muestra
}

/**
 * 2. Escribe una función findByTag(tasks, tag) que devuelve aquellas tareas del array tasks que
    contengan, en su lista de etiquetas, la etiqueta pasada como segundo parámetro.

    indexOf Devuelve el índice de la última aparición de elem en el .array, o -1 si no se encuentra.

    utilizamos filter e indexOf.
 */

function findByTag(tasks, tag) {
    
    /*
        tasks=tasks.filter(function(elemento){
            var x=elemento.tags;
            
            //Verifica que el tag este en el array de tags si existe lo retorna
            if(x.indexOf(tag)!==-1){
                return elemento;
            }
        });

        return tasks;
    
    */

  tasks = tasks.filter(function(tarea){  

    var elem=tarea.tags; //obtenemos de cada una de las tareas su tag
                                  //declaramos pos para ver el resultado de indexOf
    var pos = elem.indexOf(tag); //aplicamso indexof al elem comparado con el tag que nos pasan y el resultado lo guardamso en pos
         
    if(pos === 0)               //si es 0 indica que es = 
        return tasks;
  });//filter

    return tasks;         //devuevle solo el tag que coincida

}

/**
 * 3. Implementa una función findByTags(tasks, tags) que devuelva aquellas tareas del array tasks
    que contengan al menos una etiqueta que coincida con una de las del array tags pasado como
    segundo parámetro.
    
    some: Devuelve true si existe un elemento x en el array tal que f(x) devuelva true.

    utilizamso filter, some e indexOf.
 */
function findByTags(tasks, tags) {
    /*
     tasks=tasks.filter(function(elemento){
        //Los tags del elemento actual
        var x= elemento.tags;
        //Verifica cada uno de los tags en el elemento
        var exist=tags.some(function(tag){
            if(x.indexOf(tag)!==-1){
                return true;
            }else{
                return false;
            }
        });

        if(exist)return elemento; 
    });
  
    return tasks;
    
    */
    
    
  
  var coinciden = new Array();

  tasks = tasks.filter(function(tareas){

        var elem = tareas.tags;           

        elem.some(function(tags){ //hace la funcion si existe alguna de las palabras 

           var pos = elem.indexOf(tags);

           if(pos == 0)                   
              coinciden.push(tareas);
        })//some

          return coinciden;
    });

      return coinciden;
}

/**
 * 4. Implementa una función countDone(tasks) que devuelva el número de tareas completadas en
    el array de tareas tasks pasado como parámetro.
    
     reduce() aplica una función a un acumulador y a cada valor de un array (de izquierda a derecha) para reducirlo a un único valor.

    utilizamos reduce
 */
function countDone(tareas) {
   
   /*
      guardamos el valor de lo acumulado en total para luego poder retornarlo en countDone

      lo aplicamso sobre el parametro que nos pasan (lista de tareas) que tendra dos parametros:
        1º una funcion a la que le pasaremos el acumulador y el elemento actual que se tratará
        2º el valor inicial del acumulador

      devolvemos acumulador  que tiene el valor:
        acum + 1 (si el valor de done del elemento actual es true)
   */
  let total = tareas.reduce(function(acum,tareaAct){
   
    return acum + (tareaAct.done === true);

  },0);//reduce

      return total;
}

/**
 *5. Implementa una función createTask(texto) que reciba un texto intercalado con etiquetas, cada
  una consistente en una serie de caracteres alfanuméricos precedidos por el signo @. Esta función
  debe devolver un objeto tarea con su array de etiquetas extraídas de la cadena texto. El texto de
  la tarea resultante no debe contener las etiquetas de la cadena de entrada.

 */
function createTask(cadena) {
   /*
    //Separa el texto segun los @
    let partition=text.split("@");
    //Creamos una variable de tipo Objeto
    let task=new Object();
    let tags=new Array();
    
    partition.forEach(function(e){
        if(task.text===undefined){
            task.text=e.trim();
        }else{
        tags.push(e.trim());
    }
   task.tags=tags;   
    
  });
  return task;  
   */
    let listaTags = new Array();         //creamos el nuevo array de las tareas

    var cadenaText = cadena.split("@"); //dividimos hasta la primera concurrencia con el @
    var texto = cadenaText[0].trim();   //guardamos la parte sin @ en el text

    //busca cadenas empiezen por @ seguidas de letras y da igual si es M o m y 
    //puede buscar mas de una concurrencia en una misma cadena
    var corte = /@[a-z]+/gi;            
    var cadenasCumplenCorte = cadena.match(corte);       //aplicamos el filtro a la cadena y nos devuleve en un array las que lo cumplen

    for (var i = 0; i < cadenasCumplenCorte.length; i++) {  //guardamos cadenas con @
         listaTags[i] = cadenasCumplenCorte[i].trim().replace("@","");      //una forma de quitar el @   trim()espacios a ambos lados los quita  
        // listaTags[i] = listaTags[i].replace("@","");        //otra forma de quitar el @ 
    }
    
    //creamos el nuevo array donde guardamos el texto enla variable text y los tag las cadenas con @
    let array = [
      {text: texto, tags:listaTags}, 
    ];

     return array;
}


/*
  NO MODIFICAR A PARTIR DE AQUI
  Es necesario para la ejecución de tests
*/
module.exports = {
  getToDoTasks: getToDoTasks,
  findByTag: findByTag,
  findByTags: findByTags,
  countDone: countDone,
  createTask: createTask
}

/*
  imprimimos los resultados de cada funcion
*/

console.log(getToDoTasks(listaTareas));
console.log(findByTag(listaTareas, "personal"));
console.log(findByTags(listaTareas, ["personal", "pdap"]));
console.log(countDone(listaTareas));
console.log(createTask("Esto es una cadena @de @texto"));
console.log(createTask("Y por aquí va otra @personal"));

