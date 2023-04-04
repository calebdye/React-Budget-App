// rrd imports
import { Form, NavLink } from "react-router-dom"

// library
import { TrashIcon } from '@heroicons/react/24/solid'

// assets
import logomark from "../assets/logomark.svg"
import { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { toast } from "react-toastify";


const Nav = ({ user }) => {
  const [redirect,setRedirect] = useState(null);
  const {ready,setUser} = useContext(UserContext);

  async function logout(ev) {
    ev.preventDefault();
    await axios.post('/logout');
    setRedirect('/');
    setUser(null);
    toast.success("You’ve logged out!")
  }

  return (
    <nav>
      <NavLink
        to="/dashboard"
        aria-label="Go to home"
      >
        <img src={logomark} alt="" height={30} />
        <span>HomeBudget</span>
      </NavLink>
      {
        user && (
          <Form
            method="post"
            action="logout"
            onSubmit={logout}
          >
            <button type="submit" className="btn btn--warning">
              <span>Logout</span>
            </button>

          </Form>
        )
      }
    </nav>
  )
}
export default Nav