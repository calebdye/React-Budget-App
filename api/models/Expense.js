const mongoose = require('mongoose');
const {Schema} = mongoose;


const ExpenseSchema = new Schema({
  name: String,
  amount: Number,
  budgetId: {type:mongoose.Schema.Types.ObjectId, ref:'Budget'},
});

const ExpenseModel = mongoose.model('Expense', ExpenseSchema);

module.exports = ExpenseModel;