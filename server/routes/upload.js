const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
	let tipo = req.params.tipo;
	let id = req.params.id;
	if (!req.files){
    	return res.status(400).json({
			ok: false,
			err:{
				message: 'No se ha seleccionado nungun archivo'
			}
		});
	}
	//Validar tipo
	let tiposValidos=['productos', 'usuarios'];
	if(tiposValidos.indexOf(tipo) < 0){
		return res.status(400).json({
			ok: false,
			err:{
				message: 'Los tipos permitidos son ' + tiposValidos.join(', '),			
			}
		});
	}

	let archivo = req.files.archivo;
	let nombreCortado = archivo.name.split('.');
	let extension = nombreCortado[nombreCortado.length -1];

	//Extenciones permitidas
	let extensionesValidas=['png', 'jpg', 'gif', 'jpeg'];

	if(extensionesValidas.indexOf(extension) < 0){
		return res.status(400).json({
			ok: false,
			err:{
				message: 'Las extenciones permitidas son ' + extensionesValidas.join(', '),
				ext: extension			
			}
		});
	}

	//Cambiar nombre al archivo
	let nombreArchivo= `${id}-${new Date().getMilliseconds()}.${extension}`;

	archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) =>{
	    if (err){
	    	return res.status(500).json({
				ok: false,
				err
			});
	    }
	 	//Imagen cargada
	 	if(tipo === 'usuarios'){
	 		imagenUsuario(id, res, nombreArchivo);
	 	}else{
	 		imagenProducto(id, res, nombreArchivo);
	 	}
	    //res.json({
	    //	ok: true,
	    //	message:'Imagen subida correctamente'
	    //});
  	});

});

function imagenUsuario(id, res, nombreArchivo){
	Usuario.findById(id, (err, usuarioDB) => {
		if(err){
			borrarArchivo(nombreArchivo, 'usuarios');
			return res.status(500).json({
				ok: false,
				err
			});
		}
		if(!usuarioDB){
			borrarArchivo(nombreArchivo, 'usuarios');
			return res.status(400).json({
				ok: false,
				err:{
					message: 'Usuario no existe'
				}
			});
		}

		//let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);
		//if(fs.existsSync(pathImagen)){
		//	fs.unlinkSync(pathImagen);
		//}
		borrarArchivo(usuarioDB.img, 'usuarios');

		usuarioDB.img=nombreArchivo;
		usuarioDB.save((err, usuarioGuardado)=> {
			res.json({
				ok:true,
				usuario: usuarioGuardado,
				img: nombreArchivo
			});
		});
	});

}

function imagenProducto(id, res, nombreArchivo){
	Producto.findById(id, (err, productoDB) => {
		if(err){
			borrarArchivo(nombreArchivo, 'productos');
			return res.status(500).json({
				ok: false,
				err
			});
		}
		if(!productoDB){
			borrarArchivo(nombreArchivo, 'productos');
			return res.status(400).json({
				ok: false,
				err:{
					message: 'Usuario no existe'
				}
			});
		}

		borrarArchivo(productoDB.img, 'productos');

		productoDB.img=nombreArchivo;
		productoDB.save((err, productoGuardado)=> {
			res.json({
				ok:true,
				producto: productoGuardado,
				img: nombreArchivo
			});
		});
	});
}

function borrarArchivo(nombreImagen, tipo){
	let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
	if(fs.existsSync(pathImagen)){
		fs.unlinkSync(pathImagen);
	}
}

module.exports = app;