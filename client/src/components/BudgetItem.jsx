//rrd
import { Form, Link, Navigate } from "react-router-dom";
// helper functions
import { calculateSpentByBudget, calculateSpentByBudgets, formatCurrency, formatPercentage } from "../helpers";

//library import
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BudgetItem = ({ budget, showDelete=false }) => {
  const { _id, name, amount,} = budget;
  const spent = calculateSpentByBudgets(_id);//trying to pass name to use helper function to get all exps



  const [deleteId, newDeleteId] = useState('');
  const [redirect, setRedirect] = useState(false);

  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
      //console.log(expense._id)
       await axios.delete('/deleteBudget', {data: {id: budget._id}});
       setRedirect(true)
       toast.success('Budget Deleted')
 
    } 
    catch (e) {
      // alert('Login failed');
      console.log(e)
    }
  }

  if (redirect) {
    return <Navigate to={'/Dashboard'} />
  }


  return (
    <div
      className="budget"
 
    >
      <div className="progress-text">
        <h3>{name}</h3>
        <p>{formatCurrency(amount)} Budgeted</p>
      </div>
      <progress max={amount} value={spent} key={_id}>
      {formatPercentage(spent / amount)}
      </progress>
      <div className="progress-text">
        <small>{formatCurrency(spent)} spent</small>
        <small>{formatCurrency(amount - spent)} remaining</small>
      </div>
        {
          showDelete ? (
            <div className="flex-sm">
            <Form method="post"
            onClick={(event) => {
              if(!confirm("Are you sure you want to permanently delete this budget?")){
                event.preventDefault();
              }
            }}
            onSubmit={handleLoginSubmit}
            >
             <button type="submit" className="btn">
              <span>Delete Budget</span>
              <TrashIcon width={20}/>
              </button> 
            </Form>
            </div>

          ) : (
            <div className="flex-sm">
                <Link
            to={`/budget/${_id}`}
            className = "btn"
            >
            <span>View Details</span>
            <BanknotesIcon width={20}/>
            </Link>
            </div>
            
          )
        }
    </div>
  )
}
export default BudgetItem