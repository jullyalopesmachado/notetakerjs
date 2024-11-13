// script.js

// Get elements
const noteText = document.getElementById("noteText");
const noteDate = document.getElementById("noteDate");
const addNoteBtn = document.getElementById("addNoteBtn");
const notesList = document.getElementById("notesList");
const dateDropdown = document.getElementById("dateDropdown");
const currentDateDisplay = document.getElementById("currentDate");

// Load notes and populate date dropdown on page load
window.addEventListener("load", loadNotes);

// Display the current date at the top
const today = new Date();
const formattedDate = today.toLocaleDateString("en-GB"); // dd/mm/yyyy format
currentDateDisplay.innerText = `Today's Date: ${formattedDate}`;

// Event listener for adding a note
addNoteBtn.addEventListener("click", addNote);
dateDropdown.addEventListener("change", filterNotesByDate);

// Add a new note
function addNote() {
    const noteContent = noteText.value.trim();
    const selectedDate = noteDate.value || formattedDate; // Use selected date or today's date if none selected

    if (noteContent === "") {
        alert("Please write something in the note.");
        return;
    }

    const note = { 
        id: Date.now(), 
        content: noteContent, 
        date: selectedDate 
    };

    const notes = getNotes();
    notes.push(note);
    saveNotes(notes);

    displayNotes(notes, dateDropdown.value);
    updateDateDropdown();

    noteText.value = ""; // Clear text area
    noteDate.value = ""; // Clear date picker
}

// Display notes filtered by date
function displayNotes(notes, selectedDate = "all") {
    notesList.innerHTML = "";

    notes
        .filter(note => selectedDate === "all" || note.date === selectedDate)
        .forEach(note => {
            const li = document.createElement("li");
            li.classList.add("note-item");
            li.innerHTML = `
                <span>${note.content}</span>
                <button onclick="deleteNote(${note.id})">Delete</button>
            `;
            notesList.appendChild(li);
        });
}

// Delete a note
function deleteNote(id) {
    const notes = getNotes().filter(note => note.id !== id);
    saveNotes(notes);
    displayNotes(notes, dateDropdown.value);
    updateDateDropdown();
}

// Get notes from localStorage
function getNotes() {
    return JSON.parse(localStorage.getItem("notes")) || [];
}

// Save notes to localStorage
function saveNotes(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
}

// Load notes on page load
function loadNotes() {
    const notes = getNotes();
    displayNotes(notes);
    updateDateDropdown();
}

// Update the date dropdown with unique dates
function updateDateDropdown() {
    const notes = getNotes();
    const dates = Array.from(new Set(notes.map(note => note.date)));

    dateDropdown.innerHTML = '<option value="all">All Dates</option>';
    dates.forEach(date => {
        const option = document.createElement("option");
        option.value = date;
        option.textContent = date;
        dateDropdown.appendChild(option);
    });
}

// Filter notes by date
function filterNotesByDate() {
    const selectedDate = dateDropdown.value;
    const notes = getNotes();
    displayNotes(notes, selectedDate);
}
