const express = require("express");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const net = require("net");

const PORTHTTP = 8080;
const PORTSOCKET = 5000;

require('dotenv').config(); // leitura ficheiro .env (npm i dotenv --save)
// console.log(process.env) // listar environment
if (!process.env.PORT) {
    throw new Error('indique a porta onde iniciar o servidor HTTP: variável de ambiente PORT');
}
const PORT = process.env.PORT


//Registar os schemas
const UtilizadorModel = require("./src/models/utilizadorModel");
const VeiculoModel = require("./src/models/veiculoModel");
const ParqueModel = require("./src/models/parqueModel");
const AluguerModel = require("./src/models/aluguerModel");

//Importar as rotas
const UtilizadorRoutes = require("./src/routes/utilizadorRoutes");
const VeiculoRoutes = require("./src/routes/veiculosRoutes");
const ParqueRoutes = require("./src/routes/parqueRoutes");
const AluguerRoutes = require("./src/routes/aluguerRoutes");

//Importar controlador do servidor socket
const SocketController = require("./src/controllers/socketController");

// configuração do express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Configuração do middleware cors
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // 'Content-Type');
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT ,DELETE");
    next();
});

const openAPIDoc = require("./API-Docs/openapi_v0.json");
// middleware para incluir a documentação OpenAPI
app.use(
    "/api-docs", // a rota onde a documentação ficará disponível
    swaggerUI.serve, // servidor da documentação
    swaggerUI.setup(openAPIDoc) // documento com a especificação da API
);

//Inicializar o passport
const passport = require("passport");
require("./src/config/configPassport");
app.use(passport.initialize());

//Configurar o JWT
const { expressjwt: jwt } = require("express-jwt");
const autenticacao = jwt({
    secret: "esteEoSegredo",
    userProperty: "payload",
    algorithms: ["HS256"], // novo??
});



// error handlers
// Catch unauthorised errors
app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({ message: err.name + ": " + err.message });
    }
});

// Registar as rotas
UtilizadorRoutes(autenticacao, app);
VeiculoRoutes(autenticacao, app);
ParqueRoutes(autenticacao, app);
AluguerRoutes(autenticacao, app);

app.listen(PORTHTTP, () =>
    console.log(`Servidor RESTful a executar em http://localhost:${PORTHTTP}`)
);


const server = net.createServer((connection) => {
    SocketController.callbackCreateFunction(connection);
});

server.listen(PORTSOCKET, () => {
    SocketController.callbackListenFunction(PORTSOCKET);
});
