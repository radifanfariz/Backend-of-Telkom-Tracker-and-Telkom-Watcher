

module.exports = {
    ValidateRegister: (req,res,next) => {
        if (!req.body.user_id || req.body.user_id.length < 3){
            return res.status(400).send("Please enter a username with min. 3 chars");
        }

        if (!req.body.pass || req.body.pass.length < 6){
            return res.status(400).send("please enter a password with min. 6 chars");
        }

        if (!req.body.pass_repeat || req.body.pass != req.body.pass_repeat){
            return res.status(400).send("Both passwords must match");
        }
        next();
    },
    isLoggedIn: () => {},
}