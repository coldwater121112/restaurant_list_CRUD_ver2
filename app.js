// require packages used in the project
const express = require('express')
const methodOverride = require('method-override');
const port = 3000
const exphbs = require('express-handlebars')
// const restaurantList = require('./restaurant.json')
const mongoose = require("mongoose")
const Restaurant = require("./models/restaurant")

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})


// setting template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// setting static files
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
// routes setting
// 使用者可以瀏覽全部所有餐廳
app.get('/', (req, res) => {
  Restaurant.find() // 取出 Restaurant model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(restaurant => res.render('index', { restaurants: restaurant })) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})

// 新增餐廳頁面
app.get("/restaurants/new", (req, res) => {
  res.render("new")
})

// 新增餐廳
app.post("/restaurants", (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

// 使用者可以瀏覽一家餐廳的詳細資訊
app.get("/restaurants/:restaurant_id", (req, res) => {
  const { restaurant_id } = req.params
  // console.log(restaurant_id)
  // return Restaurant.findById(Object.values(restaurant_id))
  return Restaurant.findById(restaurant_id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// 使用者可以修改一家餐廳的資訊
app.get("/restaurants/:restaurant_id/edit", (req, res) => {
  const { restaurant_id } = req.params
  // console.log(restaurant_id)
  return Restaurant.findById(restaurant_id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})
// post的寫法 Note:<form action="/restaurants/{{ restaurant._id }}" method="POST">
// app.post("/restaurants/:restaurant_id", (req, res) => {
//   const { restaurant_id } = req.params;
//   return Restaurant.findByIdAndUpdate(restaurant_id, req.body)
//     .then(() => res.redirect(`/restaurants/${restaurant_id}`))
//     .catch(error => console.log(error));
// });

app.put("/restaurants/:restaurant_id", (req, res) => {
  const { restaurant_id } = req.params;
  return Restaurant.findByIdAndUpdate(restaurant_id, req.body)
    .then(() => res.redirect(`/restaurants/${restaurant_id}`))
    .catch(error => console.log(error));
});

// 刪除餐廳
app.delete("/restaurants/:restaurant_id", (req, res) => {
  const { restaurant_id } = req.params
  Restaurant.findByIdAndDelete(restaurant_id)
    .then(() => res.redirect("/"))
    .catch(error => console.log(error))
})

// 搜尋餐廳
app.get("/search", (req, res) => {
  // console.log(req.query.keyword)
  if (!req.query.keyword) {
    return res.redirect("/")
  }
  const keyword = req.query.keyword
  Restaurant.find({})
    .lean()
    .then(restaurant => {
      const filterRestaurants = restaurant.filter(
        data =>
          data.name.toLowerCase().includes(keyword) ||
          data.category.includes(keyword)
      )
      res.render("index", { restaurants: filterRestaurants, keyword })
    })
    .catch(error => console.log(error))
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})