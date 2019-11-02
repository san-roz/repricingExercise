const express =           require('express');
const fileLogHandler =    require('./utils/fileLogHandler');

const app = express();
const port = 3000;

app.use(express.urlencoded());
app.use(express.json());

app.post('/api/reprice', (req, res) => {
    const body = JSON.stringify(req.body);
    try {
        fileLogHandler.logRequestTofile(body)
        .then(() => {res.status(202).send()})
        .catch(err => {throw err})
    } catch(e) {
        console.log(e);
        res.status(400).send();
    }
});

app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
});