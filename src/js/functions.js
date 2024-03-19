const moment = require('moment')
import { buildHtml } from './createInnerHtml'
// alert div
const alertdiv = (width, message, className, parent, child) => {
  const div = document.createElement('div')
  div.classList.add('alert')
  div.classList.add(className)
  div.style.width = width
  div.appendChild(document.createTextNode(message))
  parent.insertBefore(div, child)
}
// remove element
const removeElement = (el, time) => {
  setTimeout(() => {
    el.remove()
  }, time)
}
const dottedLoader = (parent, child) => {
  const container = document.createElement('div')
  container.classList.add('dotted-loader-container')
  container.innerHTML = `
  <span></span>
  <span></span>
  <span></span>
  <span></span>
   <span></span>
  `
  parent.insertBefore(container, child)
}
const spinningLoader = (parent, child, width) => {
  const loader = document.createElement('div')
  loader.classList.add('spinning-loader')
  loader.innerHTML = '<div></div>'
  if (width) loader.style.width = width
  if (parent && child) {
    parent.insertBefore(loader, child)
    return
  }
  return loader
}
const clientCard = (clients, list) => {
  clients.forEach((client) => {
    const clientInfo = document.createElement('div')
    clientInfo.classList.add('client-info')
    clientInfo.setAttribute('id', client._id)
    clientInfo.innerHTML = `
                <div class="client-primary-info">
              <div class="avatar">
                <img
                  src=${
                    client.gender === 'Female'
                      ? 'https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Prescription02&hairColor=Auburn&facialHairType=Blank&clotheType=CollarSweater&clotheColor=PastelGreen&eyeType=Happy&eyebrowType=SadConcernedNatural&mouthType=Concerned&skinColor=Light'
                      : 'https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortWaved&accessoriesType=Blank&hairColor=Black&facialHairType=BeardMedium&facialHairColor=Auburn&clotheType=GraphicShirt&clotheColor=PastelYellow&graphicType=Cumbia&eyeType=EyeRoll&eyebrowType=UnibrowNatural&mouthType=Grimace&skinColor=Brown'
                  }
                  alt="Client"
                />
                <h4>${client.lastName} ${client.firstName}</h4>
              </div>
              <div class="info-details">
                <div class="line-detail">
                  <span class="key">Gender:</span>
                  <span class="value">${client.gender}</span>
                </div>
                <div class="line-detail">
                  <span class="key">PC/ID#:</span>
                  <span class="value">${client.idNumber}</span>
                </div>
                <div class="line-detail">
                  <span class="key">Phone#:</span>
                  <span class="value">${client.phoneNumber}</span>
                </div>
                <button class="expand-collapse">
                  <i class="fa-solid fa-caret-down"></i>
                </button>
              </div>
            </div>
            <div class="expanding-grid">
              <div class="client-secondary-info">
                <div class="info-details">
                  <div class="line-detail">
                    <span class="key">Email:</span>
                    <span class="value">${client.email}</span>
                  </div>
                  <div class="line-detail">
                    <span class="key">City:</span>
                    <span class="value">${client.city}</span>
                  </div>
                  <div class="line-detail">
                    <span class="key">State:</span>
                    <span class="value">${client.state}</span>
                  </div>
                  <div class="line-detail">
                    <span class="key">Country:</span>
                    <span class="value">${client.country}</span>
                  </div>
                  <div class="line-detail">
                    <span class="key">Nationality:</span>
                    <span class="value">${client.nationality}</span>
                  </div>
                </div>
                <div class="info-btns">
                  <button class="btn-n edit-client">Edit</button>

                </div>
              </div>
            </div>
    
    
    `
    list.appendChild(clientInfo)
  })
}
const searchClients = async (searchData, form, clientList) => {
  //API request
  try {
    //add loading
    console.log(process.env.API_URL_DEV)
    const loader = spinningLoader()
    clientList.appendChild(loader)
    const { data, headers, status } = await axios({
      method: 'GET',
      url: `${process.env.API_URL_DEV}/client/clients?idNumber=${searchData.idNumber}&&firstName=${searchData.firstName}&&lastName=${searchData.lastName}&&email=${searchData.email}&&arrivalDate=${searchData.arrivalDate}&&phoneNumber=${searchData.phoneNumber}`,
      data: searchData,
    })
    console.log(data)
    return data.clients
  } catch (error) {
    //rebuild error div
    const clientList = document.querySelector('.client-list-container')
    clientList.innerHTML = ''
    console.error(error)
    return error
  }
}
export const encryptData = async (data) => {
  return await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: new Uint8Array(12) },
    process.env.ENCRYPTION_KEY,
    data
  )
}
export const apiCall = async (url, method, info) => {
  try {
    const reqObj = {}
    reqObj.url = url
    reqObj.method = method
    if (info) {
      reqObj.data = info
    }

    const { data, headers, status } = await axios(reqObj)
    return { data, headers, status }
  } catch (error) {
    return {
      error: error.response,
      status: error?.response?.status,
      data: error?.response?.data,
    }
  }
}
const availableRooms = async () => {
  const { data, status, headers, error } = await apiCall(
    `${process.env.API_URL_DEV}/rooms/availableRooms`
  )
  return { data, status, headers, error }
}
const roomPrice = async (name) => {
  const { data, status, headers, error } = await apiCall(
    `${process.env.API_URL_DEV}/rooms/roomPrice/${name}`
  )
  return { data, status, headers, error }
}
export const singleClientDetails = async (url) => {
  //add a spinner as script waits api result
  const loader = spinningLoader()
  document.querySelector('.page-content').appendChild(loader)

  //find client
  const { data, status, headers, error } = await apiCall(url)

  //if error
  if (status !== 200) {
    const pageContent = document.querySelector('.page-content')
    //Remove loader
    pageContent.removeChild(loader)
    pageContent.style.height = '32rem'
    pageContent.style.display = 'flex'
    pageContent.innerHTML = `<h4 style='font-size:clamp(1.2rem,3vw,1.7rem)'>Client not found , try again.<h4>`
  } else {
    //Remove loader
    document.querySelector('.page-content').removeChild(loader)
    //ui variables
    const names = document.querySelector('.page-content .names')
    const profileDetails = document.querySelector(
      '.page-content .profile-details'
    )
    const accommodation = document.querySelector('.accommodation')

    const {
      firstName,
      lastName,
      middleName,
      nationality,
      profesional,
      company,
      dob,
      city,
      state,
      country,
      phoneNumber,
      email,
      idNumber,
      _id: id,
      activeAccommodation,
      activeServices,
    } = data.client
    names.innerHTML = `
    <p>${firstName}</p>
    ${middleName && `<p>${middleName}</p>`}
    <p>${lastName}</p>
    <button class='open-modal'><i class="fa-regular fa-pen-to-square"></i></button>
    <dialog class='edit-user'><h1>Edit client info</h1></dialog>
    `
    profileDetails.innerHTML = `
    <div>
    <p>Nationality: ${nationality}</p>
    <p>Dob: ${moment(dob).format('DD/MM/YYYY')}</p>
    <p>Profession: ${profesional}</p>
    <p>Company: ${company}</p>
    </div>
    <div>
    <p>Phone #: ${phoneNumber}</p>
    <p>Email: ${email}</p>
    </div>
    <div>
    <p>city: ${city}</p>
    <p>State: ${state}</p>
    <p>Country: ${country}</p>
    </div>
    `
    //UI Variables
    const editUserDialog = document.querySelector('.edit-user')
    const openUserModal = document.querySelector('.open-modal')
    openUserModal.addEventListener('click', () => {
      editUserDialog.showModal()
    })
    editUserDialog.innerHTML = `          
    <form action="" class="edit-client-form">
            <div class="edit-client id-pc-edit">
              <label for="id-pc">ID/PC #</label>
              <input
                type="text"
                name="idNumber"
                id="id-pc"
                class="id-pc edit"
                value=${idNumber}
              />
            </div>
              <div class="edit-client firstName-edit">
              <label for="firstName">First Name</label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                class="firstName edit"
                value=${firstName}
              />
            </div>
             <div class="edit-client middleName-edit">
              <label for="middleName">Middle Name</label>
              <input
                type="text"
                name="middleName"
                id="middleName"
                value=${middleName}
                class="middleName edit"
              />
            </div>

            <div class="edit-client lastName-edit">
              <label for="lastName">Last Name</label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value=${lastName}
                class="lastName edit"
              />
            </div>

            <div class="edit-client phone-edit">
              <label for="phone">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                id="phone"
                value=${phoneNumber}
                class="phone edit"
              />
            </div>

            <div class="edit-client email-edit">
              <label for="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value=${email}
                class="email edit"
              />
            </div>

            <div class="edit-client profession-edit">
              <label for="profession">Profession</label>
              <input
                type="text"
                name="profesional"
                id="profession"
                value=${profesional}
                class="profession edit"
              />
            </div>

              <div class="edit-client company-edit">
              <label for="company">Company</label>
              <input
                type="text"
                name="company"
                id="company"
                value=${company}
                class="company edit"
              />
            </div>

            <div class="edit-client nationality-edit">
              <label for="nationality">Nationality</label>
              <input
                type="text"
                name="nationality"
                id="nationality"
                value=${nationality}
                class="nationality edit"
              />
            </div>
            
           <div class="edit-client city-edit">
              <label for="city">City</label>
              <input
                type="text"
                name="city"
                id="city"
                value=${city}
                class="city edit"
              />
            </div>

             <div class="edit-client state-edit">
              <label for="state">State</label>
              <input
                type="text"
                name="state"
                id="state"
                value=${state}
                class="state edit"
              />
            </div>
            
             <div class="edit-client county-edit">
              <label for="county">County</label>
              <input
                type="text"
                name="country"
                id="county"
                value=${country}
                class="county edit"
              />
            </div>



            <div class="edit-client submit-btn">
                <input
                type="submit"
                name="cancel"
                id="cancel-edit"
                class="cancel"
                value="Cancel"
              />
              <input
                type="submit"
                name="submit"
                id="submit-edit"
                class="submit"
                value="Save"
              />

            </div>
            
          </form>`

    //Save / cancel edit
    document
      .querySelector('.edit-user .edit-client-form')
      .addEventListener('click', async (e) => {
        if (e.target.id === 'submit-edit') {
          e.preventDefault()
          let formData = new FormData(e.currentTarget)
          formData = Object.fromEntries(formData)
          const url = `${process.env.API_URL_DEV}/client/editclient/${id}`
          const { data, status, headers, error } = await apiCall(
            url,
            'PATCH',
            formData
          )
          if (status === 200) {
            // close modal
            editUserDialog.close()
            window.location.reload()
          }
          console.log(status)
        }
        if (e.target.id === 'cancel-edit') {
          e.preventDefault()
          editUserDialog.close()
          window.location.reload()
        }
      })

    //accommodation tabs
    accommodation.innerHTML = `
    <ul class="tabs">
    <li data-tab-target="#current" class="tab active">Current</li>
    <li data-tab-target="#history" class="tab">History</li>
    </ul>
    <div class="tab-content">
    <div data-tab-content class="active" id="current">
    
   </div>
    <div data-tab-content id="history">
    
    </div>
    </div>
    `
    const tabs = document.querySelectorAll('[data-tab-target]')
    const tabContents = document.querySelectorAll('[data-tab-content]')

    tabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        const currentTab = document.querySelector(tab.dataset.tabTarget)
        tabContents.forEach((content) => content.classList.remove('active'))
        currentTab.classList.add('active')
        tabs.forEach((tab) => tab.classList.remove('active'))
        tab.classList.add('active')
      })
    })
    const currentTab = document.querySelector('#current')

    const activeAccommodationDiv = document.createElement('div')
    activeAccommodationDiv.classList.add('active-accommodations')

    if (activeAccommodation.length) {
      const { startDate, endDate, roomDetails, unitPrice, totalCost } =
        activeAccommodation[0]
      activeAccommodationDiv.innerHTML = `
      <h4>Active Accommodation</h4>
      <ul>
      <li>
      <span>Start Date</span>
      <span>${moment(startDate).format('MMM Do YY')}</span>
      </li>
      <li>
      <span>End Date</span>
      <span>${moment(endDate).format('MMM Do YY')}</span>
      </li>
      <li>
      <span>Night(s)</span>
      <span>${totalCost / unitPrice}</span>
      </li>
       <li>
      <span>Room</span>
      <span>${roomDetails.name}</span>
      </li>
     <li>
      <span>Room Type</span>
      <span>${roomDetails.roomType}</span>
      </li>
      <li>
      <span>Unit Price</span>
      <span>${unitPrice}</span>
      </li>
      <li>
      <span>Total</span>
      <span>${totalCost}</span>
      </li>
      <li>
      <label for ="paid" >Paid</label>
      <input type="checkbox" name="paid" class="paid" id="paid"/>
      </li>
      
      <li>
      <button><i class="fa-regular fa-pen-to-square edit-acc-btn"></i></button>
      <button class="avail-room">Avail Room</button>
      <button class="checkout">check out</button>
      </li>
      </ul>
      <dialog class="edit-active-accommodation"></dialog>
      `
    } else {
      const button = document.createElement('button')
      button.classList.add('new-accommodation-btn')
      button.innerText = 'Add Accommodation'
      const title = document.createElement('h4')
      title.innerText = 'Active Accommodation'
      const addClientDialog = document.createElement('dialog')
      addClientDialog.classList.add('add-client-modal')
      activeAccommodationDiv.appendChild(title)
      activeAccommodationDiv.appendChild(button)
      activeAccommodationDiv.appendChild(addClientDialog)
    }
    const servicesDiv = document.createElement('div')
    servicesDiv.classList.add('active-services')
    const servicesTitle = document.createElement('h4')
    servicesTitle.innerText = 'Active Services'
    servicesDiv.append(servicesTitle)
    const button = document.createElement('button')
    button.classList.add('new-service-btn')
    button.innerText = 'Add Service'
    servicesDiv.appendChild(button)
    const serviceList = document.createElement('ul')
    serviceList.classList.add('active-services-list')
    servicesDiv.appendChild(serviceList)
    activeServices.forEach((service) => {
      const li = document.createElement('li')
      li.innerHTML = `
      <div>
      <span>Service</span>
      <span>${service.service}</span>
      </div>
      <div>
      <span>Amount</span>
      <span>${service.total}</span>
      </div>
    <button><i class="fa-regular fa-pen-to-square"></i></button>
      `
      serviceList.appendChild(li)
    })
    currentTab.appendChild(activeAccommodationDiv)
    currentTab.appendChild(servicesDiv)

    const checkoutBtn = document.querySelector('.checkout')
    const paidCheckBox = document.querySelector('.paid')
    if (paidCheckBox) {
      paidCheckBox.addEventListener('click', (e) => {
        if (e.target.checked) {
          checkoutBtn.style.display = 'block'
        } else {
          checkoutBtn.style.display = 'none'
        }
      })
    }

    const newAccommodation = document.querySelector('.new-accommodation-btn')
    if (newAccommodation) {
      newAccommodation.addEventListener('click', () => {
        const addClientDialog = document.querySelector('.add-client-modal')
        addClientDialog.showModal()
        //Build add client dialog
        addClientDialog.innerHTML = `
        <h4 class ='add-client-title'>New Accommodation</h4>
        <form action="" class="new-accommodation-form">
            <div class="new-acc new-acc-start">
              <label for="startDate">Start Date</label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                class="new-acc-startDate-input"
              />
            </div>
             <div class="new-acc new-acc-end">
              <label for="endDate">End Date</label>
              <input
                type="date"
                name="endDate"
                id="endDate"
                class="new-acc-endDate"
              />
            </div>

             <div class="new-acc new-acc-room">
              <label for="room">Choose Room</label>
              <select name="roomName" id="room" class="new-acc-room-selector">
      
              </select>
            </div>
             <div class="new-acc new-acc-unitPrice">
              <label for="unitPrice">Unit Price</label>
              <input
                type="Number"
                name="unitPrice"
                id="unitPrice"
                class="new-acc-unitPrice-input"
                disabled =${true}
                style="background-color:#E8E9EB"
              />
            </div>

             <div class="new-acc new-acc-overridePrice">
              <label for="overridePrice">Override Price</label>
              <input
                type="Number"
                name="price"
                id="overridePrice"
                class="new-acc-overridePrice"
              />
            </div>

            <div class="new-accommodation submit-btn">
                <input
                type="submit"
                name="cancel"
                id="cancel-newAcc"
                class="cancel"
                value="Cancel"
              />
              <input
                type="submit"
                name="submit"
                id="submit-newAcc"
                class="submit"
                value="Save"
              />

            </div>
            
          </form>

        `
        const roomSelector = document.querySelector('.new-acc-room-selector')
        roomSelector.addEventListener('focus', async (e) => {
          const unitPrice = document.querySelector('.new-acc-unitPrice-input')
          const startDate = document.querySelector('.new-acc-startDate-input')
          e.target.innerHTML = `<option value=" "selected disabled></option>`
          const { data, status, headers, error } = await availableRooms()
          if (status !== 200) {
            //disable submit
            const submitBtn = document.querySelector(
              '.new-accommodation.submit-btn .submit'
            )

            const msg = error?.data || 'Something went wrong'
            //add error notification
            const child = document.querySelector('.add-client-title')
            const errorParagraph = document.createElement('p')
            errorParagraph.className += 'alert danger'
            errorParagraph.innerHTML = msg
            addClientDialog.insertBefore(errorParagraph, child)
            //move focus away from select
            startDate.focus()
            //remove error notification after 5seconds
            if (errorParagraph) {
              removeElement(errorParagraph, 5000)
            }

            return
          } else {
            data.rooms.forEach((room) => {
              const option = document.createElement('option')
              option.value = room.name
              option.innerHTML = room.name
              roomSelector.appendChild(option)
            })
          }
        })
        roomSelector.addEventListener('change', async (e) => {
          const room = e.target.value
          //query room pice
          const { data, status, error } = await roomPrice(room)
          unitPrice.value = data.price
        })
        //save or cancel
        document
          .querySelector('.new-accommodation-form')
          .addEventListener('click', async (e) => {
            if (e.target.id === 'submit-newAcc') {
              e.preventDefault()
              let formData = new FormData(e.currentTarget)
              formData = Object.fromEntries(formData)
              formData.clientId = id
              formData.startDate = moment(formData.startDate).format(
                'DD/MM/YYYY'
              )
              formData.endDate = moment(formData.endDate).format('DD/MM/YYYY')
              const url = `${process.env.API_URL_DEV}/client/addaccommodation`
              const { data, status, headers, error } = await apiCall(
                url,
                'POST',
                formData
              )

              if (status === 200) {
                // close modal
                editUserDialog.close()
                window.location.reload()
              } else {
                errorDialogExist = document.querySelector(
                  '.add-client-modal .alert.danger'
                )
                if (!errorDialogExist) {
                  //show error message
                  const child = document.querySelector('.add-client-title')
                  const msg = data || 'Something went wrong'
                  alertdiv('100%', msg, 'danger', addClientDialog, child)
                  const alertEl = document.querySelector(
                    '.add-client-modal .alert.danger'
                  )
                  //remove error message after 5seconds
                  removeElement(alertEl, 5000)
                }
              }
            }
            if (e.target.id === 'cancel-newAcc') {
              e.preventDefault()
              addClientDialog.close()
            }
          })
      })
    }

    if (activeAccommodation.length) {
      const { startDate, endDate, roomDetails, unitPrice, totalCost } =
        activeAccommodation[0]
      const editAccommodation = document.querySelector(
        '.edit-active-accommodation'
      )
      buildHtml({
        parent: editAccommodation,
        context: 'edit active accommodation',
        startDate,
        endDate,
        roomDetails,
        unitPrice,
      })
      document.querySelector('.edit-acc-btn').addEventListener('click', (e) => {
        //show edit accommodation dialog
        editAccommodation.showModal()
      })
      const roomSelector = document.querySelector('.edit-acc-room-selector')
      if (roomSelector) {
        roomSelector.addEventListener('focus', async (e) => {
          const initialValue = e.target.value
          e.target.innerHTML = ` <option value=${initialValue} selected>${initialValue}</option>`
          //api call
          const { data, status, headers, error } = await availableRooms()
          if (status !== 200) {
            console.log(error)
            const msg = error?.data?.msg || 'Something went wrong'
            //add error notification
            const child = document.querySelector('.edit-acc-title')
            const errorParagraph = document.createElement('p')
            errorParagraph.className += 'alert danger'
            errorParagraph.innerHTML = msg
            editAccommodation.insertBefore(errorParagraph, child)
            //move focus away from select
            startDate.focus()
            //remove error notification after 5seconds
            if (errorParagraph) {
              removeElement(errorParagraph, 5000)
            }

            return
          } else {
            data.rooms.forEach((room) => {
              const option = document.createElement('option')
              option.value = room.name
              option.innerHTML = room.name
              roomSelector.appendChild(option)
            })
          }
        })
      }
      //submit or cancel editing
      const editAccommodationForm = document.querySelector(
        '.edit-accommodation-form'
      )
      editAccommodationForm.addEventListener('click', async (e) => {
        if (e.target.id === 'cancel-editAcc') {
          e.preventDefault()
          editAccommodation.close()
        }
        if (e.target.id === 'submit-editAcc') {
          e.preventDefault()
          let formData = new FormData(e.currentTarget)
          formData = Object.fromEntries(formData)
          formData.clientId = id
          formData.startDate = moment(formData.startDate).format('DD/MM/YYYY')
          formData.endDate = moment(formData.endDate).format('DD/MM/YYYY')
          const url = `${process.env.API_URL_DEV}/client/editaccommodation`
          const { data, status, headers, error } = await apiCall(
            url,
            'POST',
            formData
          )
          if (status === 200) {
            // close modal
            editUserDialog.close()
            window.location.reload()
          } else {
            errorDialogExist = document.querySelector(
              '.add-client-modal .alert.danger'
            )
            if (!errorDialogExist) {
              //show error message
              const child = document.querySelector('.add-client-title')
              const msg = data || 'Something went wrong'
              alertdiv('100%', msg, 'danger', addClientDialog, child)
              const alertEl = document.querySelector(
                '.add-client-modal .alert.danger'
              )
              //remove error message after 5seconds
              removeElement(alertEl, 5000)
            }
          }
        }
      })
    }

    console.log(data)
  }
  return data
}
export { alertdiv, removeElement, dottedLoader, clientCard, searchClients }
