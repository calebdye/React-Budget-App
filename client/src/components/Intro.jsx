import {useContext, useState} from "react";
import axios from "axios";
// import {UserContext} from "../UserContext.jsx";

import { Form, Link, Navigate } from "react-router-dom"

// library
import { UserPlusIcon } from "@heroicons/react/24/solid";

// assets
import illustration from "../assets/illustration.jpg"

const Intro = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  // const {setUser} = useContext(UserContext);
  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
      const {data} = await axios.post('/login', {email,password});
      // setUser(data);
      alert('Login successful');
      setRedirect(true);
    } catch (e) {
      alert('Login failed');
    }
  }

  if (redirect) {
    return <Navigate to={'/register'} />
  }
  
  return (
    <div className="intro">
      <div>
        <h1>
          Take Control of <span className="accent">Your Money</span>
        </h1>
        <p>
          Personal budgeting is the secret to financial freedom. Start your journey today.
        </p>
        <Form method="post" onSubmit={handleLoginSubmit}>
        <input type="email"
                 placeholder="your@email.com"
                 value={email}
                 onChange={ev => setEmail(ev.target.value)} />
          <input type="password"
                 placeholder="password"
                 value={password}
                 onChange={ev => setPassword(ev.target.value)} />
          <input type="hidden" name="_action" value="newUser" />
          <button type="submit" className="btn btn--dark">
            <span>Create Account</span>
            <UserPlusIcon width={20} />
          </button>
        </Form>
      </div>
      <div >
            Don't have an account yet? <Link to={'/register'}>Register now</Link>
          </div>
      <img src={illustration} alt="Person with money" width={600} />
    </div>
  )
}
export default Intro