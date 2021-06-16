const express = require('express')
const app = express()
require('dotenv').config();
const port = process.env.PORT || 1000
// app.use('/:productId', express.static(path.join(__dirname, '../public')));
app.use(express.static('../public'));

// const newRelic = require('newrelic');

const {
  insertIntoDb,
  getDataFromDbWithId,
  updateIdWithData,
  deleteDataWithId,
  addAmountToDb,
  deleteNumberOfRecords,
  getSizeOfDb
} = require('./dbms.js')

app.get('/checkoutInformation/:productId', (req, res) => {
  // send new data here
  var id = req.params.productId
  getDataFromDbWithId(id)
  .then((data) => {
    data = data[0].dataValues
    data.listingId = data.id
    console.log('data from get request -> ', data)
    res.send(data)
  })
  .catch((error) => {
    console.log('db: error from get request -> ', error)
    var message = `could not get item with ${id} -> ${error}`
    res.send(message)
  })
})

app.get('/dbSize', (req, res) => {
  getSizeOfDb()
  .then((data) => {
    var message = `number of rows in db -> ${data}`
    res.send(message)
  })
  .catch((error) => {
    var message = `could not db size -> ${error}`
    res.send(message)
  })
})

app.get('/db/:id', (req, res) => {
  var id = req.params.id;
  getDataFromDbWithId(id)
  .then((data) => {
    var data = data[0].dataValues
    data.listingId = data.id
    res.send(data)
  })
  .catch((error) => {
    var message = `could not get item with ${id} -> ${error}`
    res.send(message)
  })
})

app.put('/db/:id', (req, res) => {
  var id = req.params.id;
  var data = req.body
  updateIdWithData(id, data)
  .then((data) => {
    var message  = `updated listing data for id  -> , ${id}`
    res.send(message)
  })
  .catch((err) => {
    var message = `could not update listing data for id -> ${id}, ${err}`
    res.send(message)
  })
})

app.delete('/db/:id', (req, res) => {
  var id = req.params.id;
  deleteDataWithId(id)
  .then((response) => {
    var message = `item with is ${id} has been removed from db`
    res.send(message)
  })
  .catch((err) => {
    var message = `item with ${id} was not removed from db -> ${err}`
    res.send(message)
  })
})
app.get('/testDb/', (req, res) => {
  var randomNum = (min, max) => { return Math.floor(Math.random() * (max - min)) + min}
  var id = randomNum(1,10000000)
  console.log('entering testdb',id )
  getDataFromDbWithId(id)
  .then((data) => {
    console.log('data from get request -> ', data)
    res.send(data)
  })
  .catch((error) => {
    var message = `could not get item with ${id} -> ${err}`
    res.send(message)
  })
})
app.post('/testDb', (req, res) => {
  insertIntoDb()
  .then((data) => {
    console.log('data created successfuly in post request -> ')
    res.send(data)
  })
  .catch((error) => {
    var message = `could not add item to db -> ${err}`
    res.send(message)
  })
})
app.put('/testDb', (req, res) => {
  var randomNum = (min, max) => { return Math.floor(Math.random() * (max - min)) + min}
  var id = randomNum(1,10000000)
  updateIdWithData(id,generateDataForLocation())
  .then((data) => {
    console.log('data updated scuccessfuly in put request')
    res.end()
  })
  .catch((error) => {
    var message = `could not update id ${id} -> ${err}`
    res.send(message)
  })
})
app.delete('/testDb', (req, res) => {
  var randomNum = (min, max) => { return Math.floor(Math.random() * (max - min)) + min}
  var id = randomNum(1,10000000)
  deleteNumberOfRecords(1)
  .then((data) => {
    console.log('data updated scuccessfuly in put request')
    res.end()
  })
  .catch((error) => {
    console.log('put request failed -> ', error)
    res.end()
  })
})
app.listen(port, () => console.log(`server is running on port => ${port}`))
