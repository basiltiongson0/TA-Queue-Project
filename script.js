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


// Fetch and display names
const nameButton = document.getElementById('name-button');
const nameInput = document.getElementById('name');
const nameList = document.getElementById('name-list');
const removeButton = document.getElementById('remove-button');
const helpType = document.getElementById('mySelect');
const helpList = document.getElementById('help-list');


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


// Get data from Firestore
let currQueue = [];
var classInput = document.getElementById('class').textContent;
const queueDocRef = doc(db, classInput, "queue1"); // Reference to a document
getDoc(queueDocRef).then((docSnap) => {
    if (docSnap.exists()) {
        currQueue = docSnap.data().names || [];
        printNameList();
    }
    else {
        console.log("No queue document found. Creating a new one...");
        setDoc(queueDocRef, { names: [] }); // Initialize an empty queue if not found
    }
});


// Get data for help queue types
let helpQueue = [];
var classInput = document.getElementById('class').textContent;
const queueDocRef2 = doc(db, classInput, "queueData"); // Reference to a document
getDoc(queueDocRef2).then((docSnap) => {
    if (docSnap.exists()) {
        helpQueue = docSnap.data().help || [];
        printHelpList();
    }
    else {
        console.log("No queue document found. Creating a new one...");
        setDoc(queueDocRef2, { help: [] }); // Initialize an empty queue if not found
    }
});


// Add name to Firestore
nameButton.addEventListener('click', function() {
    const name = nameInput.value;
    const help = helpType.value;  //help type
    if (name) {
        currQueue.push(name);
        helpQueue.push(help);  // help type
        // Save to Firestore
        setDoc(queueDocRef, { names: currQueue });
        setDoc(queueDocRef2, { help: helpQueue});   // help type
        printNameList();
        printHelpList();
    }
    nameInput.value = ""; // clear input box when name is entered
});


// Remove first name from Firestore
removeButton.addEventListener('click', function() {
    currQueue.shift();
    helpQueue.shift();   //help type
    setDoc(queueDocRef, { names: currQueue });
    setDoc(queueDocRef2, { help: helpQueue});  //help type
    printNameList();
    printHelpList();
});
