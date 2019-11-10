const userUtil = require('../utils/userUtil');
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');

exports.test = (req, res) => {
    res.status(200).json({
        info: "User Controller is working!"
    })
};

exports.createUser = (req, res, is_admin=false) => {
    User.find({
        email: req.body.email
    }).exec()
      .then(user => {
            if (user.length >= 1){
                return userUtil.res(res, 409, "Cannot create new user, already exist")
            }else{
                bcrypt.hash(req.body.password, 12, (err, hash) => {
                    if(err) {
                        console.log(err);
                        userUtil.res(res, 500, err);
                    }else{
                        let user = new User({
                            nickname: req.body.nickname,
                            email: req.body.email,
                            password: hash,
                            is_admin: is_admin,
                            created_date: Date.now(),
                            modified_date: Date.now(),
                            age_rate: req.body.age_rate
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                userUtil.res(res, 200, "User created")
                            })
                            .catch(err =>{
                                console.log(err);
                                userUtil.res(res, 500, err)
                            })
                    }
                })
            }
      })
};

exports.getUser = (req, res) => {
    User.findOne({nickname: req.params.nickname})
        .exec()
        .then(user =>{
            if(user != null){
                userUtil.res(res, 200, user);
            }else{
                userUtil.res(res, 404, "User with this nick does not exist");
            }
        })
        .catch(error =>{
            console.log(error);
            userUtil.res(res, 500, error);
        })
};

exports.updateUser = (req, res) => {
    let toUpdate = {};
    for(let param in req.body){
        toUpdate[param] = req.body[param];
    }
    toUpdate['modified_date'] = Date.now();
    delete toUpdate["password"];
    User.updateOne({nickname: req.params.nickname}, {$set: toUpdate})
        .exec()
        .then(() =>{
            userUtil.res(res, 200, "User updated");
        })
        .catch(error => {
            userUtil.res(res, 500, error);
        })
};

exports.deleteUser = (req, res) => {
    let toDelete = req.params.nickname;
    User.deleteOne({nickname: toDelete})
        .exec()
        .then(() =>{
            userUtil.res(res, 200, "User deleted");
        })
        .catch(error =>{
            userUtil.res(res, 500, error);
        })
};

exports.getUsers = (req, res, is_admin=false) => {
    User.find({is_admin: is_admin})
        .exec()
        .then(users =>{
            userUtil.res(res, 200, users);
        })
        .catch(error => {
            userUtil.res(res, 200, error);
        })
};

exports.resetPasswordByAdmin = (req, res) => {
    let nickname = req.params.nickname;
    let password = "NewPassword1234";
    bcrypt.hash(password,12, (err, hash)=> {
        let toUpdate = {}
        toUpdate['modified_date'] = Date.now();
        toUpdate['password'] = hash;
        User.updateOne({nickname: nickname}, {$set: toUpdate})
            .exec()
            .then(() => {
                userUtil.res(res, 201, "Password changed");
            })
            .catch(error => {
                userUtil.res(res, 500, "Cannot change password");
            })
    });
};

exports.addAdmin = (req, res) => {
    this.createUser(req, res, true);
};