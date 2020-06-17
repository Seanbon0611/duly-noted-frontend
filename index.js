let days;
let months;
let years;

let tbodyTag;
let calendarTitle;
let yearsSelections;
let monthsSelections;


today = new Date();
currentMonth = today.getMonth();
currentYear = today.getFullYear();
months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
years = ["2020", "2021", "2022", "2023", "2024", "2025"]

// grab calendar body 
tbodyTag = document.getElementById("calendar-body");
// grab title (month - year)
calendarTitle = document.getElementById("monthAndYear");
// grab dropdown years
yearsSelections = document.getElementById("year");
// grab dropdown month
monthsSelections = document.getElementById("month");






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
}

function listenToNewNoteClick() {
  const newNoteBtn = document.querySelector('#note-btn')
  newNoteBtn.addEventListener('click', (e) => {
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

//CALENDAR FUNCTIONS

function renderCalendarAfterClicked() {
  const calendarButton = document.getElementById("calendar-btn");
  calendarButton.addEventListener("click", function(event) {
      // once clicked disable the button
      event.target.disabled = true;
      // grab calendar div
      const calendarDiv = document.getElementById('calendar-container');
      calendarDiv.style.display = "block";
      // garb calendar card
      const calendarCard = document.getElementById("card");
      // grab title (month - year)
      // const calendarTitle = document.getElementById("monthAndYear");
      // grab calendar table
      const calendarTable = document.getElementById("calendar");
      // grab calendar header
      const theadTag = document.getElementById("calendar-header");
      //// add days to header ---------------- TO DO: MAKE LOOP ----------------- ////
      const trTag = document.createElement("tr");
      theadTag.append(trTag);
      const thTag1 = document.createElement("th");
      thTag1.innerText = days[0];
      const thTag2 = document.createElement("th");
      thTag2.innerText = days[1];
      const thTag3 = document.createElement("th");
      thTag3.innerText = days[2];
      const thTag4 = document.createElement("th");
      thTag4.innerText = days[3];
      const thTag5 = document.createElement("th");
      thTag5.innerText = days[4];
      const thTag6 = document.createElement("th");
      thTag6.innerText = days[5];
      const thTag7 = document.createElement("th");
      thTag7.innerText = days[6];
      trTag.append(thTag1, thTag2,thTag3, thTag4, thTag5, thTag6, thTag7);
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
                  // color today's date
                  cell.classList.add("bg-info");
              } 
              cell.appendChild(cellText);
              calendarBodyRow.appendChild(cell);
              date++;
          }      
      }
      // add each row to calendar body.
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