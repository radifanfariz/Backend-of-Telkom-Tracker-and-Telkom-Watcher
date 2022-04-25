const UserData = require("../models/trackernity.authentication.model");
const SignUp = UserData.signUp;
const Login = UserData.login;
const getDropdownItemAuth = UserData.getDropdownItemAuth;

exports.getDropdownItemAuth = (req,res) => {
    getDropdownItemAuth((err,data)=>{
        if(err){
            res.status(500).send(err);
        }else{
            console.info(data);
            res.send(data);
        }
    })
}

exports.signUp = (req,res) => {
    if(!req.body){
        res.status(400).send("Content can not be empty!");
    }

    const userData = new SignUp({
        regional: req.body.regional,
        witel: req.body.witel,
        unit: req.body.unit,
        c_profile: req.body.c_profile,
        nama: req.body.nama,
        user_id: req.body.user_id,
        pass: req.body.pass
    });

    SignUp.signUp(userData,(err,success)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.send(success);
        }
    });
}

exports.login = (req,res) => {
    if(!req.body){
        res.status(400).send("Content can not be empty!");
    }

    const userDataLogin = new Login({
        user_id: req.body.user_id,
        pass: req.body.pass
    });

    Login.login(userDataLogin,(err,success) => {
        if(err){
            res.status(500).send(err);
        }else{
            res.send(success);
        }
    })
}