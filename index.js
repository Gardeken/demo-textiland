const app = require("./app");
http = require("http");
server = http.createServer(app);

server.listen(4000, () => {
  console.log("El servidor está activo");
});
