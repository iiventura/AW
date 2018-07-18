"use strict";


/**
 * Proporciona operaciones para la gestión de usuarios
 * en la base de datos.
 */
class DAOUsers {
    /**
     * Inicializa el DAO de usuarios.
     * 
     * @param {Pool} pool Pool de conexiones MySQL. Todas las operaciones
     *                    sobre la BD se realizarán sobre este pool.
     */
    constructor(pool) {
        this.pool = pool;
    }

    /**
     * Determina si un determinado usuario aparece en la BD con la contraseña
     * pasada como parámetro.
     * 
     * Es una operación asíncrona, de modo que se llamará a la función callback
     * pasando, por un lado, el objeto Error (si se produce, o null en caso contrario)
     * y, por otro lado, un booleano indicando el resultado de la operación
     * (true => el usuario existe, false => el usuario no existe o la contraseña es incorrecta)
     * En caso de error error, el segundo parámetro de la función callback será indefinido.
     * 
     * @param {string} email Identificador del usuario a buscar
     * @param {string} password Contraseña a comprobar
     * @param {function} callback Función que recibirá el objeto error y el resultado
     */
    isUserCorrect(email, password, callback) {
        if(callback===undefined) callback=function(){};
        
        this.pool.getConnection(function(error,conexion){
            if(error){
                callback(error);
            }else{
                let sql="SELECT email,password "+
                          "FROM `user`"+
                          "WHERE email = ? AND password = ?";
                
                conexion.query(sql,[email,password],
                    function(error,result){
                        conexion.release();
                        if(error){
                            callback(error);
                        }else{
                            callback(null,result[0]);
                        }
                });
            }
        });  
    }

    /**
     * Obtiene el nombre de fichero que contiene la imagen de perfil de un usuario.
     * 
     * Es una operación asíncrona, de modo que se llamará a la función callback
     * pasando, por un lado, el objeto Error (si se produce, o null en caso contrario)
     * y, por otro lado, una cadena con el nombre de la imagen de perfil (o undefined
     * en caso de producirse un error).
     * 
     * @param {string} email Identificador del usuario cuya imagen se quiere obtener
     * @param {function} callback Función que recibirá el objeto error y el resultado
     */
    getUserImageName(email, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) { callback(err); return; }
            connection.query("SELECT img FROM user WHERE email = ?",
            [email],
            (err, rows) => {
                if (err) { callback(err); return; }
                connection.release();
                if (rows.length === 0) {
                    callback(null, undefined);
                } else {
                    callback(null, rows[0].img);
                }
            });
        });
    }   
}

module.exports = {
    DAOUsers: DAOUsers
};