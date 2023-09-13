/* Task manager (no backend) */
// Can add, edit, delete tasks DONE
// Task prioritization DONE
// Task categorization DONE
// Due dates DONE

// edit mode no text case

'use strict';

class Task {
    constructor(name, tasksContainerState = null) {
        this.name = name;

        if (tasksContainerState) { this.tasksContainerState = tasksContainerState; }

        this.taskDiv = this.createTaskDiv();
        this.task = this.setUpDragListeners();
    }

    // Returns unique string, which can be used as a rudimentary serial number 
    createIndex() {
        const date = new Date();
        return date.toISOString();
    }

    createTaskDiv() {
        // Creating task div
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task');
        taskDiv.setAttribute('draggable', 'true');  // allow drag to move to different categories
        taskDiv.setAttribute('data-index', this.createIndex());  // setting data index, used for moving tasks to different categories

        // Task text creation
        const taskNameElement = document.createElement('input');
        taskNameElement.classList.add('task-text');
        taskNameElement.setAttribute('type', 'text');
        taskNameElement.setAttribute('readonly', 'true');
        taskNameElement.classList.add('no-focus');
        taskNameElement.value = this.name;

        // Create buttons container
        const btnsDiv = document.createElement('div');
        btnsDiv.classList.add('buttons-container');

        // Create container to display due date
        const dueDateDiv = document.createElement('div');
        dueDateDiv.classList.add('due-date');

        // Create calendar container to choose due date
        // Separate calendar for each task in order to have a due date for each task
        // TODO Maybe can make this better by having a single global calendar in the TaskManager class from which the user can select due date.
        // TODO create cancel button for selecting due date
        const calendar = new Calendar();
        calendar.resetCalendar();
        calendar.container.classList.add('calendar-container');  // calendar is initially hidden

        // Create buttons for task
        // Buttons: edit, delete, prioritize (star), set due date (calendar)
        const editBtn = this.createIconButton('fa-pen-to-square', () => this.toggleEditMode(taskNameElement, editBtn));
        const deleteBtn = this.createIconButton('fa-trash', () => taskDiv.remove());
        const starBtn = this.createIconButton('fa-star', () => this.togglePriority(taskDiv, starBtn));
        const calBtn = this.createIconButton('fa-calendar', () => this.openCalendar(calendar.container, btnsDiv));

        // Setting event listener for all the date boxes in calendar 
        const dates = calendar.container.querySelectorAll('.date');
        dates.forEach(date => date.addEventListener('click', event => {
            this.selectDueDate(event, calendar);
            calendar.resetCalendar();
            calendar.container.style.display = 'none';
        }));   

        // Enter and exit edit mode: setting up event listeners for alternative events 
        taskNameElement.addEventListener('keydown', event => this.toggleEditMode(taskNameElement, editBtn, event));  // On keydown enter on task name text, the text name will enter/exit edit mode
        taskNameElement.addEventListener('dblclick', event => this.toggleEditMode(taskNameElement, editBtn, event));  // On double click on task name text, the text name will enter/exit edit mode

        // Series of appends to assemble task div
        btnsDiv.append(dueDateDiv, editBtn, calBtn, deleteBtn, starBtn);
        taskDiv.append(taskNameElement, btnsDiv, calendar.container);

        return taskDiv;
    }

    setUpDragListeners() {
        // starting drag on task element trigers data transfer of data index of that task element
        this.taskDiv.addEventListener("dragstart", event => {
            event.dataTransfer.setData("text/plain", event.target.dataset.index);

            event.target.classList.add('dragging'); // for opacity

            const categoriesSection = document.querySelector('#categories-section');
            categoriesSection.querySelector('h3').textContent = 'move to a label below';    // category header title change
            
            // document.querySelectorAll('li').forEach(listElement => listElement.classList.add('drag-start'));
            categoriesSection.querySelectorAll('.buttons-container').forEach(buttonsContainer => buttonsContainer.style.display = 'none');  // hiding all buttons
        });

        // Return all elements to normal state
        this.taskDiv.addEventListener("dragend", event => {
            event.target.classList.remove('dragging');

            const categoriesSection = document.querySelector('#categories-section');
            categoriesSection.querySelector('h3').textContent = 'labels';

            // categoriesSection.querySelectorAll('li').forEach(listElement => listElement.classList.remove('drag-start'));
            categoriesSection.querySelectorAll('.buttons-container').forEach(buttonsContainer => buttonsContainer.style.display = '');
        });
    }

    // Returns an icon element, adds an event listener on click
    createIconButton(iconClass, onClick) {
        const icon = document.createElement('i');
        if (iconClass === 'fa-star') {
            icon.classList.add('button', 'fa-regular', iconClass);
        }
        else {
            icon.classList.add('button', 'fa-solid', iconClass);
        }
        icon.addEventListener('click', onClick);
        return icon;
    }

    // Shows all button containers and enables buttons and input fields
    enableActions() {
        document.querySelector('#main-task-input').classList.remove('blur');
        document.querySelector('#main-task-input').removeAttribute('disabled');

        document.querySelectorAll('.buttons-container').forEach(buttonsContainer => {
            buttonsContainer.classList.add('calendar-close');
            buttonsContainer.classList.remove('calendar-open');
        });
    }

    // Hides all button containers and disables buttons and input fields
    disableActions() {
        // TODO change id of task input (maybe create member)
        document.querySelector('#main-task-input').classList.add('blur');  
        document.querySelector('#main-task-input').setAttribute('disabled', 'true');

        // While the calendar is open, all buttons hidden to prevent other actions during selectiton
        document.querySelectorAll('.buttons-container').forEach(buttonsContainer => {
            buttonsContainer.classList.add('calendar-open');
            buttonsContainer.classList.remove('calendar-close');
        });
        document.querySelectorAll('.add-button').forEach(button => button.setAttribute('disabled', 'true'));
    }

    // Toggle edit mode for task text
    toggleEditMode(taskNameElement, editBtn, event = null) {
        // For alternative events for entering/exiting edit mode
        if (event && event.key !== 'Enter') {
            if (event.type !== 'dblclick') {
                return;
            }
        }

        // Toggle edit mode
        if (taskNameElement.hasAttribute('readonly')) {
            taskNameElement.removeAttribute('readonly');
            taskNameElement.classList.add('edit-mode');
            editBtn.classList.add('edit-mode');
        } else {
            taskNameElement.setAttribute('readonly', 'true');
            taskNameElement.classList.remove('edit-mode');
            editBtn.classList.remove('edit-mode');
        }
    }

    // Toggle task priority (star button)
    togglePriority(taskDiv, starBtn) {
        // Toggle priority mode
        if (taskDiv.classList.contains('priority')) {
            taskDiv.classList.remove('priority');
            starBtn.classList.remove('fa-solid');
            starBtn.classList.add('fa-regular');
            this.tasksContainerState.append(taskDiv);
        } else {
            taskDiv.remove();
            taskDiv.classList.add('priority');
            starBtn.classList.add('fa-solid');
            this.tasksContainerState.prepend(taskDiv);
        }
    }

    // Open the calendar for task due date selection
    openCalendar(calendarContainer, btnsDiv) {
        // If any calendar already open (check if really needed with new design)
        if (btnsDiv.classList.contains('calendar-open')) {
            return;
        }
        calendarContainer.style.display = 'flex';  // For showing hidden calendar          TODO change to css class      SEARCH .style.display
        this.disableActions();
    }

    // TODO check next and prev year edge cases
    // Select a due date for the current task
    selectDueDate(event, calendar) {
        /* Helper variables/functions */
        // These variables hold booleans whether selected date on calendar is previous or next month 
        const isPrevMonth = event.target.classList.contains('prev-month');
        const isNextMonth = event.target.classList.contains('next-month');

        // Variable is text: "MM/DD/YY" 
        const dueDateText = () => {
            if (isPrevMonth) {
                return monthToIndex(month) + '/' + day + '/' + year;
            }
            else if (isNextMonth) {
                return (monthToIndex(month) + 2) + '/' + day + '/' + year;
            }
            return (monthToIndex(month) + 1) + '/' + day + '/' + year;
        }

        /* Getting month and year from the h3 element within the current calendar state */
        /* Getting the day from the day teh user clicked on the calendar */
        const dateText = this.taskDiv.querySelector('.calendar-container #date-text h3').textContent;
        const [month, year] = dateText.split(' ');
        const day = event.target.textContent;

        /* Changes dueDate variable according to whether the selected date is previous */
        /* Uses a helper function to convert month string to index */
        let dueDate = new Date(year, monthToIndex(month), day);  
        if (isPrevMonth) {
            dueDate = new Date(year, monthToIndex(month)-1, day);
        }
        else if (isNextMonth) {
            dueDate = new Date(year, monthToIndex(month)+1, day);
        }

        /* Changes color of task div according to due date relative to current time (by adding/removing classes) */
        const currDate = new Date();
        if (dueDate.toDateString() === currDate.toDateString()) {
            this.taskDiv.querySelector('.due-date').textContent = dueDateText();
            this.taskDiv.classList.remove('overdue');
            this.taskDiv.classList.add('due-today');
        } else if (dueDate < currDate) {
            this.taskDiv.querySelector('.due-date').textContent = dueDateText();
            this.taskDiv.classList.remove('due-today');
            this.taskDiv.classList.add('overdue');
        } else {
            this.taskDiv.querySelector('.due-date').textContent = dueDateText();
            this.taskDiv.classList.remove('overdue');
            this.taskDiv.classList.remove('due-today');
        }

        this.enableActions();
    }
}

class TaskCategory {
    constructor() {
        this.tasksContainer = document.createElement('div');    // Container of the tasks container context for this category
        this.tasksContainer.classList.add('tasks-container');
        this.container = this.createCategoryElement();  // Container of the actual category

        this.setUpDragListeners();
    }

    createCategoryElement() {
        const categoryElement = document.createElement('li');
        categoryElement.classList.add('category');

        /* Text of category title/name */
        const categoryText = document.createElement('input');
        categoryText.placeholder = 'new category...';
        categoryText.type = 'text';
        categoryText.classList.add('category-text');

        /* Buttons creation */
        const btnsContainer = document.createElement('div');
        btnsContainer.classList.add('buttons-container');

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-button');
        const editIcon = document.createElement('i');
        editIcon.classList.add('fa-pen-to-square', 'fa-regular', 'fa-lg');
        editBtn.append(editIcon);
        editBtn.style.display = 'none';

        // Trash button
        const trashBtn = document.createElement('button');
        trashBtn.classList.add('trash-button');
        const trashIcon = document.createElement('i');
        trashIcon.classList.add('fa-trash', 'fa-solid', 'fa-lg');
        trashBtn.append(trashIcon);
        trashBtn.style.display = 'none';

        // Enter button (for 'submitting' category name)
        const enterBtn = document.createElement('button');
        enterBtn.textContent = 'enter';
        enterBtn.classList.add('enter-button');

        // Series of appends to assemble
        btnsContainer.append(editBtn, trashBtn, enterBtn);
        categoryElement.append(categoryText, btnsContainer);

        /* Setting up event listeners for edit button, trash button, and enter button */
        editBtn.addEventListener('click', () => {
            editBtn.style.display = 'none';
            trashBtn.style.display = 'none';
            enterBtn.style.display = '';

            categoryText.removeAttribute('readonly');
            categoryText.classList.remove('no-focus');
            categoryText.focus();

            document.querySelector('#categories-section .add-button').setAttribute('disabled', 'disabled');
        });

        trashBtn.addEventListener('click', () => {
            categoryElement.remove();
            this.tasksContainer = document.querySelector('#main-tasks-container');
            document.querySelector('#main-category').classList.add('current-context');
        });

        enterBtn.addEventListener('click', event => this.submitCategoryName(event));

        // Alternative category name submission method/event
        categoryText.addEventListener('keydown', event => {
            if (event.key === 'Enter') { this.submitCategoryName(event); }
        });

        return categoryElement;
    }

    // Method run on category name submission
    submitCategoryName(event) {
        // Category name input empty case
        if (event.key === 'Enter') {
            if (event.target.value == '') {
                event.target.focus();
                return;
            }
        }
        else {
            const inputElement = event.target.parentElement.parentElement.querySelector('input');
            if (inputElement.value == '') {
                inputElement.focus();
                return;
            }
        }
        
        // Showing edit and trash buttons + Hiding enter button
        const buttonsContainer = this.container.querySelector('.buttons-container');
        buttonsContainer.querySelector('.edit-button').style.display = '';
        buttonsContainer.querySelector('.trash-button').style.display = '';
        buttonsContainer.querySelector('.enter-button').style.display = 'none';

        // Making category text uneditable
        const categoryText = this.container.querySelector('.category-text');
        categoryText.setAttribute('readonly', 'true');
        categoryText.blur();
        categoryText.classList.add('no-focus');

        // Enabling the category add button
        document.querySelector('.add-button').removeAttribute('disabled');
    }

    // Setting up liseners for drop event on category containers
    setUpDragListeners() {
        this.container.addEventListener('dragenter', event => {
            event.preventDefault();
            this.container.classList.add('drag-enter');
        });
        this.container.addEventListener('drop', event => {
            event.preventDefault();

            // Get data that was transferred (in this case, it's the element's ID)
            const data = event.dataTransfer.getData("text/plain");
        });
    }
}

class TaskManager {
    constructor() {
        this.categoriesContainer = document.querySelector('#categories-section');
        this.mainCategoryContainer = document.querySelector('#main-category');
        this.mainTasksContainer = document.querySelector('#main-tasks-container');
        this.inputElement = document.querySelector('#main-task-input');

        this.currTasksContainerState = this.mainTasksContainer;
        this.currCategory = this.mainCategoryContainer;

        this.setUpEventListeners();
    }

    setUpEventListeners() {
        this.mainCategoryContainer.addEventListener('click', () => {
            if (this.currTasksContainerState === this.mainTasksContainer) { return; }
            
            this.currCategory.classList.remove('current-context');
            this.currCategory = this.mainCategoryContainer;
            this.currCategory.classList.add('current-context');
            this.mainTasksContainer.style.display = 'flex';
            this.currTasksContainerState.style.display = 'none';
            this.currTasksContainerState = this.mainTasksContainer; 
        });

        this.mainCategoryContainer.addEventListener('dragover', event => {
            event.preventDefault();
        });
        this.mainCategoryContainer.addEventListener('drop', event => {
            if (this.currTasksContainerState === this.mainTasksContainer) { return; }

            event.preventDefault();

            // Get data that was transferred (in this case, it's the element's ID)
            const data = event.dataTransfer.getData("text/plain");

            const task = this.currTasksContainerState.querySelector(`[data-index="${data}"]`);

            this.mainTasksContainer.append(task);
        });

        this.inputElement.addEventListener('keydown', event => this.addTask(event));

        this.categoriesContainer.querySelector('.add-button').addEventListener('click', () => {
            const newTaskCategory = this.addCategory();
            document.querySelector('#categories-section .add-button').setAttribute('disabled', 'disabled');
            newTaskCategory.container.querySelector('input').focus();
        });
    }

    addCategory() {
        const newTaskCategory = new TaskCategory();
        newTaskCategory.container.querySelector('.category-text').focus();
        document.querySelector('#categories-container ul').append(newTaskCategory.container);

        newTaskCategory.container.addEventListener('click', () => {
            this.currCategory.classList.remove('current-context');
            this.currCategory = newTaskCategory.container;
            this.currCategory.classList.add('current-context');
            this.currTasksContainerState.style.display = 'none';
            document.querySelector('#main-header').after(newTaskCategory.tasksContainer);
            newTaskCategory.tasksContainer.style.display = 'flex';
            this.currTasksContainerState = newTaskCategory.tasksContainer;
        });

        newTaskCategory.container.addEventListener('dragover', event => {
            event.preventDefault();
        });
        newTaskCategory.container.addEventListener('drop', event => {
            if (this.currTasksContainerState === newTaskCategory.container) { return; }

            event.preventDefault();

            // Get data that was transferred (in this case, it's the element's ID)
            const data = event.dataTransfer.getData("text/plain");

            const task = this.currTasksContainerState.querySelector(`[data-index="${data}"]`);

            if (task.classList.contains('priority')) {
                newTaskCategory.tasksContainer.prepend(task);
                return;
            }
            newTaskCategory.tasksContainer.append(task);
        });

        return newTaskCategory;
    }

    addTask(event) {
        if (event.key !== 'Enter') { return; }  // move this if statement a level above?
        // gets user input
        const taskName = this.inputElement.value.trim();
        
        if (taskName === '') {
            // empty case TODO
            return;
        }

        const newTask = new Task(taskName, this.currTasksContainerState);
        this.currTasksContainerState.append(newTask.taskDiv);
        
        this.inputElement.value = '';
    }
}

function monthToIndex(month) {
    const months = {
        "January": 0,
        "February": 1,
        "March": 2,
        "April": 3,
        "May": 4,
        "June": 5,
        "July": 6,
        "August": 7,
        "September": 8,
        "October": 9,
        "November": 10,
        "December": 11
    };
    return months[month];
}

const taskManager = new TaskManager();
