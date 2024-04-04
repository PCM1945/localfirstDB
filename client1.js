var PouchDB = require('pouchdb');

var db = new PouchDB('http://localhost:4321/dataBase')

var emptyDB = {
    counter : 0
} 