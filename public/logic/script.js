import {updateTable,myTableGenerator} from './table.js'
import {clearSearch,search,queryChoice} from './searchPanel.js'
import {timeAdd,addItem} from './editPanel.js'
import {collaspeAbout, collaspeEdit, collaspeSearch} from './util.js'
// Binding Func with btn
document.getElementById('selectWeekly').addEventListener('change',timeAdd)
document.getElementById('selectQuery').addEventListener('change',queryChoice)
document.getElementById('addItemBtn').addEventListener('click',addItem)
document.getElementById('searchBtn').addEventListener('click',search)
document.getElementById('displaySearchBtn').addEventListener('click',clearSearch)
document.getElementById('collaspeBtnEdit').addEventListener('click',collaspeEdit)

document.getElementById('collaspeBtnSearch').addEventListener('click',collaspeSearch)

document.getElementById('collaspeBtnAbout').addEventListener('click',collaspeAbout)  
// Starting Func when starting up website
timeAdd()
queryChoice()
myTableGenerator()
updateTable()
/*
alertDisplay("This subject already plan in another section")
successDisplay("TEST")
*/