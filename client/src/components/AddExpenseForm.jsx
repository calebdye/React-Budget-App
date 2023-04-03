// react imports
import { useContext, useEffect, useRef, useState } from "react"

// rrd imports
import { redirect, useFetcher } from "react-router-dom"

// library imports
import { PlusCircleIcon } from "@heroicons/react/24/solid"
import { UserContext } from "./UserContext"
import axios from "axios"
import { toast } from "react-toastify"

const AddExpenseForm = ({ budgets }) => {
  const fetcher = useFetcher()
  const isSubmitting = fetcher.state === "submitting";

  const formRef = useRef()
  const focusRef = useRef()

  const [newExpense, setNewExpense] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newBudgetId, setNewBudgetId] = useState('');
  const {ready,user,setUser} = useContext(UserContext);
  
  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
       await axios.post('/expense', {newExpense,newExpenseAmount,newBudgetId,user});
       
       toast.success('Expense Created')
 
    } 
    catch (e) {
      // alert('Login failed');
      console.log(e)
    }
  }



  useEffect(() => {
    if (!isSubmitting) {
      // clear form
      formRef.current.reset()
      // reset focus
      focusRef.current.focus()
    }

  }, [isSubmitting])

  return (
    <div className="form-wrapper">
      <h2 className="h3">Add New{" "}<span className="accent">
        {budgets.length === 1 && `${budgets.map((budg) => budg.name)}`}
      </span>{" "}
        Expense
      </h2>
      <fetcher.Form
        method="post"
        className="grid-sm"
        ref={formRef}
        onSubmit={handleLoginSubmit}
      >
        <div className="expense-inputs">
          <div className="grid-xs">
            <label htmlFor="newExpense">Expense Name</label>
            <input
              type="text"
              name="newExpense"
              id="newExpense"
              placeholder="e.g., Coffee"
              ref={focusRef}
              value= {newExpense}
              onChange={ev => setNewExpense(ev.target.value)}
              required
            />
          </div>
          <div className="grid-xs">
            <label htmlFor="newExpenseAmount">Amount</label>
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              name="newExpenseAmount"
              id="newExpenseAmount"
              placeholder="e.g., 3.50"
              value= {newExpenseAmount}
              onChange={ev => setNewExpenseAmount(ev.target.value)}
              required
            />
          </div>
        </div>
        <div className="grid-xs" hidden={budgets.length === 1}>
          <label htmlFor="newExpenseBudget">Budget Category</label>
          <select name="newExpenseBudget" id="newExpenseBudget" required
          onChange={ev => setNewBudgetId(ev.target.value)}
          >
            <option value="" >Select Budget</option>
            {
              budgets
                .map((budget) => {
                  return (
                    <option key={budget._id} value={budget._id}>
                      {budget.name} 
                    </option>
                  )
                })
            }
          </select>
        </div>
        {/* <input type="hidden" name="_action" value="createExpense" /> */}
        <button type="submit" className="btn btn--dark" disabled={isSubmitting}>
          {
            isSubmitting ? <span>Submitting…</span> : (
              <>
                <span>Add Expense</span>
                <PlusCircleIcon width={20} />
              </>
            )
          }
        </button>
      </fetcher.Form>
    </div>
  )
}
export default AddExpenseForm