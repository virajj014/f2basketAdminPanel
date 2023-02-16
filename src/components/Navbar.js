import { Link } from 'react-router-dom'
import React from 'react'
import './Navbar.css'
const Navbar = () => {
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
            </div>
        </div>
    )
}

export default Navbar