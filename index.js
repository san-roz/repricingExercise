const express = require('express');
      file =       require('./file');

const app = express();
const port = 3000;

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.post('/api/reprice', (req, res) => {
    const body = JSON.stringify(req.body);
    try {
        file.logRequestTofile(body);
        res.status(202).send();
    } catch(e) {
        console.log(e);
        res.status(400).send();
    }
});

app.listen(port, () => {
    console.log(`server started listening on port ${port}`)
});