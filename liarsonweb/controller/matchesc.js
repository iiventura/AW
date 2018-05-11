let dao=require('../database/dao');

module.exports={
    newmatch:function(request,response){
        dao.daoQ.addMatch(request.body.gamename,request.user,(err,id)=>{
            if(err){
                response.status(500);
                response.end();
            }else{
               dao.daoQ.joinMatch(id,request.user,(err,ok)=>{
                   if(err){
                       response.status(500);
                       response.end();
                   }else{
                       response.status(201);
                       response.end();
                   }
               });
            }
        });
        
    },
    
    joinmatch:function(request,response){
       let id=request.params.id;
      dao.daoQ.verifyNPlayers(id,(err,data)=>{
          if(err){
            response.status(500);
            response.end();
          }else if(data){ //Existe partida
              if(data.count>=4){
                   response.status(400);
                   response.end();
              }else{
                  
                  let user={
                      user:request.user,
                      cards:[]
                  };
                  
                  data.status.players.push(user);//agregamos al usuario 
                  
                  dao.daoQ.updateMatch(id,JSON.stringify(data.status),(err,ok)=>{
                      if(err){
                          console.log(err.message);
                      }else if(ok){
                          dao.daoQ.joinMatch(id,request.user,(err,ok)=>{
                                if(err){
                                    response.status(500);
                                    response.end();
                                }else{
                                    response.status(201);
                                    response.json({msg:"You have been successfully added to the match "});
                                }
                            });
                      }
                  });
              }
          }else{//No existe
            response.status(404);
            response.end();
          }
      });
    },
    
    statusmatch:function(request,response){
         let id=request.params.id;
        dao.daoQ.getStatus(id,request.user,(err,state)=>{
            if(err){
             response.status(500);
             response.end();
                
            }else if(state){
                response.status(201);
                response.json(state);
               
            }else{
                response.status(404);
                response.end();
            }
        });
    }
};


 