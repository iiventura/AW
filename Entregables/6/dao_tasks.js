"use strict";


/**
 * Proporciona operaciones para la gestión de tareas
 * en la base de datos.
 */
class DAOTasks {
    /**
     * Inicializa el DAO de tareas.
     * 
     * @param {Pool} pool Pool de conexiones MySQL. Todas las operaciones
     *                    sobre la BD se realizarán sobre este pool.
     */
    constructor(pool) {
        this.pool = pool;
    }


    /**
     * Devuelve todas las tareas de un determinado usuario.
     * 
     * Este método devolverá (de manera asíncrona) un array
     * con las tareas de dicho usuario. Cada tarea debe tener cuatro
     * atributos: id, text, done y tags. El primero es numérico, el segundo
     * una cadena, el tercero un booleano, y el cuarto un array de cadenas.
     * 
     * La función callback ha de tener dos parámetros: un objeto
     * de tipo Error (si se produce, o null en caso contrario), y
     * la lista de tareas (o undefined, en caso de error).
     * 
     * @param {string} email Identificador del usuario.
     * @param {function} callback Función callback.
     */
    getAllTasks(email, callback) {
        if(callback===undefined) callback=function(){};
        
        this.pool.getConnection(function(error,conexion){
            if(error){
                callback(error);
            }else{
                let sql="SELECT * "+
                        "FROM task "+
                        "LEFT JOIN tag ON task.id = taG.taskId";
                conexion.query(sql,[email],
                function(error,result){
                    conexion.release();
                    if(error){
                        callback(error);
                    }else{
                        let array=new Array();
                        result.forEach(function(elemento){
                            //console.log(elemento);
                            //Verifica si ya el elemento fue evaluado
                            let existe=array.some(function(e){
                                return e.id===elemento.id;
                            });
                            
                            if(!existe){
                                let final=new Object();
                                //Obtenemos los tags que le pertenecen y filtramos
                                let tags=result.map(function(task){
                                    if(task.id===elemento.id)
                                        return task.tag;
                                });
                                
                                tags=tags.filter(function(e){return e!==undefined;});
                                
                               final.id=elemento.id;
                               final.user=elemento.user;
                               final.text=elemento.text;
                               final.done=elemento.done;
                               final.tags=tags;
                               
                               array.push(final);
                                
                            }
                         
                            
                        });
                        callback(null,array);
                    }
                });
                
            }
        });

    }

    /**
     * Inserta una tarea asociada a un usuario.
     * 
     * Se supone que la tarea a insertar es un objeto con, al menos,
     * dos atributos: text y tags. El primero de ellos es un string con
     * el texto de la tarea, y el segundo de ellos es un array de cadenas.
     * 
     * Tras la inserción se llamará a la función callback, pasándole el objeto
     * Error, si se produjo alguno durante la inserción, o null en caso contrario.
     * 
     * @param {string} email Identificador del usuario
     * @param {object} task Tarea a insertar
     * @param {function} callback Función callback que será llamada tras la inserción
     */
    insertTask(email, task, callback) {
        if(callback===undefined) callback=function(){};
        
        this.pool.getConnection(function(error,conexion){
            if(error){
                callback(error);
            }else{
                let sql="INSERT INTO `task`(`id`, `user`, `text`, `done`)"+
                        "VALUES (NULL,?,?,?)";
                
                conexion.query(sql,[email,task.text,task.done],
                    function(error,result){
                        if(error){
                            callback(error);
                        }else{ 
                           sql="INSERT INTO tag(taskId, tag) VALUES ";
                            let data=new Array();
                            
                            for(let i=0;i<task.tags.length;i++){
                                data.push(result.insertId);
                                data.push(task.tags[i]);
                                if(i===task.tags.length-1)
                                   sql+="(?,?)";
                                else
                                   sql+="(?,?),";
                            }
                           //console.log(sql); //la sentencia necesaria para insertar varios
                           //console.log(data);//el array de valores de ? sustitutos 
                           //Solo llamas error porque no necesitas el valor de la inserccion
                            conexion.query(sql,data,function(error){
                                conexion.release();//se cierra la conexion en este momento
                                if(error)
                                    callback(error);
                                else{
                                    callback(null);
                                }
                            });
                            
                        }
                    });
            }
        });
    }

    /**
     * Marca la tarea indicada como realizada, estableciendo
     * la columna 'done' a 'true'.
     * 
     * Tras la actualización se llamará a la función callback, pasándole el objeto
     * Error, si se produjo alguno durante la actualización, o null en caso contrario.
     * 
     * @param {object} idTask Identificador de la tarea a modificar
     * @param {function} callback Función callback que será llamada tras la actualización
     */
    markTaskDone(idTask, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) { callback(err); return; }
            connection.query(
                "UPDATE task SET done = 1 WHERE id = ?",
                [idTask],
                (err) => {
                    connection.release();
                    callback(err);
                }
            );
        });
    }

    /**
     * Elimina todas las tareas asociadas a un usuario dado que tengan
     * el valor 'true' en la columna 'done'.
     * 
     * Tras el borrado se llamará a la función callback, pasándole el objeto
     * Error, si se produjo alguno durante la actualización, o null en caso contrario.
     * 
     * @param {string} email Identificador del usuario
     * @param {function} callback Función llamada tras el borrado
     */
    deleteCompleted(email, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) { callback(err); return; }
            connection.query(
                "DELETE FROM task WHERE user = ? AND done = 1",
                [email],
                (err) => {
                    connection.release();
                    callback(err);
                }
            );
        });
    }
}

module.exports = {
    DAOTasks: DAOTasks
};