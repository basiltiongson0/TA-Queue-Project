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
const qString = document.getElementById('details');
const qOut = document.getElementById('question-list');

const timeButton = document.getElementById('time-button');
const taEstimate = document.getElementById('ta-estimate');
const totalTime = document.getElementById('total-time');

let timerStartTime = 0;  // timer start time
let isTimerRunning = false;  
let totalTimeElapsed = 0;
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
function printQuestionList() {
    qOut.innerHTML = "";
    questions.forEach(function(item) {
        const li = document.createElement('li');
        li.textContent = item;
        qOut.appendChild(li);
    });
}

// changes from 59 minutes to one hour and so on
function displayTimeEst(time) {
    if (time < 60) {
        totalTime.textContent = `Estimated Queue Time: ${time} minute${time === 1 ? "" : "s"}`;
    } else {
        const hours = Math.floor(time / 60);
        const minutes = time % 60;
        const hourText = `${hours} hour${hours === 1 ? "" : "s"}`;
        const minuteText = minutes > 0 ? ` and ${minutes} minute${minutes === 1 ? "" : "s"}` : "";
        totalTime.textContent = `Estimated Queue Time: ${hourText}${minuteText}`;
    }
}

// Get data from Firestore for names (queue)
let currQueue = [];
// var classInput = document.getElementById('class').textContent;
var classInput = document.getElementById('class').getAttribute('data-password');
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
        const storedTime = docSnap.data().totalTimeSpent || [];
        elapsedTimeArray = storedTime;
        const totalTimeSpent = elapsedTimeArray.reduce((a, b) => a + b, 0);  // Calculate total time
        console.log(`Total time previously spent: ${totalTimeSpent} seconds`);

        taEst = docSnap.data().estimate || 0;
        displayTimeEst(taEst * currQueue.length);  // Display the initial total time on page load

        timerStartTime = Date.now(); 
        startTimer(); 
    } else {
        console.log("No queue document found. Creating a new one...");
        setDoc(queueDocRef4, { estimate: 0 });
    }
});

let questions = [];
const queueDocRef6 = doc(db, classInput, "details");
getDoc(queueDocRef6).then((docSnap) => {
    if (docSnap.exists()) {
        questions = docSnap.data().details || [];
        printQuestionList();
    } else {
        console.log("No queue document found. Creating a new one...");
        setDoc(queueDocRef6, { details: [] });
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
    const detail = qString.value;
    if (name) {
        currQueue.push(name);
        helpQueue.push(help);  // help type
        questions.push(detail);
        // Save to Firestore
        setDoc(queueDocRef, { names: currQueue });
        setDoc(queueDocRef6, { details: questions });
        setDoc(queueDocRef2, { help: helpQueue });
        printNameList();
        printHelpList();
        printQuestionList();
        updateEstimatedTime();
    }
    nameInput.value = ""; // clear input box when name is entered
    qString.value = "";
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
    questions.shift();
    setDoc(queueDocRef, { names: currQueue });
    setDoc(queueDocRef2, { help: helpQueue });
    setDoc(queueDocRef6, { details: questions });
    printNameList();
    printHelpList();
    printQuestionList();
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


const toggleVisibility = document.getElementById('toggle-visibility');
const inputContainer = document.getElementById('input-container');

// Reference to Firestore document for visibility
const visibilityRef = firebase.firestore().collection('queues').doc('visibility');

// Function to sync visibility across users
function syncVisibilityFromFirestore() {
    visibilityRef.onSnapshot((doc) => {
        const isVisible = doc.data().isVisible;
        // Update the UI based on the Firestore value
        if (isVisible) {
            inputContainer.style.display = 'block';
            toggleVisibility.checked = true;
        } else {
            inputContainer.style.display = 'none';
            toggleVisibility.checked = false;
        }
    });
}

// Listen for changes in the checkbox and update Firestore
toggleVisibility.addEventListener('change', () => {
    const isVisible = toggleVisibility.checked;

    // Update Firestore with the new visibility state
    visibilityRef.set({
        isVisible: isVisible
    }, { merge: true });
});

// Sync the visibility when the page loads
syncVisibilityFromFirestore();