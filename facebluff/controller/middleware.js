module.exports={
    verifyUser:function (request, response, next){
       if(request.session.idU===undefined){
           response.redirect('/');
       }else{
           next();
       }
    },
    verifyNoUser: function (request, response,next){
       if(request.session.idU!==undefined){
           response.redirect('/profile');
       }else{
           next();
       }
    
    }
};

