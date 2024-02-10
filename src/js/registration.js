import { alertdiv, removeElement, dottedLoader } from './functions'

export const newClient = async (client, alertObj, loaderObj, formEl) => {
  try {
    //add loader
    dottedLoader(loaderObj.parentDiv, loaderObj.childDiv)
    const { data, status, headers } = await axios({
      method: 'POST',
      url: `${process.env.API_URL_DEV}/client/addclient`,
      data: client,
    })
    //remove loader
    if (status) {
      if (document.querySelector('.dotted-loader-container')) {
        document.querySelector('.dotted-loader-container').remove()
      }
    }
    //clear inputs
    formEl.reset()
    //Build success message
    alertdiv(
      alertObj.width,
      data.msg,
      alertObj.sucessClass,
      alertObj.parentDiv,
      alertObj.childDiv
    )
  } catch (error) {
    //remove loader
    if (document.querySelector('.dotted-loader-container')) {
      document.querySelector('.dotted-loader-container').remove()
    }
    //Build failure message
    alertdiv(
      alertObj.width,
      error.response.data,
      alertObj.failClass,
      alertObj.parentDiv,
      alertObj.childDiv
    )
  }
  //remove alert div
  if (document.querySelector('.alert')) {
    removeElement(document.querySelector('.alert'), 5000)
  }
}

export const backHome = async (alertObj) => {
  try {
    const { data, headers, status } = await axios({
      Method: 'GET',
      url: `${process.env.API_URL_DEV}/client/backhome`,
    })
    //go to home page
    let clients = data.clients
    clients = encodeURIComponent(JSON.stringify(clients))
    window.location.href = `home.html?redirected=true&&clients=${clients}`
  } catch (error) {
    //build alert message
    alertdiv(
      alertObj.width,
      error.response.data,
      alertObj.failClass,
      alertObj.parentDiv,
      alertObj.childDiv
    )
    console.log(error)
  }
}
