const express = require('express');
const app = express();
app.use(express.static('public'));
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

express.json();
express.urlencoded({ extended: true });