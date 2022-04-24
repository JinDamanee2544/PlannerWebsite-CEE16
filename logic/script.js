import {updateTable,myTableGenerator} from '../logic/table.js'
import {clearSearch,search,queryChoice} from '../logic/searchPanel.js'
import {timeAdd,addItem} from '../logic/editPanel.js'

// Binding Func with btn
document.getElementById('selectWeekly').addEventListener('change',timeAdd)
document.getElementById('selectQuery').addEventListener('change',queryChoice)
document.getElementById('addItemBtn').addEventListener('click',addItem)
document.getElementById('searchBtn').addEventListener('click',search)
document.getElementById('displaySearchBtn').addEventListener('click',clearSearch)
// Starting Func when starting up website
timeAdd()
queryChoice()
myTableGenerator()
updateTable()
/*
alertDisplay("This subject already plan in another section")
successDisplay("TEST")
*/