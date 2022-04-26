import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
const firebaseConfig = {
    apiKey: "AIzaSyC3W0TynIaNGbc5pHvyGt_5H5ffzfbw1cE",
    authDomain: "planner-db-7c75a.firebaseapp.com",
    projectId: "planner-db-7c75a",
    storageBucket: "planner-db-7c75a.appspot.com",
    messagingSenderId: "649014743586",
    appId: "1:649014743586:web:6bcfce98705e85ca9a707b"
  };
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    where,
    query,
    setDoc,
} from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js';
import { successDisplay } from "./alertBox.js";

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const subjectRef = collection(db, 'subjects');
export const myPlannerRef = collection(db,'myPlanner');

// ----------------------- Planner ------------------- //
export async function loadCoursePlanner(course){
    const courseRef = doc(db,'myPlanner',`${course.subjectID}-${course.section}`)
    const myPlannerDoc = await getDoc(courseRef)
    return myPlannerDoc
}
export async function loadAllPlanner(){
    const courseRef = collection(db,'myPlanner')
    const myPlannerDoc = await getDocs(courseRef)
    return myPlannerDoc
}
export async function deleteFromPlanner(course){
    const deleteRef = doc(db,'myPlanner',`${course.subjectID}-${course.section}`)
    await deleteDoc(deleteRef)
    successDisplay('Delete : ' + course.subjectName)
}
export async function addToPlannerDB(course){
    const locationRef = doc(db,'myPlanner',`${course.subjectID}-${course.section}`)
    setDoc(locationRef,{
        subjectID : course.subjectID,
        subjectName : course.subjectName,
        section : course.section,
        instructorName : course.instructorName,
        classroom : course.classroom,
        timeMap : course.timeMap
    })
    successDisplay("Add In Planner successfully")
}
export async function quearySameCoursePlanner(course){
    const searchID = `${course.subjectID}`
    const foundRef = query(myPlannerRef,where('subjectID', '>=', `${searchID}`),where('subjectID', '<=', `${searchID}`+ '\uf8ff'))
    const foundDoc = await getDocs(foundRef)
    return foundDoc
}
// ----------------------- Subject ------------------- //
export async function searchInDB(subjectID,section){
    const searchRef = doc(db,'subjects',`${subjectID}-${section}`)
    const searchDoc = await getDoc(searchRef)
    return searchDoc
}
export async function searchByName(){
    const name = document.getElementById('searchSubjectName').value.trim().toUpperCase()
    const foundref = query(subjectRef, where('subjectName', '>=', `${name}`) , where('subjectName', '<=', `${name}`+ '\uf8ff'));
    const queryDoc = await getDocs(foundref)
    return queryDoc
}
export async function searchByID(){
    const id = document.getElementById('searchSubjectID').value.trim()
    const foundref = query(subjectRef, where('subjectID', '>=', `${id}`) , where('subjectID', '<=', `${id}`+ '\uf8ff'));
    const queryDoc = await getDocs(foundref)
    return queryDoc
}
export async function addInDatabase(course){
    const locationRef = doc(db,'subjects',`${course.subjectID}-${course.section}`)
    setDoc(locationRef,{
        classroom : course.classroom,
        instructorName : course.instructorName,
        section : course.section,
        subjectID : course.subjectID,
        subjectName : course.subjectName,
        timeMap : course.timeMap
    })
    successDisplay("Successfully added to database")
}