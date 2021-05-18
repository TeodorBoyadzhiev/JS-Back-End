const http = require('http');


const server = http.createServer(requestHendler);


function requestHendler(req, res) {
    res.write('Gys do gys');
    res.end();
}

server.listen(3000);