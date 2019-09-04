const server = require("./server.js");

const port = 4444;

server.listen(port, () => console.log(`Server listening on port ${port}`))