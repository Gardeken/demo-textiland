const app = require("./app");
http = require("http");
server = http.createServer(app);
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("El servidor está activo, en el puerto " + PORT);
});
