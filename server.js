const PORT = 8000;
var http = require('http');
var server = http.createServer( (request, response) => {
	console.log(request.body);
});


server.listen(PORT, ()=> {
	console.log("Server listening on port %s", PORT);
});
