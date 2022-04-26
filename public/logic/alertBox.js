export function alertDisplay(text){
    const container = document.getElementById('container')
    const alertBox = document.createElement('div')
    alertBox.className = 'alertBox'
    alertBox.id = 'alertBox'
    const title = document.createElement('h1')
    title.innerHTML = `${text}`

    const errorSound = new Audio('./sound/errorSound.mp3')
    errorSound.play()

    alertBox.appendChild(title)
    container.appendChild(alertBox)
    
}
export function successDisplay(text){
    const container = document.getElementById('container')
    const alertBox = document.createElement('div')
    alertBox.className = 'successBox'
    alertBox.id = 'successBox'
    const title = document.createElement('h1')
    title.innerHTML = `${text}`

    const successSound = new Audio('./sound/successSound.mp3')
    successSound.play()

    alertBox.appendChild(title)
    container.appendChild(alertBox)
}