const mongoose = require('mongoose');

DBHOST="mongodb://127.0.0.1:27017/"
DBNAME="parking_registos"
if (!process.env.DBLOCALHOST) {
    throw new Error('indique o host da base de dados: variável de ambiente DBLOCALHOST');
}
if (!process.env.DBATLAS) {
    throw new Error('indique o host da base de dados: variável de ambiente DBATLAS');
}
if (!process.env.DBNAME) {
    throw new Error('indique o nome da base de dados: variável de ambiente DBNAME');
}
const DB = `${process.env.DBNAME}`
const URL_DBLOCALHOST = `mongodb://${process.env.DBLOCALHOST}/${DB}`
const URL_DBATLAS = `mongodb+srv://${process.env.DBATLAS}/${DB}?retryWrites=true&w=majority`

const mongodb = {
    pathLocalhost: URL_DBLOCALHOST, // 'mongodb://127.0.0.1/db_evento',
    pathAtlas: URL_DBATLAS // 'mongodb+srv://aluno:ulPortoEI@cluster0.urlod.mongodb.net/BDAtividadeAula07?retryWrites=true&w=majority'
};


// const urlBaseDados = mongodb.pathLocalhost
const urlBaseDados =mongodb.pathAtlas

mongoose.connect(
    urlBaseDados,
    { useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.on('connected', () => {
    console.log(`Mongoose ligado a ${urlBaseDados}`);
});
mongoose.connection.on('error', err => {
    console.log('Mongoose erro ao conectar: ', err);
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose: foi desligada a ligação. ');
});
