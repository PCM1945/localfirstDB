var PouchDB = require('pouchdb');
const readLineSync = require('readline-sync');


var db = new PouchDB('client1DB');
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
        console.log("CLIENT-1")
        console.log('########################')
        console.log("1 - Create Document");
        console.log("2 - Update counter");
        console.log("3 - Delete Document");
        console.log('4 - Read Document');
        console.log('5 - Reset Counter');
        console.log('0 - Exit')
        console.log('########################')

        userRes = readLineSync.question('Choose An Option: ');
        switch (userRes) {
            case('1'):
                await createDoc(emptyDocument);
            break;
            case('2'):
                var doc = await getDoc(docId);
                if(doc){
                    let counter = doc['counter'];
                    doc['counter'] = counter + 1;
                    await updateDoc(docId, doc);
                    let res= await getDoc(docId)
                    console.log(`Counter: ${res['counter']}`);
                }
                //console.log(counter);
            break;
            case('3'):
                await delDoc(docId);
            break;
            case('4'):
                let response = await getDoc(docId)
                console.log(response);
            break;
            case('5'):
            var doc = await getDoc(docId);
            doc['counter'] = '0';
            await updateDoc(docId, doc);
            let r = await getDoc(docId)
            if(r){
                console.log(`Counter: ${r['counter']}`);
            }
            break;
            case('0'):
                break;
            default:
                console.log('option does not exist');
                break;
        }
    }

}

main()

db.addListener( '',(event) => {
    console.log(event);
})


async function getDoc(doc_id){
    try{
        var response = await db.get(doc_id);
        return response
    }
    catch(err){
        console.log(`Error Name: ${err.name}`);
        console.log(`Error Message: ${err.message}` );
        console.log(err.status);
    }
    
}

async function createDoc(document){
    try {
        console.log('Creating Document...');
        var response = await db.put(document);
        console.log(`Document Created: ${response.ok}`)
      } catch (err) {
        console.log(`Error Name: ${err.name}`);
        console.log(`Error Message: ${err.message}` );
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
        console.log(`Document Updated: ${response.ok}`)
    }
    catch(err){
        console.log(`Error Name: ${err.name}`);
        console.log(`Error Message: ${err.message}` );
        console.log(err.status);
    }
}

async function delDoc(doc_id){
    try {
        console.log('Deleting Document...');
        var doc = await db.get(doc_id);
        var response = await db.remove(doc);
        console.log(`Document Deleted: ${response.ok}`);
      } catch (err) {
        console.log(`Error Name: ${err.name}`);
        console.log(`Error Message: ${err.message}` );
        console.log(err.status);
      }
}


