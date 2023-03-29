// reacts
import { useContext, useEffect, useRef, useState } from "react";

// rrd imports
import { Form, useFetcher } from "react-router-dom"

// library imports
import { CurrencyDollarIcon } from "@heroicons/react/24/solid"
import { toast } from "react-toastify";
import axios from "axios";
import { UserContext } from "./UserContext";

const AddBudgetForm = () => {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting"

  const formRef = useRef();
  const focusRef = useRef();

  const [newBudget, setNewBudget] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const {ready,user,setUser} = useContext(UserContext);
  async function handleLoginSubmit(ev) {
     ev.preventDefault();
    try {
       await axios.post('/budget', {newBudget,newBudgetAmount,user});
       
       toast.success('Budget Created')
    } 
    catch (e) {
      // alert('Login failed');
      console.log(e)
    }
  }

  useEffect(() => {
    if (!isSubmitting) {
      formRef.current.reset()
      focusRef.current.focus()
    }
  }, [isSubmitting])

  return (
    <div className="form-wrapper">
      <h2 className="h3">
        Create budget
      </h2>
      <fetcher.Form
        method="post"
        className="grid-sm"
        ref={formRef}
        onSubmit={handleLoginSubmit}
      >
        <div className="grid-xs">
          <label htmlFor="newBudget">Budget Name</label>
          <input
            type="text"
            name="newBudget"
            id="newBudget"
            placeholder="e.g., Groceries"
            value= {newBudget}
            onChange={ev => setNewBudget(ev.target.value)}
            required
            ref={focusRef}
          />
           
        </div>
        <div className="grid-xs">
          <label htmlFor="newBudgetAmount">Amount</label>
          
          <input
            type="text"
            name="newBudget"
            id="newBudget"
            placeholder="e.g., $350"
            value= {newBudgetAmount}
            onChange={ev => setNewBudgetAmount(ev.target.value)}
            required
            ref={focusRef}
            inputMode="decimal"
            />
        </div>

        <button type="submit" className="btn btn--dark" disabled={isSubmitting}>
          {
            isSubmitting ? <span>Submitting…</span> : (
              <>
                <span>Create budget</span>
                <CurrencyDollarIcon width={20} />
              </>
            )
          }
        </button>
      </fetcher.Form>
    </div>
  )
}
export default AddBudgetForm