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
    // setDoc(queueDocRef3, { time: totalTimeEstimate })
    //     .then(() => {
    //         console.log("Time updated in Firestore.");
    //     })
    //     .catch((error) => {
    //         console.error("Error updating time in Firestore: ", error);
    //     });




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




// Remove first name from Firestore
removeButton.addEventListener('click', function() {
    currQueue.shift();
    helpQueue.shift();  // help type
    setDoc(queueDocRef, { names: currQueue });
    setDoc(queueDocRef2, { help: helpQueue });
    printNameList();
    printHelpList();
    updateEstimatedTime();
});




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
