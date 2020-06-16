let today;
let currentMonth;
let currentYear;
let days;
let months;
let years;

let tbodyTag;
let calendarTitle;
let yearsSelections;
let monthsSelections;

document.addEventListener("DOMContentLoaded", function() {
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

    renderCalendarAfterClicked();
    displayCalendar(currentMonth, currentYear);
    previousButtonClickListener();
    nextButtonClickListener();
    dropDownListener();
})

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