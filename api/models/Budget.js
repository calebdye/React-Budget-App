const mongoose = require('mongoose');
const {Schema} = mongoose;


const BudgetSchema = new Schema({
  name: String,
  amount: Number,
  owner: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
});

const BudgetModel = mongoose.model('Budget', BudgetSchema);

module.exports = BudgetModel;