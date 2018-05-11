var express = require('express');
var router = express.Router();
var passport = require("passport");
var passportHTTP = require('passport-http');
var control=require('.././controller');
let dao=require('../database/dao');


router.use(passport.initialize());

passport.use(new passportHTTP.BasicStrategy(
        { realm: 'Autenticacion' },
        (user, pass, callback) => {
            dao.daoU.verifyUser(user,pass,(err,result)=>{
                if(result){
                    callback(null,user);
                    
                }else if(!result){
                    callback(null,false);
                }
            });
        }
));

/* HOME PAGE */
router.get('/',control.usersc.main );

/* REGISTER */
router.post('/register',control.usersc.register);

/* LOGIN */
router.post('/login',control.usersc.login);

/* MATCHES */
router.get('/matches',passport.authenticate('basic', { session: false, 
                    failureRedirect: "/unauthorized" }), control.usersc.matches);

/* NEW MATCH */
router.post('/newmatch',passport.authenticate('basic', { session: false, 
                    failureRedirect: "/unauthorized" }), control.matchesc.newmatch);

/* JOIN MATCH */
router.put('/join/:id',passport.authenticate('basic', { session: false, 
                    failureRedirect: "/unauthorized" }), control.matchesc.joinmatch);

/* STATUS MATCH */
router.get('/status/:id', passport.authenticate('basic', { session: false, 
                    failureRedirect: "/unauthorized" }),control.matchesc.statusmatch);

 router.get("/unauthorized", (request, response) => {
        response.status(403);
        response.end();
    });

module.exports = router;
