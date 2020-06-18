const usersURL = "http://localhost:3000/users";
const notesURL = "http://localhost:3000/notes";

let today, currentMonth, currentYear, days, months, years, tbodyTag, calendarTitle, yearsSelections, monthsSelections;

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


window.SpeechRecognition = window.speechRecognition || window.webkitSpeechRecognition;

if (!localStorage.user_id) {
  renderSignIn()
} else {
  renderhomePage()
}
function renderhomePage() {
  appContainer.innerHTML = `
  <div id="buttons-container">
    <button type="button" class="btn btn-outline-info" id="signout-btn">SIGN-OUT</button>
    <button type="button" class="btn btn-outline-info" id="note-btn">NEW NOTE</button>
    <button type="button" class="btn btn-outline-info" id="calendar-btn">CALENDAR</button>
  </div>
`
signOut()
renderCalendarAfterClicked();
displayCalendar(currentMonth, currentYear);
previousButtonClickListener();
nextButtonClickListener();
dropDownListener();
listenToNewNoteClick();
fetchBackend();
toggleFilterBtn()
}

function listenToNewNoteClick() {
  const newNoteBtn = document.querySelector('#note-btn')
  const newNoteDiv = document.getElementById("new-note");
  const calendarDiv = document.getElementById('calendar-container');
  const calendarButton = document.getElementById("calendar-btn");
  const NotesListDiv = document.getElementById("notes-div");
  newNoteBtn.addEventListener('click', (event) => {
    // once clicked disable the button
    event.target.disabled = true;
    // once clicked display textarea
    newNoteDiv.style.display = "block";
    // once clicked hide calendar
    calendarDiv.style.display = "none";
    // once clicked undisable calendar button
    calendarButton.disabled = false;
    // once clicked hide note list
    NotesListDiv.style.display = "none";
    renderNewNote()
  })
}


function renderNewNote() {
  const recognition = new SpeechRecognition();
  recognition.interimResults = true;
  recognition.continuous = true
  let textArea = document.querySelector('#txtarea');

  recognition.addEventListener('result', (e) => {
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join("")

      textArea.textContent = transcript
    console.log(transcript)
  });
  recognition.start();
  
  listenToNoteSubmit()

}

function listenToNoteSubmit() {
  const noteContainer = document.querySelector('#note-form');
  noteContainer.addEventListener('submit', (event) => {
    event.preventDefault();
    const noteInput = event.target.textinput;
    const note = noteInput.value;
    let userId = parseInt(localStorage.user_id)
    const noteContent = {
      user_id: userId,
      content: note
    }

    handleNoteSubmit(noteContent);
    noteInput.value = "";
  })
}

function handleNoteSubmit(noteContent) {
  fetch('http://localhost:3000/notes', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(noteContent)
  })
  .then(res => res.json())
}

//1.sign-in form
function renderSignIn() {
    appContainer.innerHTML = `
    <div class='form-container'>
      <form id='signin-form'>
      <h1>SIGN IN</h1>
      <div class='group'>
        <input class='form-input'type='text' placeholder="Enter Username" name='usernameInput'>
      </div>
      <div class='group'>
        <input class='form-input' type='text' placeholder="Enter Email" name='emailInput'>
      </div>
      <input class='btn btn-outline-info'type="submit">
      <br><br>
      <p>Not registered? Sign-up <span class='signup'>here</span></p>
      </form>
    </div>
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
    <div class='form-container'>
      <form id='signup-form'>
        <h1>SIGN UP</h1>
        <input class='form-input' type='text' placeholder="Enter Username" name='usernameInput'>
        <input class='form-input' type='text' placeholder="Enter Email" name='emailInput'>
        <input class='btn btn-outline-info' id='sign-up-submit' type="submit">
        <br><br>
        <p>Already registered? Sign-in <span class='signin'>here</span></p>
      </form>
    </div>
  `
  listenToSignInClick()
  listenForSignUpSubmit()
}

function listenForSignUpSubmit() {
  const signUpForm = document.querySelector('#signup-form');
  signUpForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const usernameInput = event.target.usernameInput
    const emailInput = event.target.emailInput

    const username = usernameInput.value
    const email = emailInput.value

    const signUpData = {
      username,
      email
    }

    handleSignUp(signUpData);
  })
}

function handleSignUp(signUpData) {
  fetch('http://localhost:3000/users', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(signUpData)
  })
  .then(resp => resp.json())
  .then(res => {
    if (!res.error) {
      renderSignIn()
    } else {
      console.log("error!")
    }
  })

  
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
    handleSignOut()
    /////////////////////////////////////////////////////////
    //*** ADDING - HIDE NEW NOTE TEXT AREA WHEN SIGNOUT ***//
    const newNoteDiv = document.getElementById("new-note");
    newNoteDiv.style.display = "none";
    //////*** ADDING - HIDE CALENDAR WHEN SIGNOUT ***///////
    const calendarDiv = document.getElementById('calendar-container');
    calendarDiv.style.display = "none";
    ////////////////////////////////////////////////////////
    //////*** ADDING - HIDE NOTE LIST WHEN SIGNOUT ***///////
    const NotesListDiv = document.getElementById("notes-div");
    NotesListDiv.style.display = "none";
    ////////////////////////////////////////////////////////
  })
}

function handleSignOut() {
  fetch('http://localhost:3000/signout', {
      method: 'delete'
    })
    .then(resp => resp.json())
    renderSignIn()
    localStorage.clear()
}
function listenForSignInSubmit() {
  const formContainer = document.querySelector('#signin-form')
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
  .then(data => {
    let user = localStorage.setItem("user_id", data.user.id)
    if (!data.error) {
      renderhomePage(user)
    } 
  })
}

function listenToAboutClick() {
  const abtBtn = document.querySelector('.about-btn');
  abtBtn.addEventListener('click', () => {
    appContainer.innerHTML = `
      <div class='abt-container'>
        <p class='about-txt'>
          Welcome to <span class='app-name'>Duly Noted</span>, tired of always manually typing out your notes? wish you could just speak your mind and have all your ideas jot down on a notepad? Well you've come to the right place! Here at Duly noted using speech recognition technology we are able to pick up your speech, send that over to a server and translate it back into readable text! You're able to save notes, look at notes from previous days via our calendar, edit notes previous notes as well as delete notes. Happy Speaking!
        </p>
      </div>
    `

  })
}

listenToAboutClick();

function listenToLogoClick() {
  const logoContainer = document.querySelector('.logo-container')
  logoContainer.addEventListener('click', () => {
    if (!localStorage.user_id) {
      renderSignIn()
    } else {
      renderhomePage()
    }
  })
}

listenToLogoClick();


//CALENDAR FUNCTIONS

function renderCalendarAfterClicked() {
  const calendarButton = document.getElementById("calendar-btn");
  const calendarDiv = document.getElementById('calendar-container');
  const newNoteBtn = document.querySelector('#note-btn')
  const newNoteDiv = document.getElementById("new-note");
  const NotesListDiv = document.getElementById("notes-div");
  calendarButton.addEventListener("click", function(event) {
      // once clicked disable the button
      event.target.disabled = true;
      // once clicked display calendar
      calendarDiv.style.display = "block";
      // once clicked undisable new note button
      newNoteBtn.disabled = false;
      // once clicked hide note textarea
      newNoteDiv.style.display = "none";
      // once clicked hide note list
      NotesListDiv.style.display = "none";
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
              //////////////////////////////////////////
              //** ADDING - CLASS ATTRIBUTE TO DATE **//
              cell.setAttribute("class", "date");
              /////////////////////////////////////////
              let cellText = document.createTextNode(date);
              if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                  // color today's date
                  cell.style.background = "#B0E0E6";
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

////////////////////////////////////////////////////

function fetchBackend() {
    fetch(`http://localhost:3000/notes`)
      .then((response) => response.json())
      .then( noteData => {
        let onlyUserNotes = noteData.filter(note => note.user.id === parseInt(localStorage.user_id))
        rederNote(onlyUserNotes)
      });
}


function renderNotes(notes) {
  let createdAt = notes.map(note => note.created_at.split("-"))
  let year = createdAt.map(date => date[0])
  let month = createdAt.map(date => date[1])
  let day = createdAt.map(date => date[2].split("T")[0])
  console.log(day)
  
}

function rederNote(noteData) {
  noteData.map((note) => {
    addNoteTopage(note);
  })
}

function addNoteTopage(note) {
  const NotesListDiv = document.getElementById("notes-div");
  const NoteList = document.getElementById("notes-list");
  const calendarDiv = document.getElementById('calendar-container');
  const calendarButton = document.getElementById("calendar-btn");
  const h5Tag = document.getElementById("today-note");
  // extract day month year from note.created_at
  let noteCreated = note.created_at.split("-");
  let year = noteCreated[0];
  let month = noteCreated[1];
  let date = noteCreated[2].split("T")[0];
  // clear field
  tbodyTag.addEventListener("click", function(event) {
      // making sure the calendar date being clicked on is valid (can't click on blank box)
      // and only clickable when the date has note(s) associated with on the backend
      if (event.target.className === "date" && event.target.innerText == `${date}`) {
          // once date clicked
          // display note list
          NotesListDiv.style.display = "block";
          // hide calendar
          calendarDiv.style.display = "none";
          // turn on calendar button
          calendarButton.disabled = false;

          h5Tag.innerText = `${date} - ${month} - ${year} Notes`

          // note
          const singleNote = document.createElement("div")
          singleNote.innerText = `${note.content}`;
          NoteList.append(singleNote);
      }
    //// will we check who is logged in?
    //// and no repeat when click again
  })
}

// function renderSingleNote(note) {
//   const notesToArray = new Array(note.content)
//   console.log(notesToArray)
//   let noteCreated = note.created_at.split("-");
//   let year = noteCreated[0];
//   let month = noteCreated[1];
//   let date = noteCreated[2].split("T")[0];
//   const NotesListDiv = document.getElementById("notes-div");
//   const NoteList = document.getElementById("notes-list");
//   const calendarDiv = document.getElementById('calendar-container');
//   const calendarButton = document.getElementById("calendar-btn");
//   const h5Tag = document.getElementById("today-note");
//   NotesListDiv.style.display = "block";
//   calendarDiv.style.display = "none";
//   calendarButton.disabled = false;
//   NoteList.innerHTML = `
//     <h5>${date} - ${month} - ${year} Notes</h5>
//     <div>${note.content}</div>
//   `
// }

function toggleFilterBtn() {
  const plain = document.getElementById("filrer-1");
  const breeze = document.getElementById("filrer-2");
  const bloom = document.getElementById("filrer-3");
  const calendar = document.getElementById("card");
  breeze.addEventListener("click", function() {
    console.log("breeze cliciked");
    calendar.style.backgroundImage = "url('assets/002op.png')";
  })
  bloom.addEventListener("click", function() {
    console.log("bloom cliciked");
    calendar.style.backgroundImage = "url('assets/001.png')";
  })
  plain.addEventListener("click", function() {
    console.log("plain cliciked");
    calendar.style.backgroundImage = "none";
  })
}
