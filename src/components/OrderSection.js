import React, { useEffect, useState } from 'react'
import { db, storage } from '../Firebase/FirebaseConfig'
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import './OrderSection.css'
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

const OrderSection = () => {
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
            temp.push(doc.data())
        });
        setAllOrders(temp)
    }
    useEffect(() => {
        getallorder()
    }, [])

    // console.log(allorders)


    const changeOrderStatus = (id, orderdata, status) => {
        const docRef = doc(db, "Orders", id);
        const data = {
            ...orderdata,
            orderstatus: status
        }
        setDoc(docRef, data).then(() => {
            alert("Document successfully written!");
        })
            .catch((error) => {
                alert("Error writing document: ", error);
            })

        getallorder()
    }


    const [deliveryboyname, setDeliveryboyname] = useState('')
    const [deliveryboyphone, setDeliveryboyphone] = useState('')

    const changeDeliveryboyName = (id, orderdata) => {

        if (deliveryboyname === '') {
            alert('Delivery Boy Name is required')
            return
        }

        else {
            const docRef = doc(db, "Orders", id);
            const data = {
                ...orderdata,
                deliveryboy_name: deliveryboyname
            }
            setDoc(docRef, data).then(() => {
                alert("Document successfully written!");
            })
                .catch((error) => {
                    alert("Error writing document: ", error);
                })

            getallorder()
            setDeliveryboyname('')
        }
    }


    const changeDeliveryboyPhone = (id, orderdata) => {

        if (deliveryboyphone === '') {
            alert('Delivery Boy Phone is required')
            return
        }

        else {
            const docRef = doc(db, "Orders", id);
            const data = {
                ...orderdata,
                deliveryboy_phone: deliveryboyphone
            }
            setDoc(docRef, data).then(() => {
                alert("Document successfully written!");
                getallorder()
                setDeliveryboyphone('')
            })
                .catch((error) => {
                    alert("Error writing document: ", error);
                })


        }
    }
    // console.log(allordersstatus)

    const changePaystatus = (id, orderdata, status) => {
        const docRef = doc(db, "Orders", id);
        const data = {
            ...orderdata,
            paymentstatus: status
        }
        setDoc(docRef, data).then(() => {
            alert("Document successfully written!");
        })
            .catch((error) => {
                alert("Error writing document: ", error);
            })

        getallorder()
    }
    return (
        <div className="order-section">
            <Navbar />
            <h1 className="order-head1">Order Section</h1>

            <div className="order-s1">
                <input type="text" placeholder="Search by order id or delivery status" onChange={(e) => setKeyword(e.target.value)} className='searchbar' />



                <div className="order-s1-in">
                    <p>Sort by Order Status</p>
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
                        <td>OrderId</td>
                        <td>Pay Type</td>
                        <td>Pay Status</td>
                        <td>Delivery Status</td>
                        <td>DB Name</td>
                        <td>DB Phone</td>
                        <td>Cost</td>
                        <td>Details</td>
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
                            <td>{order.orderid}</td>
                            <td>{order.orderpayment}</td>
                            <td>
                                {order.paymentstatus === 'pending' && 
                                <select className='ordertxt' onChange={(e) => changePaystatus(order.orderid, order, e.target.value)}>
                                    <option value="pending">Pending</option>
                                    <option value="success">Success</option>
                                    <option value="failed">Failed</option>
                                    <option value="refunded">Refunded</option>
                                    <option value="notrefunded">Not Refunded</option>
                                </select>
                                }

                                {order.paymentstatus === 'success' &&
                                <select className='ordertxt' onChange={(e) => changePaystatus(order.orderid, order, e.target.value)}>
                                    <option value="success">Success</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                    <option value="refunded">Refunded</option>
                                    <option value="notrefunded">Not Refunded</option>
                                </select>
                                }

                                {order.paymentstatus === 'failed' &&
                                <select className='ordertxt' onChange={(e) => changePaystatus(order.orderid, order, e.target.value)}>
                                    <option value="failed">Failed</option>
                                    <option value="pending">Pending</option>
                                    <option value="success">Success</option>
                                    <option value="refunded">Refunded</option>
                                    <option value="notrefunded">Not Refunded</option>
                                </select>

                                }

                                {order.paymentstatus === 'refunded' &&
                                <select className='ordertxt' onChange={(e) => changePaystatus(order.orderid, order, e.target.value)}>
                                    <option value="refunded">Refunded</option>
                                    <option value="pending">Pending</option>
                                    <option value="success">Success</option>
                                    <option value="failed">Failed</option>
                                    <option value="notrefunded">Not Refunded</option>
                                </select>
                                }

                                {order.paymentstatus === 'notrefunded' &&
                                <select className='ordertxt' onChange={(e) => changePaystatus(order.orderid, order, e.target.value)}>
                                    <option value="notrefunded">Not Refunded</option>
                                    <option value="pending">Pending</option>
                                    <option value="success">Success</option>
                                    <option value="failed">Failed</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                                }
                            </td>
                            <td>{order.orderstatus === 'pending' &&
                                <select className='ordertxt' onChange={(e) => changeOrderStatus(order.orderid, order, e.target.value)}>
                                    <option value="pending">Pending</option>
                                    <option value="ontheway">On the way</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            }
                                {order.orderstatus === 'ontheway' &&
                                    <select className='ordertxt' onChange={(e) => changeOrderStatus(order.orderid, order, e.target.value)}>
                                        <option value="ontheway">On the way</option>
                                        <option value="pending">Pending</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                }

                                {order.orderstatus === 'delivered' &&
                                    <select className='ordertxt' onChange={(e) => changeOrderStatus(order.orderid, order, e.target.value)}>
                                        <option value="delivered">Delivered</option>
                                        <option value="pending">Pending</option>
                                        <option value="ontheway">On the way</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                }

                                {order.orderstatus === 'cancelled' && <p> {order.orderstatus}</p>}</td>
                            <td>
                                {order.deliveryboy_name ? <p className='ordertxt'> {order.deliveryboy_name}</p> :
                                    <div className='deliveryboy'>
                                        <input type="text" placeholder="Enter deliveryboy name"
                                            onChange={(e) => { setDeliveryboyname(e.target.value) }}
                                        />
                                        <button onClick={(e) => changeDeliveryboyName(order.orderid, order)} >save</button>
                                    </div>
                                }
                            </td>
                            <td>{
                                order.deliveryboy_phone ? <p className='ordertxt'> {order.deliveryboy_phone}</p> :
                                    <div className='deliveryboy'>
                                        <input type="text" placeholder="Enter deliveryboy phone"

                                            onChange={(e) => { setDeliveryboyphone(e.target.value) }}
                                        />
                                        <button onClick={(e) => changeDeliveryboyPhone(order.orderid, order)} >save</button>
                                    </div>

                            }
                            </td>
                            <td>{order.ordercost}</td>
                            <td><Link to={`/orderdetails/${order.orderid}`}><button>Show Details</button></Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    )
}

export default OrderSection