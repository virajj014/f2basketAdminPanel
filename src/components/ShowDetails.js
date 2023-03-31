import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../Firebase/FirebaseConfig'
import './ShowDetails.css'
import { Link } from 'react-router-dom'

const ShowDetails = () => {

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

    const { orderid } = useParams()
    const [orderdata, setOrderData] = useState({})
    const [ordertotal, setOrderTotal] = useState(0)
    console.log(orderid)

    const getorderdata = async () => {
        const docRef = doc(db, "Orders", orderid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setOrderData(docSnap.data())
            let total = 0
            docSnap.data().orderdata.map((item) => {
                let item1 = JSON.parse(item)
                total = total + (item1.productquantity * item1.data.productPrice)
            })
            setOrderTotal(total)
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }

    useEffect(() => {
        getorderdata()
    }, [])


    const convertDate = (date) => {
        // 1680289128424
        // let d = new Date(date)
        // return d.toLocaleDateString()
        // date1 = dd/mm/yyyy
        // time = hh:mm am/pm
        let date1 = new Date(parseInt(date)).toLocaleDateString()
        let hour = new Date(parseInt(date)).getHours()
        let min = new Date(parseInt(date)).getMinutes()
        let ampm = hour >= 12 ? 'pm' : 'am'
        hour = hour % 12 || 12;
        let time = hour + ":" + min + " " + ampm
        // console.log(date1)
        return date1 + ' ' + time
    }
    return (
        <div className="order-section">
            <Navbar />
            <Link to='/'><button className='goback-btn'>Go back</button></Link>

            <h1 className='order-head1'>Order Details</h1>
            <div className='orderdetails-form'>
                <div className="orderetails_row">
                    <p>Customer Name</p>
                    <p>{orderdata.ordername}</p>
                </div>
                <div className="orderetails_row">
                    <p>Order Address</p>
                    <p>{orderdata.orderaddress}</p>
                </div>

                <div className="orderetails_row">
                    <p>Customer Phone</p>
                    <p>{orderdata.orderphone}</p>
                </div>

                <div className="orderetails_row">
                    <p>Order Status</p>
                    <p>{orderdata.orderstatus}</p>
                </div>

                <div className="orderetails_row">
                    <p>Order Date</p>
                    <p>{
                        convertDate(orderdata.orderdate)
                    }</p>
                </div>

                <div className="orderetails_row">
                    <p>Order Items</p>
                    <div>
                        {
                            orderdata.orderdata && orderdata.orderdata.map((item) => {

                                let item1 = JSON.parse(item)
                                console.log(item1)
                                return (
                                    <div className="orderdetails_item">
                                        <p>{item1.productquantity} {item1.data.productName} - Rs. {item1.data.productPrice} / {item1.data.productpriceunit}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                <div className="orderetails_row">
                    <p>Order Total</p>
                    <p> Rs. {ordertotal}</p>
                </div>
            </div>

        </div>
    )
}

export default ShowDetails