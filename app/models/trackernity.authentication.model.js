const bcrypt = require("bcryptjs/dist/bcrypt")
const { use } = require("express/lib/application")
const jwt = require("jsonwebtoken")
const { encrypt, decrypt } = require("../utility/crypto-process.js")
const sql = require("./db.js")

const UserData = function(userData){
    this.regional = userData.regional
    this.witel = userData.witel
    this.unit = userData.unit
    this.c_profile = userData.c_profile
    this.user_id = userData.user_id
    this.nama = userData.nama
    this.pass = userData.pass
}

const UserDataLogin = function(userDataLogin){
    this.user_id = userDataLogin.user_id
    this.pass = userDataLogin.pass
}
UserData.getDropdownItemAuth = (result) => {
    let query = `SELECT p_witel.code,p_witel.treg,regional,witel,unit from p_regional RIGHT JOIN p_witel ON p_regional.id = p_witel.id LEFT JOIN p_unit ON p_witel.id = p_unit.id`;
    sql.query(query,
    (err,res) => {
        if(err || !res.length){
            console.log("error: ","No Data!");
            result("No Data!", null);
            return;
        }
        result(null,res);
    }
    )
}

UserData.signUp = (newValues,result) => {
    sql.query(`SELECT userid FROM t_user_mobile_new WHERE LOWER(userid) = LOWER(${sql.escape(newValues.user_id)})`,
    (err,res) =>{
        if(res && res.length){
            console.log("error: This username is already in user!");
            result("This username is already in user!", null);
            return;
        }else{
            bcrypt.hash(newValues.pass, 10, (err, hash) => {
                if(err){
                    console.log("error: ",err);
                    result(err,null);
                    return;
                }else{
                    var insertItem = {
                        regional:newValues.regional,
                        witel:newValues.witel,
                        unit: newValues.unit,
                        c_profile: newValues.c_profile,
                        userid:newValues.user_id,
                        nama:newValues.nama,
                        pass:hash
                    }
                    sql.query(`INSERT INTO t_user_mobile_new SET ?`,insertItem,
                        (err, res) => {
                            if(err){
                                throw err;
                                result(err,null);
                            }else{
                                const successRegister = {
                                    code:"200",
                                    status:"Success Registered !",
                                    data:[
                                        {
                                            user_id:newValues.user_id,
                                            date_time:new Date().toISOString()
                                        }
                                    ]
                                }
                                console.log("successRegister: ",successRegister);
                                result(null,successRegister);
                                return;
                            }
                        });
                }
            });
        }
    });
}

UserDataLogin.login = (values,result) => {
    sql.query(`SELECT * FROM t_user_mobile_new WHERE userid = ${sql.escape(values.user_id)} AND flagging = 'f-0101'`,
    (err,res) => {
        if(err){
            throw err;
            result(err,null);
            return;
        }
        if(!res.length){
            console.log("error: Username or Password incorrect!");
            result("Username or Password incorrect! and could be admin don't give you access!",null);
            return;
        }

        // let encryptedPass = encrypt("terserah123");
            try{
                let decryptedPass = decrypt(values.pass);
        
                // console.log("Decrypted: ",encryptedPass);

                bcrypt.compare(decryptedPass,res[0]['pass'],(bErr,bResult)=>{
                    if(bErr){
                        throw bErr;
                        result("Username or Password incorrect!",null);
                        return;
                    }
                    if(bResult){
                        const token = jwt.sign({
                            nama:res[0].nama,
                            user_id:res[0].user_id,
                        },'SECRETKEY', 
                        {expiresIn:"7d"}
                        );
                        ///////////can add log for login on db//////////
                        const successLogin = {
                            code:"200",
                            status:"Success Login !",
                            data:[
                                {
                                    token,
                                    user: res[0],
                                    date_time:new Date().toISOString()
                                }
                            ]
                        }
                        console.log("successLogin: ", successLogin);
                        result(null,successLogin)
                        return;
                    }
                    console.log("error: Username or Password incorrect!");
                    result("Username or Password incorrect!",null);
                    return;
                })
        }catch(err){
            console.log(err);
            result(err,null);
            return;
        }
    })
}

module.exports = {
    getDropdownItemAuth: UserData.getDropdownItemAuth,
    signUp: UserData,
    login: UserDataLogin
};