import React from 'react'
import './Login.css'

const Login = () => {

    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')

    const handleLogin = () => {
        if(username === 'admin' && password === 'admin123'){
            alert('Login successful')
            localStorage.setItem('admin', JSON.stringify({username, password}))
            window.location.href = '/'
        }
        else{
            alert('Login failed')
        }
    }
  return (
    <div className='logincont'>
        <div className='loginformcont'>
            <h1>F2Basket - Admin Login</h1>
            <form>
                <input type='text' placeholder='Username' 
                    onChange={(e)=>setUsername(e.target.value)}
                />
                <input type='password' placeholder='Password' 
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <button
                    type='button'
                    onClick={()=>handleLogin()}
                >Login</button>
            </form>
        </div>
    </div>
  )
}

export default Login