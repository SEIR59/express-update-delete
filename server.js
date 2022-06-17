const express = require('express')
const app = require("liquid-express-views")(express())
const fruits = require('./models/fruits.js')
const rowdy = require('rowdy-logger')
const routesReport = rowdy.begin(app)

const methodOverride = require('method-override')

app.use((req, res, next) => {
    console.log('I run for all routes');
    next();
});

app.use(express.urlencoded({
    extended: false
})) // allows us to view body of a post request

app.use(express.static('public')); //tells express to try to match requests with files in the directory called 'public'

app.use(express.json()) // This prepares our api to receive json data from the body of all incoming requests.

// use methodOverride. We'll be adding q query parameter to our delete form named _method
app.use(methodOverride('_method'))

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

app.delete('/fruits/:indexOfFruitsArray', (req, res) => {
    fruits.splice(req.params.indexOfFruitsArray, 1) //remove the item from the array
    res.redirect('/fruits') // redirect back to index route

})

app.get('/fruits/:indexOfFruitsArray/edit', (req, res) => {
    res.render(
        'edit', 
        {
            fruit: fruits[req.params.indexOfFruitsArray], 
            index: req.params.indexOfFruitsArray
        }
    )
})

app.put('/fruits/:indexOfFruitsArray', (req, res) => {
    // console.log(req.body)
    if (req.body.readyToEat === "on"){
        req.body.readyToEat = true
    } else {
        req.body.readyToEat = false
    }
    fruits[req.params.indexOfFruitsArray].color = req.body.color
    res.redirect('/fruits')
})

app.listen(3000, () => {
    console.log("listening on port 3000!")
    routesReport.print()
})