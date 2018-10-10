const jwt = require('jsonwebtoken');

//======================
//Veridicar token
//======================

let verificaToken = (req, res, next) => {
	let token = req.get('token');

	jwt.verify(token, process.env.SEED, (err, decoded) =>{
		if(err){
			return res.status(401).json({
				ok: false,
				err
			});
		}
		req.usuario= decoded.usuario;
		next();
	});
};

//======================
//Veridicar AdminRole
//======================
let verificaAdmin_Role = (req,res,next) => {
	let usuario= req.usuario;
	if(usuario.role === 'ADMIN_ROLE'){
		next();
	}else{
		return res.json({
			ok:false,
			err:{
				menssage: 'El usuario no es administrador'
			}
		});
	}
};

//======================
//Veridicar token para imagen
//======================
let verificaTokenImg = (req, res, next) => {
	let token = req.query.token;
	jwt.verify(token, process.env.SEED, (err, decoded) =>{
		if(err){
			return res.status(401).json({
				ok: false,
				err:{
					menssage: 'Token no valido'
				}
			});
		}
		req.usuario= decoded.usuario;
		next();
	});
}

module.exports={
	verificaToken,
	verificaAdmin_Role,
	verificaTokenImg
}