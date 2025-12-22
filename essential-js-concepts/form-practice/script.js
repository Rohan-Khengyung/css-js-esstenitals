const loginForm = document.getElementById('login-form')
console.log(loginForm)


loginForm.addEventListener('submit', function(event){
    event.preventDefault()
    console.log("Clicks")
})


