import { profile } from "./profile.js"

export const signin = async(e) => {
    const sign = `
    <div class="containerBody">
        <div class="loginContainer">
            <h1 class="loginHeader">Login</h1>
            <div class="errorCookie"></div>
            <form id="loginForm">
                <label>Username:</label>
                <input type="text" name="username" class="username" placeholder="Enter your Username" required>
                <label>Password:</label>
                <input type="password" name="password" class="password" placeholder="Enter your Password" required>
                <button class="loginBtn">Login</button>
            </form>
        </div>
    </div>
    `
    const style = `
    <link rel="stylesheet" href="signin.css">
    `
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'signin.css';
    document.head.appendChild(link);
    
    document.body.innerHTML = sign
    const loginBtn = document.querySelector('.loginBtn')
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault()
        const username = document.querySelector('.username').value 
        const password = document.querySelector('.password').value 

        setJWT(username, password)
    })
    
}

const setJWT = async(username, password) => {
    const errorCookie = document.querySelector('.errorCookie')
    try {
        const response = await fetch('https://learn.zone01oujda.ma/api/auth/signin', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
                'Contenet-Type': 'application/json'
            }
        })
        const jwt = await response.json()
        console.log(response)
        if(response.ok) {
            localStorage.setItem('jwt', jwt)
            errorCookie.classList.remove('error')
            errorCookie.textContent = ''
            // history.pushState({page: "profile",},  "profile", "/profile")
            profile()
            location.reload();
        } else {
            errorCookie.classList.add('error')
            errorCookie.textContent = 'Invalid Credentials!'
            
        }
    } catch (error) {
        alert("errorrr  ",  error)
    }
}