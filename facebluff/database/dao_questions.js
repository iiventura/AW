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
    getAllQuestions:function(callback) {
        if(callback===undefined) callback=function(){};
        
         pool.getConnection(function(error,conexion){
            if(error){
                callback(error);
            }else{
                let sql="SELECT question.id_question, question.title "+
                        "FROM question order by Rand() LIMIT 5";
                let data=new Array();
                
                conexion.query(sql,[],
                function(error,result){
                    conexion.release();
                    if(error){
                        callback(error);
                    }else{      
                        result.forEach(function(elemento){
                       //nos aseguramos que estamso creando un objeto de tipo Question
                            data.push( new Question(elemento.id_question,elemento.title));                                                     
                        });
                        }
                        callback(null,data);
                });
            }
        });
    },
    
    userQuestionAnswer:function(infor,callback){
        
         pool.getConnection(function(error,conexion){
            if(error){
                callback(error);
            }else{
                
                let sql="SELECT myself.id_question FROM question, myself "+
                        " WHERE question.id_question = ? AND myself.id_question= ? AND myself.id_user = ? ";
                                
                conexion.query(sql,[infor.idQ,infor.idQ,infor.idU],function(error,result){
                    conexion.release();
                    if(error){
                        callback(error);
                    }else{ 
                        callback(null,result.length);
                    }
                });
            }
        });
        
    },
    
    titleOfTheQuestion:function(idQ,callback){
        
         pool.getConnection(function(error,conexion){
            if(error){
                callback(error);
            }else{
                let sql="SELECT question.title FROM question"+
                        " WHERE question.id_question = ? ";
                                
                conexion.query(sql,[idQ],function(error,result){
                    conexion.release();
                    if(error){
                        callback(error);
                    }else{ 
                        callback(null,result);
                    }
                });
            }
        });
        
    },
    
    
    idFriend:function(idU,callback){
        
         pool.getConnection(function(error,conexion){
            if(error){
                callback(error);
            }else{
                 let sql="SELECT have.id_friend "+ 
                        "FROM have WHERE have.id_user=? AND  have.request='accepted' "+
						"GROUP BY have.id_friend";
						
                conexion.query(sql,[idU],function(error,result){
                    conexion.release();
                    if(error){
                        callback(error);
                    }else{ 
                        callback(null,result);
                    }
                });
            }
        });
        
    },
    friendAnswerQuestion:function(listaID_Amigos,callback){
        
         pool.getConnection(function(error,conexion){
            if(error){
                callback(error);
            }else{
                 let sql="SELECT id_user FROM myself "+
                            "WHERE  id_user=? AND "+
                            " id_question=? "+ 
                            "GROUP by id_user";
                
                conexion.query(sql,listaID_Amigos,function(error,result){
                    conexion.release();
                    if(error){
                        callback(error);
                    }else{ 
                        let idU=new Array();
                         
                        for (var i = 0; i < result.length; i++) {
                            idU.push(result[i].id_user);
                        }
                        
                        callback(null,idU);
                    }
                });
            }
        });
        
    },
      friendTableOther:function(lista_IDU_idF_idQ,callback){
                
        pool.getConnection(function(error,conexion){
            if(error){
                callback(error);
            }else{
                 let sql="SELECT other.id_friend FROM other where other.id_user =? AND "+
                         " other.id_friend =? AND other.id_question =?";
                
                conexion.query(sql,lista_IDU_idF_idQ,function(error,result){
                    conexion.release();
                    if(error){
                        callback(error);
                    }else{ 
                        
                        let amigosTablaOther=new Array();
                        for (var i = 0; i < result.length; i++) {
                            amigosTablaOther.push(result[i].id_friend);
                        }
                        callback(null,amigosTablaOther);
                    }
                });
            }
        });
        
    },
    lastIdAnswer:function(callback){
        if(callback===undefined) callback=function(){};
        
        pool.getConnection((error,conexion)=>{
            if(error){
                callback(error);
            }else{
               
                let sql="SELECT answer.id_answer FROM answer WHERE answer.id_answer "+
                        "= (SELECT MAX(answer.id_answer) from answer)";
                
                 conexion.query(sql,[],(error,result)=>{
                     conexion.release();
                     if(error){
                         callback(error);
                     }else{
                         callback(null, result[0].id_answer);
                     }
                 });
            }
        });   
    }
    
    
 };
 
 function Question(id,title){
    this.id =id;
    this.title =title;
}
/*
    insertQuestion:function(question,callback){
        if(callback===undefined) callback=function(){};
        
        pool.getConnection((error,conexion)=>{
            if(error){
                callback(error);
            }else{
               
                let sql="INSERT INTO question (id_question, title, n_options) VALUES (NULL,?,?)";
                conexion.query(sql,[ question.title,question.n_options],(error,result)=>{
                    if(error){
                        callback(error);
                    }else{
                        callback(null,result.insertId);
                    }
                });
            }
        });
    },
    
    insertAnswers:function(answers,callback){
        if(callback===undefined) callback=function(){};
        
        pool.getConnection((error,conexion)=>{
            if(error){
                callback(error);
            }else{
                let sql="INSERT INTO answer (id_answer, id_question, title, truth) VALUES ";
                
                let data=new Array();
                for (var i = 0; i < answers.options.length; i++) {
                    data.push(answers.id); 
                    var op = answers.options[i].toString();
                     data.push(op);
                     
                    if(answers.options[i] === answers.truth)
                        data.push(1);
                     else
                        data.push(0);
                                        
                    if(i===answers.options.length-1){
                        sql+="(NULL,?,?,?)";
                    }else{
                        sql+="(NULL,?,?,?),";
                    }
                }
                conexion.query(sql,data,(error,result)=>{
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
    
    getTittle:function(id,callback){
         pool.getConnection(function(error,conexion){
            if(error){
                callback(error);
            }else{
                let sql="SELECT question.title FROM question"+
                        " WHERE question.id_question = ? ";
                                
                conexion.query(sql,[id],function(error,result){
                    conexion.release();
                    if(error){
                        callback(error);
                    }else{
                        
                        callback(null,result[0].title);
                    }
                });
            }
        });
    },
    
    verifyUserAnswer:function(info,callback){
        pool.getConnection(function(error,conexion){
            if(error){
                callback(error);
            }else{
                
                let sql="SELECT myself.id_question FROM question, myself "+
                        " WHERE question.id_question = ? AND myself.id_question= ? AND myself.id_user = ? ";
                                
                conexion.query(sql,[info.idQ,info.idQ,info.idU],function(error,result){
                    conexion.release();
                    if(error){
                        callback(error);
                    }else{
                        if(result.length===0){
                            callback(null,false);//No Ha Contestado
                        }else{
                            callback(null,true);//Si ha contestado
                        }
                        
                    }
                });
            }
        });
    },
    
    setNewOtherAnswer:function(info,callback){
        if(callback===undefined)callback=function(){};
        
        pool.getConnection((error,conexion)=>{
            if(error){
                callback(error);
            }else{
                let sql="SELECT have.id_friend "+
                        "FROM have INNER JOIN myself ON have.id_friend=myself.id_user"
                        +" WHERE have.id_user=?";
                //Buscamos los amigos que han contestado esa pregunta
                conexion.query(sql,[info.idU],(error,myself)=>{
                    conexion.release();
                    if(error){
                        callback(error);
                    }else{
                        
                        sql="SELECT other.id_friend FROM other "+
                            "WHERE id_user=? AND id_question=?";
                    //Buscamos los amigos que ya estan en other para adivinar
                        conexion.query(sql,[info.idU,info.idQ],(error,other)=>{
                            if(error){
                                callback(error);
                            }else{
                                let total=new Array();
                                
                                other.forEach((friendO)=>{
                                    total=myself.filter((friendM)=>{
                                        return friendM.id_friend!==friendO.id_friend;
                                    });
                                });
                                let data=new Array();
                                total.forEach((e)=>{
                                    data.push(e.id_friend);
                                });
                                
                                callback(null, data);
                               
                            }
                        });
                        
                        
                    }
                });
            }
        });
    },
    
    lastIdAnswer:function(callback){
                
        if(callback===undefined) callback=function(){};
        
        pool.getConnection((error,conexion)=>{
            if(error){
                callback(error);
            }else{
               
                let sql="SELECT answer.id_answer FROM answer WHERE answer.id_answer "+
                        "= (SELECT MAX(answer.id_answer) from answer)";
                
                 conexion.query(sql,[],(error,result)=>{
                     conexion.release();
                     if(error){
                         callback(error);
                     }else{
                         callback(null, result[0].id_answer);
                     }
                 });
            }
        });   
    },
    
    insertOthers:function(info,others,callback){
        pool.getConnection((error,conexion)=>{
            if(error){
                callback(error);
            }else{
                let sql="INSERT INTO other (id_user, id_friend, id_question,"+
                        " id_answer) VALUES ";
                
                let data=new Array();
                for (var i = 0; i < others.length; i++) {
                    
                    
                     data.push(info.idU); 
                     data.push(others[i]);
                     data.push(info.idQ);
                     data.push(info.idA);
                                        
                    if(i===others.length-1){
                        sql+="(?,?,?,?)";
                    }else{
                        sql+="(?,?,?,?),";
                    }
                }
                
                conexion.query(sql,data,(error,result)=>{
                    if(error){
                        callback(error);
                    }else{
                        callback(null,true);
                    }
                });
            }
        });
    },
    
    friendsAnswered:function(){}*/