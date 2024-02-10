// UI Variables
const openNavbtn = document.querySelector('.open-nav-btn')
const navigation = document.querySelector('.navigation')
const closeNavbtn = document.querySelector('.close-nav-btn')

// Window location
const locationWin = window.location.href
// console.log(locationWin.includes('login.html'))
openNavbtn.addEventListener('click', (e) => {
  e.preventDefault()
  navigation.style.transform = 'translateX(0)'
})

closeNavbtn.addEventListener('click', (e) => {
  e.preventDefault()
  navigation.style.transform = 'translateX(-100%)'
})
