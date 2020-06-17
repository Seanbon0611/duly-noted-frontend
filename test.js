
const appContainer = document.querySelector('#app');
isSignedIn = false
window.SpeechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
if (isSignedIn === true) {
  renderhomePage()
} else {
  renderSignIn()
}
function renderhomePage() {
  appContainer.innerHTML = `
  <div id="buttons-container">
    <button type="button" class="btn btn-outline-info" id="signout-btn">SIGN-OUT</button>
    <button type="button" class="btn btn-outline-info" id="note-btn">NEW NOTE</button>
    <button type="button" class="btn btn-outline-info" id="calendar-btn">CALENDAR</button>
  </div>
<div class ='form-container'>
  <div class='notes-container'>

  </div>
</div>

<div id='calendar-container'>
</div>`
signOut()
renderNewNote()
}

function renderNewNote() {
  const recognition = new SpeechRecognition();
  recognition.interimResults = true;

  let p = document.createElement('p');
  const formContainer = document.querySelector('.notes-container');
  formContainer.appendChild(p);

  recognition.addEventListener('result', (e) => {
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join("")

      p.textContent = transcript
      if(e.results[0].isFinal) {
        p = document.createElement('p');
        formContainer.appendChild(p)
      }
    console.log(transcript)
  });
  recognition.addEventListener('end', recognition.start)
  recognition.start();
}



//1.sign-in form
function renderSignIn() {
    appContainer.innerHTML = `
    <form>
    <h1>SIGN IN</h1>
    <input type='text' placeholder="Enter Username" name='usernameInput'>
    <input type='text' placeholder="Enter Email" name='emailInput'>
    <input type="submit">
    <p>Not registered? Sign-up <span class='signup'>here</span></p>
    </form>
  `
  listenForSignInSubmit()
  listenToSignUpClick()
}
function listenToSignUpClick() {
  const signUpLink = document.querySelector('.signup')
  signUpLink.addEventListener('click', (e) => {
    renderSignUp()
  })
}

//2.sign-up form
function renderSignUp() {
  appContainer.innerHTML = `
  <form>
  <h1>SIGN UP</h1>
  <input type='text' placeholder="Enter Username">
  <input type='text' placeholder="Enter Email">
  <input type="submit">
  <p>Already registered? Sign-in <span class='signin'>here</span></p>
</form>
  `
  listenToSignInClick()
}
function listenToSignInClick() {
  const signInLink = document.querySelector('.signin')
  signInLink.addEventListener('click', (e) => {
    renderSignIn()
  })
}

//3.sign-out
function signOut() {
  const signOut = document.querySelector('#signout-btn')
  signOut.addEventListener('click', (e) => {
    console.log(e.target)
    handleSignOut()
  })
}

function handleSignOut() {
  fetch('http://localhost:3000/signout', {
      method: 'delete'
    })
    .then(resp => resp.json())
    renderSignIn()
    isSignedIn = false
}
function listenForSignInSubmit() {
  const formContainer = document.querySelector('#app')
  formContainer.addEventListener('submit', (event) => {
    event.preventDefault();
    const usernameInput = event.target.usernameInput
    const emailInput = event.target.emailInput

    const username = usernameInput.value
    const email = emailInput.value

    const signInData = {
      username,
      email
    }

    usernameInput.value = ""
    emailInput.value = ""

    handleSignIn(signInData);
  });
}

function handleSignIn(signInData) {
  fetch("http://localhost:3000/signin",{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(signInData)
  })
  .then(resp => resp.json())
  .then(user => {
    if (!user.error) {
      renderhomePage(user)
      isSignedIn = true
    } 
  })
}