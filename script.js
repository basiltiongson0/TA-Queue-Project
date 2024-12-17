// // import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
// //const analytics = getAnalytics(app);
// const db = firebase.firestore();


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












// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "firebase/firestore";

// Your web app's Firebase configuration
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

// Reference to the Firestore document holding the queue
const queueRef = doc(db, "queues", "queueData");

// DOM elements
const nameButton = document.getElementById('name-button');
const nameInput = document.getElementById('name');
const nameList = document.getElementById('name-list');
const removeButton = document.getElementById('remove-button');

// Function to render the name list based on Firestore data
function printNameList(names) {
    nameList.innerHTML = ""; // Clear the existing list
    names.forEach(function(item) {
        const li = document.createElement('li');
        li.textContent = item;
        nameList.appendChild(li);
    });
}

// Listen to changes in the Firestore document in real-time
onSnapshot(queueRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const names = data.names || []; // Use an empty array if no names exist
        printNameList(names);
    } else {
        console.log("No such document!");
    }
});

// Add name to Firestore
nameButton.addEventListener('click', async function() {
    const name = nameInput.value;
    if (name) {
        try {
            const docSnapshot = await getDoc(queueRef);
            const currentNames = docSnapshot.exists() ? docSnapshot.data().names : [];
            const updatedNames = [...currentNames, name]; // Add new name to the array

            // Update Firestore with the new name list
            await setDoc(queueRef, { names: updatedNames });
            nameInput.value = ''; // Clear the input field
        } catch (error) {
            console.error("Error adding name: ", error);
        }
    }
});

// Remove first name from Firestore
removeButton.addEventListener('click', async function() {
    try {
        const docSnapshot = await getDoc(queueRef);
        const currentNames = docSnapshot.exists() ? docSnapshot.data().names : [];
        const updatedNames = currentNames.slice(1); // Remove the first name from the array

        // Update Firestore with the new name list
        await setDoc(queueRef, { names: updatedNames });
    } catch (error) {
        console.error("Error removing name: ", error);
    }
});













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

