const express = require("express");
const mysql = require("mysql");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");//Paso 1.1.1
const mysqlSession = require("express-mysql-session");//Paso 1.1.2
const config = require("./config");
const daoTasks = require("./dao_tasks");
const daoUsers = require("./dao_users");
const taskUtils = require("./task_utils");

const MySQLStore = mysqlSession(session);//Pso 1.2 Permite sesiones con mysql
const sessionStore = new MySQLStore({//Paso 1.3 Conexion de session con la bd
    database: config.mysqlConfig.database,
    host: config.mysqlConfig.host,
    user: config.mysqlConfig.user,
    password: config.mysqlConfig.password
});

const middlewareSession = session({//paso 1.4.1
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});


const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(middlewareSession);  //Paso 1.4.2

/*Paso 3.1 Middleware que verica si no hay currentUser
 se asegura que para poder entrar a la pagina tareas de usuario@ucm.
 se haya loggueado*/
function verifyUser(request,response,next){
    if(request.session.currentUser===undefined){
        response.redirect('/login.html');
    }else{
        next();
    }
}
/*Paso 3.2 Middleware que verifica si existe un currentUser
 se asegura de que si hay un currentUser no necesite hacer login
 */
function verifyNoUser(request,response,next){
    if(request.session.currentUser!==undefined){
        response.redirect('/tasks');
    }else{
        next();
    }
}

let pool = mysql.createPool({
    database: config.mysqlConfig.database,
    host: config.mysqlConfig.host,
    user: config.mysqlConfig.user,
    password: config.mysqlConfig.password
});

let daoT = new daoTasks.DAOTasks(pool);
let daoU = new daoUsers.DAOUsers(pool);



/******ENTREGABLE 7******/
app.get('/login.html',verifyNoUser,function(request, response){//Paso 2.0 la peticion sin datos
    //console.log(request.session.errorMsg);
    response.render('login', {errorMsg:request.session.errorMsg });//Paso 2.1
});

app.post('/login',verifyNoUser,function(request, response){//Paso 2.3 procesar datos de peticion
  //paso 2.4llama a la funcion de dao_users para verificar
    daoU. isUserCorrect(request.body.mail,request.body.pass,(err, result) =>{
        if (err) {
            console.error(err);
        } else if (result) { //2.5.1 guarda id y redirecciona la pagina principal de listas tareas
            request.session.currentUser=request.body.mail;
            response.redirect('/tasks');
        } else { //2.5.2 asigna errorMsg y redirreciona al login.html porque no esta en la bd
            request.session.errorMsg="Usuario y/o contraseña incorrectos";
            response.redirect('/login.html');
    }
  });
    
});

/*Paso 2.6 Modificar la version de  "/task* evaluando si tenemos usuario o no
 y asignarle el request.session.currentUser al tareas.ejs
 */
app.get('/tasks',verifyUser, function(request, response) { 
       //2.6 El usuario existe, busca las tareas en la bd segun el 
       //request.session.currentUser
       //y se las asignaal ejs  junto con el username
       daoT.getAllTasks(request.session.currentUser, (err, tasks) => {
       if (err) {
            console.error(err);
        } else {
           response.render('tasks', {username:request.session.currentUser,
                                                                taskList:tasks });
        }
    });
     
});

app.get('/imagenUsuario',verifyUser,function(request,response){
      daoU.getUserImageName(request.session.currentUser,
                function(err,result){
                    let dir;
                    if(err){
                         console.error(err);
                     }else if(result===undefined){
                        dir=__dirname+'/public/img/NoPerfil.png';
                        
                     }else if(result!==undefined){
                         dir=__dirname+'/profile_imgs/'+result;
                        
                     }
                    response.sendFile(dir); 
             } );    
});
/*Paso 2.7 Que la app olvide la session creada */
app.get('/logout',verifyUser, function(request,response){
    request.session.destroy();
    response.redirect('/login.html');
});

app.post('/addTask',verifyUser, function(request, response) { 
    
    let task=taskUtils.createTask(request.body.taskText);
    task.done=0; 
    console.log(task.tags.length);
    daoT.insertTask(request.session.currentUser, task, (err) => {
            if (err) {
                console.error(err);
            } else {
                //console.log("Elemento insertado correctamente");
                response.redirect('/tasks');//paso 4.5 Redirecciona a la pagina de tareas
            }
    });
    
});

app.get('/finish',verifyUser, function(request, response){
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

app.get('/deleteCompleted',verifyUser, function(request, response){
    
    daoT.deleteCompleted(request.session.currentUser,(err)=>{
        if(err){
            console.error(err);
        }else{
            console.log("Elemento modificado");
            response.redirect('/tasks');//paso 5.1 Redireccionas al inicio 
        }
    });
});
/******FIN ENTREGABLE 7******/

app.listen(config.port, function (err) {
    if (err) {
        console.log("No se ha podido iniciar el servidor.");
        console.log(err);
    } else {
        console.log(`Servidor escuchando en puerto ${config.port}.`);
    }
});