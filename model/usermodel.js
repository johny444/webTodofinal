
var connect = require('./db_connect');

const userlist = (callback) => {
    return connect.query('select * from user', [], callback);
}
//add
const userlistbyid = (iduser, callback) => {
    return connect.query('select * from user where iduser =?', [iduser], callback);

}
const userlistbyemail = (email, callback) => {
    return connect.query('select * from user where email =?', [email], callback);

}
const adduser = ({ firstName, lastName,birthDay, email, password, gender }, callback) => {
    return connect.query('insert into user (firstName,lastName,birthDay,email,password,gender) value(?,?,?,?,?,?)',
        [firstName, lastName, birthDay, email, password, gender], callback)

}
const deleteuser = (iduser, callback) => {
    return connect.query('delete from user where iduser =?', [iduser], callback)
}
const updateuser = (data, callback) => {
    let {
        firstName, lastName,birthDay, email, password, gender,iduser
    } = data
    return connect.query('update user set firstName=?,lastName=?,birthDay=?,email=?,password=?,gender=? where iduser=?',
        [firstName, lastName, birthDay, email, password, gender, iduser], callback)
}

module.exports = { userlist,userlistbyid,adduser,deleteuser,updateuser,userlistbyemail }