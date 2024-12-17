// // import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional

// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyBXaPIq6nfeQa2qETjLPt379-TIMd_Oz8o",
//   authDomain: "database1-53083.firebaseapp.com",
//   projectId: "database1-53083",
//   storageBucket: "database1-53083.firebasestorage.app",
//   messagingSenderId: "862586413669",
//   appId: "1:862586413669:web:71beb08bde5ae8df9adc8c",
//   measurementId: "G-DHSPFQRQYR"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = firebase.firestore(app);

// const userRef = doc(db, "queue", "queueData");


// //my code
// const nameButton = document.getElementById('name-button');
// const nameInput = document.getElementById('name');
// const nameList = document.getElementById('name-list');
// const removeButton = document.getElementById('remove-button');


// function printNameList(){
//     nameList.innerHTML =""; 
//     currQueue.forEach(function(item){
//         const li = document.createElement('li');
//         li.textContent = item;
//         nameList.appendChild(li);
//     });
// }

// let currQueue = JSON.parse(localStorage.getItem('queue')) || [];
// printNameList();

// nameButton.addEventListener('click', function() {
//     const name = nameInput.value;
//     if(name){
//         currQueue.push(name);      //all names held here
//         localStorage.setItem('queue', JSON.stringify(currQueue));
//         printNameList();
//     }
// });

// removeButton.addEventListener('click', function() {
//     currQueue.shift();
//     localStorage.setItem('queue', JSON.stringify(currQueue));
//     printNameList();
// });















// // Initialize Firebase (make sure this is already done in your HTML file or previous JS code)
// import { initializeApp } from "firebase/app";
// import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "firebase/firestore";

// // Your Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBXaPIq6nfeQa2qETjLPt379-TIMd_Oz8o",
//   authDomain: "database1-53083.firebaseapp.com",
//   projectId: "database1-53083",
//   storageBucket: "database1-53083.firebasestorage.app",
//   messagingSenderId: "862586413669",
//   appId: "1:862586413669:web:71beb08bde5ae8df9adc8c",
//   measurementId: "G-DHSPFQRQYR"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// // Get references to the buttons and input elements
// const nameButton = document.getElementById('name-button');
// const nameInput = document.getElementById('name');
// const nameList = document.getElementById('name-list');
// const removeButton = document.getElementById('remove-button');

// // Firestore collection and document references
// const queueDocRef = doc(db, "queues", "mainQueue"); // Single document that holds the queue data

// // Function to print the name list (UI update)
// function printNameList(currQueue) {
//     nameList.innerHTML = "";
//     currQueue.forEach(function(item) {
//         const li = document.createElement('li');
//         li.textContent = item;
//         nameList.appendChild(li);
//     });
// }

// // Fetch the current queue from Firestore
// async function fetchQueue() {
//     const queueSnap = await getDoc(queueDocRef);
//     if (queueSnap.exists()) {
//         const queueData = queueSnap.data();
//         return queueData.names || [];
//     } else {
//         // Initialize queue if the document doesn't exist
//         await setDoc(queueDocRef, { names: [] });
//         return [];
//     }
// }

// // Fetch and display the queue when the page loads
// fetchQueue().then(currQueue => {
//     printNameList(currQueue);
// });

// // Listen for real-time updates to the queue document
// onSnapshot(queueDocRef, (docSnap) => {
//     if (docSnap.exists()) {
//         const queueData = docSnap.data();
//         printNameList(queueData.names || []);
//     }
// });

// // Add name to the queue (update Firestore)
// nameButton.addEventListener('click', async function() {
//     const name = nameInput.value;
//     if (name) {
//         const currQueue = await fetchQueue(); // Get current queue from Firestore
//         currQueue.push(name); // Add the new name to the queue

//         // Update the queue document in Firestore
//         await updateDoc(queueDocRef, {
//             names: currQueue
//         });
//     }
// });

// // Remove the first name from the queue (update Firestore)
// removeButton.addEventListener('click', async function() {
//     const currQueue = await fetchQueue(); // Get current queue from Firestore
//     if (currQueue.length > 0) {
//         currQueue.shift(); // Remove the first name from the queue

//         // Update the queue document in Firestore
//         await updateDoc(queueDocRef, {
//             names: currQueue
//         });
//     }
// });




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

// Function to display the name list
function printNameList() {
    nameList.innerHTML = "";
    currQueue.forEach(function(item) {
        const li = document.createElement('li');
        li.textContent = item;
        nameList.appendChild(li);
    });
}

// Get data from Firestore
let currQueue = [];
const queueDocRef = doc(db, "queues", "queue1"); // Reference to a document
getDoc(queueDocRef).then((docSnap) => {
    if (docSnap.exists()) {
        currQueue = docSnap.data().names || [];
        printNameList();
    }
});

// Add name to Firestore
nameButton.addEventListener('click', function() {
    const name = nameInput.value;
    if (name) {
        currQueue.push(name);
        // Save to Firestore
        setDoc(queueDocRef, { names: currQueue });
        printNameList();
    }
});

// Remove first name from Firestore
removeButton.addEventListener('click', function() {
    currQueue.shift();
    setDoc(queueDocRef, { names: currQueue });
    printNameList();
});

