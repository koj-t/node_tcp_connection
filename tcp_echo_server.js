'use strict'
const net = require('net');
const readline = require('readline');
const server = net.createServer();

server.maxConnections = 3;
class Client {
    constructor (socket) {
        this.socket = socket;
    }
    writeData (d) {
        if (this.socket.writable) {
            const key = this.socket.remoteAddress + ':' + this.socket.remotePort;
            process.stdout.write('[' + key + '] - ' + d );
            this.socket.write('[R] ' + d);
        }
    }
}

let clients = {};
server.on('connection',  (socket) => {
    let status = server.connections + '/' + server.maxConnections;
    const key = socket.remoteAddress + ':' + socket.remotePort;
    console.log('Connection Start(' + status + ') - ' + key);
    clients[key] = new Client(socket);

    let data = '';
    const newline = /\r\n|\n/;
    socket.on('data',  (chunk) => {
        data += chunk.toString();
        if (newline.test(data)) {
            clients[key].writeData(data);
            data = '';
        }
    });

    socket.on('end',  () => {
        status = server.connections + '/' + server.maxConnections;
        console.log('Connection End(' + status + ') - ' + key);
        delete clients[key];
    });
});

server.on('close',  () => {
    console.log('Server Closed');
});
server.listen(11111, '127.0.0.1',  () => {
    const addr = server.address();
    console.log('Listening Start on Server - ' + addr.address + ':' + addr.port);
});

const rl = readline.createInterface(process.stdin, process.stdout);
rl.on('SIGINT',  () => {
    for (const i in clients){
        const socket = clients[i].socket;
        socket.end();
    }
    server.close();
    rl.close();
});
