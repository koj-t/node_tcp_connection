var net = require('net');
var readline = require('readline');

var options = {};
options.host = process.argv[2];
options.port = process.argv[3];

var client = net.connect(options);

client.on('error', function(e){
  console.log('Connection Failed - ' + options.host + ':' + options.port);
  console.error(e.message);
});

client.on('connect', function(){
  console.log('Connected - ' + options.host + ':' + options.port);
});

var rl = readline.createInterface(process.stdin, process.stdout);
rl.on('SIGINT', function(){
  console.log('Connetion Closed -' + options.host + ':' + options.port);
  client.end();
  rl.close();
});

var i = 0;
client.setTimeout(1000);
client.on('timeout', function(){
  var str = i + ': Hello World\n';
  process.stdout.write('[S]' + str);
  client.write(str);
  i = i + 1;
});

client.on('data', function(chunk){
  process.stdout.write(chunk.toString());
});

client.on('end', function(had_error){
  client.setTimeout(0);
  console.log('Connetion End - ' + options.host + ':' + options.port);
});

client.on('close', function(){
  console.log('Client Closed');
  rl.close();
});
