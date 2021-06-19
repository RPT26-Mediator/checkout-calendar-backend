const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const db = process.env.DATABASE
const host = process.env.HOST
const user = process.env.DBUSER
const dbPassword = process.env.DB_PASS

console.log('db -> ', db)
console.log('host -> ', host)
console.log('user -> ', user)

const sequelize = new Sequelize(db, user, dbPassword, {
  host: host,
  dialect: 'postgres',
  logging: false,
  port: 5432
});
var {generateDataForLocation} = require('./dataGenerationScript.js')
const {performance} = require('perf_hooks');

const connect = (async () => {
  try {
    await sequelize.authenticate();
    console.log('sequelize connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})()

const LocationInfo = sequelize.define('locationinfo', {
  // Model attributes are defined here
    cleaningFee:  {type: DataTypes.DECIMAL},
    daysNotice: {type: DataTypes.SMALLINT},
    monthsInAdvance : {type: DataTypes.SMALLINT},
    monthlyDiscount: {type: DataTypes.DECIMAL},
    newListingPromoDiscount:  {type: DataTypes.DECIMAL},
    priceForDate:  {type: DataTypes.DECIMAL},
    serviceFee: {type: DataTypes.DECIMAL},
    unavailableDates : {type: DataTypes.TEXT},
    weeklyDiscount:  {type: DataTypes.DECIMAL}
  }, {
  freezeTableName: true
});

const LocationInfoInit =  (async() => {
  try {
    await LocationInfo.sync()
    console.log('LocationInfo initialized')
    var firstItemInDb = await getDataFromDbWithId(1)
    if (firstItemInDb.length === 0) {
      // seed db here
      // seedDb()
      console.log('db is empty')
    } else {
      // console.log('firstItemInDb -> ', firstItemInDb)
    }
  } catch (error) {
    console.error('unable to initialize locationinfo', error);
  }
})()

const getDataFromDbWithId = async (id) => {
  try {
    var data = await LocationInfo.findAll({ where: {id: id}})
    // console.log(`data for id ${id} -> `,data)
    return data
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
// getDataFromDbWithId(1)
const insertIntoDb = async function() {
  const data = generateDataForLocation()
  try {
    await LocationInfo.create({
      cleaningFee: data.cleaningFee,
      daysNotice: data.daysNotice,
      monthlyDiscount: data.monthlyDiscount,
      monthsInAdvance : data.monthsInAdvance,
      newListingPromoDiscount: data.newListingPromoDiscount,
      priceForDate: data.priceForDate,
      serviceFee: data.serviceFee,
      unavailableDates : data.unavailableDates,
      weeklyDiscount: data.weeklyDiscount
      })
    } catch (error) {
      console.log('db save error -> ', error)
    }
}
// insertIntoDb()

var generateDataArray = (amount) => {
  var storage = []
  for ( var i = 1; i <= amount; i++) {
    var data = generateDataForLocation()
    storage.push(data)
  }
  return storage
}
var createBulkData = async () => {
  var data = generateDataArray(10000)
  try {
    await LocationInfo.bulkCreate(data, { validate: true });
  } catch (error) {
    console.error('Unable to create bulk data', error);
  }
}
// for small queries
const addAmountToDb = async (amount) => {
  for (var i = 0; i < amount; i++ ){
    await insertIntoDb()
  }
}
const seedDb = async () => {
  console.time('seedDB')
  for (var i = 0 ; i < 1000; i++) {await createBulkData()}
  console.timeEnd('seedDB')
}
const getSizeOfDb = async () => {
  console.time('counting all rows in db')
  try {
    var numberOfRows = await LocationInfo.count('*')
    console.log('numberOfRows in db -> ',numberOfRows )
    console.timeEnd()
    return numberOfRows
  } catch(error) {
    console.log('entering error')
    console.log('error counting all records in db ->', error)
  }
}
getSizeOfDb()

const updateIdWithData = async (id, data) => {
  console.log('id -> ', id)
  try {
    await LocationInfo.update(data, {where: {id: id}});
    // console.log('updated id -> ', id)
  } catch(err) {
    console.log('error updating data -> ', err)
  }
}

const deleteDataWithId = async (id) => {await LocationInfo.destroy({where: {id: id}});}

const deleteNumberOfRecords = async (amount) => {
  var lastRecordId = await getSizeOfDb()
  console.log('lastRecordId', lastRecordId)
  var stoppingPoint = lastRecordId - amount
  for (var i = lastRecordId; i > stoppingPoint; i--) {
      await deleteDataWithId(i)
  }
  console.log('done deleting')
}
// deleteNumberOfRecords(33607)
// addAmountToDb(2)
const test50000GetRecords = async () => {
  const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  var queryTimes = []
  for (var i = 0; i < 50000; i++) {
    var start = performance.now();
    var randomId = getRandomNumber(0,10000000)
    try {
      await getDataFromDbWithId(randomId)
      var end = performance.now();
      var time = end - start;
      queryTimes.push(time)
    } catch(err) {
      console.log('error getting data -> ', err)
    }
  }
  const totalTime = queryTimes.reduce((accumulator, element) => {
    return accumulator + element;
  }, 0);
  var averageTime = totalTime / queryTimes.length
  console.log('average time -> ', averageTime)
}

const test50000UpdateQueries = async () => {
  const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  var queryTimes = []
  for ( var i = 0; i < 50000; i++) {
    var start = performance.now();
    var randomId = getRandomNumber(0,10000000)
      try {
        console.log('randomId id right here ->', randomId)

        await updateIdWithData(i,generateDataForLocation())
        var end = performance.now();
        var time = end - start;
        queryTimes.push(time)
      } catch(err) {
        console.log('error updating data -> ', err)
      }
  }
  const totalTime = queryTimes.reduce((accumulator, element) => {
    return accumulator + element;
  }, 0);
  var averageTime = totalTime / queryTimes.length
  console.log('average time -> ', averageTime)
}

const test50000DeleteQueries = async () => {
var amount = 500000
var queryTimes = []
  for (var i = 1; i < 50000; i++) {
    var start = performance.now();
    try {
      await deleteDataWithId(i)
      var end = performance.now();
      var time = end - start;
      queryTimes.push(time)
    } catch(err) {
      console.log('error -> ', err)
    }
  }
  const totalTime = queryTimes.reduce((accumulator, element) => {
    return accumulator + element;
  }, 0);
  var averageTime = totalTime / queryTimes.length
  console.log('average time -> ', averageTime)
}

module.exports = {
  insertIntoDb,
  getDataFromDbWithId,
  updateIdWithData,
  deleteDataWithId,
  addAmountToDb,
  deleteNumberOfRecords,
  getSizeOfDb,
}