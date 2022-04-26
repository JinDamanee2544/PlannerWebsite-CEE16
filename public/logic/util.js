export function collaspeEdit(){
    const btn = document.getElementById('collaspeBtnEdit')
    btn.innerHTML = '+'
    btn.removeEventListener('click',collaspeEdit)
    btn.addEventListener('click',expandEdit)

    const inputDivSearch = document.getElementById('inputDivEdit')
    const timeDetailDivSearch = document.getElementById('timeDetailDivEdit')
    const hrSearch = document.getElementById('hrEdit')
    const addItemBtn = document.getElementById('addItemBtn')
    inputDivSearch.style.display = 'none'
    timeDetailDivSearch.style.display = 'none'
    hrSearch.style.display = 'none'
    addItemBtn.style.display = 'none'

    const subHeaderDivSearch = document.getElementById('subHeaderDivEdit')
    subHeaderDivSearch.className = 'subHeader collaspe'
}
function expandEdit(){
    const btn = document.getElementById('collaspeBtnEdit')
    btn.innerHTML = '-'
    btn.removeEventListener('click',expandEdit)
    btn.addEventListener('click',collaspeEdit)

    const inputDivSearch = document.getElementById('inputDivEdit')
    const timeDetailDivSearch = document.getElementById('timeDetailDivEdit')
    const addItemBtn = document.getElementById('addItemBtn')
    const hrSearch = document.getElementById('hrEdit')
    inputDivSearch.style.display = 'initial'
    timeDetailDivSearch.style.display = 'initial'
    addItemBtn.style.display = 'initial'
    hrSearch.style.display = 'initial'

    const subHeaderDivSearch = document.getElementById('subHeaderDivEdit')
    subHeaderDivSearch.className = 'subHeader'

    
}
export function collaspeSearch(){
    const btn = document.getElementById('collaspeBtnSearch')
    btn.innerHTML = '+'
    btn.removeEventListener('click',collaspeSearch)
    btn.addEventListener('click',expandSearch)

    const queryDivSearch = document.getElementById('queryDivSearch')
    const listSearchDiv = document.getElementById('listSearchDiv')
    const hrSearch = document.getElementById('hrSearch')
    const searchBtn = document.getElementById('searchBtn')
    
    queryDivSearch.style.display = 'none'
    listSearchDiv.style.display = 'none'
    hrSearch.style.display = 'none'
    searchBtn.style.display = 'none'

    const subHeaderDivSearch = document.getElementById('subHeaderDivSearch')
    subHeaderDivSearch.className = 'subHeader collaspe'
}
function expandSearch(){
    const btn = document.getElementById('collaspeBtnSearch')
    btn.innerHTML = '-'
    btn.removeEventListener('click',expandSearch)
    btn.addEventListener('click',collaspeSearch)

    const queryDivSearch = document.getElementById('queryDivSearch')
    const listSearchDiv = document.getElementById('listSearchDiv')
    const hrSearch = document.getElementById('hrSearch')
    const searchBtn = document.getElementById('searchBtn')
    
    queryDivSearch.style.display = 'initial'
    listSearchDiv.style.display = 'initial'
    hrSearch.style.display = 'initial'
    searchBtn.style.display = 'initial'

    const subHeaderDivSearch = document.getElementById('subHeaderDivSearch')
    subHeaderDivSearch.className = 'subHeader'
}
export function collaspeAbout(){
    const btn = document.getElementById('collaspeBtnAbout')
    btn.innerHTML = '+'
    btn.removeEventListener('click',collaspeAbout)
    btn.addEventListener('click',expandAbout)

    const contentAbout = document.getElementById('contentAbout')
    contentAbout.style.display = 'none'

    const subHeaderDivAbout = document.getElementById('subHeaderDivAbout')
    subHeaderDivAbout.className = 'subHeader collaspe'
}
function expandAbout(){
    const btn = document.getElementById('collaspeBtnAbout')
    btn.innerHTML = '-'
    btn.removeEventListener('click',expandAbout)
    btn.addEventListener('click',collaspeAbout)

    const contentAbout = document.getElementById('contentAbout')
    contentAbout.style.display = 'initial'

    const subHeaderDivAbout = document.getElementById('subHeaderDivAbout')
    subHeaderDivAbout.className = 'subHeader'
}