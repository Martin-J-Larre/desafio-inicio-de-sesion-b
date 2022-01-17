import server from './src/app.js';
require("dotenv").config();

const port = process.env.PORT || 8001

const server = app.listen(port, () => {
    console.log(`Server on http://localhost:${server.address().port}`);
});
server.on("error", (err) => console.log(`Error in server: ${err}`));

