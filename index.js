
const usersURL = "http://localhost:3000/api/v1/users";
const notesURL = "http://localhost:3000/api/v1/notes";

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const years = ["2020", "2021", "2022", "2023", "2024", "2025"]

// grab calendar div
const calendarDiv = document.getElementById('calendar-container');
// grab calendar button
const calendarButton = document.getElementById("calendar-btn");
// grab calendar body 
const tbodyTag = document.getElementById("calendar-body");
// grab title (month - year)
const calendarTitle = document.getElementById("monthAndYear");
// grab dropdown years
const yearsSelections = document.getElementById("year");
// grab dropdown month
const monthsSelections = document.getElementById("month");
// grab new note button
const newNoteButton = document.getElementById("note-btn");
// grab new note div
const newNoteDiv = document.getElementById("new-note");

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
`
signOut()
renderCalendarAfterClicked();
displayCalendar(currentMonth, currentYear);
previousButtonClickListener();
nextButtonClickListener();
dropDownListener();
listenToNewNoteClick()
newNoteButtonListener();
// fetchBackend();
}

function listenToNewNoteClick() {
  const newNoteBtn = document.querySelector('#note-btn')
  newNoteBtn.addEventListener('click', (e) => {
    // once clicked disable the button
    event.target.disabled = true;
    // once clicked display textarea
    newNoteDiv.style.display = "block";
    // once clicked hide calendar
    calendarDiv.style.display = "none";
    // once clicked undisable calendar button
    calendarButton.disabled = false;
    renderNewNote()
  })
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
  
  let saveBtn = document.createElement('button');
  saveBtn.setAttribute("class", "btn btn-outline-info")

}



//1.sign-in form
function renderSignIn() {
    appContainer.innerHTML = `
    <form>
    <h1>SIGN IN</h1>
    <input type='text' placeholder="Enter Username" name='usernameInput'>
    <input type='text' placeholder="Enter Email" name='emailInput'>
    <input class='btn btn-outline-info'type="submit">
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

//NOTE FUNCTION


//CALENDAR FUNCTIONS

// function fetchBackend() {
//     fetch(baseURL)
//       .then((response) => response.json())
//       .then((userData) => console.log(userData));
// }

function renderCalendarAfterClicked() {
    calendarButton.addEventListener("click", function(event) {
        // once clicked disable the button
        event.target.disabled = true;
        // once clicked display calendar
        calendarDiv.style.display = "block";
        // once clicked undisable new note button
        newNoteButton.disabled = false;
        // once clicked hide note textarea
        newNoteDiv.style.display = "none";
    });
}

function displayCalendar(month, year) {
    //// DISPLAYING CALENDAR BODY ////
    const firstDay = (new Date(year, month)).getDay();
    const daysInMonth = 32 - new Date(year, month, 32).getDate(); 
    // clearing body
    tbodyTag.innerHTML = "";   
    // assign month - year to calendar title
    calendarTitle.innerText = months[month] + " " + year;
    yearsSelections.value = year;
    monthsSelections.value = month;
    // generating dates
    let date = 1;
    for (let counter = 0; counter < 6; counter++) {
        let calendarBodyRow = document.createElement("tr");
        // filling calendar with dates
        for (let i = 0; i < 7; i++) {
            if (counter === 0 && i < firstDay) {
                // adding cell
                let cell = document.createElement("td");
                let cellText = document.createTextNode("");
                cell.appendChild(cellText);
                calendarBodyRow.appendChild(cell);
            } else if (date > daysInMonth) {
                break;
            } else {
                let cell = document.createElement("td");
                let cellText = document.createTextNode(date);
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    // color today date
                    cell.style.background = "#B0E0E6";
                } 
                cell.appendChild(cellText);
                calendarBodyRow.appendChild(cell);
                date++;
            }      
        }
        // add each row to calendar body
        tbodyTag.appendChild(calendarBodyRow);
    }
}

function previousButtonClickListener() {
  // grab previous button
  const previousButton = document.getElementById("previous");
  previousButton.addEventListener("click", function() {
      currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
      currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
      displayCalendar(currentMonth, currentYear);
  })
}

function nextButtonClickListener() {
  // grab next button
  const nextButton = document.getElementById("next");
  nextButton.addEventListener("click", function() {
      currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
      currentMonth = (currentMonth + 1) % 12;
      displayCalendar(currentMonth, currentYear);
  })
}

function dropDownListener() {
  // grab dropdown
  const dropDownForm = document.getElementById("drop-down");
  dropDownForm.addEventListener("change", function() {
      currentYear = parseInt(yearsSelections.value);
      console.log(currentYear)
      currentMonth = parseInt(monthsSelections.value);
      console.log(currentMonth + 1)
      displayCalendar(currentMonth, currentYear);
  })
}