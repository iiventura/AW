
$(document).ready(function() {
  
  
 
     showUserAccess();
  

   
   $("#new").on("click", processNewUser);
   $("#log").on("click", processLogin);
   $("#out").on("click", processLogout);
   $("#create").on("click", processNewMatch);
   $("#join").on("click", processJoinMatch);
   $("#match-list").on("click","button.state",getStatus);
   $("#home").on("click",()=>{
       showMainUser();
       loadMatches();
   });
  

});





//<------------------------------------AJAX----------------------------------------------->

let actual={name:"", auth:"",cards:[],status:[]};


function processNewUser(event){
    event.preventDefault();
    let user=$("#logger input[type='email']").val();
    let pass=$("#logger input[type='password']").val();
    
    $.ajax({
        method:"POST",
        url:"/register",
        data: JSON.stringify({ user: user,pass:pass }),
        contentType: "application/json",
        
         statusCode: {
             201:()=>{
                 showUserAccess();
                  alert("The user was successfully registered.");  
             },
             400:(data)=>{
                 setNotifications(data.responseJSON.msg);
                 $("#notify").show(); 
             }}

    });
}

function processLogin(event){
    event.preventDefault();
     let user=$("#logger input[type='email']").val();
    let pass=$("#logger input[type='password']").val();
    
    $.ajax({
        method:"POST",
        url:"/login",
        data: JSON.stringify({ user: user,pass:pass }),
        contentType: "application/json",
        
         statusCode: {
             200:(data)=>{
                 if(data.isUser){
                     
                     actual.auth = btoa(user + ":" + pass);
                     
                     actual.name = user;
                     
                     
                     showMainUser();
                     setUsername(user);
                     loadMatches();
                 }else{
                    setNotifications("The user and password are incorrect");
                    $("#notify").show(); 
                 }
                   
             },
             400:(data)=>{
                 setNotifications(data.responseJSON.msg);
                 $("#notify").show(); 
             }}

    });
}

function processLogout(){
    actual.name="";
    actual.auth="";
    
    showUserAccess();
    
}

function loadMatches(){
    $.ajax({
        method:"GET",
        url:"/matches",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "Basic " + actual.auth);
        },
       statusCode:{
           200:(data)=>{
              
               
               let ul=$("#match-list ul #init");
                    $("button.state").empty();//apunta al li de 
               let list=JSON.parse(data);
              
               list.forEach((m)=>{
                   ul.after(addMatchLink(m));
               });
               
           }
       }
    });
}

function processNewMatch(){
    let name=$("#create-match input[type='text'] ").val();
    
    if(name.length>0){
        $.ajax({
        method:"POST",
        url:"/newmatch",
         beforeSend: function(request) {
            request.setRequestHeader("Authorization", "Basic " + actual.auth);
        },
        data: JSON.stringify({ gamename: name }),
        contentType: "application/json",
        
         statusCode: {
             201:()=>{
                loadMatches();
                alert("New match have been created");   
             }
         }
             

    });
    }
}

function processJoinMatch(){
    let id = Number($("#join-match input[type='text'] ").val());
    
    if (!isNaN(id)) {
    $.ajax({
            method: "PUT",
            url: "/join/" + id,
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Basic " + actual.auth);
            },
           statusCode: {
             201:(data)=>{
                    loadMatches();
               alert(data.msg);
                   
             },
             404:(data)=>{
                alert("The match doesn't exist");
             },
             400:(data)=>{
                 alert("The match have 4 players");
                 
             }
             
         }
        });
    
    
    }else{
        alert("The id match have to be a number, please try again");
    }
    
}

function getStatus(event){
    let selected = $(event.target);
    let liPadre = selected.parent();
    
    
     $.ajax({
        method: "GET",
        url: "/status/" + liPadre.data("id"),
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "Basic " + actual.auth);
        },
        statusCode: {
            201:(data)=>{
                let info=JSON.parse(data.status);
                showMatch();
                setTitle(selected.text());
                
                if(info.players.length===4){
                    setIntro("");
                }else{
                    setIntro("La partida aun no tiene suficiente jugadores,"+
            " el identificador de esta partida es: "+liPadre.data("id"));
                }
                $(".cardstable").hide();
                $(".mycards").hide();
                
                info.players.forEach((p)=>{
                    let user =new Object();
                    user.name=p.user;
                    user.cards=p.cards.length;
                    createPlayer(user);
                });
                
            },
            404:()=>{
                alert("Error searching that match");
            }
        }
    });
}
//<----------------------------------END AJAX--------------------------------------------->



