const express = require("express");
const path = require("path");
const {Server} = require("ws");

const app = express();

/**
 * HTTP Server
 */
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'server', 'client_browser.html')));

const httpServer = app.listen(5000, 'localhost', () => {
    console.log('HTTP server is listening on localhost:5000');
});

/**
 * WebSocket Server
 */
const wsServer = new Server({port:5085}); // Starts the WebSocket server on port 8085
console.log('WebSocket server is listening on localhost:5085');

let nClientes = 0;  //index do numero de clients no server
let nickname = ''   //para associar o /nickname escolhido

wsServer.on('connection',
    wsClient => {
        const id = ++nClientes;     //counter para o numero de clients no server
        wsClient.send(`CLIENTE ${id}`);
        console.log(id);
        wsClient.onmessage = (event) => {
            if (event.data.includes('/nickname')) {     //se o que escrever na textbox contiver /nickname
                wsClient.id = nickname

                if (event.data.includes('/to')) {       //se o que escrever na textbox contiver /to
                    const id_mensagem = event.data.indexOf(' ', 4)  //para receber o id do client
                    const nickname_singular = event.data.substring(4, id_mensagem) //para receber o nickname
                    const msg_singular = event.data.substring(id_mensagem, event.data.length) //junta os dois de cima
                    const msg = {emissor: nickname, mensagem: `${nickname} -> ${msg_singular}`};

                    wsServer.clients.forEach(client => {    // broadcast para todos os clients
                        if (nickname_singular === client.id)        // so se o /to nickname for igual ao client que escreve
                            client.send(msg.mensagem)
                    })
                } else {
                    const dados = {parque: nickname, matricula: `${nickname} -> ${event.data}`};  //envia a mensagem
                    console.log(dados)

                    wsServer.clients.forEach(
                        client => {
                            if (client !== wsClient) {  //para dar refresh nas páginas dos clients
                                client.send(msg.mensagem)
                            }
                        }
                    )
                }
            }
            wsClient.onerror = (error) => console.log(`The server received: ${error['code']}`);
        }
    }
);