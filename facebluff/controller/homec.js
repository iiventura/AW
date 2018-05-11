var _ = require("underscore");//libreria especial de arrays
var dao=require('../database/dao');

module.exports={
    login:function(request, response){
        response.render('login',{title:"Enter", warnings:[]});
    }, 
    processlogin:function(request, response){
        let warnings=new Array();
        
       request.checkBody("email", "Email can not be empty.").notEmpty();
       request.checkBody("password", "Password can not be empty.").notEmpty();
       
       request.getValidationResult().then(result=> {
        if (result.isEmpty()) {
            dao.daoU.isUserCorrect(request.body.email,request.body.password,
            (error,result)=>{
                if(error){
                    console.log(error);
                }else if(result){
                    request.session.idU=result.id_user;
                    response.redirect('/profile');
                }else{
                    warnings.push("The email and The password don't match");
                    response.render('login',{title:"Enter", warnings:warnings});
                }
         });
        }else{
            warnings=_.pluck(result.array(),'msg');
            response.render('login',{title:"Enter", warnings:warnings});
        }
       
       });
       
    },
    
    register:function(request,response){
        response.render('register',{title:"New User",warnings:[]});
    }, 
    processregister:function(request,response){
       let warnings=new Array(); 
       
       request.checkBody("email", "Email can not be empty.").notEmpty();
       request.checkBody("password", "Password can not be empty.").notEmpty();
       request.checkBody("name", "Name can not be empty.").notEmpty();
       
       if(request.body.sex===undefined){
            warnings.push("You have to select a Gender.");
       }
       
       //Obtenemos los datos 
        let user={
            email:request.body.email,
            pass:request.body.password,
            name:request.body.name,
            sex:request.body.sex,
            birthdate:request.body.birthdate,
            photo:null
        };
        
       //Verficamos que exista una foto
        if (request.file) {
            user.photo= request.file.buffer;
        }
       
       request.getValidationResult().then(result=>{
           //Si hay errores 
           if(warnings.length>0 ||!result.isEmpty()){
                warnings=_.union(warnings,_.pluck(result.array(),'msg'));
                //console.log(warnings);
                response.render('register',{title:"New User",warnings:warnings});
           }else{
                //Verificamos que el email no exista en la bd
                dao.daoU.verifyUser(user.email,(error,result)=>{
                    if(error){
                        console.log(error);
                    }else if(result){
                        warnings.push("The email is already registered");
                        response.render('register',{title:"New User",warnings:warnings});
                    }else{
                        dao.daoU.insertUser(user,(error,newId)=>{
                            if(error){
                                console.log(error);
                            }else{
                              
                                //creamos las conexiones con los otros usuarios a none
                                dao.daoU.createConnections(newId, (error,result)=>{
                                    if(error){
                                        console.log(error);
                                    }else if(result){
                                        response.redirect('/');
                                    }
                                });
                            }
                        });
                    }
                });
           }
       });

        
    }
            
};


