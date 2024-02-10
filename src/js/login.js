import { alertdiv, removeElement } from './functions'
const regex = {
  email: '',
  password: '',
}

const userLogin = async (emailField, passwordField) => {
  email = emailField.value
  password = passwordField.value
  //API Login Call
  try {
    const { data, status, headers } = await axios.post(
      `${process.env.API_URL_DEV}/auth/login`,
      {
        email,
        password,
      }
    )
    //if successful login redirect to home
    window.location.href = '/home.html'
  } catch (error) {
    //build error div
    const form = document.querySelector('.login-form')
    const loginContainer = document.querySelector('.login-container')
    alertdiv(
      'clamp(19rem, 80vw, 30rem)',
      error.response.data,
      'danger',
      loginContainer,
      form
    )
    //remove alert after 3seconds
    dangerDiv = loginContainer.querySelector('.danger')
    removeElement(dangerDiv, 10000)
  }
}
export { userLogin }
