import { useState, useEffect, useContext } from "react";
import { AppContext } from "./App.jsx"

export const HomePage = () => {
  const [signedIn, setSignedIn] = useContext(AppContext)
  return (
	<>
	  <h1>You are {signedIn ? "signed in" : "not signed in"}</h1>
	</>
  )
}

