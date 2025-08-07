const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();
const { productUpload} = require('./middleware/cloudinaryUploader');
const cloudinary = require('./utils/cloudinary')


const app = express();
const PORT = process.env.PORT || 3000;

//importing the models
//const User = require('./models/userModel');
const Product = require('./models/productModel');
//const Store = require('./models/storeModel')

//middleware
app.use(cors())
app.use(express.json());
app.use(bodyParser.json());


//saving products
app.post('/products', productUpload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  };

  const { name, price, category, description } = req.body;

  try {
    // Upload the product image to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'product_images',
      use_filename: true,
      unique_filename: false,
      overwrite: false
    });
    const imageUrl = cloudinaryResult.secure_url;
    const publicId = cloudinaryResult.public_id;

    const product = await Product.create({
      name,
      price,
      category,
      description,
      image: imageUrl,
      publicId: publicId
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Error saving product:", err);
    res.status(500).json({ message: "Failed to save product" });
  }
});

//getting user's product data
app.get('/products', async (req, res) => {
  
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

//fetching by category
// Fetching products by brand
app.get('/products/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category: category });  // Fetch products by category
        if (!products.length) {
            return res.status(404).json({ message: `No products found for category ${category}` });
        }
        res.status(200).json(products);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

//Deleting products
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);  // Find the store by ID and delete it

        if (!product) {
            return res.status(404).json({ message: `No product found with ID ${id}` });
        }

        // ✅ Delete image from Cloudinary using publicId
        if (product.publicId) {
        await cloudinary.uploader.destroy(product.publicId);
        }
        // ✅ Then delete the product from DB
        await Product.findByIdAndDelete(id);

        res.status(200).json({ message: `Product with ID ${id} has been deleted` });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});



mongoose.connect('mongodb+srv://aaronasante470:Shootout88@cluster0.tbzubqq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>{
    console.log("connected to mongodb");
    app.listen(PORT, ()=>{
        console.log('callista Wears API is running on port 3000');
    })
}).catch((error) => {  // ✅ include (error)
  console.log("Aaron MongoDB connection error:", error.message);
});


