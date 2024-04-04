var PouchDB = require('pouchdb');
const readLineSync = require('readline');

const readline = require('readline');
//const fileStream = fs.createReadStream('input.txt');

const rl = readline.createInterface({
  input: process.stdin, //or fileStream 
  output: process.stdout
});


dbName = 'client2DB'
docId = 'doc'
const emptyDocument = {
    "_id" : docId,
    '_rev': 0,
     "counter": 0
  } 
  
var db = new PouchDB(dbName);
//var db = new PouchDB('http://localhost:4321/dataBase')
//db.changes()

sync()

function sync(){
    var sync = PouchDB.sync(`${dbName}`, `./client1DB`, {
        live: true,
        retry: true
    }).on('change', function (info) {
        // handle change
        console.log(info.direction);
    }).on('paused', function (err) {
        console.log('Replication Paused', err);
        // replication paused (e.g. replication up to date, user went offline)
    }).on('active', function () {
        console.log('replicate resumed')
        // replicate resumed (e.g. new changes replicating, user went back online)
    }).on('denied', function (err) {
        console.log(`Replication Denied: ${err}`);
        // a document failed to replicate (e.g. due to permissions)
    }).on('complete', function (info) {
        console.log('Sync Complete')
    }).on('error', function (err) {
        console.log(err)
        // handle error
    });
}




async function main(){
    let userRes;
    while (userRes !== '0') {
        
        console.log("CLIENT-2")
        console.log('########################')
        console.log("1 - Create Document");
        console.log("2 - Update counter");
        console.log("3 - Delete Document");
        console.log('4 - Read Document');
        console.log('5 - Reset Counter');
        console.log('0 - Exit')
        console.log('########################')
        const userRes = await new Promise(resolve => {
            rl.question("Choose An Option: ", resolve)
          })
        //userRes = readLineSync.question('Choose An Option: ');
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
                let res= await getDoc(docId)
                console.log(`Counter: ${res['counter']}`);
            break;
            case('3'):
                await delDoc(docId);
            break;
            case('4'):
                let response = await getDoc(docId)
                if(response){
                     console.log(response['counter']);
                }
               
            break;
            case('5'):
            var doc = await getDoc(docId);
            doc['counter'] = '0';
            await updateDoc(docId, doc);
            let r = await getDoc(docId)
            console.log(`Counter: ${r['counter']}`);
            break;
            case('0'):
                db.close()
                //sync.cancel()
                break;
            default:
                console.log('option does not exist');
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
        console.log(`Document Updated: ${response.ok}`)
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
        console.log(`Document Deleted: ${response.ok}`);
      } catch (err) {
        console.log(err.name);
        console.log(err.message);
        console.log(err.status);
      }
}





