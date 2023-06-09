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
  origin: 'http://127.0.0.1:8080',
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
  const {newExpense,newExpenseAmount,newBudgetId,user,name,budgId,ifBudgetPage} = req.body;
console.log(req.body)
  try {
    const expenseResponse = await Expense.create({
      name: newExpense,
      amount: newExpenseAmount, 
      budgetId:budgId,//need to use budget id
      budgetName:name || ifBudgetPage,
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


//Delete budget
app.delete('/deleteBudget', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  console.log(req)
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {id} = userData
      await Budget.findByIdAndDelete(req.body.id)
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


app.get('/budgets/:id', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {id} = req.params;
   res.json(await Budget.findById(id));
  
});

app.get('/expenses/:id', async (req,res) => {
 
  mongoose.connect(process.env.MONGO_URL);
  const {id} = req.params;
   res.json(await Expense.find({budgetId:id}));
  
});

app.listen(process.env.PORT||3000);