'use strict';
const db = require('./database').db
const key = require('./secret').security_key;

const getLogin = async() => {
    return {
        title: 'Login',
        layout: 'login-layout'
    }
}

const getakun = async() => {
    
}

const Login = async(username, password) => {
    //var encrypted = cipher.update(username, 'utf8', 'base64') + cipher.final('base64');
    //var decrypted = decipher.update(encrypted, 'base64', 'utf8') + decipher.final('utf8');
    try {
        let query = `SELECT * FROM USERS WHERE username = '${username}' AND password = '${password}'`
        const login = db.prepare(query).all();
        // console.log(login.length);
        if (login.length == 1 ) {
            return {status: 'ok'}
        }else{
            return {status: 'no'}
        }   
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getLogin,
    Login
}