import { profile } from "./profile.js";
import { signin } from "./signin.js";

export let jwt = localStorage.getItem('jwt')
console.log(jwt)
if(!jwt) {
    signin()
} else {
    profile()
}

// window.addEventListener('popstate', ()=> {
//     const jwt = localStorage.getItem('jwt')
//     if(event.state?.page === 'profile' && jwt) {
//         profile()
//     }
//     event.state?.page === 'profile' && jwt ? profile() : signin
// })

