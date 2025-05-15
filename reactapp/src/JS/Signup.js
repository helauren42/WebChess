import { useEffect, useState } from "react";

export const SignupPage = () => {
  return (
    <div id="account-base-container">
      <div id="account-block">
        <form className="account-form" onSubmit={(e) => { submitLogin(e) }}>
        </form>
      </div>
    </div>
  )
}

