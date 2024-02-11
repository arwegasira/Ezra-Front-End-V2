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
    const loader = spinningLoader()
    clientList.appendChild(loader)
    const { data, headers, status } = await axios({
      method: 'GET',
      url: `${process.env.API_URL_DEV}/client/clients?idNumber=${searchData.idNumber}&&firstName=${searchData.firstName}&&lastName=${searchData.lastName}&&email=${searchData.email}&&arrivalDate=${searchData.arrivalDate}&&phoneNumber=${searchData.phoneNumber}`,
      data: searchData,
    })
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
      status: error.response.status,
      data: error.response.data,
    }
  }
}
export const singleClientDetails = async (url) => {
  //find client
  const { data, status, headers, error } = await apiCall(url)
  //if error
  if (status !== 200) {
    console.log(data)
    const pageContent = document.querySelector('.page-content')
    pageContent.style.height = '32rem'
    pageContent.style.display = 'flex'
    pageContent.innerHTML = `<h4 style='font-size:clamp(1.2rem,3vw,1.7rem)'>Client not found , try again.<h4>`
  } else {
    //ui variables
    const names = document.querySelector('.page-content .names')
    const profileDetails = document.querySelector(
      '.page-content .profile-details'
    )

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
    <p>Dob: ${dob}</p>
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
    console.log(data)
  }
  return data
}
export { alertdiv, removeElement, dottedLoader, clientCard, searchClients }
