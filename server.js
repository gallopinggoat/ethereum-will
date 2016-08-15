var http = require("http-server")
var fs = require("fs")


const PORT = 8000;


http.createServer( (request, response) => {
	console.log(request);
}).listen(PORT, () => {
	console.log("Server listening on port %s", PORT);
});
