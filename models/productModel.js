const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productName: String,
  productPrice: Number,
  productStock: Number,
  productCategory: String,
  productImage: {type: String, required: true},
  publicId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
