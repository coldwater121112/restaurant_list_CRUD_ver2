const Restaurant = require("../restaurant")
const db = require('../../config/mongoose')
const restaurantList = require("../../restaurant.json").results

db.on("error", () => {
  console.log("mongodb error!")
})

db.once("open", () => {
  console.log("running restaurantSeeder script...")
  Restaurant.create(restaurantList)
    .then(() => {
      console.log("restaurantSeeder done!")
      db.close()
    })
    .catch(err => console.log(err))
})