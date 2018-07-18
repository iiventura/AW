const express = require("express");
const mysql = require("mysql");
const path = require("path");
const bodyParser = require("body-parser");
const config = require("./config");
const daoTasks = require("./dao_tasks");
const taskUtils = require("./task_utils");

const app = express();
/**PASO 3.0 : Asignar que la aplicacion trabaja con plantillas ejs**/
app.set("view engine", "ejs");
/*Paso 4.0 : Asignar el middleware BodyParser*/
app.use(bodyParser.urlencoded({ extended: false }));
/*fin paso 3.0*/
let pool = mysql.createPool({
    database: config.mysqlConfig.database,
    host: config.mysqlConfig.host,
    user: config.mysqlConfig.user,
    password: config.mysqlConfig.password
});

let daoT = new daoTasks.DAOTasks(pool);
/*******************PASO 2**************************************/
//proporcionar los recursos estaticos al cliente [carpeta public]
app.use(express.static(path.join(__dirname, 'public'))); 

//asignarle a la direccion web '/tasks' con metodo GET
app.get('/tasks', function(request, response) { 
    let username="usuario@ucm.es";
  //Paso 3.0 llamar a la base de datos y obtener las tareas
  daoT.getAllTasks(username, (err, tasks) => {
        if (err) {
            console.error(err);
        } else {
          
            //Paso 3.1 renderizar una ejs una vez obtenidas las tareas en el callback
           response.render('tasks', {username:username, taskList:tasks });
        }
    });
    
    
  //response.redirect('tasks.html');//Paso 2, redirecciona una html
});
/*fin del paso 2*/
/*****PASO 4.1 crear la direccion que procesara la nueva tarea*******/
app.post('/addTask', function(request, response) { 
    //console.log(request.body);//Imprime lo que se paso en el form
    
    let username="usuario@ucm.es";//paso 4.2 obtener el  nombre del usuario
    let task=taskUtils.createTask(request.body.taskText); //paso 4.3 obtener la tarea y sus tags
    task.done=0;//paso 4.4 asignamos por defecto que la tarea no esta 
   // console.log(task); //imprime la tarea que se inserta en la bd
    
    daoT.insertTask(username, task, (err) => {
            if (err) {
                console.error(err);
            } else {
                //console.log("Elemento insertado correctamente");
                response.redirect('/tasks');//paso 4.5 Redirecciona a la pagina de tareas
            }
    });
    
});
/**fin del paso 4**/

/***PASO 5 Crear la direccion para finalizar la tarea , input hidden por defecto es get****/
app.get('/finish', function(request, response){
    
    //console.log(request.query.id);//imprime el id del elemento que el cliente selleciono
    daoT.markTaskDone(request.query.id, (err)=>{ 
        if (err) {
            console.error(err);
        } else {
            console.log("Elemento modificado");
            response.redirect('/tasks');//paso 5.1 Redireccionas al inicio 
        }
    });
  
});
/******fin del paso 5******/
/***PASO 6 Eliminar tareas que ya estasn realizadas****/
app.get('/deleteCompleted', function(request, response){
    let username="usuario@ucm.es";
    daoT.deleteCompleted(username,(err)=>{
        if(err){
            console.error(err);
        }else{
            console.log("Elemento modificado");
            response.redirect('/tasks');//paso 5.1 Redireccionas al inicio 
        }
    });
});
/******fin del paso 5******/
app.listen(config.port, function (err) {
    if (err) {
        console.log("No se ha podido iniciar el servidor.");
        console.log(err);
    } else {
        console.log(`Servidor escuchando en puerto ${config.port}.`);
    }
});