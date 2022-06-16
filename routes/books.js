var express = require('express');
var router = express.Router();
var jwtHelper = require('../helpers/jwt-helper');
var {body} = require('express-validator');
var booksController = require("../controllers/books-controller");

/* GET home page. */
router.get('/', jwtHelper.authenticateToken, booksController.index);
router.get('/details/:id', jwtHelper.authenticateToken, booksController.showBookDetails);
router.get('/paginated/collection', jwtHelper.authenticateToken, booksController.pagination);
router.get('/paginated/collection/:title', jwtHelper.authenticateToken, booksController.pagination);
router.get('/delete/:id', jwtHelper.authenticateToken, booksController.destroy);
router.get('/addBook', jwtHelper.authenticateToken, booksController.addBook);
router.get('/addBook/:id', jwtHelper.authenticateToken, booksController.addBook);
router.post('/addBook', body('title').isLength({min: 2}), body('author').isLength({min: 1}), jwtHelper.authenticateToken, booksController.store);
router.post('/addBook/:id', body('title').isLength({min: 2}), body('author').isLength({min: 1}), jwtHelper.authenticateToken, booksController.store);
module.exports = router;