var authService = require("../services/auth-service");
var jwtHelper = require('../helpers/jwt-helper');

exports.login =async (req, res) => {
    res.render('login', {
        title: 'books',
        errMsg: {
            valid: false
        }
    })
}

exports.accessUser = async (req, res, next) => {
    const input = {
        email: req.body.email.replace(/(["'])/g, "\\$1"),
        psw: req.body.psw
    };
    const user = await authService.getByEmail(input.email);
    if(user){
        const check = await authService.comparePassword(input.psw, user.password);
        if(check){
            const token = jwtHelper.generateAccessToken(user);
            res.cookie('authorization', 'Bearer '+token).redirect('/api/books');
        }else{
            res.render('login', {
                title: 'books',
                errMsg: {
                    valid: true,
                    msg: 'Incorrect password'
                }
            });
        }
    }else{
        res.render('login', {
            title: 'books',
            errMsg: {
                valid: true,
                msg: 'Incorrect email'
            }
        })
    }
}

exports.register = (req, res) => {
    let formData = {};
    res.render('register', {
        title: 'books',
        errMsg: {
            valid: false
        },
        formData
    });
}

exports.addUser = async (req, res) => {
    const formData = validateRegisterForm(req.body);
    if (formData.valid) {
        const check = await authService.checkIfExists(formData.email.value);
        if (check) {
            res.render('register', {
                title: 'books',
                formData,
                errMsg: {
                    valid: true,
                    msg: 'User already exists'
                }
            });
        } else {
            let input = {
                name: formData.name.value,
                email: formData.email.value,
                password: await authService.cryptPassword(formData.psw.value)
            };
            await authService.addUser(input);
            let user = await authService.getByEmail(input.email);
            const token = jwtHelper.generateAccessToken(user);
            delete(user.password);
            res.cookie('authorization', 'Bearer '+token).redirect('/api/books');
        }
    }
    res.render('register', {
        title: 'books',
        formData: formData,
        errMsg: {
            valid: false
        }
    });
}

exports.logout = (req,res) => {
    res.clearCookie('authorization');
    res.redirect('/api/books');
}

//form validation
function validateRegisterForm(body){
    let name = body.name.replace(/(["'])/g, "\\$1");
    let email = body.email.replace(/(["'])/g, "\\$1");
    let psw = body.psw;

    const emailTest = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const numbersPsw = /[0-9]/g;
    const upperCaseLetters = /[A-Z]/g;
    const lowerCaseLetters = /[a-z]/g;

    let formData = {
        valid: true,
        name: {
            value: name
        },
        email: {
            value: email
        },
        psw: {
            value: psw
        }
    };

    if(!name || name.length<2){
        formData.name = {
            value: name,
            valid: false,
            err: 'Name not valid'
        };

        formData.valid = false;
    }

    if(!email || emailTest.test(String(email).toLowerCase()) == false){
        formData.email = {
            value: email,
            valid: false,
            err: 'Email not valid'
        };

        formData.valid = false
    }

    if(!psw || psw.length < 6 || !psw.match(upperCaseLetters) || !psw.match(lowerCaseLetters) || !psw.match(numbersPsw)){
        formData.psw = {
            value: psw,
            valid: false,
            err: 'Password invalid'
        };

        formData.valid =  false;
    }

    return formData;
}
