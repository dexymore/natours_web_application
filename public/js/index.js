

import {login,logout} from './login'

import {signUp} from './signup'

import {updateSettings} from './updateSettings'

import {displayMap} from './mapbox'
import { doc } from 'prettier';
// DOM ELEMENTS
const mapBox = document.getElementById('map');  
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const signUpForm = document.querySelector('.form--signup');

// Values

if(mapBox){
    const locations = JSON.parse(document.getElementById('map').dataset.locations);

displayMap(locations);
}

if(loginForm){
document.querySelector('.form').addEventListener('submit', e=> {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
    
    }); }

if(logoutBtn) logoutBtn.addEventListener('click', logout);

if(userDataForm){
document.querySelector('.form-user-data').addEventListener('submit', e=> {
e.preventDefault();
const form = new FormData();
form.append('name',document.getElementById('name').value);
form.append('email',document.getElementById('email').value);
form.append('photo',document.getElementById('photo').files[0]);

updateSettings(form,'data');
// document.querySelector('.btn--save-settings').addEventListener('click', e=> {
// location.reload(true);
// });

}); }


if(userPasswordForm){
document.querySelector('.form-user-password').addEventListener('submit', async e=> {
e.preventDefault();
document.querySelector('.btn--save-password').textContent='updating...';
const passwordCurrent = document.getElementById('password-current').value;
const password = document.getElementById('password').value;
const passwordConfirm = document.getElementById('password-confirm').value;
await updateSettings({passwordCurrent,password,passwordConfirm},'password');
document.querySelector('.btn--save-password').textContent='save password';
document.getElementById('password-current').value='';
document.getElementById('password').value='';
document.getElementById('password-confirm').value='';
});
}


if(signUpForm){
document.querySelector('.form').addEventListener('submit', e=> {
e.preventDefault();
const name = document.getElementById('name').value;
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;
const passwordConfirm = document.getElementById('passwordConfirm').value;
signUp(email, password,name,passwordConfirm);


})
}

