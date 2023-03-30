//rrd
import { Form, Link } from "react-router-dom";
// helper functions
import { calculateSpentByBudget, formatCurrency, formatPercentage } from "../helpers";

//library import
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";

const BudgetItem = ({ budget, showDelete=false }) => {
  const { _id, name, amount,} = budget;
  const spent = calculateSpentByBudget(name);//trying to pass name to use helper function to get all exps

  return (
    <div
      className="budget"
 
    >
      <div className="progress-text">
        <h3>{name}</h3>
        <p>{amount} Budgeted</p>
      </div>
      <progress max={amount} value={spent} key={_id}>
        {amount}
      </progress>
      <div className="progress-text">
        {/* <small>{formatCurrency(spent)} spent</small> */}
        <small>{amount} remaining</small>
      </div>
        {
          showDelete ? (
            <div className="flex-sm">
            <Form method="post"
            action="delete"
            onSubmit={(event) => {
              if(!confirm("Are you sure you want to permanently delete this budget?")){
                event.preventDefault();
              }
            }}
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