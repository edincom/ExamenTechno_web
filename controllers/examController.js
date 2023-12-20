var mysql = require('mysql2');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database : 'voc',   // A modifier
});



connection.connect(function(error) {if(error) console.log(error)});

liste_voc = []

let wordtest
let successtest
let attempttest

exports.testYourself = function(req,res){
    connection.query('SELECT * FROM vocab ORDER BY RAND() LIMIT 1', function(error,result){
        if (error) console.log(error);

        console.log(result);
        console.log(result[0]["translation"]);
        let wordtoFind = result[0]["translation"];
        wordtest = result[0]["word"];
        successtest = result[0]["success"];
        attempttest = result[0]["attempt"];

        res.render("home.ejs", {translation : wordtoFind, msg :" "});
    })
}

exports.listVocab = function(req,res){
    if (liste_voc.length === 0) {
        connection.query('select * from vocab;', function (error, result) {
            let word;
            if (error) console.log(error);
            for (const row of result) {
                word = row;
                liste_voc.push(word);
            }
            console.log(typeof liste_voc[0]["attempt"])
            console.log(liste_voc[0]["attempt"])
            console.log(liste_voc[0]["attempt"]/liste_voc[0]["attempt"]);
            console.log(liste_voc)
            res.render('Vocabulary.ejs', {ListeofVoc: liste_voc});
            liste_voc = [];
        });
    }
}

exports.addWord = function(req,res){
    let newword = {"word": req.body.word};
    let newtrans = {"translation": req.body.translation};
    connection.query('INSERT INTO vocab (word,translation) VALUES (?,?);', [newword["word"],newtrans["translation"]], function(error,result) {
        if(error) console.log(error);
        res.redirect('/vocab');
    })
}

exports.deleteWord = function(req,res){
    let wordToDelete = req.params.i;
    connection.query("DELETE FROM vocab WHERE word = ?;", wordToDelete, function(error, result) {
        if (error) console.log(error);
        res.redirect('/vocab');
    })
}

exports.checkTranslation = function(req,res){
    let word = req.body.word;
    console.log(word);
    console.log(wordtest);
    if (word == wordtest){
        console.log("T'as raison");
        attempttest = attempttest + 1;
        successtest = successtest + 1;
        connection.query('UPDATE vocab SET success=?, attempt=? WHERE word = ?', [successtest, attempttest, wordtest], function(error, result){
            res.redirect('/test');
        })
    }
    else{
        console.log("T'as pas raison");
        attempttest = attempttest + 1;
        connection.query('UPDATE vocab SET attempt=? WHERE word = ?', [attempttest, wordtest], function(error,result){
            res.redirect('/test');
        })
    }
}