//==================
//Puerto
//==================
process.env.PORT = process.env.PORT || 3000;

//==================
//Entorno
//==================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==================
//Vencimiento del Token
//==================
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = '48h';

//==================
//SEED de autorización
//==================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//==================
//Base de datos
//==================
let urlBD;

if(process.env.NODE_ENV === 'dev'){
	urlBD = 'mongodb://localhost:27017/cafe';
}else{
	urlBD = process.env.MONGO_URI;
}
process.env.URLDB = urlBD;

//==================
//Google Client ID
//==================
process.env.CLIENT_ID = process.env.CLIENT_ID || '692387307251-rbc5lkn9esjiog8ld5hevq32mpr4qo46.apps.googleusercontent.com';