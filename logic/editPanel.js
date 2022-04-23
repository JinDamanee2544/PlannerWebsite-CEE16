import { searchInDB,addInDatabase } from "../logic/database.js";

var selectWeeklyGlobal = 1;


export function timeAdd(){
    console.log('change');
    const courseWeeklySelect = document.getElementById('selectWeekly')
    const courseWeekly = courseWeeklySelect.options[courseWeeklySelect.selectedIndex].value;
    // Update selectWeeklyGlobal
    selectWeeklyGlobal = courseWeekly

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
export async function addItem(){
    console.log("Add Item");

    // fetch 
    const subjectName = document.getElementById('subjectName').value.trim().toUpperCase()
    const subjectID = document.getElementById('subjectID').value.trim()
    const section = document.getElementById('section').value.trim()
    const instructorName = document.getElementById('instructorName').value.trim().toUpperCase()
    const classroom = document.getElementById('classroom').value.trim()

    // check Duplicate
    const searchDoc = await searchInDB(subjectID,section)
    if(searchDoc.data()){
        console.log("This subject already in database");
        alert("This subject already in database");
        return;
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
        const course = {
            classroom,instructorName,section,subjectID,subjectName,timeMap
        }
        console.log(course);
        addInDatabase(course)
    } else {
        alert("Please fill all content below before submit your data")
        console.log("Fail");
    }
}