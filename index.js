const express = require('express');
const {logRequestTofile, searchForProductPrice} = require('./utils/fileLogHandler');

const app = express();
const port = 3000;

app.use(express.urlencoded());
app.use(express.json());

app.post('/api/reprice', (req, res) => {
    const body = req.body;
    try {
        logRequestTofile(body)
        .then(res.status(202).send())
        .catch(err => {console.log(err)})
    } catch(e) {
        console.log(e);
        res.status(500).send();
    }
});

app.get('/api/product/:id/price', (req, res) => {
    const productId = req.params.id;
    try {
        searchForProductPrice(productId)
        .then(productInfo => res.status(202).send(productInfo))
        .catch(err => res.status(err.status).send(err.message));
    } catch (e) {
        res.status(500).send();
    }
});

app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
});
