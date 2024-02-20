import * as dotenv from 'dotenv'
import { userLogin } from './login.js'
import { newClient, backHome } from './registration'
import {
  dottedLoader,
  clientCard,
  searchClients,
  singleClientDetails,
} from './functions'

dotenv.config()
// Window location
const locationWin = window.location.href

// =============== INDEX =============================
if (window.location.pathname === '/') {
  // to be added redirect to the home page if user is logged in or login page if not
  window.location.href = '/home.html'
}
//======  LOGIN FORM =============================
if (locationWin.includes('login.html')) {
  //UI Variables
  const email = document.querySelector('.login-form .email')
  const password = document.querySelector('.login-form .password')
  const loginBtn = document.querySelector('#loginBtn')

  loginBtn.addEventListener('click', (e) => {
    e.preventDefault()
    userLogin(email, password)
  })
}

// ============================= HOME PAGE====================================
if (locationWin.includes('home.html')) {
  let clients
  if (window.location.search.includes('redirected=true')) {
    const queryString = window.location.search
    const params = new URLSearchParams(queryString)
    clients = params.get('clients')
    clients = decodeURIComponent(clients)
    clients = JSON.parse(clients)
    const clientList = document.querySelector('.client-list-container')
    clientCard(clients, clientList)
  }
  if (window.location.search.includes('clientSearch=true')) {
    const queryString = window.location.search
    const params = new URLSearchParams(queryString)
    clients = params.get('clients')
    clients = decodeURIComponent(clients)
    clients = JSON.parse(clients)
    const clientList = document.querySelector('.client-list-container')
    clientCard(clients, clientList)
  }
  //UI variables
  const searchForm = document.querySelector('.search-form')
  let expandClientDiv = document.querySelectorAll('.expand-collapse')
  const editClient = document.querySelector('.edit-client')
  const clientCards = document.querySelectorAll('.client-info')
  const newClientBtn = document.querySelector('.new-client')
  const filterInputs = document.querySelectorAll('.filter')

  // new client btn
  newClientBtn.addEventListener('click', (e) => {
    if (e.target.id === 'new-client') {
      window.location.href = 'client-registration.html'
    }
  })

  // expand client card fx
  expandClientDiv.forEach((el) => {
    el.addEventListener('click', (e) => {
      console.log(el.parentElement.parentElement.nextElementSibling)
      const nextsib = el.parentElement.parentElement.nextElementSibling
      nextsib.classList.toggle('expanded')
      el.classList.toggle('rotate')
    })
  })
  // search client functionality
  searchForm.addEventListener('click', async (e) => {
    e.preventDefault()
    if (e.target.id === 'submit-filters') {
      // get form data with formData API
      const formData = new FormData(e.currentTarget)
      const searchData = Object.fromEntries(formData)
      const clientList = document.querySelector('.client-list-container')
      clientList.innerHTML = ''
      let clients = await searchClients(searchData, searchForm, clientList)
      clients = encodeURIComponent(JSON.stringify(clients))
      window.location.href = `home.html?clientSearch=true&&clients=${clients}`
    }
  })
  // edit client functionality
  clientCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      const id = card.getAttribute('id')
      if (e.target.classList.contains('edit-client')) {
        window.location.href = `client-details.html?edit=true&&id=${id}`
      }
    })
  })
}

// ========================REGISTRATION PAGE ==================================
if (locationWin.includes('client-registration.html')) {
  //UI variables
  const inputs = document.querySelectorAll('.input')
  const submitBtn = document.querySelector('#submit')
  const alertBoxParent = document.querySelector('.page-content')
  const alertBoxChild = document.querySelector('.form-container')
  const btnSection = document.querySelector('.reg-btn')
  const regForm = document.querySelector('.reg-form')
  const backHomebtn = document.querySelector('#back-home')

  const alertObj = {
    with: '100%',
    sucessClass: 'success',
    failClass: 'danger',
    parentDiv: alertBoxParent,
    childDiv: alertBoxChild,
  }

  const loaderObj = {
    parentDiv: regForm,
    childDiv: btnSection,
  }

  submitBtn.addEventListener('click', async (e) => {
    e.preventDefault()
    e.target.disabled = true
    const formData = new FormData(regForm)
    const client = Object.fromEntries(formData)
    await newClient(client, alertObj, loaderObj, regForm)
    e.target.disabled = false
  })

  backHomebtn.addEventListener('click', (e) => {
    e.preventDefault()
    backHome(alertObj)
  })
}

// =========================Client details page =========================

if (locationWin.includes('client-details.html')) {
  const queryString = window.location.search
  const params = new URLSearchParams(queryString)
  let client
  if (params.get('edit') === 'true') {
    const id = params.get('id')
    const url = `${process.env.API_URL_DEV}/client/getclientbyid/${id}`
    singleClientDetails(url)
  }
}
