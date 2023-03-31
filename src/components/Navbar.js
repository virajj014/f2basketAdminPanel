import { Link } from 'react-router-dom'
import React from 'react'
import './Navbar.css'
const Navbar = () => {

    const setlogin = () => {
        if (localStorage.getItem('admin')) {
            return (
                <div className='loginlogoutcont'>
                    <Link to='/login' style={{ textDecoration: 'none' }} onClick={() => localStorage.removeItem('admin')}>
                        <button className='loginlogoutbtn'>Logout</button>
                    </Link>
                </div>
            )
        }
        else {
            return (
                <div className='loginlogoutcont'>
                    <Link to='/login' style={{ textDecoration: 'none' }}>
                        <button className='loginlogoutbtn'>Login</button>
                    </Link>
                </div>
            )
        }
    }


    const [islogin , setislogin] = React.useState(false)

    const checklogin = () => {
        if(localStorage.getItem('admin')){
            setislogin(true)
        }
        else{
            setislogin(false)
            window.location.href = '/login'
        }
    }

    React.useEffect(()=>{
        checklogin()
    },[])
 

    return (
        <div className="navbar">
            <div className="nav-left">
                <h1>Orchard Fresh</h1>
            </div>
            <div className="nav-right">
                <Link to='/orders' style={{ textDecoration: 'none' }}>
                    <p>Orders</p>
                </Link>
                <Link to='/addproduct' style={{ textDecoration: 'none' }}>
                    <p>Add Product</p>
                </Link>
                <Link to='/manageproducts' style={{ textDecoration: 'none' }}>
                    <p>Manage Products</p>
                </Link>

                <Link to='/manageslider' style={{ textDecoration: 'none' }}>
                    <p>Manage Slider</p>
                </Link>

                <div className='loginlogoutcont'>
                    {setlogin()}
                </div>
            </div>
        </div>
    )
}

export default Navbar