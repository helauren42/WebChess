import { useEffect, useContext } from 'react'
import '../CSS/Social.css'
import { AccountContext, AppContext, WS } from './App'

export const SocialPage = () => {
  const [signedIn, setSignedIn, activeUsers] = useContext(AppContext)
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
        const container = document.createElement('div')
        container.className = "active-users-list-element"
        const middleElem = document.createElement('div')
        const leftElem = document.createElement('div')
        const rightElem = document.createElement('div')
        middleElem.className = "active-users-middle"
        leftElem.className = "active-users-left"
        rightElem.className = "active-users-right"
        // add username middle element
        const usernameElement = document.createElement('h3')
        usernameElement.title = username
        const textUsername = username.length < 15 ? username : username.substring(0, 14) + '.';
        // todo add profile picture to left element

        // right element icon
        usernameElement.textContent = username
        middleElem.append(usernameElement)
        // const messageIcon = document.createElement("span")
        // messageIcon.textContent = '✉️';
        // rightElem.append(messageIcon)

        // append elements to parent
        container.append(leftElem)
        container.append(middleElem)
        container.append(rightElem)
        parent.append(container)
        console.log("updated active users")
      }
    }
  }, [activeUsers])
  return (
    <div id='social-page-container' >
      <div className="whole-width" id="global-message-container">
        <div id="ghost"></div>
        <section id="global-message-section">
          <section id="message-history"></section>
          <input id="input-message" type="text"></input>
        </section>
        <section id='active-users-container'>
          <div id="active-users-title-container">
            <h1 id='active-users-title'>Active Users</h1>
          </div>
          <div id='active-users-list'></div>
        </section>
      </div >
    </div >
  )
}

