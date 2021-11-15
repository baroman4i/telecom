const express = require('express')
const https = require('https')
const mongoose = require('mongoose')
const Dog = require('./models/Dog')
const Breed = require('./models/Breed')
const app = express()
const port = 5000
const url = "https://dog.ceo/api/breeds/image/random";
let dogs = []
let breeds = []

const addBreed = async (arr, data) => {
  const title = arr[4]
  let writeResult = null
  const isАdded = await Breed.findOne({title})
  if (isАdded) writeResult = isАdded._id
  else {
    const breed = new Breed({title})
    writeResult = await breed.save()
  }
  addDog(arr, data, writeResult._id)
}
const addDog = async (arr, data, id) => {
  const title = arr[5].substr(0, arr[5].indexOf('.'))
  const isАdded = await Dog.findOne({title})
  if (isАdded) return console.log('такая собака уже eсть в базе')
  const dog = new Dog({
    breed: id,
    image: data.message,
    title: title
  })
  await dog.save()
}
const setDogs = () => {
  new Promise((resolve, reject) => {
    for (let i = 0; i < 100; i++) {
      https.get(url, response => {
        let data = ''
        response.on('data', chunk => {
          data += chunk
        });
        response.on('end', async () => {
          data = JSON.parse(data)
          const splitEls = data.message.split('/')
          await addBreed(splitEls, data)
          i == 99 ? resolve(data) : null 
        })
      }).on('error', err => {
        console.error(err)
      })
    }
  })
  .catch(err => console.log(err.message))
}
app.get('/', (req, res) => {
  res.send('work')
})
app.get('/getels', async (req, res) => {
  try {
    await setDogs()
    return res.json(dogs)
  }
  catch (err) {
    return res.send(err.message) 
  }
})
app.get('/dogs', async (req, res) => {
  dogs = await Dog.find({})
  // breeds = await Breed.find({})
  // console.log(array)
  res.json(dogs)
})
const start = async () => {
  try {
    await mongoose.connect('mongodb+srv://admin4ik:admin4ik1234@baroman.dtezh.mongodb.net/testtelecom?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(app.listen(port, () => console.log(`Example app listening on port ${port}!`)))
  } catch (err) {console.log(err)}
}
start()

