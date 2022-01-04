var express = require('express');
var usermodel = require('../model/usermodel');
var router = express.Router();
let mysql = require('mysql');

router.get('/', (req, res, next) => {
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
});
router.get('/iduser=:iduser', (req, res, next) => {
    usermodel.userlistbyiduser(req.params.iduser, (err, user) => {
        if (err) {
            next(err);
        } else {
            return res.json({
                status: 200,
                data: user
            })
        }
    })
});
router.get('/email=:email', (req, res, next) => {
    usermodel.userlistbyemail(req.params.email, (err, user) => {
        if (err) {
            next(err);
        } else {
            return res.json({
                status: 200,
                data: user
            })
        }
    })
});
//get add from html
router.get('/add', (req, res) => {
    res.render('user/add', {
        firstName: '',
        lastName: '',
        birthDay: '',
        email: '',
        password: '',
        gender: ''
        
    })
})
router.post('/add', (req, res, next) => {
  
    console.log("hello")
    if (req.body.iduser != "" || req.body.firstName != "" || req.body.lastName != "" || req.body.birthDay != "" || req.body.email != "" || req.body.password != "" || req.body.gender != "" ) {
        usermodel.adduser(req.body, (err, user) => {
            if (err) {
                next(err);
            } else {
                res.redirect('/users')
            }
        })

    } else {
        return res.status(400).json({
            status: 400,
            message: "bad request"
        })
    }

});


router.get('/delete/:iduser', (req, res, next) => {
    usermodel.deleteuser(req.params.iduser, (err, user) => {
        if (err) {
            req.flash('error', err),
                res.redirect('/users');
        } else {
            req.flash('success', 'user successfully deleted! ID = ' + req.params.iduser);
            res.redirect('/users');
        }
    })

});

router.post('/update/:iduser', (req, res, next) => {
    let iduser = req.params.iduser;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let birthDay = req.body.birthDay;
    let email = req.body.email;
    let password = req.body.password;
    let gender = req.body.gender;
    
    let errors = false;
    if (firstName.length == 0 ||
        lastName.length == 0 ||
        birthDay.length == 0 ||
        email.length == 0 ||
        password.length == 0 ||
        gender.length == 0 
        ) {
        errors = true;
        req.flash('error', 'please enter name and author');
        res.render('user/edit', {
            iduser: req.params.iduser,
            firstName: firstName,
            lastName: lastName,
            birthDay: birthDay,
            email: email,
            password: password,
            gender: gender
            
        })
    }

    if (!errors) {
        let form_data = {
            firstName: firstName,
            lastName: lastName,
            birthDay: birthDay,
            email: email,
            password: password,
            gender: gender,
            
        }

        connect.query('update user set ? where iduser= ' + iduser, form_data, (err, user) => {
            if (err) {

                req.flash('error', err);
                console.log("I'm  error");
                res.render('user/edit', {
                    iduser: req.params.iduser,
                    firstName: form_data.firstName,
                    lastName: form_data.lastName,
                    birthDay: form_data.birthDay,
                    email: form_data.email,
                    password: form_data.password,
                    gender: form_data.gender
                   
                })
            } else {
                req.flash('success', 'user successfully updated');
                res.redirect('/users')
            }

        })
    }



});


var connect = require('../model/db_connect');
router.get('/edit/(:iduser)', (req, res, next) => {
    let iduser = req.params.iduser;

    connect.query('SELECT * FROM user WHERE iduser = ' + iduser, (err, user, fields) => {

        if (user.length <= 0) {
            req.flash('error', 'user not found with iduser = ' + iduser)
            res.redirect('/user');
        } else {
            res.render('user/edit', { //thư mục views/user/edit
                title: 'Edit user',
                iduser: user[0].iduser,
                firstName: user[0].firstName,
                lastName: user[0].lastName,
                birthDay: user[0].birthDay,
                email: user[0].email,
                password: user[0].password,
                gender: user[0].gender
                
            })
        }
    });
})

module.exports = router;