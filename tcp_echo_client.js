'use strict'
const net = require('net');
const readline = require('readline');
const options = {};

options.host = process.argv[2];
options.port = process.argv[3];
const client = net.connect(options);

client.on('error', () => {
    console.error('Connection Failed -' + options.host + ':' + options.port);
    console.error(e.message);
});

client.on('connect', () => {
    console.log('Connected - ' + options.host + ':' + options.port);
});

const rl = readline.createInterface(process.stdin, process.stdout);
rl.on('SIGINT', () => {
    console.log('Connection Closed - ' + options.host + ':' + options.port);
    client.end();
    rl.close();
});

let i=0;
client.setTimeout(1000);
client.on('timeout', () => {
    const str = i + ' Hello World\n';
    process.stdout.write('[S] ' + str);
    client.write(str);
    i = i + 1;
});

client.on('data', (chunk) => {
    process.stdout.write(chunk.toString());
});

client.on('end', (had_error) => {
    client.setTimeout(0);
    console.log('Connection End - ' + options.host + ':' + options.port);
});

client.on('close', () => {
    console.log('Client Closed');
});
