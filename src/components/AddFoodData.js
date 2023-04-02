import React, { useState } from 'react'
import './AddproductData.css'
// firebase imports
import { db, storage } from '../Firebase/FirebaseConfig'
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Navbar from './Navbar';
//
const AddproductData = () => {


    const [islogin, setislogin] = React.useState(false)

    const checklogin = () => {
        if (localStorage.getItem('admin')) {
            setislogin(true)
        }
        else {
            setislogin(false)
            window.location.href = '/login'
        }
    }

    React.useEffect(() => {
        checklogin()
    }, [])


    const [productName, setproductName] = useState('')
    const [productPrice, setproductPrice] = useState('')
    const [productImage, setproductImage] = useState(null)
    const [productCategory, setproductCategory] = useState('')
    const [productpriceunit, setproductpriceunit] = useState('')
    const [productdescription, setproductdescription] = useState('')
    const [productwholesaleprice, setproductwholesaleprice] = useState('')
    const [productwholesalequantity, setproductwholesalequantity] = useState('')
    const [productavailability, setproductavailability] = useState('')


    const handleSubmit = (e) => {
        e.preventDefault()

        if (islogin == false) {
            alert('Please login first')
            return
        }

        if (productImage == null) {
            alert('Please select an image')
            return
        }

        else {
            const imageRef = ref(storage, `productImages/${productImage.name}`)
            uploadBytes(imageRef, productImage)
                .then(() => {
                    alert('Image uploaded successfully')
                    getDownloadURL(imageRef)
                        .then((url) => {
                            // console.log(url)
                            // setproductImageUrl(url)

                            const productData = {
                                productName,
                                productPrice,
                                productImageUrl: url,
                                productCategory,
                                productpriceunit,
                                id: new Date().getTime().toString(),
                                productdescription,
                                productwholesaleprice,
                                productwholesalequantity,
                                productavailability
                            }

                            // console.log(productData)
                            try {
                                const docRef = addDoc(collection(db, "productData"), productData);
                                alert("Data added successfully ", docRef.id);
                            }
                            catch (error) {
                                alert("Error adding document: ", error);
                            }
                        })
                })
                .catch((error) => {
                    alert(error.message)
                })
        }

    }


    // console.log(new Date().getTime().toString())
    return (
        <div className="product-outermost">
            <Navbar />
            <div className="form-outer">
                <h1 className='order-head1'>Add Product Data</h1>
                <form className="form-inner">
                    <label>Product Name</label>
                    <input type="text" name="product_name"
                        onChange={(e) => { setproductName(e.target.value) }} />
                    <br />

                    <label>Product Availability</label>
                    <select name="product_availability" onChange={(e) => { setproductavailability(e.target.value) }}>
                        <option value="null">Select Product Availability</option>
                        <option value="IN STOCK">IN STOCK</option>
                        <option value="OUT OF STOCK">OUT OF STOCK</option>
                    </select>
                    <br />



                    <label>Product Price (Retail)</label>
                    <input type="number" name="product_price"
                        onChange={(e) => { setproductPrice(e.target.value) }}
                    />

                    <label>Product Price Unit</label>
                    <select name="product_price_unit" onChange={(e) => { setproductpriceunit(e.target.value) }}>
                        <option value="null">Select Product Price Unit</option>
                        <option value="kg">Kg</option>
                        <option value="piece">Piece</option>
                        <option value="dozen">Dozen</option>
                    </select>

                    <br />
                    <label>Product Price (Wholesale)</label>
                    <input type="number" name="product_price"
                        onChange={(e) => { setproductwholesaleprice(e.target.value) }}
                    />
                    <label>Product Quantity (Wholesale)</label>
                    <input type="number" name="product_price"
                        onChange={(e) => { setproductwholesalequantity(e.target.value) }}
                    />

                    <br />

                    <label>Product Category</label>
                    <select name="product_category" onChange={(e) => { setproductCategory(e.target.value) }}>
                        <option value="null">Select Product Category</option>
                        <option value="fruit">Fruit</option>
                        <option value="plant">Plant</option>
                        <option value="flower">Flower</option>
                    </select>

                    <br />
                    <label>Product Image</label>
                    <input type="file" name="product_image"
                        onChange={(e) => { setproductImage(e.target.files[0]) }}
                    />

                    <br />

                    <label>Product Description</label>
                    <textarea name="product_description" rows="5" cols="30"
                        onChange={(e) => { setproductdescription(e.target.value) }}
                    ></textarea>

                    <button onClick={handleSubmit}>Add product</button>
                </form>
            </div >
        </div >
    )
}

export default AddproductData