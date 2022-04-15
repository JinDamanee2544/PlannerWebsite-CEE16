// put Your SDK setup and configuration here (CDN version)
// =======================================================
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC3W0TynIaNGbc5pHvyGt_5H5ffzfbw1cE",
    authDomain: "planner-db-7c75a.firebaseapp.com",
    projectId: "planner-db-7c75a",
    storageBucket: "planner-db-7c75a.appspot.com",
    messagingSenderId: "649014743586",
    appId: "1:649014743586:web:6bcfce98705e85ca9a707b"
  };
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    updateDoc,
} from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js';

// ======================================================= //

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const subjectRef = collection(db, 'subjects');

// global
var CourseWeeklyGlobal = 1;




async function test(){
    console.log('test');
    const items = await getDocs(subjectRef)
    //console.log(items);
    if(items){
        const subject = items.docs.map((item) => ({
            ...item.data(),
        }));

        console.log(subject);
    }
}
function timeAdd(){
    console.log('change');
    const courseWeeklySelect = document.getElementById('courseCnt')
    const courseWeekly = courseWeeklySelect.options[courseWeeklySelect.selectedIndex].value;
    CourseWeeklyGlobal = courseWeekly // Set global
    
    const timeDiv = document.getElementById('timeDetail')
    timeDiv.innerHTML = '' //clear

    for (let index = 1; index <= courseWeekly; index++) {
        const eachInfo = document.createElement('div')
        
        const order = document.createElement('span')
        order.innerHTML = index + " : "
        const day = document.createElement('label');
        day.innerHTML = 'day'
        const timeStart = document.createElement('label');
        timeStart.innerHTML = 'timeStart'
        const timeEnd = document.createElement('label');
        timeEnd.innerHTML = 'timeEnd'
        const dayInput = document.createElement('input');
        const startInput = document.createElement('input');
        const endInput = document.createElement('input');

        // binding ID
        dayInput.id = 'dayInput' +  index
        startInput.id = 'startInput' +  index
        endInput.id = 'endInput' +  index

        eachInfo.append(order,day,dayInput,timeStart,startInput,timeEnd,endInput)
        timeDiv.appendChild(eachInfo)
    }
}
function addItem(){
    console.log("Add Item");

    // fetch 
    const subjectName = document.getElementById('subjectName').value
    const subjectID = document.getElementById('subjectID').value
    const section = document.getElementById('section').value
    const instructorName = document.getElementById('instructorName').value
    const classroom = document.getElementById('classroom').value
    
    const timeMap = new Map()
    for (let index = 1; index <= CourseWeeklyGlobal; index++) {
        var dayInput = document.getElementById(`dayInput${index}`).value
        var startInput = document.getElementById(`startInput${index}`).value
        var endInput = document.getElementById(`endInput${index}`).value

        var arrayTime = [startInput,endInput]
        
        timeMap.set(dayInput,arrayTime)
    }
    console.log(timeMap);
    
    addDoc(subjectRef,{
        classroom,
        instructorName,
        section,
        subjectID,
        subjectName,
        timeMap                 // <-------------- Problem Here : Can't push Map in database. Pls someone Help!
    })
    console.log("Add successfully");
}
/*
async function updateItem() {
    console.log('updateItem');

    const docId = document.getElementById('docId').value;

    const bookRef = await doc(db, `books/${docId}`);
    let bookInstance = await getDoc(bookRef);
    bookInstance = bookInstance.data();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    const bookData = {
        title: title ? title : bookInstance.title,
        author: author ? author : bookInstance.author,
        isbn: isbn ? isbn : bookInstance.isbn,
    };

    console.log(bookData);

    updateDoc(bookRef, bookData)
        .then(function () {
            console.log('success');
        })
        .catch(function (error) {
            console.log('failed', error);
        });
}

async function deleteItem() {
    console.log('deleteItem');

    const docId = document.getElementById('docId').value;
    const docRef = doc(db, `books/${docId}`);

    await deleteDoc(docRef);
}
*/

// Binding Func with btn
document.getElementById('test').addEventListener('click',test)
document.getElementById('courseCnt').addEventListener('change',timeAdd)
document.getElementById('addItemBtn').addEventListener('click',addItem)

// Starting Func when starting up website
timeAdd()