let express = require('express');
let router = express.Router();

let examController = require('./controllers/examController');

router.get('/', (req,res) => res.redirect('/test'))              //Changer formation selon l'examen
router.get('/test', examController.testYourself);
router.get('/vocab', examController.listVocab);
router.post('/vocab/add', examController.addWord);
router.get('/vocab/delete/:i', examController.deleteWord);
router.post('/test/enter', examController.checkTranslation);

module.exports = router;