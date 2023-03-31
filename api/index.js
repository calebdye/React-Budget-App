const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const User = require('./models/User.js');
const Budget = require('./models/Budget.js');
const Expense = require('./models/Expense.js');


require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';


app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: 'http://127.0.0.1:5173',
}));


function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

app.get('/api/test', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json('test ok');
});


app.post('/register', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {name,email,password} = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password:bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
    console.log(e)
  }

});

app.post('/login', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {email,password} = req.body;
  const userDoc = await User.findOne({email});
  console.log(userDoc)
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({
        email:userDoc.email,
        id:userDoc._id
      }, jwtSecret, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('pass not ok');
    }
  } else {
    res.status(404).json('not found');
  }
});


//Create budget
app.post('/budget', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {newBudget,newBudgetAmount,user} = req.body;

  try {
    const budgetResponse = await Budget.create({
      name: newBudget,
      amount: newBudgetAmount, 
      owner:user._id,
    });
    res.json(budgetResponse);
  } catch (e) {
    res.status(422).json(e);
    console.log(e)
  }

});

//Get budgets
app.get('/budgets', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;

  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {id} = userData
      res.json(await Budget.find({owner:id}));
    });
  } else {
    res.json(null);
  }
});


//Create expenses
app.post('/expense', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {newExpense,newExpenseAmount,newBudgetId,user} = req.body;

  try {
    const expenseResponse = await Expense.create({
      name: newExpense,
      amount: newExpenseAmount, 
      budgetId:newBudgetId,//need to use budget id
      owner:user._id,
    });
    res.json(expenseResponse);
  } catch (e) {
    res.status(422).json(e);
    console.log(e)
  }
});

//Get expenses
app.get('/expenses', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);

  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {id} = userData

      res.json(await Expense.find({owner:id}));
    });
  } else {
    res.json(null);
  }
});

//Delete expenses
app.delete('/deleteExpense', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {id} = userData
      await Expense.findByIdAndDelete(req.body.id)
      res.json('Deleted');
    });
  } else {
    res.json(null);
  }
});





app.post('/logout', (req,res) => {
  res.cookie('token', '').json(true);
});

app.get('/profile', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {name,email,_id} = await User.findById(userData.id);
      res.json({name,email,_id});
    });
  } else {
    res.json(null);
  }
});


app.post('/api/places', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  const {
    title,address,addedPhotos,description,price,
    perks,extraInfo,checkIn,checkOut,maxGuests,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner:userData.id,price,
      title,address,photos:addedPhotos,description,
      perks,extraInfo,checkIn,checkOut,maxGuests,
    });
    res.json(placeDoc);
  });
});

app.get('/api/user-places', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const {id} = userData;
    res.json( await Place.find({owner:id}) );
  });
});

app.get('/api/places/:id', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {id} = req.params;
  res.json(await Place.findById(id));
});

app.put('/api/places', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  const {
    id, title,address,addedPhotos,description,
    perks,extraInfo,checkIn,checkOut,maxGuests,price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,address,photos:addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,price,
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
});



app.listen(4000);