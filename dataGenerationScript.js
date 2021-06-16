
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDecimal = (min, max) => parseFloat((Math.random() * (max - min + 1) + min).toFixed(2));

var randomDaysNotice = () => getRandomNumber(0,7);
var randomMonthsNotice = () => getRandomNumber(0,2);
var randomServiceFee = () => getRandomDecimal(0, 300);
var randomCleaningFee = () => getRandomDecimal(0, 150);
var randomMonthlyDiscount = () => getRandomDecimal(5, 60);
var randomWeeklyDiscount = () => getRandomDecimal(5, 40);
var randomPromoDiscount = () => getRandomDecimal(5, 20);
var randomPrice = () => getRandomDecimal(75, 400);

  var generateDataForLocation = () => {
    return {
      cleaningFee: randomCleaningFee(),
      daysNotice: randomDaysNotice(),
      monthsInAdvance: randomMonthsNotice(),
      monthlyDiscount: randomMonthlyDiscount(),
      newListingPromoDiscount: randomPromoDiscount(),
      priceForDate: randomPrice(),
      serviceFee: randomServiceFee(),
      unavailableDates: '',
      weeklyDiscount: randomWeeklyDiscount(),
    }
  }

module.exports = {
  generateDataForLocation: generateDataForLocation
}
