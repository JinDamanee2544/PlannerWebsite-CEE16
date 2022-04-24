import { searchInDB,addInDatabase } from "../logic/database.js";
import { alertDisplay } from "./alertBox.js";

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
        day.innerHTML = 'Day'
        const timeStart = document.createElement('label');
        timeStart.innerHTML = 'Time-Start'
        const timeEnd = document.createElement('label');
        timeEnd.innerHTML = 'Time-End'

        const daySelect = document.createElement('select')
        
        const dayList = ['MON','TUE','WED','THU','FRI']
        dayList.forEach(day=>{
            const dayOption = document.createElement('option')
            dayOption.innerHTML = `${day}`
            dayOption.value = `${day}`
            dayOption.id = `option-${day}`
            daySelect.appendChild(dayOption)
        })

        const startInput = document.createElement('input');
        const endInput = document.createElement('input');

        // binding ID
        daySelect.id = 'selectDay' + index
        startInput.id = 'startInput' +  index
        endInput.id = 'endInput' +  index

        eachInfo.append(order,day,daySelect,timeStart,startInput,timeEnd,endInput)
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
        alertDisplay("This subject already in database")
        return;
    }
    const timeMap = {}
    for (let index = 1; index <= selectWeeklyGlobal; index++) {
        var daySelect = document.getElementById(`selectDay${index}`)
        var dayInput = daySelect.options[daySelect.selectedIndex].value

        var startInput = document.getElementById(`startInput${index}`).value
        var endInput = document.getElementById(`endInput${index}`).value

        timeMap[dayInput]={start:startInput,end:endInput}        
    }

    //console.log(timeMap);
    if(classroom && instructorName && section && subjectID && subjectName && timeMap){
        const course = {
            classroom,instructorName,section,subjectID,subjectName,timeMap
        }
        addInDatabase(course)
    } else {
        alertDisplay("Please fill all content below before submit your data")
    }
}