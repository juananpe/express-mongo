const express = require('express');
const mongojs = require('mongojs')
const db = mongojs('mongodb://127.0.0.1:27017/test', ['inventory'])
const app = express();
const port = 3000;

// use templates
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => res.send('Hello World!'));


app.get('/inventory', (req, res) => {
    db.inventory.find((err, docs) => {
        if (err) {
            res.send(err);
        } else {
            res.render('inventory', {elements: docs})
        }
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
