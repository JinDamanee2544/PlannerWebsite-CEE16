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
    where,
    query,
    arrayUnion,
    arrayRemove,
    setDoc,
} from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js';

// ======================================================= //

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const subjectRef = collection(db, 'subjects');
const myPlannerRef = collection(db,'myPlanner');

// global
var selectWeeklyGlobal = 1;
var selectQueryGlobal = 0; // 0:ID 1:Name
var subjectInplanner = 0;
var subjectInplannerSet = new Set();
var isOverLap = false;

async function checkDataBase(){
    console.log('CheckDatabase');
    const items = await getDocs(subjectRef)
    //console.log(items);
    if(items){
        const subject = items.docs.map((item) => ({
            ...item.data(),
        }));

        console.log(subject);
    }
}
async function search(){
    console.log('search');
    var search
    if(selectQueryGlobal==0){ // By ID
        search = document.getElementById('searchSubjectID').value.trim()
    } else {
        search = document.getElementById('searchSubjectName').value.trim().toUpperCase()
    }
    var foundref
    if(selectQueryGlobal==0){
        foundref = query(subjectRef, where('subjectID', '>=', `${search}`) , where('subjectID', '<=', `${search}`+ '\uf8ff'));
    } else {
        foundref = query(subjectRef, where('subjectName', '>=', `${search}`) , where('subjectName', '<=', `${search}`+ '\uf8ff'));
    }
    const queryID = await getDocs(foundref)
    const searchList = [] // array of data array - 2D array
    if(queryID){
        const queryMap = queryID.docs.map(item=>({
            ...item.data()
        }))
        if(queryMap.length==0) {
            console.log('Not found');
            alert('Not found')
            return;
        } else {
            searchList.push(queryMap)
        }
    }
    const searchBox = document.getElementById('searchList')
    searchBox.innerHTML = '' // clear
    //console.log(searchList);
    var idx = 1;
    searchList[0].forEach(subjectData => {
        //console.log(subjectData);
        const searchCard = document.createElement('div')
        searchCard.className = 'searchCard'
        searchCard.id = 'card'+subjectData.subjectID+'-'+subjectData.section

        const titleDiv = document.createElement('div')
        titleDiv.className = 'searchCard-title'
        const nameIDDisplay = document.createElement('h1')
        nameIDDisplay.innerHTML = subjectData.subjectID + ' - '+ subjectData.subjectName
        const secDisplay = document.createElement('h1')
        secDisplay.innerHTML = subjectData.section
        titleDiv.append(nameIDDisplay,secDisplay)

        const contentDiv = document.createElement('div')
        contentDiv.className = 'searchCard-content'

        const instDisplay = document.createElement('p')
        instDisplay.innerHTML = 'Instructor Name : '+subjectData.instructorName
        contentDiv.append(instDisplay)
        const timeMap = subjectData.timeMap
        for(var day in timeMap){
            const dayTimeDisplay = document.createElement('p')
            dayTimeDisplay.innerHTML = day+' : '+timeMap[day].start + ' - ' +timeMap[day].end
            contentDiv.append(dayTimeDisplay)
        }
        idx++;
        const addToPlannerBtn = document.createElement('button')
        addToPlannerBtn.id = 'add'+idx
        addToPlannerBtn.innerHTML = 'Add To my Planner'
        addToPlannerBtn.className = 'addToPlannerBtn'
        addToPlannerBtn.addEventListener('click',function(){
            addToPlanner(subjectData)   
        })
        searchCard.append(titleDiv,contentDiv,addToPlannerBtn)
        searchBox.appendChild(searchCard)

    });
}   
function timeAdd(){
    console.log('change');
    const courseWeeklySelect = document.getElementById('selectWeekly')
    const courseWeekly = courseWeeklySelect.options[courseWeeklySelect.selectedIndex].value;
    selectWeeklyGlobal = courseWeekly // Set global
    
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
function queryChoice(){
    console.log('updateQueryWay');
    const queryDiv = document.getElementById('queryChoice')
    queryDiv.innerHTML = '' //clear
    const selectQuery = document.getElementById('selectQuery')
    const choice = selectQuery.options[selectQuery.selectedIndex].value
    selectQueryGlobal = choice
    if(choice==0){
        const idLabel = document.createElement('label')
        idLabel.innerHTML = 'Subject ID : '
        const inputID = document.createElement('input')
        inputID.id = 'searchSubjectID'
        inputID.type = 'text'
        queryDiv.append(idLabel,inputID)
    } else {
        const nameLabel = document.createElement('label')
        nameLabel.innerHTML = 'Subject Name : '
        const inputName = document.createElement('input')
        inputName.id = 'searchSubjectName'
        inputName.type = 'text'
        queryDiv.append(nameLabel,inputName)
    } 
}
async function addItem(){
    console.log("Add Item");

    // fetch 
    const subjectName = document.getElementById('subjectName').value.trim().toUpperCase()
    const subjectID = document.getElementById('subjectID').value.trim()
    const section = document.getElementById('section').value.trim()
    const instructorName = document.getElementById('instructorName').value.trim().toUpperCase()
    const classroom = document.getElementById('classroom').value.trim()

    // check Duplicate
    const searchRef = doc(db,'subjects',`${subjectID}-${section}`)
    const searchSnap = await getDoc(searchRef)
    if(searchSnap.data()){
        console.log("This subject already in database");
        alert("This subject already in database");
    }

    
    const timeMap = {}
    for (let index = 1; index <= selectWeeklyGlobal; index++) {
        var dayInput = document.getElementById(`dayInput${index}`).value
        var startInput = document.getElementById(`startInput${index}`).value
        var endInput = document.getElementById(`endInput${index}`).value

        timeMap[dayInput]={start:startInput,end:endInput}        
    }

    //console.log(timeMap);
    if(classroom && instructorName && section && subjectID && subjectName && timeMap){
        const locationRef = doc(db,'subjects',`${subjectID}-${section}`)
        setDoc(locationRef,{
            classroom,
            instructorName,
            section,
            subjectID,
            subjectName,
            timeMap
        })
        console.log("Add successfully");
    } else {
        alert("Please fill all content below before submit your data")
        console.log("Fail");
    }
    
}
function myTableGenerator(){
    const tableContainer = document.getElementById('myTable')
    tableContainer.innerHTML = ''
    const table = document.createElement('table')
    // ----------- head --------------// 
    const headRow = document.createElement('tr')
    const headDay = document.createElement('th')
    headDay.innerHTML = 'Day'
    headDay.className = 'headDay'
    headDay.style.borderTopLeftRadius = '25px'
    const headTime = document.createElement('th')
    headTime.innerHTML = 'Time'
    headTime.id = 'headTime'
    headTime.colSpan = subjectInplanner
    headTime.style.borderTopRightRadius = '25px'
    headRow.append(headDay,headTime) 
    table.appendChild(headRow)
    // ------------- Content ------------//
    const day = ['MON','TUE','WED','THU','FRI']
    for(let idx=0;idx<5;idx++){
        var thisDay = day[idx]
        const contentRow = document.createElement('tr')
        contentRow.id = thisDay
        const dayCol = document.createElement('td')
        dayCol.innerHTML = thisDay
        contentRow.appendChild(dayCol)
        table.appendChild(contentRow)
    }
    tableContainer.appendChild(table)

}
async function addToPlanner(course){
    // checking Duplicate
    const searchInplannerRef = doc(db,'myPlanner',`${course.subjectID}-${course.section}`)
    const searchSnap = await getDoc(searchInplannerRef)
    if(searchSnap.data()){
        console.log();("This subject already in planner")
        alert("This subject already in planner")
    }
    
    // checking time overlap
    const checkOverLap = await overlapping(course)
    //console.log(checkOverLap);
    if(checkOverLap){
        alert('Your selected course has overlapped with another course in planner')
        console.log('Your selected course has overlapped with another course in planner');
        return;
    }
    
    subjectInplanner++;
    subjectInplannerSet.add(`${course.subjectID}+'-'+${course.section}`)
    
    const locationRef = doc(db,'myPlanner',`${course.subjectID}-${course.section}`)
    setDoc(locationRef,{
        subjectID : course.subjectID,
        subjectName : course.subjectName,
        section : course.section,
        instructorName : course.instructorName,
        classroom : course.classroom,
        timeMap : course.timeMap
    })
    
    updateTable();
    
}
async function overlapping(course){
    // fetch database and sort
    isOverLap = false
    const allSubjectDoc = await getDocs(myPlannerRef)
    if(allSubjectDoc){
        const allSubject = allSubjectDoc.docs.map((item) => ({
            ...item.data(),
        }));
        /*
        if(allSubject.length==0){
            isOverLap = false;
            return false;
        }*/
        var dayMap = {
            "MON":[],
            "TUE":[],
            "WED":[],
            "THU":[],
            "FRI":[]
        }
        for(var idx=0;idx<allSubject.length;idx++){
            var thisSubject = allSubject[idx];
            for(var day in thisSubject.timeMap){
                dayMap[day].push(thisSubject) 
            }
        }
        for(var day in course.timeMap){
            const courseTimeStart = course.timeMap[day].start.replace(':','')
            const courseTimeEnd = course.timeMap[day].end.replace(':','')
            dayMap[day].forEach(otherCourse => {
                var otherCourseStart = otherCourse.timeMap[day].start.replace(':','')
                var otherCourseEnd = otherCourse.timeMap[day].end.replace(':','')
                if(Number(courseTimeStart) < Number(otherCourseEnd) && Number(courseTimeEnd) > Number(otherCourseStart)){
                    //console.log(course.subjectName + ' ' + otherCourse.subjectName);
                    isOverLap = true;
                    //return true  <---- This won't work I don't know I can't return
                    // So I crete boolean for this instead 
                }
            })
        }
    }
    return isOverLap
}

async function updateTable(){
    const allSubjectDoc = await getDocs(myPlannerRef)
    if(allSubjectDoc){
        const allSubject = allSubjectDoc.docs.map((item) => ({
            ...item.data(),
        }));
        //console.log(allSubject);
        var subjectCnt = allSubject.length
        //console.log('CNT : '+subjectCnt)
        myTableGenerator()
        upDateColSpan(subjectCnt)

        var dayMap = {
            "MON":[],
            "TUE":[],
            "WED":[],
            "THU":[],
            "FRI":[]
        }
        for(var idx=0;idx<allSubject.length;idx++){
            var thisSubject = allSubject[idx];
            for(var day in thisSubject.timeMap){
                dayMap[day].push(thisSubject) 
            }
        }
        
        for(var day in dayMap){
            var coursesThisDay = dayMap[day];
            coursesThisDay.sort(function(a,b){
                return a.timeMap[day].start.replace(':','') - b.timeMap[day].start.replace(':','')
            })
            for(var idx=0 ; idx<coursesThisDay.length ;idx++){   // Each Day
                let course = coursesThisDay[idx];

                const thisRow = document.getElementById(`${day}`)
                const subjectBox = document.createElement('td')
                const subjectDiv = document.createElement('div')
                subjectDiv.className = 'subjectDivInTable'
                subjectDiv.id = 'subjectDivInTable'
                subjectDiv.addEventListener('click',function(){
                    openDetail(course)
                })
                const title = document.createElement('p')
                title.innerHTML = `${course.subjectName}`
                const time = document.createElement('p')
                time.innerHTML = `${course.timeMap[day].start}`+' - '+`${course.timeMap[day].end}`

                subjectDiv.append(title,time)
                subjectBox.append(subjectDiv)
                thisRow.appendChild(subjectBox)
            }
        }
    }
}
function upDateColSpan(subjectCnt){
    const headTime = document.getElementById('headTime')
    headTime.colSpan = subjectCnt
}
function openDetail(course){
    console.log(course.subjectName);
    console.log('openDetail');
    const container = document.getElementById('container')
    const popUpBox = document.createElement('div')
    popUpBox.className = 'popUpBox'
    popUpBox.id = 'popUpBox'
    const title = document.createElement('h1')
    title.innerHTML = `${course.subjectName}`
    const grayBG = document.createElement('div')
    grayBG.className = 'grayBG'
    grayBG.id = 'grayBG'

    const closeBtn = document.createElement('button')
    closeBtn.innerHTML = 'Close'
    closeBtn.className = 'closeBtn'
    closeBtn.addEventListener('click',closeDetail)

    const instructorName = document.createElement('p')
    instructorName.innerHTML = 'Instructor Name : '+`${course.instructorName}`
    const classRoom = document.createElement('p')
    classRoom.innerHTML = 'Classroom : '+`${course.classroom}`
    const section = document.createElement('p')
    section.innerHTML = 'Section : '+`${course.section}`
    const courseID = document.createElement('p')
    courseID.innerHTML = 'Subject ID : '+`${course.subjectID}`
    const timeDiv = document.createElement('div')
    for(var day in course.timeMap){
        const time = document.createElement('p')
        time.innerHTML = `${day} : ${course.timeMap[day].start} - ${course.timeMap[day].end}`
        timeDiv.append(time)
    }
    
    const deleteBtn = document.createElement('button')
    deleteBtn.innerHTML = 'Delete From My Planner'
    deleteBtn.className = 'deleteBtn'
    deleteBtn.addEventListener('click',function(){
        deleteFromPlanner(course);
        closeDetail();
    })

    popUpBox.append(title,closeBtn,courseID,section,instructorName,classRoom,timeDiv,deleteBtn)
    container.append(popUpBox,grayBG)
}
function closeDetail(){
    const popUpBox = document.getElementById('popUpBox')
    popUpBox.remove()
    const grayBG = document.getElementById('grayBG')
    grayBG.remove()
}
async function deleteFromPlanner(course){
    
    const deleteRef = doc(db,'myPlanner',`${course.subjectID}-${course.section}`)

    await deleteDoc(deleteRef)
    console.log('delete : ' + course.subjectName);
    updateTable()
}
// Binding Func with btn
document.getElementById('test').addEventListener('click',checkDataBase)
document.getElementById('selectWeekly').addEventListener('change',timeAdd)
document.getElementById('selectQuery').addEventListener('change',queryChoice)
document.getElementById('addItemBtn').addEventListener('click',addItem)
document.getElementById('searchBtn').addEventListener('click',search)
// Starting Func when starting up website
timeAdd()
queryChoice()
myTableGenerator()
updateTable()