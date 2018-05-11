"use strict";

var mysql = require("mysql");
var config = require('.././config');

var pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.name
});

module.exports={
    isUserCorrect:function(email,password,callback){
        if(callback===undefined) callback=function(){};
        
        pool.getConnection((error,conexion)=>{
            if(error){
                callback(error);
            }else{
                let sql="SELECT id_user  FROM `user` WHERE email=? AND pass=?";
                
                conexion.query(sql,[email,password],(error,result)=>{
                    conexion.release();
                    if(error){
                        callback(error);
                    }else{
                        callback(null, result[0]);
                    }
                });
            }
        });   
    },
    
    insertUser:function(user,callback){
        if(callback===undefined) callback=function(){};
        
        pool.getConnection((error,conexion)=>{
            if(error){
                callback(error);
            }else{
                let sql;
                if(user.photo===null){
                    sql="INSERT INTO user (id_user, email, pass, name, sex, birthdate, points) VALUES (NULL,?,?,?,?,?,0)";
                }else{
                    sql="INSERT INTO user (id_user, email, pass, name, sex, birthdate, photo, points) VALUES (NULL,?,?,?,?,?,?,0)";
                }
                    let data=[user.email,user.pass,user.name, user.sex, user.birthdate,user.photo];
                
                conexion.query(sql,data,(error,result)=>{
                    conexion.release();
                    if(error){
                        callback(error);
                    }else{
                        callback(null,result.insertId);
                    }
                });
            }
        });
    },
    
    getUser:function(id,callback){
        if(callback===undefined) callback=function(){};
        
        pool.getConnection((error,conexion)=>{
            if(error){
                callback(error);
            }else{
                let sql="SELECT email,name,birthdate,points,photo FROM user WHERE id_user=?";
                
                conexion.query(sql,[id],(error, result)=>{
                   conexion.release();
                    if(error){
                        callback(error);
                    }else{
                        callback(null,result[0]);
                    }
                });
                
            }
        });
    },
    
    getImage:function(id,callback){
        if(callback===undefined) callback=function(){};
        
        pool.getConnection((error,conexion)=>{
            if(error){
                callback(error);
            }else{
                let sql="SELECT photo FROM user WHERE id_user= ?";
                
                conexion.query(sql,[id],(error,result)=>{
                    conexion.release();
                    if(error){
                        callback(error);
                    }else{
                        if(result[0].length === 0){
                            callback(null,undefined);
                        }else{
                            callback(null,result[0].photo);
                        }
                        
                    }
                });
                
            }
        });
    },
    
    verifyUser:function(email,callback){
        if(callback===undefined) callback=function(){};
        
        pool.getConnection((error,conexion)=>{
            if(error){
                callback(error);
            }else{
                let sql="SELECT email FROM user WHERE email= ?";
                
                conexion.query(sql,[email],(error,result)=>{
                    conexion.release();
                    if(error){
                        callback(error);
                    }else{
                        callback(null,result[0]);
                    }
                });
            }
        });
    },
    
    waitingUsers:function(id,callback){
        if(callback===undefined)callback=function(){};
        
        pool.getConnection((error,conexion)=>{
            if(error){
                callback(error);
            }else{
                let sql="SELECT have.id_friend, user.name, user.photo "+ 
                        "FROM have INNER JOIN user ON"+
                        " have.id_friend=user.id_user AND have.id_user= ? AND have.request='waiting'";
                
                conexion.query(sql,[id],(error,result)=>{
                    conexion.release();
                    if(error){
                        callback(error);
                    }else{
                        
                        let array=new Array();
                        result.forEach(function(friend){
                            if(friend.photo.length===0){
                                array.push(new Friend(friend.id_friend,friend.name,0));
                            }else{
                                array.push(new Friend(friend.id_friend,friend.name,1));
                            }
                            
                        });
                        
                       callback(null,array); 
                    }
                });

            }
        });
    },
    
    friends:function(id,callback){
        if(callback===undefined)callback=function(){};
        
        pool.getConnection((error,conexion)=>{
            if(error){
                callback(error);
            }else{
                let sql="SELECT have.id_friend, user.name, user.photo "+ 
                        "FROM have INNER JOIN user ON"+
                        " have.id_friend=user.id_user AND have.id_user= ? AND have.request='accepted'";
                
                conexion.query(sql,[id],(error,result)=>{
                    conexion.release();
                    if(error){
                        callback(error);
                    }else{
                        
                        let array=new Array();
                        result.forEach(function(friend){
                            if(friend.photo.length===0){
                                array.push(new Friend(friend.id_friend,friend.name,0));
                            }else{
                                array.push(new Friend(friend.id_friend,friend.name,1));
                            }
                        });
                        
                       callback(null,array); 
                    }
                });

            }
        });
    },
    
    acceptUser:function(id_user,id_guest,callback){
        if(callback===undefined) callback=function(){};
        
        pool.getConnection((error,conexion)=>{
            if(error){
                callback(error);
            }else{
                let sql="UPDATE have SET request='accepted' WHERE id_user= ? AND id_friend= ?";
                
                conexion.query(sql,[id_user,id_guest],(error,result)=>{
                    if(error){
                        callback(error);
                    }else{
                        sql="UPDATE have SET request='accepted' WHERE id_user= ? AND id_friend= ?";
                        
                        conexion.query(sql,[id_guest,id_user],(error,result)=>{
                            conexion.release();
                            if(error){
                                callback(error);
                            }else{
                                callback(null,true);
                            }
                        });
                    }
                });
            }
        });
    },
    
    rejectUser:function(id_user,id_guest,callback){
        if(callback===undefined) callback=function(){};
        
        pool.getConnection((error,conexion)=>{
            if(error){
                callback(error);
            }else{
                let sql="UPDATE have SET request='rejected' WHERE id_user= ? AND id_friend= ?";
                
                conexion.query(sql,[id_user,id_guest],(error,result)=>{
                    if(error){
                        callback(error);
                    }else{
                        sql="UPDATE have SET request='rejected' WHERE id_user= ? AND id_friend= ?";
                        
                        conexion.query(sql,[id_guest,id_user],(error,result)=>{
                            conexion.release();
                            if(error){
                                callback(error);
                            }else{
                                callback(null,true);
                            }
                        });
                    }
                });
            }
        });
    },
    
    requestUser:function(id_user,id_guest,callback){
         if(callback===undefined) callback=function(){};
        
        pool.getConnection((error,conexion)=>{
            if(error){
                callback(error);
            }else{
                let sql="UPDATE have SET request='requested' WHERE id_user= ? AND id_friend= ?";
                
                conexion.query(sql,[id_user,id_guest],(error,result)=>{
                    if(error){
                        callback(error);
                    }else{
                        sql="UPDATE have SET request='waiting' WHERE id_user= ? AND id_friend= ?";
                        
                        conexion.query(sql,[id_guest,id_user],(error,result)=>{
                            conexion.release();
                            if(error){
                                callback(error);
                            }else{
                                callback(null,true);
                            }
                        });
                    }
                });
            }
        });
    },
    
    createConnections:function(id,callback){
        if(callback===undefined) callback=function(){};
        
        pool.getConnection((error,conexion)=>{
            if(error){
                callback(error);
            }else{
                let sql="SELECT id_user FROM user WHERE id_user!= ?";
                
                conexion.query(sql,[id],(error,result)=>{
                    if(error){
                        callback(error);
                    }else{
                        sql="INSERT INTO have (id_user, id_friend) VALUES ";
                        let data=new Array();
                        if(result.length>0){
                            for(let i=0;i<result.length;i++){
                                data.push(id);
                                data.push(result[i].id_user);
                                data.push(result[i].id_user);
                                data.push(id);
                                
                                if(i===result.length-1){
                                    sql+="(?,?),(?,?)";
                                }else{
                                    sql+="(?,?),(?,?),";
                                }
                            }
                            
                            
                            conexion.query(sql,data,(error,result)=>{
                                if(error){
                                    callback();
                                }else{
                                    callback(null,true);
                                }
                            });
                        }else{
                            callback(null,true);
                        }
                    }
                    conexion.release();
                });
            }
        });
    },
    
    searchUsers:function(id,word,callback){
        if(callback===undefined) callback=function(){};
        
        pool.getConnection((error,conexion)=>{
            if(error){
                callback(error);
            }else{
                let sql="SELECT have.*, user.name, user.photo "+
                        "FROM have INNER JOIN user ON have.id_friend=user.id_user "+
                        "WHERE have.id_user= ? AND have.request!='accepted' AND have.request!='reject' "+
                        "AND have.request!='waiting' AND user.name like ?";
                
                conexion.query(sql,[id,word],(error,result)=>{
                    conexion.release();
                    if(error){
                        callback(error);
                    }else{
                        let data=new Array();
                        //console.log(result);
                        result.forEach((user)=>{
                            if(user.photo.length===0){
                                data.push(new User(user.id_friend,user.name, user.request,0));
                            }else{
                                data.push(new User(user.id_friend,user.name, user.request,1));
                            }
                            
                        });
                       
                        callback(null,data);
                    }
                });
            }
        });
    },
    
    modifyUser:function(user,callback){
        if(callback===undefined) callback=function(){};
        
        pool.getConnection((error,conexion)=>{
            if(error){
                callback(error);
            }else{
                
                let sql="UPDATE user SET pass=?,name=?,sex=?,"+
                            "birthdate=?,photo=?, points=? WHERE email= '"+user.email+"'";
                               
               let data=[user.pass,user.name, user.sex, user.bday,user.photo,user.points,user.email];
                conexion.query(sql,data,(error,result)=>{
                            if(error){
                                callback(error);
                            }else{
                                callback(null,true);
                            }
                });
            }
        });
    }
    
};

//Objeto de Tipo friend
function Friend(id,name, photo){
    this.id=id;
    this.name=name;
    this.photo=photo;
}

function User(id,name,request, photo){
    this.id=id;
    this.name=name;
    this.request=request;
    this.photo=photo;
}