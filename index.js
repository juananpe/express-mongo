const express = require('express');
const mongojs = require('mongojs')
const db = mongojs('mongodb://127.0.0.1:29000/test', ['inventory'])
const app = express();
const port = 3000;

// enable json body parsing
app.use(express.json());

// enable post body parsing
app.use(express.urlencoded({extended: true}));

// use templates
app.set('view engine', 'ejs');
app.set('views', './views');

let remove = function(res, id){
    db.inventory.remove({_id: mongojs.ObjectId(id)}, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
}
app.delete('/inventory/:id', (req, res) => {
    remove(res, req.params.id)
});

app.get('/inventory/delete/:id', (req, res) => {
    remove(res, req.params.id)
})

app.post('/inventory', (req, res) => {
    // insert the document
    db.inventory.insert(req.body, (err, result) => {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
        }
    })
})

app.get('/inventory', (req, res) => {
    db.inventory.find((err, docs) => {
        if (err) {
            res.send(err);
        } else {
            res.render('inventory', {elements: docs})
        }
    })
})

app.get('/edit/:id', (req, res) => {
    db.inventory.findOne({_id: mongojs.ObjectId(req.params.id)}, (err, doc) => {
        if (err) {
            res.send(err);
        } else {
            console.log(doc)
            res.render('edit', {element: doc})
        }
    })
})

app.post('/edit/:id', (req, res) => {

    req.body.size = JSON.parse(req.body.size)
    console.log(req.body)
    console.log(req.params.id)

    db.inventory.findAndModify({
            query: {_id: mongojs.ObjectId(req.params.id)},
            update: {$set: req.body}
        },
        (err, result) => {
            if (err) {
                res.send(err)
            } else {
                res.redirect('/inventory')
            }
        })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
