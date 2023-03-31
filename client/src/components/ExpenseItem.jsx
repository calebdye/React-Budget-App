//helper
import { Link, useFetcher } from "react-router-dom";

//library import
import { TrashIcon } from "@heroicons/react/24/solid";

//rrd
import { formatCurrency, formatDatetoLocaleString, getAllMatchingItems } from "../helpers"
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const ExpenseItem = ({expense, showBudget}) => {
  const fetcher = useFetcher();
  const budget = getAllMatchingItems({
    category: "budgets",
    key: "_id",//not sure if needs _
    value: expense.budgetId
  })[0];

  const [deleteId, newDeleteId] = useState('');

  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
      console.log(deleteId)
       await axios.post('/deleteExpense', expense._id);
       
       toast.success('Expense Created')
 
    } 
    catch (e) {
      // alert('Login failed');
      console.log(e)
    }
  }

  return (
    <>
    <td>{expense.name}</td>
    <td>{expense.amount}</td>
    <td>{expense.budgetId}</td>
    <td>{expense._id}</td>
    {/* <td>{expense.createdAt)}</td> */}
    
    { showBudget && (
    <td>
      
      {/* <Link
    to={`/budget/${budget.id}`}
    style={{"--accent": budget.color,
  }}
    >
      {budget.name}
    </Link> */}
    </td>
      )}
    <td>
    <fetcher.Form 
    method="post"
    onSubmit={handleLoginSubmit}
    >

        <input type="hidden" name="expenseId"
        value={expense._id} 
        onChange={ev => newDeleteId(expense._id)}
        />
        <button
        type="submit"
        className="btn btn--warning"
        aria-label={`Delete ${expense.name} expense`}
        >
          <TrashIcon width={20}/>
        </button>
      </fetcher.Form>
    </td>
    </>
  )
}

export default ExpenseItem