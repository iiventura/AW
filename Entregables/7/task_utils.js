/**
* A partir de un texto seguido de una serie de etiquetas de la forma
* @tag1, @tag2, etc., extrae las etiquetas, creando un objeto tarea
* como resultado.
*
* El objeto devuelto contiene dos atributos:
* - tags: un array con las etiquetas de la tarea.
* - text: la cadena de texto de entrada sin las etiquetas.
*
* @param {string} text Texto de la tarea, incluyendo etiquetas
*/
function createTask(text) {
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
}
module.exports = {
createTask: createTask
};
