const { verificarUsuario } = require("./queries");
const jwt = require("jsonwebtoken");

const isAuth = async(req, res, next) => {
    const authorization = req.header("Authorization")
    const token = authorization.split("Bearer ")[1]
    jwt.verify(token, process.env.SECRET_KEY)
    req.mail = jwt.decode(token)
    next()
}

const usuarioExiste = async (req, res, next) => {
    try {
        await verificarUsuario(req.body.mail);
        next();
    } catch (error) {
        //throw new Error( { code: 500, message: error.message });    
        res.status(400).send(error);
    }
};

module.exports = {
    isAuth,
    usuarioExiste,
};
