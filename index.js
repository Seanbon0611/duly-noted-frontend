const usersURL = "http://localhost:3000/api/v1/users";
const notesURL = "http://localhost:3000/api/v1/notes";

let today, currentMonth, currentYear, days, months, years, tbodyTag, calendarTitle, yearsSelections, monthsSelections, calendarDiv, calendarButton, newNoteButton, newNoteDiv;

document.addEventListener("DOMContentLoaded", function() {
    today = new Date();
    currentMonth = today.getMonth();
    currentYear = today.getFullYear();
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    years = ["2020", "2021", "2022", "2023", "2024", "2025"]

    // grab calendar div
    calendarDiv = document.getElementById('calendar-container');
    // grab calendar button
    calendarButton = document.getElementById("calendar-btn");
    // grab calendar body 
    tbodyTag = document.getElementById("calendar-body");
    // grab title (month - year)
    calendarTitle = document.getElementById("monthAndYear");
    // grab dropdown years
    yearsSelections = document.getElementById("year");
    // grab dropdown month
    monthsSelections = document.getElementById("month");
    // grab new note button
    newNoteButton = document.getElementById("note-btn");
    // grab new note div
    newNoteDiv = document.getElementById("new-note");

    renderCalendarAfterClicked();
    displayCalendar(currentMonth, currentYear);
    previousButtonClickListener();
    nextButtonClickListener();
    dropDownListener();
    newNoteButtonListener();
    // fetchBackend();
})

// function fetchBackend() {
//     fetch(baseURL)
//       .then((response) => response.json())
//       .then((userData) => console.log(userData));
// }

function newNoteButtonListener() {
    newNoteButton.addEventListener("click", function(event) {
        // once clicked disable the button
        event.target.disabled = true;
        // once clicked display textarea
        newNoteDiv.style.display = "block";
        // once clicked hide calendar
        calendarDiv.style.display = "none";
        // once clicked undisable calendar button
        calendarButton.disabled = false;
    });
}

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

