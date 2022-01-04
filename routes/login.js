// var connect = require('../model/db_connect');
const bcrypt = require('bcrypt');
var express = require('express');
var router = express.Router();
const connect = require('./database');
const { body, validationResult } = require('express-validator');
var usermodel = require('../model/usermodel');
// DECLARING CUSTOM MIDDLEWARE
const ifNotLoggedin = (req, res, next) => {
    if(!req.session.isLoggedIn){
        return res.render('./login_Res/login');
    }
    next();
}
const ifLoggedin = (req,res,next) => {
    if(req.session.isLoggedIn){
        return res.redirect('./login_Res/home');
    }
    next();
}
// END OF CUSTOM MIDDLEWARE
// ROOT PAGE
// router.get('/', ifNotLoggedin, (req,res,next) => {
//     connect.execute("SELECT `name` FROM `admin` WHERE `id`=?",[req.session.userID])
//     .then(([rows]) => {
//         res.render('./user/home',{
//             firstName:rows[0].name
//         });
//     });
    
// });// END OF ROOT PAGE
router.get('/', ifNotLoggedin, (req,res,next) => {
    usermodel.userlist((err, user) => {
        if (err) {
            next(err);
        } else {
            // return res.json({
            //     status: 200,
            //     data: user
            // })
            return res.render('user', {
                data: user
            })
        }
    })
    
});// END OF ROOT PAGE


// REGISTER PAGE
router.post('/register', ifLoggedin, 
// post data validation(using express-validator)
[
    body('user_email','Invalid email address!').isEmail().custom((value) => {
        return connect.execute('SELECT `email` FROM `admin` WHERE `email`=?', [value])
        .then(([rows]) => {
            if(rows.length > 0){
                return Promise.reject('This E-mail already in use!');
            }
            return true;
        });
    }),
    body('user_name','Username is Empty!').trim().not().isEmpty(),
    body('user_pass','The password must be of minimum length 6 characters').trim().isLength({ min: 6 }),
],// end of post data validation
(req,res,next) => {

    const validation_result = validationResult(req);
    const {user_name, user_pass, user_email} = req.body;
    // IF validation_result HAS NO ERROR
    if(validation_result.isEmpty()){
        // password encryption (using bcryptjs)
        bcrypt.hash(user_pass, 12).then((hash_pass) => {
            // INSERTING USER INTO DATABASE
            connect.execute("INSERT INTO `admin`(`name`,`email`,`password`) VALUES(?,?,?)",[user_name,user_email, hash_pass])
            .then(result => {
                res.send(`your account has been created successfully, Now you can <a href="/page">Login</a>`);
            }).catch(err => {
                // THROW INSERTING USER ERROR'S
                if (err) throw err;
            });
        })
        .catch(err => {
            // THROW HASING ERROR'S
            if (err) throw err;
        })
    }
    else{
        // COLLECT ALL THE VALIDATION ERRORS
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });
        // REDERING login PAGE WITH VALIDATION ERRORS
        res.render('./login_Res/Register',{
            register_error:allErrors,
            old_data:req.body
        });
    }
});// END OF REGISTER PAGE

router.get("/register2", (req, res) => {
    res.render('./login_Res/Register')
})

// LOGIN PAGE
router.post('/', ifLoggedin, [
    body('user_email').custom((value) => {
        return connect.execute('SELECT email FROM admin WHERE email=?', [value])
        .then(([rows]) => {
            if(rows.length == 1){
                return true;
                
            }
            return Promise.reject('Invalid Email Address!');
            
        });
    }),
    body('user_pass','Password is empty!').trim().not().isEmpty(),
], (req, res) => {
    const validation_result = validationResult(req);
    const {user_pass, user_email} = req.body;
    if(validation_result.isEmpty()){
        
        connect.execute("SELECT * FROM `admin` WHERE `email`=?",[user_email])
        .then(([rows]) => {
            bcrypt.compare(user_pass, rows[0].password).then(compare_result => {
                if(compare_result === true){
                    req.session.isLoggedIn = true;
                    req.session.userID = rows[0].id;

                    res.redirect('/page');
                }
                else{
                    res.render('./login_Res/login',{
                        login_errors:['Invalid Password!']
                    });
                }
            })
            .catch(err => {
                if (err) throw err;
            });


        }).catch(err => {
            if (err) throw err;
        });
    }
    else{
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });
        // REDERING login PAGE WITH LOGIN VALIDATION ERRORS
        res.render('./login_Res/login',{
            login_errors:allErrors
        });
    }
});
// END OF LOGIN PAGE

// LOGOUT
router.get('/logout',(req,res)=>{
    //session destroy
    req.session = null;
    res.redirect('/page');
});
// END OF LOGOUT

module.exports = router;
