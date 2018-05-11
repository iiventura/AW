var express = require('express');
var router = express.Router();
var control=require('.././controller');
var multer = require("multer");
var upload = multer({ storage: multer.memoryStorage() });

/**************************APARTADO 1******************************************/
/* LOGIN */
router.get('/',control.middleware.verifyNoUser,control.homec.login );
//processlogin::
router.post('/',control.middleware.verifyNoUser, control.homec.processlogin);

/* REGISTER */
router.get('/register',control.middleware.verifyNoUser,control.homec.register );
//processregister::
router.post('/register',control.middleware.verifyNoUser,upload.single("foto"),
                                                control.homec.processregister);
                                                                   

/* RUTAS ESPECIALES*/
//Obtener las imagenes del usuario
router.get('/image/:id', control.middleware.verifyUser,control.userc.image);

/* RUTAS DE USUARIO */
router.get('/logout',control.middleware.verifyUser,control.userc.logout );
router.get('/profile', control.middleware.verifyUser,control.userc.profile);
router.get('/friends', control.middleware.verifyUser,control.userc.friends);
router.get('/search', control.middleware.verifyUser,control.userc.search);
//Muestra el perfil del otro usuario
router.get('/user/:id',control.middleware.verifyUser,control.userc.userid);
router.get('/user/',control.middleware.verifyUser,control.userc.user);
//Acepta Amistad de id
router.get('/accept/:id',control.middleware.verifyUser,control.userc.accept);
//Rechaza Amistad de id
router.get('/reject/:id',control.middleware.verifyUser,control.userc.reject);
//Solicita Amistad de id
router.get('/request/:id',control.middleware.verifyUser,control.userc.request);

/*Direcciones Modificar Usuario*/
router.get('/modify',control.middleware.verifyUser,control.userc.modify );
//processmodify::
router.post('/modify',control.middleware.verifyUser,upload.single("foto"),
                                                   control.userc.processmodify);
                                                   
                                                   
                                                   
                                                                                               
/**************************APARTADO 2******************************************/
/*Listar aleatoriamente preguntas*/
router.get('/questions',control.middleware.verifyUser,control.questionsc.questions);
/*Form Pregunta */
router.get('/newquestion',control.middleware.verifyUser,control.questionsc.newQuestion);
/*Procesar Pregunta*/
router.post('/newquestion',control.middleware.verifyUser,control.questionsc.processNewQuestion);
/*Vista Pregunta i*/
router.get('/question/:id',control.middleware.verifyUser,control.questionsc.questionid);
router.get('/question',control.middleware.verifyUser,control.questionsc.question);


/**************************APARTADO 3******************************************/

                                                   
                                                   
                                                   
                                                   
                                                   
                                                   
                                                   

module.exports = router;
