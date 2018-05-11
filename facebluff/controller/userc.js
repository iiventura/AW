let dao=require('../database/dao');


module.exports={
    logout:function(request,response){
        request.session.destroy();
        response.redirect('/');
    }, 
    
    profile:function(request,response){
       dao.daoU.getUser(request.session.idU,(error,result)=>{
           if(error){
               console.log(error);
           }else if(result){
               request.session.points=result.points;
               let user={
                   email:result.email,
                   name:result.name,
                   points:result.points,
                   bday:result.birthdate
               };
               
               if(result.photo.length===0){
                   request.session.photo=0;
               }else{
                   request.session.photo=1;
               }
               
               
               response.render('profile',{title:"Your Profile",user:user,
                          id:request.session.idU, photo:request.session.photo});
               
           }
       });
    },
    
    image:function(request,response,next){
        let n=request.params.id;
      
        if(isNaN(n)){
            response.status(400);
            response.end("Peticion incorrecta");
        
        }else{
           dao.daoU.getImage(n,(error,image)=>{
                if(image){
                    response.end(image);
                }else if(error){
                    console.log(error);
                }
            });
        }
    },
    
    friends:function(request,response){
        request.session.word=undefined;
        //Busca los usuarios que tienen request=waiting
        dao.daoU.waitingUsers(request.session.idU,(error,result)=>{
            if(error){
                console.log(error);
            }else{
               let waiting=result;
               
                //Busca los amigos del usuario
                dao.daoU.friends(request.session.idU,(error,result)=>{
                    if(error){
                        console.log(error);
                    }else{
                        let accepted=result;
                       
                        response.render('friends',{id:request.session.idU,
                    points:request.session.points,waiting:waiting, accepted:accepted, photo:request.session.photo });
                    }
                });
            }
        });
        
    },
    
    accept:function(request,response){
      dao.daoU.acceptUser(request.session.idU,request.params.id,
        (error,result)=>{
            if(error){
                console.log(error);
            }else if(result){
                response.redirect('/friends');
            }
        });  
    },
    reject:function(request,response){
        dao.daoU.rejectUser(request.session.idU,request.params.id,
        (error,result)=>{
            if(error){
                console.log(error);
            }else if(result){
                response.redirect('/friends');
            }
        });  
    },
    request:function(request,response){
        dao.daoU.requestUser(request.session.idU,request.params.id,
        (error,result)=>{
            if(error){
                console.log(error);
            }else if(result){
                response.redirect('/search');
            }
        });  
    },
    
    userid:function(request,response){
        request.session.friend=request.params.id;
        response.redirect('/user');
    },
    user:function(request,response){
        dao.daoU.getUser(request.session.friend,(error,result)=>{
           if(error){
               console.log(error);
           }else if(result){
               request.session.points=result.points;
               let user={
                   id:request.session.friend,
                   email:result.email,
                   name:result.name,
                   points:result.points,
                   bday:result.birthdate
               };
               
               let photo;
               if(result.photo.length===0){
                   photo=0;
               }else{
                   photo=1;
               }
               response.render('user',{id:request.session.idU, 
                   points:request.session.points, user:user,photo:photo});
               
           }
       });
    },
    
    search:function(request,response){
        if(request.query.word!==undefined){
            request.session.word=request.query.word;
        }
        
        dao.daoU.searchUsers(request.session.idU,"%"+request.session.word+"%",
            (error,result)=>{
                if(error){
                    console.log(error);
                }else{
                    
                 response.render('search',{id:request.session.idU, 
                     points:request.session.points, list:result,
                     word:request.session.word,photo:request.session.photo});
                }
            });
    },
    
    modify:function(request,response){
        dao.daoU.getUser(request.session.idU, (error,result)=>{
            if(error){
                console.log(error);
            }else if(result){    
                 request.session.points=result.points;
                 
               let user={
                   email:result.email,
                   pass:result.password,
                   name:result.name,
                   sex:result.sex,
                   points:result.points,
                   bday:result.birthdate
               };
               
                response.render('modify',{user:user, photo:request.session.photo, id:request.session.idU});
            }
        });
    }, 
    processmodify:function(request,response){
         dao.daoU.getUser(request.session.idU,(error,result)=>{
           if(error){
               console.log(error);
           }else if(result){
               
               let user={
                   id: request.session.idU,
                   email:result.email,
                   pass:request.body.password,
                   sex:request.body.sex,
                   name:request.body.name,
                   photo:null,
                   points:result.points,
                   bday:null
               };
               
               if(request.body.birthdate === "")
                   user.bday=result.birthdate;
               else
                   user.bday= request.body.birthdate;
                
                //Verficamos que exista una foto
                if (request.file) {
                    user.photo= request.file.buffer;
                }else{
                      user.photo=result.photo;
                }
        
                dao.daoU.modifyUser(user,(error,result)=>{
                    if(error){
                        console.log(error);
                    }else if(result){
                        response.redirect('/profile');
                    }
                 });
           }
       });
    }
    
};