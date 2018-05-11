"use strict";
var pool = require('./pool');

module.exports={
   existUser:function(email, callback){
       if(callback===undefined)callback=function(){};
       
       pool.getConnection((err,conn)=>{
           if(err){
               callback(err);
           }else{
               let sql="SELECT  username FROM users WHERE username= ? ";
               conn.query(sql,[email],(err, result)=>{
                   conn.release();
                   
                   if(err) callback(err);
                   else if (result.length===0) callback(null,false);
                   else callback(null,true);
               });
               
           }
       });
   }, 
   
   newUser:function(user, pass,callback){
       if(callback===undefined)callback=function(){};
       
       pool.getConnection((err,conn)=>{
           if(err) callback(err);
           else{
               let sql="INSERT INTO users (username, password) VALUES (?,?)";
               
               conn.query(sql,[user,pass],(err,result)=>{
                   conn.release();
                   
                   if(err) callback(err);
                   else callback(null,true);
               });
           }
       });
   },
   
   verifyUser:function(user,pass,callback){
       if(callback===undefined)callback=function(){};
       
       pool.getConnection((err,conn)=>{
           if(err) callback(err);
           else{
               let sql="SELECT username, password"+
                       " FROM users WHERE username= ? AND password= ? ";
               conn.query(sql,[user,pass],(err,result)=>{
                    conn.release();
                 
                   if(err)callback(err);
                   else if (result.length===0) callback(null,false);
                   else callback(null,true);
                   
               });
           }
       });
   },
   
   getMatches:function(user,callback){
       if(callback===undefined)callback=function(){};
       
       pool.getConnection((err,conn)=>{
           if(err) callback(err);
           else{
               let sql="SELECT matches.idMatch, matches.name "+
                       "FROM matches JOIN play ON play.idMatch=matches.idMatch "+
                       "JOIN users ON users.idUser=play.idUser WHERE users.username= ?";
               
               conn.query(sql,[user],(err, result)=>{
                   conn.release();
                   if(err) callback(err);
                   else callback(null,result);
               });
           }
       });
   }
};

