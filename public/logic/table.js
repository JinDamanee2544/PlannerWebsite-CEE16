import {loadAllPlanner,loadCoursePlanner,deleteFromPlanner,addToPlannerDB,quearySameCoursePlanner} from '../logic/database.js'
import { alertDisplay } from './alertBox.js';
import { openDetail } from './popUpBox.js';
var subjectInplanner = 0;

// ----------------- LOCAL FUNC ---------------------//
function upDateColSpan(subjectCnt){
    const headTime = document.getElementById('headTime')
    headTime.colSpan = subjectCnt
}

async function overlapping(course){
    // fetch database and sort
    let isOverLap = false
    const allSubjectDoc = await loadAllPlanner()
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
        //console.log(dayMap);
        for(var day in course.timeMap){
            const courseTimeStart = course.timeMap[day].start.replace(':','')
            const courseTimeEnd = course.timeMap[day].end.replace(':','')
            if(dayMap[day]){
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
    }
    return isOverLap
}
async function checkSection(course){
    const checkDoc = await quearySameCoursePlanner(course);
    const checkMap = checkDoc.docs.map((item) => ({
        ...item.data(),
    }));
    //console.log(checkMap);
    if(checkMap.length==0) {
        return false
    } else {
        return true
    }
}
// ----------------- EXPORT FUNC ---------------------//
export function myTableGenerator(){
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
    //headTime.colSpan = subjectInplanner
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
export async function addToPlanner(course){
    // checking Duplicate
    const searchSnap = await loadCoursePlanner(course);
    if(searchSnap.data()){
        alertDisplay("This subject already in planner")
        return;
    }
    // checking Same Subject but it's other section
    const checkOtherSection = await checkSection(course)
    if(checkOtherSection){
        alertDisplay("This subject already plan in another section")
        return;
    }
    // checking time overlap
    const checkOverLap = await overlapping(course)
    if(checkOverLap){
        alertDisplay('Your selected course has overlapped with another course in planner')
        return;
    }
    addToPlannerDB(course)
    updateTable();
}

export async function updateTable(){
    const allSubjectDoc = await loadAllPlanner();
    if(allSubjectDoc){
        const allSubject = allSubjectDoc.docs.map((item) => ({
            ...item.data(),
        }));
        // Update all subject counter 
        var subjectCnt = allSubject.length
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
