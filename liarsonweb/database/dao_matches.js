"use strict";
var pool = require('./pool');

module.exports={
    addMatch:function(name,creator, callback){
        if(callback===undefined) callback=function(){};
        
        pool.getConnection((err,conn)=>{
            if(err) callback(err);
            else{
                 
                let match={
                    players:[{user:creator,cards:[]}],
                    status:"waiting"
                };
                let sql="INSERT INTO matches (name, status) VALUES ( ? , ?)";
                
                conn.query(sql,[name,JSON.stringify(match)],(err,result)=>{
                    conn.release();
                    if(err) callback(err);
                    else callback(null,result.insertId);
                });
            }
        });
    },
    
    joinMatch:function(idMatch,username, callback){
        if(callback===undefined) callback=function(){};
        
        pool.getConnection((err,conn)=>{
            if(err) callback(err);
            else{
                let sql="SELECT idUser FROM users WHERE username= ?";
                conn.query(sql,[username],(err, result)=>{
                    if(err) callback(err);
                    else{
                  
                        sql="INSERT INTO play (idUser, idMatch) VALUES (? , ? )";
                        conn.query(sql,[result[0].idUser,idMatch],(err,result2)=>{
                            if(err)callback(err);
                            else callback(null,true);
                        });
                    }
                });
            }
        });
    },
    
    verifyNPlayers:function(id,callback){
        if(callback===undefined) callback=function(){};
        
        pool.getConnection((err, conn)=>{
            if(err) callback(err);
            else{
                let sql ="SELECT matches.status FROM matches "+
                         "JOIN play ON play.idMatch=matches.idMatch"+
                         " WHERE play.idMatch= ? ";
                 
                conn.query(sql,[id],(err,result)=>{
                    conn.release();
                    if(err)callback(err);
                    
                    else if(result.length===0) callback(null,undefined);
                    
                   else if(result.length>0){
                       let match=new Object();
                       match.count=result.length;
                       match.status=JSON.parse(result[0].status);
                       callback(null,match);
                   }
                        
                    
                });
            }
        });
    },
    
    updateMatch:function(id,status,callback){
        if(callback===undefined)callback=function(){};
        
        pool.getConnection((err,conn)=>{
            if(err)callback(err);
            else{
                let sql="UPDATE matches SET matches.status= ? WHERE idMatch= ?";
                
                conn.query(sql,[status,id],(err,result)=>{
                    if(err) callback(err);
                    else callback(null,true);
                });
            }
        });
    },
    
    getStatus:function(idM, user,callback){
        if(callback===undefined) callback=function(){};
        
        pool.getConnection((err,conn)=>{
            if(err)callback(err);
            else{
                let sql="SELECT idUser FROM users WHERE username= ?";
                 
                 conn.query(sql,[user],(err,result)=>{
                     if(err) callback(err);
                     else {
                         //console.log(result[0].idUser);
                         
                         sql="SELECT matches.status FROM matches "+
                            "JOIN play ON play.idMatch=matches.idMatch "+
                            "JOIN users ON play.idUser=users.idUser "+
                            "WHERE users.idUser= ? AND matches.idMatch= ?";
                    
                         conn.query(sql,[result[0].idUser,idM],(err,result)=>{
                             if(err)callback(err);
                             else if(result.length===0)callback(null,undefined);
                             
                             else  callback(null,result[0]);
                         });
                     }
                 });
            }
        });
    }
};

