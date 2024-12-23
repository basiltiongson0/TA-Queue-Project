// Import Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXaPIq6nfeQa2qETjLPt379-TIMd_Oz8o",
  authDomain: "database1-53083.firebaseapp.com",
  projectId: "database1-53083",
  storageBucket: "database1-53083.firebasestorage.app",
  messagingSenderId: "862586413669",
  appId: "1:862586413669:web:71beb08bde5ae8df9adc8c",
  measurementId: "G-DHSPFQRQYR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const nameButton = document.getElementById('name-button');
const nameInput = document.getElementById('name');
const nameList = document.getElementById('name-list');
const removeButton = document.getElementById('remove-button');
const helpType = document.getElementById('mySelect');
const helpList = document.getElementById('help-list');

const timeButton = document.getElementById('time-button');
const taEstimate = document.getElementById('ta-estimate');
const totalTime = document.getElementById('total-time');

let timerStartTime = 0;  // Variable to store the start time of the timer
let isTimerRunning = false;  // Boolean flag to check if the timer is running
let totalTimeElapsed = 0;  // Variable to store the total elapsed time
let timerEndTime = 0;

// Function to display the name list
function printNameList() {
    nameList.innerHTML = "";
    currQueue.forEach(function(item) {
        const li = document.createElement('li');
        li.textContent = item;
        nameList.appendChild(li);
    });
}

// Function display help list
function printHelpList() {
    helpList.innerHTML = "";
    helpQueue.forEach(function(item) {
        const li = document.createElement('li');
        li.textContent = item;
        helpList.appendChild(li);
    });
}

function displayTimeEst(time){
    totalTime.textContent = `Estimated Queue Time: ${time} minutes`;
}

// Get data from Firestore for names (queue)
let currQueue = [];
var classInput = document.getElementById('class').textContent;
const queueDocRef = doc(db, classInput, "queue1");
getDoc(queueDocRef).then((docSnap) => {
    if (docSnap.exists()) {
        currQueue = docSnap.data().names || [];
        printNameList();
        updateEstimatedTime();
    } else {
        console.log("No queue document found. Creating a new one...");
        setDoc(queueDocRef, { names: [] });
    }
});

// Get data for help queue types
let helpQueue = [];
const queueDocRef2 = doc(db, classInput, "queueData");
getDoc(queueDocRef2).then((docSnap) => {
    if (docSnap.exists()) {
        helpQueue = docSnap.data().help || [];
        printHelpList();
    } else {
        console.log("No queue document found. Creating a new one...");
        setDoc(queueDocRef2, { help: [] });
    }
});

// Get data for estimated time (time per student)
let taEst = 0;
const queueDocRef4 = doc(db, classInput, "TAestimate");
getDoc(queueDocRef4).then((docSnap) => {
    if (docSnap.exists()) {
        taEst = docSnap.data().estimate || 0;
        displayTimeEst(taEst * currQueue.length);  // Display the initial total time on page load
    } else {
        console.log("No queue document found. Creating a new one...");
        setDoc(queueDocRef4, { estimate: 0 });
    }
});

// Update estimated time based on queue length and TA's estimate
function updateEstimatedTime(){
    const totalTimeEstimate = taEst * currQueue.length;  // Calculate total time based on the current queue
    displayTimeEst(totalTimeEstimate);  // Display the total estimated time on the page
}

// Add name to Firestore
nameButton.addEventListener('click', function() {
    const name = nameInput.value;
    const help = helpType.value;  // help type
    if (name) {
        currQueue.push(name);
        helpQueue.push(help);  // help type
        // Save to Firestore
        setDoc(queueDocRef, { names: currQueue });
        setDoc(queueDocRef2, { help: helpQueue });
        printNameList();
        printHelpList();
        updateEstimatedTime();
    }
    nameInput.value = ""; // clear input box when name is entered
});

const elapsedTimeDisplay = document.getElementById('elapsed-time');
let elapsedTimeArray =[];
// Remove first name from Firestore
removeButton.addEventListener('click', function() {
    // Check if the queue is not empty before starting the timer
    if (currQueue.length === 0) {
        console.log("Queue is empty. Timer will not start.");
        return;  // Do nothing if the queue is empty
    }

    if (!isTimerRunning) {
        // Timer is not running, so start the timer
        timerStartTime = Date.now();  // Capture the start time of this interval
        isTimerRunning = true;  // Set the flag to indicate timer is running
        console.log("Timer started...");
       
        // Update the display to show "0" when timer starts
        elapsedTimeDisplay.textContent = "0";  // Reset to 0 seconds when the timer starts


        // Start updating the timer every second
        startTimer();
    }

    // elapsedTimeDisplay.textContent = "0";
    // timerStartTime = Date.now();
    // Store elapsed time in the array whenever the button is pressed
    // We will always update the elapsed time when the remove button is clicked
    const currentElapsedTime = (Date.now() - timerStartTime) / 1000;  // Calculate time in seconds
    elapsedTimeArray.push(currentElapsedTime);
    elapsedTimeDisplay.textContent = Math.floor(currentElapsedTime);

    elapsedTimeDisplay.textContent = "0";
    timerStartTime = Date.now();

    // Save totalTimeElapsed to Firestore
    setDoc(queueDocRef4, { estimate: taEst, totalTimeSpent: elapsedTimeArray })
        .then(() => {
            console.log(`Elapsed time: ${currentElapsedTime} seconds`);
            console.log(`Total time spent: ${elapsedTimeArray.reduce((a, b) => a + b, 0)} seconds`);
        })
        .catch((error) => {
            console.error("Error updating total time in Firestore: ", error);
        });

    currQueue.shift();
    helpQueue.shift();  // help type
    setDoc(queueDocRef, { names: currQueue });
    setDoc(queueDocRef2, { help: helpQueue });
    printNameList();
    printHelpList();
    updateEstimatedTime();
});

// Timer interval function to update the displayed time
let timerInterval; // Reference to store the interval ID

function startTimer() {
    // Update the displayed time every second
    timerInterval = setInterval(() => {
        const currentElapsedTime = Date.now() - timerStartTime;  // Get current elapsed time
        const timeInSeconds = Math.floor(currentElapsedTime / 1000);  // Convert to seconds
        elapsedTimeDisplay.textContent = timeInSeconds;  // Update the display
    }, 1000);  // Update every second
}

// When the TA updates the estimate time
timeButton.addEventListener('click', function(){
    const timePerStudent = parseFloat(taEstimate.value);  // Get the inputted TA estimate
    if (!isNaN(timePerStudent) && timePerStudent > 0) {
        // Update the TA's estimate in Firestore
        setDoc(queueDocRef4, { estimate: timePerStudent })
            .then(() => {
                taEst = timePerStudent;  // Update the local variable with the new estimate
                console.log("TA estimate updated in Firestore.");
                updateEstimatedTime();  // Recalculate and update the total time
            })
            .catch((error) => {
                console.error("Error updating TA estimate in Firestore: ", error);
            });
    }
});
