const express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;


var url = 'mongodb+srv://vtrshu:Vtrshukun1@cluster1-4jh5j.mongodb.net/test';

router.get('/', async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("toystore");
    let results = await dbo.collection("product").find({}).toArray();
    res.render('allToy', { toy: results });
})

///---------------------------Insert Toy---------------------------------------

router.get('/insert', (req, res) => {
    res.render('insertToy');
})
router.post('/insert', async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("toystore");
    let name = req.body.ToyName;
    let type = req.body.type;
    let price = req.body.price;
    if(price > 200){
        res.render('insertToy', {error: "Price must be < 200"});
    }
    let newtoy = {
        
            ToyName: name,
            type: type,
            price: price,
        
    };
    await dbo.collection("product").insertOne(newtoy);

    let results = await dbo.collection("product").find({}).toArray();
    res.render('allToy', { toy: results });
})


/// --------------------------Edit Toy-----------------------------------------
router.get('/edit', async (req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;

    let client = await MongoClient.connect(url);
    let dbo = client.db("toystore");
    let result = await dbo.collection("product").findOne({ "_id": ObjectID(id) });
    res.render('editDetail', { toy: result });

})
///---------------------------Post edit infomation-----------------------------
router.post('/edit', async (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let type = req.body.type;
    let price = req.body.price;
    if(price > 200){
        res.render('editDetail', {error: "Price must be < 200"});
    }
    let newValues = { $set: { ToyName: name, type: type, price: price } };
    var ObjectID = require('mongodb').ObjectID;
    let condition = { "_id": ObjectID(id) };
    
     

    let client = await MongoClient.connect(url);
    let dbo = client.db("toystore");
    await dbo.collection("product").updateOne(condition, newValues);
    //
    let results = await dbo.collection("product").find({}).toArray();
    res.render('allToy', { toy: results });
})

///------------------------------------Delete Toy------------------------------------


router.get("/delete", async (req, res) => {
    let id = req.query.id;
    var ObjectID = require("mongodb").ObjectId;
    let condition = { "_id": ObjectID(id) };

    // let client = MongoClient.connect(url);
    // let dbo = client.db("toystore");
    // await dbo.collection("product").deleteOne(condition);

    // let results = await dbo.collection("product").find({}).toArray();
    // res.render('allToy', { toy: results });
    MongoClient.connect(url, async function(err, db) {
        if (err) throw err;
        var dbo = db.db("toystore");
        await dbo.collection("product").deleteOne(condition, function(err, obj) {
          if (err) throw err;
          console.log("1 document deleted");
          db.close();
        });
      });
      res.redirect("/toy");

})

///-------------------------------------Search for toy---------------------------------

router.get('/search', (req, res) => {
    res.render('searchToy');
})

router.post('/search', async (req, res) => {
    let searchtoy = req.body.ToyName;
    let client = await MongoClient.connect(url);
    let dbo = client.db("toystore");
    let results = await dbo.collection("product").find({ "ToyName": searchtoy }).toArray();
    res.render('allToy', { toy: results });
})
//--------------------------------Limit PRICE----------------------------

module.exports = router;