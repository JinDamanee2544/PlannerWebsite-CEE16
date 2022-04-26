import { addToPlanner } from "./table.js";
import { searchByID,searchByName } from "./database.js";
import { alertDisplay } from "./alertBox.js";
var selectQueryGlobal = 0; // 0:ID 1:Name

export function clearSearch(){
    const searchBox = document.getElementById('searchList')
    searchBox.innerHTML = '' // clear
    const exampleSearchDiv = document.createElement('div')
    exampleSearchDiv.className = 'searchCard example'
    const waitingText = document.createElement('p')
    waitingText.innerHTML = 'Waiting For Input...'
    exampleSearchDiv.appendChild(waitingText)
    searchBox.appendChild(exampleSearchDiv)
}
export async function search(){
    console.log('search');
    var queryDoc;
    if(selectQueryGlobal==0){ // By ID
        queryDoc = await searchByID()
    } else {
        queryDoc = await searchByName()
    }
    const searchList = [] // array of data array - 2D array
    if(queryDoc){
        const queryMap = queryDoc.docs.map(item=>({
            ...item.data()
        }))
        if(queryMap.length==0) {
            console.log('Not found');
            alertDisplay('Not found')
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
export function queryChoice(){
    console.log('updateQueryWay');
    const queryDiv = document.getElementById('queryChoice')
    queryDiv.innerHTML = '' //clear
    const selectQuery = document.getElementById('selectQuery')
    const choice = selectQuery.options[selectQuery.selectedIndex].value
    // Update Selectquery
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