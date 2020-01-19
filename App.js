'use strict';
// Web stuff
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Mongo
const {MongoClient, ObjectId} = require('mongodb');

const { sortByGrade, findLowestAverageGrades } = require('./operators')

const uri = "<INPUT HERE BEFORE RUNNING PROGRAM>";
const DB_NAME = "assessment_db";
const COL_NAME = "students";


app.set('view engine', 'pug');
app.set('views','./views');

var database, collection;

app.listen(5000, () => {
    MongoClient.connect(uri, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DB_NAME);
        collection = database.collection(COL_NAME);
        console.log("Connected to `" + DB_NAME + "`!");
    });
});

var toType = function(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

app.get('/', (req, res) => {
    console.log("Aha someone came!");

    var students = collection.find({}).toArray().then( (arr) => {return JSON.parse(JSON.stringify(arr));} )  ;

    students.then((students)=> {res.render('index',{students:students})});

});

app.post('/', (req, res) => {
    // Yes, this function is very packed.. terrible complexity.. prototype...
    
    if (req.body.student_select == undefined)
    {
        console.error("You need to enter students!");
        res.redirect('/');
        return;
    }

    if (req.body.subtype == "View Info") // If we want to view info
    {
        console.log("Sorting now by the view info of each student!");
        let ids = req.body.student_select.map(val => ObjectId(val));
        let query = { _id : {$in: ids}  };

        var students = collection.find({}).toArray().then( (arr) => {return JSON.parse(JSON.stringify(arr));} )  ;
        var selected_students = collection.find(query).toArray().then( arr => { return JSON.parse(JSON.stringify(arr)) } );

        students.then((students) => {
            selected_students.then(selected_students => {
                res.render('view_info', {students:students, selected_students: selected_students});
            });
        });
    }
    else if (req.body.subtype == "Sort By Grade")
    {
        console.log("Sorting now by the grade of each student!");
        let ids = req.body.student_select.map(val => ObjectId(val));
        let query = { _id : {$in: ids}  };

        var students = collection.find({}).toArray().then( (arr) => {return JSON.parse(JSON.stringify(arr));} )  ;
        var selected_students = collection.find(query).toArray().then( arr => { return JSON.parse(JSON.stringify(arr)) } );

        students.then((students) => {
            selected_students.then(selected_students => {
                const [sorted_students, grades] = sortByGrade(selected_students);
                res.render('view_sorted', {students:students, sorted_students:sorted_students});
            });
        });
    }
    else if (req.body.subtype == "Lowest Average GPA(s)")
    {
        console.log("This is the Lowest Average GPA of Each Selected Students!");
        let ids = req.body.student_select.map(val => ObjectId(val));
        let query = { _id : {$in: ids}  };

        var students = collection.find({}).toArray().then( (arr) => {return JSON.parse(JSON.stringify(arr));} )  ;
        var selected_students = collection.find(query).toArray().then( arr => { return JSON.parse(JSON.stringify(arr)) } );

        students.then((students) => {
            selected_students.then(selected_students => {
                const [lowest_students, min_avgs] = findLowestAverageGrades(selected_students);
                console.log("GOT The averages!");
                console.log(lowest_students);
                console.log(min_avgs);
                res.render('view_lowest', {students:students, lowest_students:lowest_students, averages:min_avgs});
            });
        });
    }
    else
    {
        res.send("Don't recognize this post request!")
    }
});
