const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  breed: {type: Types.ObjectId, ref: 'Breed'},
  image: {type: String, required: true},
  title: {type: String, required: true},
})
module.exports = model('Dog', schema)