const express = require('express');

const app = express();
const port = 3000;


app.get('/', (req, res) => {
    res.send('Welcome Page');
});

app.get('/catalog', (req, res) => {
    res.send('Hello, Express!');
});

app.get('/edit', (req, res) => {
    res.redirect('catalog');
});

app.listen(port, () => console.log('Server is listening on port ' + `${port}`));