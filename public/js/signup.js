/*eslint-disable*/
import axios from 'axios';

import '@babel/polyfill'

import {hideAlert,showAlert} from './alert'

export const signUp = async (email, password,name,passwordConfirm) => {

    try{
        const result=await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/signup',
            data:{
                email,
                password,
                name,
                passwordConfirm
            }
            })
            if(result.data.status==='success'){
                showAlert('success','signed up successfully')
                window.setTimeout(()=>{
                    location.assign('/')
                },1500)
            }
    } catch(err){
    
        showAlert('error',err.response.data.message)
    };

}