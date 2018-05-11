let dao=require('../database/dao');

module.exports={
    main:function(request,response){
        response.redirect('index.html');
    }, 
    
    register:function(request,response){
       request.checkBody("user", "Email can not be empty.").notEmpty();
       request.checkBody("pass", "Password can not be empty.").notEmpty();
       
        request.getValidationResult().then(result=> {
        if (result.isEmpty()){
            dao.daoU.existUser(request.body.user,(err,result)=>{
                if(err){
                    response.status(500);
                    response.end();
                    
                }else if(result){
                    response.status(400);
                    response.json({ 
                        msg: "The email is already registered." });
                    
                }else{
                    dao.daoU.newUser(request.body.user, request.body.pass,
                                    (err,result)=>{
                                        if(err){
                                            response.status(500);
                                            response.end();
                                            
                                        }else if(result){
                                            
                                            response.status(201);
                                            response.end();
                                        }
                    });
                }
            });
        }else{
            response.status(400);
            response.json({ msg: result.array() });
        }});
    },
    
    login:function(request, response){
       request.checkBody("user", "Email can not be empty.").notEmpty();
       request.checkBody("pass", "Password can not be empty.").notEmpty();
       
       request.getValidationResult().then(result=>{
           if (result.isEmpty()){
               dao.daoU.verifyUser(request.body.user, request.body.pass,
                    (err,result)=>{
                        if(err){
                            response.status(500);
                            response.end();
                            
                        }else{
                            response.status(200);
                            response.json({isUser:result});
                        }
                    });
           }else{
               response.status(400);
               response.json({ notification: result.array() });
           }
       });
    },
    
    matches:function(request,response){
        dao.daoU.getMatches(request.user,(err,result)=>{
            if(err){
                response.status(500);
                response.end();
                
            }else{
                response.status(200);
                response.json(JSON.stringify(result));
            }
        });
        
    }
    
    
};