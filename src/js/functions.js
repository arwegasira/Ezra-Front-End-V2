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
    <p>Professional: ${profesional}</p>
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
    console.log(data)
  }
  return data
}
export { alertdiv, removeElement, dottedLoader, clientCard, searchClients }
