import { useEffect, useContext } from 'react'
import '../CSS/Social.css'
import { AccountContext, AppContext, WS } from './App'

const createActiveUserBlock = (username) => {
  if (username.length > 10)
    username = username.substring(0, 9) + '.'
  const block = document.createElement('div')
}

export const SocialPage = () => {
  const [signedIn, setSignedIn, activeUsers] = useContext(AppContext)
  const [accountUsername] = useContext(AccountContext)
  console.log("Social page active users: ", activeUsers)
  useEffect(() => {
    const parent = document.getElementById("active-users-list")
    for (let i = 0; i < activeUsers.length; i++) {
      const username = activeUsers[i]
      const arrayUsersList = Array.from(document.getElementsByClassName("active-users-list-element"))
      console.log(arrayUsersList)
      for (let i = 0; i < arrayUsersList.length; i++) {
        const element = arrayUsersList[i]
        parent.removeChild(element)
      }
      for (let i = 0; i < activeUsers.length; i++) {
        const username = activeUsers[i]
        if (username == accountUsername)
          continue
        const listElement = document.createElement('li')
        listElement.className = "active-users-list-element"
        listElement.textContent = username
        console.log("appending user: ", listElement)
        parent.append(listElement)
      }
    }
  }, [activeUsers])
  return (
    <div id='social-page-container' >
      <div className="whole-width" id="direct-message-container">
        <div id="ghost"></div>
        <section id="direct-message-section">
          <section id="message-history"></section>
          <input id="input-message" type="text"></input>
        </section>
        <section id='active-users-container'>
          <div id="active-users-title-container">
            <h1 id='active-users-title'>Active Users</h1>
          </div>
          <ul id='active-users-list'></ul>
        </section>
      </div >
    </div >
  )
}

