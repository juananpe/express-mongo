const express = require('express');
const mongojs = require('mongojs')
const db = mongojs('mongodb://127.0.0.1:27017/test', ['inventory'])
const app = express();
const port = process.env.PORT || 3000;


// the middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));


// use templates
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => res.redirect('/inventory'));


app.get('/inventory', (req, res) => {
    db.inventory.find((err, docs) => {
        if (err) {
            res.send(err);
        } else {
            res.render('inventory', {elements: docs})
        }
    })
})

app.post('/inventory/add', (req, res) => {
    let newItem = {
        item: req.body.item,
        qty: parseInt(req.body.qty),
        size: JSON.parse(req.body.size), // Assuming size is in JSON format
        status: req.body.status
    };

    db.inventory.insert(newItem, (err, doc) => {
        if (err) {
            res.send("There was a problem adding the information to the database.");
        } else {
            res.redirect('/inventory');
        }
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
