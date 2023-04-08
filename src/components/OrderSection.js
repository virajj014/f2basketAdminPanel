import React, { useEffect, useState } from 'react'
import { db, storage } from '../Firebase/FirebaseConfig'
import { collection, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import './OrderSection.css'
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import './OrderSectionTable.css'

const OrderSection = () => {

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


    
    const [allorders, setAllOrders] = useState([])
    const [allordersstatus, setAllOrdersStatus] = useState('pending')
    const [keyword, setKeyword] = useState('')
    const getallorder = async () => {
        setAllOrders([]);
        const querySnapshot = await getDocs(collection(db, "Orders"));
        let temp = []
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // // console.log(doc.id, " => ", doc.data());
            // setAllOrders((prev) => [...prev, doc.data()])
            // setAllOrders((prev) => [doc.data()])
            // temp.push(doc.data())
            // console.log(doc.id)
            temp.push({ ...doc.data(), id: doc.id })
        });

        setAllOrders(temp)
    }
    useEffect(() => {
        getallorder()
    }, [])

    // console.log(allorders)


    const changeOrderStatus = (id, orderdata, status) => {


        // find and update
        const docRef = doc(db, "Orders", id);

        const data = {
            ...orderdata,
            orderstatus: status
        }

        updateDoc(docRef, {
            ...orderdata,
            orderstatus: status
        })
            .then(() => {
                alert("Document successfully written!");
                getallorder()
            })
            .catch((error) => {
                alert("Error writing document: ", error);
                console.error("Error writing document: ", error);
            });
    }


    const [deliveryboyname, setDeliveryboyname] = useState('')
    const [deliveryboyphone, setDeliveryboyphone] = useState('')

    const changeDeliverydetails = (id, orderdata) => {

        if (deliveryboyname === '' || deliveryboyphone === '') {
            alert('Delivery Boy Name & Phone is required')
            return
        }

        else {
            const docRef = doc(db, "Orders", id);
            const data = {
                ...orderdata,
                deliveryboy_name: deliveryboyname,
                deliveryboy_phone: deliveryboyphone
            }
            updateDoc(docRef, data).then(() => {
                alert("Document successfully written!");
            })
                .catch((error) => {
                    alert("Error writing document: ", error);
                })

            getallorder()
            setDeliveryboyname('')
        }
    }


    const changePaystatus = (id, orderdata, status) => {
        const docRef = doc(db, "Orders", id);
        const data = {
            ...orderdata,
            paymentstatus: status
        }
        updateDoc(docRef, data).then(() => {
            alert("Document successfully written!");
        })
            .catch((error) => {
                alert("Error writing document: ", error);
            })

        getallorder()
    }

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
            <h1 className="order-head1">Order Section</h1>
            <div className="order-sectionin">

                <div className="order-s1">
                    <input type="text" placeholder="Search by order id or delivery status" onChange={(e) => setKeyword(e.target.value)} className='searchbar' />



                    <div className="order-s1-in">
                        <p>Order Status</p>
                        <select className='ordertxt' onChange={(e) => setAllOrdersStatus(e.target.value)}>
                            <option value="pending">Pending</option>
                            <option value="">All</option>
                            <option value="ontheway">On the way</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th scope="col">OrderId</th>
                            <th scope="col">Order Date</th>
                            <th scope="col">Pay Status</th>
                            <th scope="col">Delivery Status</th>
                            <th scope="col">DB Details</th>
                            <th scope="col">Cost</th>
                            <th scope="col">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allorders.filter((val) => {
                            if (allordersstatus === "") {
                                return val
                            } else if (val.orderstatus.toLowerCase().includes(allordersstatus.toLowerCase())) {
                                return val
                            }
                        }).filter((val) => {
                            if (keyword === "") {
                                return val
                            } else if (val.orderid.toLowerCase().includes(keyword.toLowerCase()) || val.orderstatus.toLowerCase().includes(keyword.toLowerCase())) {
                                return val
                            }
                        }).map((order) => (
                            <tr>
                                <td
                                    data-label="OrderId"
                                >{order.id}</td>
                                <td
                                    data-label="Order Date"
                                >{
                                    convertDate(order.orderdate)
                                }</td>
                                <td
                                    data-label="Pay Status"
                                >


                                    {order.paymentstatus === 'pending' &&
                                        <select className='ordertxt' onChange={(e) => changePaystatus(order.id, order, e.target.value)}>
                                            <option value="pending">Pay - Pending</option>
                                            <option value="success">Pay - Success</option>
                                            <option value="failed">Pay - Failed</option>
                                            <option value="refunded">Pay - Refunded</option>
                                            <option value="notrefunded">Pay - Not Refunded</option>
                                        </select>
                                    }

                                    {order.paymentstatus === 'success' &&
                                        <select className='ordertxt' onChange={(e) => changePaystatus(order.id, order, e.target.value)}>
                                            <option value="success">Success</option>
                                            <option value="pending">Pending</option>
                                            <option value="failed">Failed</option>
                                            <option value="refunded">Refunded</option>
                                            <option value="notrefunded">Not Refunded</option>
                                        </select>
                                    }

                                    {order.paymentstatus === 'failed' &&
                                        <select className='ordertxt' onChange={(e) => changePaystatus(order.id, order, e.target.value)}>
                                            <option value="failed">Failed</option>
                                            <option value="pending">Pending</option>
                                            <option value="success">Success</option>
                                            <option value="refunded">Refunded</option>
                                            <option value="notrefunded">Not Refunded</option>
                                        </select>

                                    }

                                    {order.paymentstatus === 'refunded' &&
                                        <select className='ordertxt' onChange={(e) => changePaystatus(order.id, order, e.target.value)}>
                                            <option value="refunded">Refunded</option>
                                            <option value="pending">Pending</option>
                                            <option value="success">Success</option>
                                            <option value="failed">Failed</option>
                                            <option value="notrefunded">Not Refunded</option>
                                        </select>
                                    }

                                    {order.paymentstatus === 'notrefunded' &&
                                        <select className='ordertxt' onChange={(e) => changePaystatus(order.id, order, e.target.value)}>
                                            <option value="notrefunded">Not Refunded</option>
                                            <option value="pending">Pending</option>
                                            <option value="success">Success</option>
                                            <option value="failed">Failed</option>
                                            <option value="refunded">Refunded</option>
                                        </select>
                                    }
                                </td>
                                <td
                                    data-label="Delivery Status"
                                >{order.orderstatus === 'pending' &&
                                    <select className='ordertxt' onChange={(e) => {
                                        // console.log(order)
                                        changeOrderStatus(order.id, order, e.target.value)
                                    }}>
                                        <option value="pending">Pending</option>
                                        <option value="ontheway">On the way</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                }
                                    {order.orderstatus === 'ontheway' &&
                                        <select className='ordertxt' onChange={(e) => {
                                            // console.log(order)
                                            changeOrderStatus(order.id, order, e.target.value)
                                        }}>
                                            <option value="ontheway">On the way</option>
                                            <option value="pending">Pending</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    }

                                    {order.orderstatus === 'delivered' &&
                                        <select className='ordertxt' onChange={(e) => {
                                            // console.log(order)
                                            changeOrderStatus(order.id, order, e.target.value)
                                        }}>
                                            <option value="delivered">Delivered</option>
                                            <option value="pending">Pending</option>
                                            <option value="ontheway">On the way</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    }

                                    {order.orderstatus === 'cancelled' && <p> {order.orderstatus}</p>}</td>

                                <td
                                    data-label="DB Details"
                                >

                                    {order.deliveryboy_name && order.deliveryboy_phone ? 
                                    <p className='ordertxt1'> {order.deliveryboy_name}<br></br> {order.deliveryboy_phone}</p> :
                                        <div className='deliveryboy inputdiv'>
                                            <input type="text" placeholder="Enter deliveryboy name"
                                                onChange={(e) => { setDeliveryboyname(e.target.value) }}
                                            />
                                            <input type="text" placeholder="Enter deliveryboy phone"
                                                onChange={(e) => { setDeliveryboyphone(e.target.value) }}
                                            />
                                            <button onClick={(e) => changeDeliverydetails(order.id, order)} >Save</button>
                                        </div>
                                    }
                                </td>

                                <td
                                    data-label="Cost"
                                >Rs. {order.ordercost}</td>
                                <td
                                    data-label="Details"
                                >
                                    <div>
                                        <Link to={`/orderdetails/${order.id}`}><button>Show Details</button></Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    )
}

export default OrderSection