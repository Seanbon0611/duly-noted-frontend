let today;
let currentMonth;
let currentYear;
let days;
let months;

document.addEventListener("DOMContentLoaded", function() {
    today = new Date();
    currentMonth = today.getMonth();
    currentYear = today.getFullYear();
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    renderCalendarAfterClicked();
})

function renderCalendarAfterClicked() {
    const calendarButton = document.getElementById("calendar-btn");
    calendarButton.addEventListener("click", function(event) {
        // once clicked disable the button
        event.target.disabled = true;
        // grab calendar div
        const calendarDiv = document.getElementById('calendar-container');
        // add calendar card
        const calendarCard = document.createElement("div");
        calendarCard.setAttribute("class", "card");
        calendarDiv.append(calendarCard);
        // title (month - year)
        const calendarTitle = document.createElement("h3");
        calendarTitle.setAttribute("class", "card-header");
        calendarTitle.setAttribute("id", "monthAndYear");
        calendarCard.append(calendarTitle);
        // calendar table
        const calendarTable = document.createElement("table");
        calendarTable.setAttribute("class", "table table-bordered table-responsive-sm");
        calendarTable.setAttribute("id", "calendar");
        calendarCard.append(calendarTable);
        //// header with days
        const theadTag = document.createElement("thead");
        calendarTable.append(theadTag);
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
        // body 
        const tbodyTag = document.createElement("tbody");
        tbodyTag.setAttribute("id", "calendar-body");
        calendarTable.append(tbodyTag);
        // previous and next buttons container
        const previousNextButtonsContainer = document.createElement("div");
        previousNextButtonsContainer.setAttribute("class", "form-inline")
        calendarCard.append(previousNextButtonsContainer);
        //// add previous button
        const previousButton = document.createElement("button");
        previousButton.setAttribute("class", "btn btn-outline-info col-sm-6");
        previousButton.setAttribute("id", "previous");
        previousButton.innerText = "<<";
        previousNextButtonsContainer.append(previousButton);
        //// add next button
        const nextButton = document.createElement("button");
        nextButton.setAttribute("class", "btn btn-outline-info col-sm-6");
        nextButton.setAttribute("id", "next");
        nextButton.innerText = ">>";
        previousNextButtonsContainer.append(nextButton);
        // dropdown
        const dropDownForm = document.createElement("form");
        dropDownForm.setAttribute("class", "form-inline");
        calendarCard.append(dropDownForm);
        //// dropdown months
        const monthsSelections = document.createElement("select");
        monthsSelections.setAttribute("class", "form-control col-sm-6");
        monthsSelections.setAttribute("id", "month");
        monthsSelections.setAttribute("name", "month");
        dropDownForm.append(monthsSelections);
        //// add each month
        const month1 = document.createElement("option");
        month1.innerText = months[0];
        const month2 = document.createElement("option");
        month2.innerText = months[1];
        const month3 = document.createElement("option");
        month3.innerText = months[2];
        const month4 = document.createElement("option");
        month4.innerText = months[3];
        const month5 = document.createElement("option");
        month5.innerText = months[4];
        const month6 = document.createElement("option");
        month6.innerText = months[5];
        const month7 = document.createElement("option");
        month7.innerText = months[6];
        const month8 = document.createElement("option");
        month8.innerText = months[7];
        const month9 = document.createElement("option");
        month9.innerText = months[8];
        const month10 = document.createElement("option");
        month10.innerText = months[9];
        const month11 = document.createElement("option");
        month11.innerText = months[10];
        const month12 = document.createElement("option");
        month12.innerText = months[11];
        monthsSelections.append(month1, month2, month3, month4, month5, month6, month7, month8, month9, month10, month11 ,month12);
        //// dropdown years
        const yearsSelections = document.createElement("select");
        yearsSelections.setAttribute("class", "form-control col-sm-6");
        yearsSelections.setAttribute("name", "year");
        yearsSelections.setAttribute("id", "year");
        dropDownForm.append(yearsSelections);
        //// add each year
        const year1 = document.createElement("option");
        year1.innerText = "2020";
        const year2 = document.createElement("option");
        year2.innerText = "2021";
        const year3 = document.createElement("option");
        year3.innerText = "2022";
        const year4 = document.createElement("option");
        year4.innerText = "2023";
        const year5 = document.createElement("option");
        year5.innerText = "2024";
        const year6 = document.createElement("option");
        year6.innerText = "2025";
        yearsSelections.append(year1, year2, year3, year4, year5, year6);

        // DISPLAYING CALENDAR BODY  
        const firstDay = (new Date(currentYear, currentMonth)).getDay();
        const daysInMonth = 32 - new Date(currentYear, currentMonth, 32).getDate(); 
        // clearing body
        tbodyTag.innerHTML = "";   
        // assign month - year to calendar title
        calendarTitle.innerText = months[currentMonth] + " " + currentYear;
        yearsSelections.value = currentYear;
        monthsSelections.value = currentMonth;
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
                }
                else if (date > daysInMonth) {
                    break;
                }
                else {
                    let cell = document.createElement("td");
                    let cellText = document.createTextNode(date);
                    if (date === today.getDate() && currentYear === today.getFullYear() && currentMonth === today.getMonth()) {
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
    });
}

//1.render sign-in form
//2.render sign-up form
//3.render new note
//4.render calendar
//5.render 

let isSignedIn = true

window.SpeechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
homePage()
function homePage() {
  const formContainer = document.querySelector('.form-container')
  if (isSignedIn === false) {
    formContainer.innerHTML = renderSignIn();
    listenForSignInSubmit()
  } else if (isSignedIn === true) {
    renderNewNote()
  }
}

function renderSignIn() {
  return `
    <form>
    <h1>SIGN IN</h1>
    <input type='text' placeholder="Enter Username">
    <input type='text' placeholder="Enter Email">
    <input type="submit">
    <p>Not registered? Sign-up <a href='https://google.com'>here</a></p>
    </form>
  `
}

function listenForSignInSubmit() {
  const formContainer = document.querySelector('.form-container')
  formContainer.addEventListener('submit', (event) => {
    event.preventDefault()
    console.log(event)
  })
}

function renderSignUp() {
  return `
  <form>
  <h1>SIGN UP</h1>
  <input type='text' placeholder="Enter Username">
  <input type='text' placeholder="Enter Email">
  <input type="submit">
  <p>Already registered? Sign-in <a href='https://google.com'>here</a></p>
</form>
  `
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

