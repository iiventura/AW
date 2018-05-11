let dao=require('../database/dao');
var _ = require("underscore");//libreria especial de arrays

module.exports={
    questions:function(request,response){
        
        dao.daoQ.getAllQuestions((error,result)=>{
           if(error){
               console.log(error);
           }else if(result){    
                response.render('questions',{id:request.session.idU,
                                    points:request.session.points,list:result,
                                    photo:request.session.photo});
           }
       });       
    },
    
    newQuestion:function(request,response){
        response.render('newquestion',{id:request.session.idU,
            points:request.session.points,warnings:[],photo:request.session.photo});
    },
    processNewQuestion:function(request,response){
        let warnings=new Array();
        let options=new Array();
        
        request.checkBody("titleQuestion", "The title can not be empty.").notEmpty();
        request.checkBody("trueOption", "The true option can not be empty.").notEmpty();

        //console.log(request.body);
        if(request.body.options===' '){
            warnings.push("The options can not be empty");
        }else{
            let partition=request.body.options.split("@");
            
            
            if(partition.length>2){
                partition.forEach((elemento)=>{
                    if(elemento!==' '){
                        options.push(elemento.trim().toUpperCase());
                    }
                    
                });
                
                  //Eliminamos Repetidos definido al final del js
            options=options.unique();
            
            //Verificamos si la opcion verdadera esta en la lista de opciones 
            if(request.body.trueOption!==''){
                let exit=options.some(opt=>{
                    return opt===request.body.trueOption.trim().toUpperCase();});
                
                if(!exit){
                    warnings.push("The true option should be written in the options section ");
                }
                
            }
            }else {
                warnings.push("You have to assing  at least two options ");
            }
          
        }
        
        
        request.getValidationResult().then(result=> {
            //Existe algun error
           if(warnings.length>0 ||!result.isEmpty()){
                warnings=_.union(warnings,_.pluck(result.array(),'msg'));
                response.render('newquestion',{id:request.session.idU,
                                points:request.session.points,warnings:warnings,
                                photo:request.session.photo});
            
           }else{
               let question={
                   title:request.body.titleQuestion,
                    n_options:options.length};
              
                dao.daoQ.insertQuestion(question,(error,result)=>{
                    if(error){
                        console.log(error.message);
                    }else{
                        
                        let answers={
                            id:result,
                            options:options,
                            truth:request.body.trueOption.trim().toUpperCase()
                        };
                        
                        dao.daoQ.insertAnswers(answers,(error,result)=>{
                            if(error){
                                console.log(error.message);
                            }else{
                                response.redirect('/questions');
                            }
                        });
                    }
                });
                
            }
        });
    },
    
    questionid:function(request,response){
        request.session.idQ=parseInt(request.params.id);
        response.redirect("/question");
    },
    question:function(request,response){
         let listaContestaPregutna=new Array(); 
       let lista_IDU_idF_idQ=new Array(); 
       let lista_InfoAmigos=new Array();
       let lista_IDAmigos=new Array();
                
        let infor={
            idU:request.session.idU,
            idQ:request.session.idQ,
            idA:null
        };
        
         var usuarioContesta;       
        
        //obtenemos el titulo de la pregunta
        dao.daoQ.titleOfTheQuestion(infor.idQ,(error,result)=>{
           if(error){
               console.log(error);
           }else{
              request.session.titleQuestion = result[0].title;
              
              //obtenemos si el usuario a respondido o no para mostrra el boton
               dao.daoQ.userQuestionAnswer(infor,(error,result)=>{
                if(error){
                    console.log(error);
                }else{ 
                    if(result === 1)
                        usuarioContesta=false;
                    else
                        usuarioContesta=true;
                      
                    //obtenemos los amigos del usuario
                    dao.daoQ.idFriend(infor.idU,(error,result)=>{
                        if(error){
                            console.log(error);
                        }else{ 
                             
                              if(result.length !== 0){
                                
                                //creamos la lista para pasarla directamente a los amigos que han cnt a la pregunta
                                 for (var i = 0; i < result.length; i++) {
                                    listaContestaPregutna.push(result[i].id_friend);//idF
                                    listaContestaPregutna.push(infor.idQ); //idQ

                                    //lista con los id de los amigos la utilizamos
                                    //para filtar con los que estan en other
                                    lista_IDAmigos.push(result[i].id_friend);

                                    //guardamos el idU y id amigo para la consulta de si estan 
                                    //en la tabla other
                                    lista_IDU_idF_idQ.push(infor.idU); 
                                    lista_IDU_idF_idQ.push(result[i].id_friend);
                                    lista_IDU_idF_idQ.push(infor.idQ);
                                   }  

                                   /*
                                    * comrpobamos si los amigos que han contestado a la pregunta
                                    * estan en la tabla other sino inserta
                                    */
                                    //buscamos los amigos que han contestado a la pregunta
                                    dao.daoQ.friendAnswerQuestion(listaContestaPregutna,(error,result)=>{
                                        if(error){
                                            console.log(error);
                                       }else{ 
                                           //utilizada para saber si es correcta la pregunta o no
                                           listaContestaPregutna=result; 

                                            //nos devuelve los amigos que ya estan en other con esa pregunta
                                            dao.daoQ.friendTableOther(lista_IDU_idF_idQ,(error,result)=>{
                                                if(error){
                                                    console.log(error);
                                               }else{ 
                                                   lista_IDAmigos_tablaOther =result;

                                                     lista_idU_insertaOther =lista_IDAmigos.filter(function(elemento){ 

                                                            for (var i = 0; i < lista_IDAmigos_tablaOther.length; i++) {
                                                                return elemento !== lista_IDAmigos_tablaOther[i];
                                                            }  
                                                        });

                                                        let idU_idF={
                                                            uidU:infor.idU,
                                                            uidF:lista_idU_insertaOther,
                                                            uidQ:infor.idQ,
                                                            uidA:1
                                                        };

                                                    if(lista_idU_insertaOther.length === 0)
                                                        idU_idF.uidF=lista_IDAmigos;

                                                    //obtenemos el ultimo id de la tabla answer para insertarlo como id en la tabla other
                                                    //de esta manera no da error y siempre metemso uno correcto
                                                     dao.daoQ.lastIdAnswer((error,result)=>{
                                                    if(error){
                                                        console.log(error);
                                                   }else { 
                                                        var idLastAns = result;
                                                       //insertamos en la tabla other las tuplas paras nuestros amigos
                                                        //des estamanera sabremso el estado de la pregunta con cada uno de ellos
                                                        dao.daoQ.insertOther(idU_idF,idLastAns,(error,result)=>{
                                                            if(error){
                                                                console.log(error.message);
                                                           }else if(result){                                                             

                                                                  let inforUsuario={
                                                                    idU:request.session.idU,
                                                                    idF:lista_IDAmigos,
                                                                    idQ:request.session.idQ
                                                                };
                                                                 //obtenemos el resultado de este usuario con sus amigos 
                                                                //en eseta pregunta, con datos del usuario
                                                               dao.daoQ.information_User_Other(inforUsuario,(error,result)=>{                                
                                                                   if(error){
                                                                       console.log(error);
                                                                   }else{     
                                                                       
                                                                           result.forEach(function(user){

                                                                               let amigos={
                                                                                   id_amigo:null,
                                                                                   name:null,
                                                                                   photo:null,
                                                                                   state:null
                                                                               };

                                                                             amigos.id_amigo=user.id_user; 
                                                                             amigos.name=user.name;
                                                                             amigos.photo=user.photo;
                                                                             amigos.state=user.state;
                                                                             lista_InfoAmigos.push(amigos);

                                                                          });

                                                                         response.render("question",{id:request.session.idU,points:request.session.points,
                                                                                titleQuestion:request.session.titleQuestion, preguntaContestada:usuarioContesta,
                                                                                amigos:lista_InfoAmigos});
                                                                   }
                                                                });//information_User_Other
                                                            }
                                                        });//insertOther
                                                    }
                                                });//insertOther
                                               }
                                            });//friendTableOther
                                        }
                                   });//friendAnswerQuestion    
                               }else{//ene l caso de que no tenga amigos no hay que hacer todas las comrpobacioenes
                                   response.render("question",{id:request.session.idU,points:request.session.points,
                                        titleQuestion:request.session.titleQuestion, preguntaContestada:usuarioContesta,
                                        amigos:lista_InfoAmigos});
                               }
                             }    
                          });//idFriend
                }
            }); //userQuestionAnswer
          }
         }); //titleOfTheQuestion
    }

};



//Funcion para quitar repetidos en options cuando se crea la pregunta
Array.prototype.unique=function(a){
    return function(){
        return this.filter(a);
    };}(function(a,b,c){
        return c.indexOf(a,b+1)<0;
    });
    
    
    /*question:function(request,response){
        //Busca el titulo de la pregunta
        dao.daoQ.getTittle(request.session.idQ,(error,result)=>{
            if(error){
                console.log(error);
            }else{
                let title=result;
                //Verificamos si es usuario ha contestado
                let info={
                    idU:request.session.idU,
                    idQ:request.session.idQ
                };
                
                dao.daoQ.verifyUserAnswer(info,(error,result)=>{
                    if(error){
                        console.log(error.message);
                    }else{
                        let answerU=result;
                       //Buscamos los usuarios que son amigos y no estan en other
                       dao.daoQ.setNewOtherAnswer(info,(error,newOthers)=>{
                           if(error){
                               console.log(error.message);
                           }else if(newOthers.length>0) {
                               //ultimo answer por defecto a los other nuevos
                               dao.daoQ.lastIdAnswer((error,lastId)=>{
                                   if(error){
                                       console.log(error.message);
                                   }else{
                                       info.idA=lastId;
                                       //insertamos los que no  estan en other
                                       dao.daoQ.insertOthers(info,newOthers,
                                            (error,result)=>{
                                                if(error){
                                                    console.log(error.message);
                                                }else{
                                                    //Buscamos la info de los 
                                                    //usuarios que han contestado
                                                   //dao.daoQ.friendsAnswered();
                                                }
                                       });
                                   }
                               });
                              
                           }else{
                               //Buscamos la info de los usuarios que han contestado
                               dao.daoQ.friendsAnswered(info);
                           }
                       });
                    }
                });
            }
        });
    }*/