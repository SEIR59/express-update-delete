const express = require('express')
const app = require("liquid-express-views")(express())
const fruits = require('./models/fruits.js')

app.use((req, res, next) => {
    console.log('I run for all routes');
    next();
});

app.use(express.urlencoded({
    extended: false
})) // allows us to view body of a post request

app.use(express.static('public')); //tells express to try to match requests with files in the directory called 'public'

app.use(express.json()) // This prepares our api to receive json data from the body of all incoming requests.

app.get('/', (req, res) => {
    // res.render("show")
    res.send("You have reached the 'home' page whose path is simply '/'")
})

app.get('/fruits/', (req, res) => {
    res.render(
        'index', {
            allFruits: fruits
        }
    )
})

app.get('/fruits/new', (req, res) => {
    res.render('new')
})

app.post('/fruits', (req, res) => {
    if (req.body.readyToEat === 'on') { //if checked, req.body.readyToEat is set to 'on'
        req.body.readyToEat = true; //do some data correction
    } else { //if not checked, req.body.readyToEat is undefined
        req.body.readyToEat = false; //do some data correction
    }
    fruits.push(req.body);
    console.log(req.body);
    res.redirect('/fruits'); //send the user back to /fruits
});

app.get('/fruits/:indexOfFruitsArray', (req, res) => {
    res.render("show", {
        fruit: fruits[req.params.indexOfFruitsArray]
    })
})

app.listen(3000, () => {
    console.log("listening on port 3000!")
})