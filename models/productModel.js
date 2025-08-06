const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  description: String,
  image: {type: String, required: true},
  publicId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
