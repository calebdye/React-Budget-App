// rrd imports
import { Link, Navigate, useLoaderData } from "react-router-dom";

// library imports
import { toast } from "react-toastify";

// components
import Intro from "../components/Intro";
import AddBudgetForm from "../components/AddBudgetForm";
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";

//  helper functions
import { createExpense, deleteItem, fetchData, waait } from "../helpers"
import { UserContext } from "../components/UserContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";


// loader
// export async function dashboardLoader() {
//   const userName = fetchData("userName");
//   const budgets = fetchData("budgets");
//   const expenses = fetchData("expenses");
//   return { userName, budgets, expenses }
// }

// action
// export async function dashboardAction({ request }) {
 //  await waait();

//   const data = await request.formData();
//   const { _action, ...values } = Object.fromEntries(data)

  // new user submission
  // if (_action === "newUser") {
  //   try {
  //     localStorage.setItem("userName", JSON.stringify(values.userName))
  //     return toast.success(`Welcome, ${values.userName}`)
  //   } catch (e) {
  //     throw new Error("There was a problem creating your account.")
  //   }
  // }

  // if (_action === "createBudget") {
  //   try {
  //     createBudget({
  //       name: values.newBudget,
  //       amount: values.newBudgetAmount,
  //     })
  //     return toast.success("Budget created!")
  //   } catch (e) {
  //     throw new Error("There was a problem creating your budget.")
  //   }
  // }

  // if (_action === "createExpense") {
  //   try {
  //     createExpense({
  //       name: values.newExpense,
  //       amount: values.newExpenseAmount,
  //       budgetId: values.newExpenseBudget
  //     })
  //     return toast.success(`Expense ${values.newExpense} created!`)
  //   } catch (e) {
  //     throw new Error("There was a problem creating your expense.")
  //   }
  // }

//   if (_action === "deleteExpense") {
//     try {
//       deleteItem({
//         key: "expenses",
//         id: values.expenseId,
//       });
//       return toast.success(`Expense deleted!`)
//     } catch (e) {
//       throw new Error("There was a problem deleting your expense.")
//     }
//   }
// }



const Dashboard = () => {
  const [exps, setExps] = useState([])
  const [budgs, setBudgs] = useState([])

  useEffect(()=> {
    axios.get('/budgets').then(({data}) => {
      setBudgs(data);
    });
  }, []);

  useEffect(()=> {
    axios.get('/expenses').then(({data}) => {
      setExps(data);
    });
  }, []);


  // const { budgets, expenses } = useLoaderData()
  const {ready,user,setUser} = useContext(UserContext);
  const [redirect,setRedirect] = useState(null);

  if (!ready) {
    return 'Loading...';
  }
  
  if (ready && !user && !redirect) {
    return <Navigate to={'/'} />
  }
  
  if (redirect) {
    return <Navigate to={'/'} />
  }

  return (
    <>
      {
        <div className="dashboard">
          <h1>Welcome back, <span className="accent">
            {!!user && (
              <div>
            {user.name}    
              </div>
          )}
          </span></h1>
          <div className="grid-sm">
            {
              budgs && budgs.length > 0
                ? (
                  <div className="grid-lg">
                    <div className="flex-lg">
                      <AddBudgetForm />
                      <AddExpenseForm budgets={budgs} />
                    </div>
                    <h2>Existing Budgets</h2>
                    <div className="budgets">
                      {
                        budgs.map((budget) => (
                          <BudgetItem key={budget._id} budget={budget} />
                        ))
                      }
                    </div>
                    {
                      exps && exps.length>0 && (
                     <div className="grid-md">
                      <h2>Recent Expenses</h2>
                      <Table 
                      expenses={exps
                      .slice(0,8)} 
                      />
                      {exps.length > 8 && (
                        <Link
                        to="expenses"
                        className="btn btn--dark">
                          View all expenses
                        </Link>
                      )}
                     </div>
                      )
                    }
                  </div>
                )
                : (
                  <div className="grid-sm">
                    <p>Personal budgeting is the secret to financial freedom.</p>
                    <p>Create a budget to get started!</p>
                    <AddBudgetForm />
                  </div>
                )
            }
          </div>
        </div>
}
    </>
  )
}
export default Dashboard