import { updateTable } from "./table.js";
import { deleteFromPlanner } from "./database.js";

export function openDetail(course){
    //console.log(course.subjectName);
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
    closeBtn.innerHTML = 'X'
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
    const timeLabel = document.createElement('p')
    timeLabel.innerHTML = 'Time : '
    const timeDiv = document.createElement('div')
    timeDiv.className = 'timePopUp'
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
        updateTable();
        closeDetail();
    })
    popUpBox.append(title,closeBtn,courseID,section,instructorName,classRoom,timeLabel,timeDiv,deleteBtn)
    container.append(popUpBox,grayBG)
} 
function closeDetail(){
    const popUpBox = document.getElementById('popUpBox')
    popUpBox.remove()
    const grayBG = document.getElementById('grayBG')
    grayBG.remove()
}