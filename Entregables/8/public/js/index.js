"use strict";

/*
 * Manejador que se ejecuta cuando el DOM se haya cargado.
 */
$(() => {
    // Solicita al servidor la lista de tareas, y la muestra en la página
    loadTasks();

    // Cuando se pulse alguno de los botones 'Eliminar', se llamará a
    // la función onRemoveButtonClick
    $("div.tasks").on("click", "button.remove", onRemoveButtonClick);

    // Cuando se pulse el botón de 'Añadir', se llamará a la función
    // onAddButtonClick
    $("button.add").on("click", onAddButtonClick);
});

/*
 * Convierte una tarea en un elemento DOM.
 *  
 * @param {task} Tarea a convertir. Debe ser un objeto con dos atributos: id y text.
 * @return Selección jQuery con el elemento del DOM creado
 */
function taskToDOMElement(task) {
    let result = $("<li>").addClass("task");
    result.append($("<span>").text(task.text));
    result.append($("<button>").addClass("remove").text("Eliminar"));
    result.data("id", task.id);
    return result;
}

function loadTasks() {
    $.ajax({
        method:"GET",
        url:"/tasks",
        success:function(data, textStatus, jqXHR){
          let ul=$(".tasks ul .newTask"); //apunta al li de newtask
          
     
            data.forEach((e)=>{
                ul.before(taskToDOMElement(e));
            });
            
        },
         error:function(jqXHR, textStatus, errorThrown) {
             console.log("Se ha producido un error cargando tareas");
        }
    });
}

function onRemoveButtonClick(event) {
    // Obtenemos el botón 'Eliminar' sobre el que se ha
    // hecho clic.
    let selected = $(event.target);

    // Obtenemos el elemento <li> que contiene el botón
    // pulsado.
    let liPadre = selected.parent();

    
   
    // Implementar el resto del método aquí.
     $.ajax({
        method:"DELETE",
        url:"/tasks/"+liPadre.data("id"),//.data(id) busca el id asigando en el load
        success:function(data, textStatus, jqXHR){
            liPadre.remove();
        },
        error:function(jqXHR, textStatus, errorThrown) {
             console.log("Se ha producido un error eliminando la tarea");
        }
    });
}

function onAddButtonClick(event) {
    let info=$("[type=\"text\"]").val();
    console.log(info);
    if(info!==""){
     $.ajax({
        method:"POST",
        url:"/tasks",
        data: JSON.stringify({ text: info }),
        contentType: "application/json",
        success:function(data,textStatus, jqXHR){
            console.log(data);
        $(".newTask").before(taskToDOMElement(data));    
        },
        error:function(jqXHR, textStatus, errorThrown) {
            alert("Se produjo un error creando la tarea");
        }
    });}
}

