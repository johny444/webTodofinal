var express = require('express');
var notemodel = require('../model/notemodel');
var router = express.Router();

router.get('/', (req, res, next) => {
    notemodel.notelist((err, note) => {
        if (err) {
            next(err);
        } else {
            return res.json({
                status: 200,
                data: note
            })
         
        }
    })
});
router.get('/id=:id', (req, res, next) => {
    notemodel.notelistbyid(req.params.id, (err, note) => {
        if (err) {
            next(err);
        } else {
            return res.json({
                status: 200,
                data: note
            })
        }
    })
});
router.get('/iduser=:iduser', (req, res, next) => {
    notemodel.listnoteByidUser(req.params.iduser, (err, note) => {
        if (err) {
            next(err);
        } else {
            return res.json({
                status: 200,
                data: note
            })
        }
    })
});

router.get('/add', (req, res) => {
    res.render('Note/addnote', {
        created: '',
        title: '',
        content: '',
        sendNotification: '',
        remainder_time: '',
        iduser: ''
        
    })
})

//delete by id
router.delete('/delete/id=:id', (req, res, next) => {
    notemodel.deletenote(req.params.id, (err, note) => {
        if (err) {
            next(err);
        } else {
            return res.json({
                status: 200,
                message: "ok"
            })
        }
    })

});

// router.put('/update/id=:id', (req, res, next) => {
//     if (req.body.created &&
//         req.body.title &&
//         req.body.content &&
//         req.body.sendNotification &&
//         req.body.remainder_time &&
//         req.body.iduser) {
//         try {
//             notemodel.updatenote({

//                 created: req.body.created,
//                 title: req.body.title,
//                 content: req.body.content,
//                 sendNotification: req.body.sendNotification,
//                 remainder_time: req.body.remainder_time,
//                 id: req.params.id,
//                 iduser:req.body.iduser

//             }, (err, note) => {
//                 if (err) {
//                     next(err);
//                 } else {
//                     return res.json({
//                         status: 200,
//                         message: "ok"
//                     })
//                 }
//             })
//         } catch (error) {
//             next(error);
//         }
//     } else {
//         next(createError(400))
//     }
// });
var connect = require('../model/db_connect');
router.get('/notelist/(:iduser)', (req, res, next) => {
    let iduser = req.params.iduser;

    connect.query('SELECT * FROM note WHERE iduser = ' + iduser, (err, note, fields) => {

        if (note.length <= 0) {
            req.flash('error', 'Book not found with iduser = ' + iduser)
            // res.redirect('/user');
            res.render('Note/noteNull',{
                data:note
            })
        } else {
            res.render('Note/note', { //thư mục views/user/edit
               data:note
                
            })
        }
    });
})



module.exports = router;