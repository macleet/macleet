'use strict'

class Calendar {
    constructor() {
        this.container = this.createCalendar();

        this.months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        this.days = [
            "Sunday", "Monday", "Tuesday", "Wednesday",
            "Thursday", "Friday", "Saturday"
        ];

        this.loadDate = new Date();
        this.year = this.loadDate.getFullYear();
        this.month = this.loadDate.getMonth();
        this.date = this.loadDate.getDate();

        // text box displaying month and year
        this.dateText = this.container.querySelector('#date-text h3');
        this.datesContainer = this.container.querySelectorAll('.date'); 

        this.setupEventListeners();
    }

    createCalendar() {
        // Create the main calendar container
        const calendarContainer = document.createElement('div');
        calendarContainer.classList.add('calendar-container');

        // Create the date text container
        const dateTextContainer = document.createElement('div');
        dateTextContainer.id = 'date-text-container';

        // Create the left button (caret-left)
        const leftButton = document.createElement('i');
        leftButton.id = 'left-button';
        leftButton.classList.add('fa-solid', 'fa-caret-left', 'fa-2x');

        // Create the date text
        const dateText = document.createElement('div');
        dateText.id = 'date-text';
        const dateTextHeader = document.createElement('h3');
        dateText.appendChild(dateTextHeader);

        // Create the right button (caret-right)
        const rightButton = document.createElement('i');
        rightButton.id = 'right-button';
        rightButton.classList.add('fa-solid', 'fa-caret-right', 'fa-2x');

        // Append left button, date text, and right button to date text container
        dateTextContainer.appendChild(leftButton);
        dateTextContainer.appendChild(dateText);
        dateTextContainer.appendChild(rightButton);

        // Create the dates container
        const datesContainer = document.createElement('div');
        datesContainer.id = 'dates-container';

        // Create days of the week
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        for (const day of daysOfWeek) {
            const daysText = document.createElement('div');
            daysText.classList.add('days-text');
            daysText.id = day.toLowerCase();
            const p = document.createElement('p');
            p.textContent = day.substring(0, 3);
            daysText.appendChild(p);
            datesContainer.appendChild(daysText);
        }

        // Create date elements
        for (let row = 1; row <= 5; row++) {
            for (const day of daysOfWeek) {
                const date = document.createElement('div');
                date.classList.add('date', `row-${row}`, day.toLowerCase());
                datesContainer.appendChild(date);
            }
        }

        // Append date text container and dates container to calendar container
        calendarContainer.appendChild(dateTextContainer);
        calendarContainer.appendChild(datesContainer);

        // containerToAppend.append(calendarContainer);

        return calendarContainer;
    }

    setupEventListeners() {
        window.addEventListener('load', () => this.resetCalendar());

        // left button to previous year
        this.leftBtn = this.container.querySelector('#left-button');
        this.leftBtn.addEventListener('click', () => this.goToPrevMonth());

        // right button to previous year
        this.rightBtn = this.container.querySelector('#right-button');
        this.rightBtn.addEventListener('click', () => this.goToNextMonth());

        // reset calendar to current date after selection
        // const dates = this.container.querySelectorAll('.date');
        // dates.forEach(date => date.addEventListener('click', () => this.resetCalendar()));
    }

    getDateString () { return this.months[this.month] + ' ' + this.year; }

    goToPrevMonth() {
        if (this.month === 0) {
            this.year--;
            this.month = 11;
        }
        else {
            this.month--;
        }

        // render title and correct number positions
        this.renderCalendarText();
    }

    goToNextMonth() {
        if (this.month === 11) {
            this.year++;
            this.month = 0;
        }
        else {
            this.month++;
        }
        
        // render title and correct number positions
        this.renderCalendarText();
    }

    resetCalendar() {
        this.loadDate = new Date();
        this.year = this.loadDate.getFullYear();
        this.month = this.loadDate.getMonth();
        this.date = this.loadDate.getDate();

        // render title and correct number positions
        this.renderCalendarText();
    }

    getDaysInMonth (year = this.year, month = this.month) { 
        if (year === -1) {  // previous month
            return new Date(year, month, 0).getDate();
        }
        else if (year === 1) {
            return new Date(year, month + 2, 0).getDate();
        }
        return new Date(year, month + 1, 0).getDate(); // 0 causes underflow
    }

    getFirstDay (year = this.year, month = this.month) {
        return new Date(year, month, 1).getDay();
    }

    renderCalendarText() {
        // change calendar title according to selected month and year
        this.dateText.textContent = this.getDateString();

        const totalDays = 35;  // total number of days in a calendar (5 x 7)

        let currMonth = [...Array(this.getDaysInMonth() + 1).keys()];
        let nextMonth = [...Array(this.getDaysInMonth(1) + 1).keys()];
    
        // carryover from previous month
        const daysInPrevMonth = this.getDaysInMonth(-1);
        let j = 0;
        for (let i = daysInPrevMonth - this.getFirstDay() + 1; i <= daysInPrevMonth; i++, j++) {  // never loops more than 6 times
            this.datesContainer[j].textContent = i;
            this.datesContainer[j].classList.add('prev-month');
        }
    
        // find number location of current month days
        currMonth.shift();  // shave 0
        let m = j;
        for (let k = 1; m < currMonth.length + j; m++, k++) {
            this.datesContainer[m].classList.remove('prev-month');
            this.datesContainer[m].classList.remove('next-month');
            this.datesContainer[m].textContent = k;
        }

        // preview dates of next month
        let remDays = totalDays - currMonth.length;
        nextMonth.shift();  // shave 0
        nextMonth = nextMonth.slice(0, remDays).reverse();  // reverse because we are popping
    
        let fullMonth = nextMonth.concat(currMonth);
        for (let i = m, j = 1; i < totalDays; i++, j++) {
            this.datesContainer[i].textContent = j;
            this.datesContainer[i].classList.add('next-month');
        }
    }
}

// create a new Calendar
// const cal = new Calendar();
// document.querySelector('#project-container').append(cal.container);