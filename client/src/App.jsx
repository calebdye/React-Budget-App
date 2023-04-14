import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// Library
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import Main from "./layouts/Main";

// Actions
import { logoutAction } from "./actions/logout";
import deleteBudget from "./actions/deleteBudget";

// Routes
import Dashboard, { dashboardLoader } from "./pages/Dashboard";
import Error from "./pages/Error";
import ExpensesPage, { expensesAction, expensesLoader } from "./pages/ExpensesPage";
import BudgetPage from "./pages/BudgetPage";
import RegisterPage from "./pages/Register";
import axios from "axios";
import Intro from "./components/Intro";
import { UserContextProvider } from "./components/UserContext";

// axios.defaults.baseURL = "http://127.0.0.1:4000"
axios.defaults.baseURL = process.env.CYCLIC_URL
axios.defaults.withCredentials = true;


const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
     //loader: mainLoader,
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
        //  action: dashboardAction,
        errorElement: <Error />
      },
      {
        path: "expenses",
        element: <ExpensesPage />,
        loader: expensesLoader,
        // action: expensesAction,
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
        // loader: budgetLoader,
        //  action: budgetAction,
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
        element: <Intro />
      //  action: logoutAction
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
