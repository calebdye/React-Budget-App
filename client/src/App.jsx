import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// Library
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import Main, { mainLoader } from "./layouts/Main";

// Actions
import { logoutAction } from "./actions/logout";
import deleteBudget from "./actions/deleteBudget";

// Routes
import Dashboard, { dashboardAction, dashboardLoader } from "./pages/Dashboard";
import Error from "./pages/Error";
import ExpensesPage, { expensesAction, expensesLoader } from "./pages/ExpensesPage";
import BudgetPage, { budgetAction, budgetLoader } from "./pages/BudgetPage";
import RegisterPage from "./pages/Register";
import axios from "axios";
import Intro from "./components/Intro";
import { UserContextProvider } from "./components/UserContext";

axios.defaults.baseURL = "http://127.0.0.1:4000"
axios.defaults.withCredentials = true;


const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
     loader: mainLoader,
    errorElement: <Error />,
    children: [
      {
        index: true,        
        element: <Intro/>,
        // loader: dashboardLoader,
        // action: dashboardAction,
        errorElement: <Error />
      },      
      {
        path:"Dashboard",
        element: <Dashboard />,
         loader: dashboardLoader,
         action: dashboardAction,
        errorElement: <Error />
      },
      {
        path: "expenses",
        element: <ExpensesPage />,
        loader: expensesLoader,
        action: expensesAction,
        errorElement: <Error />,
      },
      {
        path: "register",
        element: <RegisterPage />,
        errorElement: <Error />,
      },
      {
        path: "budget/:id",
        element: <BudgetPage />,
        loader: budgetLoader,
         action: budgetAction,
        errorElement: <Error />,
        children: [
          {
            path: "delete",
            action: deleteBudget,
          },
        ],
      },
      {
        path: "logout",
        action: logoutAction
      }
    ]
  },
]);

function App() {
  return <div className="App">
    <UserContextProvider>
    <RouterProvider router={router} />
    <ToastContainer />
    </UserContextProvider>
  </div>;
}

export default App;
