
var connect = require('./db_connect');

const notelist = (callback) => {
    return connect.query('select * from note', [], callback);
}
//add
const notelistbyid = (id, callback) => {
    return connect.query('select * from note where id =?', [id], callback);

}
const listnoteByidUser = (iduser, callback) => {
    return connect.query('select * from note where iduser =?', [iduser], callback);

}
const addnote = ({ created, title, content, sendNotification, remainder_time, iduser}, callback) => {
    return connect.query('insert into note (created, title,content, sendNotification, remainder_time,iduser) value(?,?,?,?,?,?)',
        [created, title, content, sendNotification, remainder_time,iduser], callback)

}
const deletenote = (id, callback) => {
    return connect.query('delete from note where id =?', [id], callback)
}
const updatenote = (data, callback) => {
    let {
        created, title, content, sendNotification, remainder_time,iduser, id
    } = data
    return connect.query('update note set created=?,title=?,content=?,sendNotification=?,remainder_time=?,iduser=? where id=?',
        [created, title, content, sendNotification, remainder_time,iduser, id], callback)
}

module.exports = { notelist, notelistbyid, addnote, deletenote, updatenote,listnoteByidUser }