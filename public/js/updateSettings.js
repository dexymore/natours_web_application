// update data
import axios from 'axios';
import {showAlert} from './alert'
import '@babel/polyfill'
export const updateSettings = async (data,type) => { 
    const url = type==='password'?'http://127.0.0.1:3000/api/v1/users/updatemypassword':'http://127.0.0.1:3000/api/v1/users/updateme'
    try{
        const result=await axios({
            method: 'patch',
            url ,
            data
            })
            if(result.data.status==='success'){
                showAlert('success',`${type.toUpperCase()} updated successfully`)
                window.setTimeout(()=>{
                    location.assign('/me')
                },1500)
            }
    } catch(err){
    
        showAlert('error',err.response.data.message)
    };
    



   }