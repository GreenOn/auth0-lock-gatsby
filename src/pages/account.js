import React from "react"
import { Router } from "@reach/router"
import { login } from "../utils/auth"
import { Link } from "gatsby"
import "../styles/global.css"

const Home = () => <p>Home</p>
const MyAccount = () => <p>My Account</p>
const Settings = () => <p>Settings</p>
const Billing = () => { 
  login()
    return (
        <p>signup</p>
    );
}

const Account = () => {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>{" "}
        <Link to="/account/">My Account</Link>{" "}
        <Link to="/account/settings/">Settings</Link>{" "}
        <Link to="/account/billing/">Signup</Link>{" "}
      </nav>
      <Router>
        <Home path="/" />
        <MyAccount path="/account/" />
        <Settings path="/account/settings" />
        <Billing path="/account/billing" />
      </Router>
    </>
  )
}

export default Account