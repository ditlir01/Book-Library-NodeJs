var mysqlConfig = require("../connections/mysql");
var connection = mysqlConfig.connection;
var bcrypt = require("bcrypt");

exports.cryptPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, function(err, salt) {
            if (err)
                return reject(err);

            bcrypt.hash(password, salt, function(err, hash) {
                return resolve(hash);
            });
        });
    });
};

exports.comparePassword = (plainPass, hasWord) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainPass, hasWord, function(err, isPasswordMatch) {
            return err == null ?  resolve(isPasswordMatch) : reject(err);
        });
    });
};

exports.addUser = (input) => {
    return new Promise((resolve, reject) => {
        var sql = "INSERT INTO users (name, email, password) VALUES ('"+ input.name +"', '"+ input.email+"', '"+ input.password+"')";
        connection.query(sql, (error, elements) => {
            if(error)
                return reject(error);

            return resolve(elements)
        })
    })
};

exports.getByEmail = (email) => {
    return new Promise((resolve, reject) => {
        var sql = "SELECT * FROM users WHERE email= '"+ email +"'";
        connection.query(sql, (error, elements) => {
            if(error)
                return reject(error);

            return resolve(elements[0]);
        })
    })
};

exports.checkIfExists = (email) => {
    return new Promise((resolve, reject) => {
        var sql = "SELECT email FROM users WHERE email= '"+ email +"'";
        connection.query(sql, (error, elements) => {
           if(error)
               return reject(error)

            return resolve(elements[0]);
        });
    })
};

