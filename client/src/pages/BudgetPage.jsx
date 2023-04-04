//rrd
import { useLoaderData, useParams } from "react-router-dom";
//library
import { toast } from "react-toastify";
//componenets
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";
//helpers
import { createExpense, deleteItem, getAllMatchingItems } from "../helpers"
import { useEffect, useState } from "react";
import axios from "axios";

//loader
// export async function budgetLoader({params}) {
//   const budget = await getAllMatchingItems({
//       category: "budgets",
//       key: "id",
//       value: params.id
//   })[0];

//   const expenses = await getAllMatchingItems({
//       category: "expenses",
//       key: "budgetId",
//       value: params.id
//   });

//   if(!budget){
//       throw new Error("The budget you are trying to find does not exist")
//   }

//   return {budget, expenses}
// }

// //action
// export async function budgetAction({request}) {
//   const data = await request.formData();
//   const {_action, ...values} = Object.fromEntries(data);

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
//   if (_action === "createExpense") {
//       try {
//         createExpense({
//           name: values.newExpense,
//           amount: values.newExpenseAmount,
//           budgetId: values.newExpenseBudget
//         })
//         return toast.success(`Expense ${values.newExpense} created!`)
//       } catch (e) {
//         throw new Error("There was a problem creating your expense.")
//       }
//     }

// }



// const BudgetPage = () => {
//  // const {budget, expenses} = useLoaderData();



//     const {id} = useParams();
//   const [budget,setBudget] = useState(null);
//   const [expenses,setExpense] = useState(null);
//   useEffect(() => {
//     if (!id) {
//       return;
//     }
//     axios.get(`/budgets/${id}`).then(response => {
//       setBudget(response.data);
//       console.log(response.data)
//     });
//   }, [id]);

  
//   useEffect(() => {
//     if (!id) {
//       return;
//     }
//     axios.get(`/expenses/${id}`).then(response => {
//       setExpense(response.data);
//       console.log(response.data)
//     });
//   }, [id]);


// return (
  // <div className="grid-lg"
  // // style={{
  // //     "--accent": budget.color,
  // // }}
  // >
  //     <h1 className="h2">
  //         <span className="accent">{budget.name}</span>{" "}Overview
  //     </h1>
  //     <div className="flex-lg">
  //         <BudgetItem budget={budget} showDelete={true}/>
  //         <AddExpenseForm budgets={[budget]} />
  //     </div>
  //     {
  //         expenses && expenses.length > 0 && (
  //             <div className="grid-md">
  //                 <h2>
  //                     <span className="accent">{budget.name}</span>
  //                     Expenses
  //                 </h2>
  //                 <Table expenses={expenses} showBudget={false}/>
  //             </div>
  //         )
  //     }
  // </div>
//)
//}

// export default BudgetPage





const BudgetPage = () => {

  const {id} = useParams();
  const [budget,setBudget] = useState(null);
  const [expenses,setExpense] = useState(null);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/budgets/${id}`).then(response => {
      setBudget(response.data);
      console.log(response.data)
    });
  }, [id]);

  
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/expenses/${id}`).then(response => {
      setExpense(response.data);
      console.log(response.data)
    });
  }, [id]);

  if (budget) {
    
    return (
    
    
      <div className="grid-lg"
      // style={{
      //     "--accent": budget.color,
      // }}
      >
          <h1 className="h2">
              <span className="accent">{budget.name}</span>{" "}Overview
    
          </h1>
          <div className="flex-lg">
              <BudgetItem budget={budget} showDelete={true}/>
              <AddExpenseForm budgets={[budget]} ifBudgetPage={budget.name}/>
          </div>
          {
              expenses && expenses.length > 0 && (
                  <div className="grid-md">
                      <h2>
                          Expenses
                      </h2>
                      <Table expenses={expenses} showBudget={false}/>
                  </div>
              )
          }
      </div>
    )
  } else {'loading'}
}

export default BudgetPage