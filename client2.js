var PouchDB = require('pouchdb');
const readLineSync = require('readline-sync');


var db = new PouchDB('client2DB');
//var db = new PouchDB('http://localhost:4321/dataBase')

docId = 'doc'
const emptyDocument = {
  "_id" : docId,
  '_rev': 0,
   "counter": 0
} 

async function main(){
    let userRes;
    while (userRes !== '0') {
        console.log("create document 1");
        console.log("Update Document 2");
        console.log("Delete Document 3");
        console.log('Read Document   4');

        userRes = readLineSync.question('Choose An Option: ');
        switch (userRes) {
            case('1'):
                await createDoc(emptyDocument);
            break;
            case('2'):
                var doc = await getDoc(docId);
                let counter = doc['counter'];
                //console.log(counter);
                doc['counter'] = counter + 1;
                await updateDoc(docId, doc);
            break;
            case('3'):
                await delDoc(docId);
            break;
            case('4'):
                let response = await getDoc(docId)
                console.log(response);
            break;
        }
    }

}

main()

async function getDoc(doc_id){
    try{
        var response = await db.get(doc_id);
        return response
    }
    catch(err){
        console.log(err.name);
        console.log(err.message);
        console.log(err.status);
    }
    
}

async function createDoc(document){
    try {
        console.log('Creating Document...');
        var response = await db.put(document);
        console.log(`Document Created: ${response.ok}\n`)
      } catch (err) {
        console.log(err.name);
        console.log(err.message);
        console.log(err.status);
      }
}

async function updateDoc(doc_id, docContents){
    try{
        console.log('Updating Document...');
        var doc = await db.get(doc_id);
        var response = await db.put({
            ...docContents,
            '_id': doc._id,
            '_rev': doc._rev,
        })
        console.log(`Document Updated: ${response.ok}\n`)
    }
    catch(err){
        console.log(err.name);
        console.log(err.message);
        console.log(err.status);
    }
}

async function delDoc(doc_id){
    try {
        console.log('Deleting Document...');
        var doc = await db.get(doc_id);
        var response = await db.remove(doc);
        console.log(`Document Deleted: ${response.ok}\n`);
      } catch (err) {
        console.log(err.name);
        console.log(err.message);
        console.log(err.status);
      }
}


