
Mickey Shop (Handmade Goods E-Commerce Website)
===============================================

This project is a full-stack e-commerce web application for browsing, searching, and purchasing handmade products. It includes user registration, cart functionality, and order tracking.

Features
--------
- User registration and login with hashed passwords
- Searchable product catalog with stock filtering
- Persistent cart per user
- Checkout with order creation and inventory updates
- View past orders

Project Structure
-----------------
/public          => Static HTML, CSS, JS files
/public/js       => Frontend scripts (user.js, checkout.js, etc.)
/public/styles   => Stylesheets
server.js        => Main Express server
handmade_products.json => Optional sample data

Requirements
------------
- Node.js 
- MongoDB (running locally on default port 27017)

Installation
------------
1. Run server (optionally load sample product data)

   There is a file named 'handmade_products.json' in the root directory with product entries,
   you can ensure that the last line in 'server.js' is uncommented (it should be already) to run:

   addDataToDatabase();

   Then run the server once to insert products:

   cd to directory of server.js, and run 

    node server.js

   in a terminal

   After data is inserted, comment that line again to prevent re-insertion.

2. Visit the app

   Open your browser and navigate to:
   http://localhost:3000

MongoDB Structure
-----------------
- Database: mickeyShop
- Collections:
  - users: { username, password (hashed) }
  - products: { name, description, price, quantity, tags, ... }
  - carts: { userId, productId, quantity }
  - orders: { userId, items[], total, date }
