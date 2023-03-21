//rrd
import { redirect } from "react-router-dom";
//library
import { toast } from "react-toastify";
//helpers
import { deleteItem, getAllMatchingItems } from "../helpers";


const deleteBudget = ({params}) => {
    try {
        deleteItem({
           key: "budgets",
           id: params.id
        });

        const associatedExpenses = getAllMatchingItems({
            category: "expenses",
            key: "budgetId",
            value: params.id
        });

        associatedExpenses.forEach((expenses)=>{
            deleteItem({
                key: "expenses",
                id: expenses.id
            })
        })
        toast.success("Budget Deleted")
   } catch (e) {
       throw new Error("There was a problem deleting you budget");
   }
   return redirect("/")
}

export default deleteBudget