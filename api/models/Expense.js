const mongoose = require('mongoose');
const {Schema} = mongoose;


const ExpenseSchema = new Schema({
  name: String,
  amount: Number,
  budgetId: String,
  owner: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
});

const ExpenseModel = mongoose.model('Expense', ExpenseSchema);

module.exports = ExpenseModel;