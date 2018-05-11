
//<----------------------------------JQUERY --------------------------------------------->

//<--VIEWs  -->
function showUserAccess(){ //LOGIN 
    $("#match-list").hide();
    $("#main-matches").hide();
    $(".wrapper").hide();
    $("#side-right").hide(); //User y Logout button 
    $("#notify").hide();
    $("#form-log").show();
}

function showMainUser(){ //CREATE + JOIN MATCH
    $("#form-log").hide();
    $(".wrapper").hide();
     $("#notify").hide();
    $("#main-matches").show();
    $("#match-list").show();
    $("#side-right").show();
};

function showMatch(){ //Basic Structure to a Match
    $("#form-log").hide();
    $("#main-matches").hide();
    $(".wrapper").show();
   
};
//<!--end VIEWs/////////////////////////////////////////////////////////////////////////////////////-->


//<-- SPECIALS  -->
function setUsername(username){ //SIDE-RIGHT P
    ////Modifica el nombre del Usuario en la barra
    $("#side-right p").text(username);
}

function setTurn(){ //Oculta el mensaje de no turno 
    $("#no-turn").hide();
} 
function setNoTurn(){ //Oculta los botones de turno
    $("#its-turn").hide();
}

function addMatchLink(match){//crea y agrega el link a una Partida al nav
   
    
    let result = $("<li>").addClass("match");
    result.append($("<button>").addClass("state").text(match.name));
    result.data("id", match.idMatch);
    return result;
   
}

function setTitle(title){
    $("#left-updater h1").text(title);
}

function setIntro(texto){//Modifica la intro cuando faltan jugadores
    $("#updater p").text(texto);
    $("#updater p").show();
  
}


function createPlayer(user){// crea jugador en la tabla 
    let name=$("<td>").text(user.name);
    
    let cards=$("<td>").text(user.cards);
    
    let total=$("<tr>").append(name).append(cards);
    
    if(user.turn===true){
        total=setTurnPlayer(total);
    }
    
    $("#sidebar table ").append(total);
    
}
function setTurnPlayer(tr){ //Activa 
    return tr.prop("id","turn");
}

function setNotifications(messages){//Notificaciones de error
    $("#notify ul").empty();//Vaciamos esta capa
    
    if(typeof(messages)==="string"){
        let li=$("<li>").text(messages);
         $("#notify ul").append(li);
    }else{
        messages.forEach((e)=>{
         let li=$("<li>").text(e.msg);
          $("#notify ul").append(li);
        });
    }
    
    
}

//<!-- end SPECIALS/////////////////////////////////////////////////////////////////////////////////-->
             
//<----------------------------------END JQUERY --------------------------------------------->


