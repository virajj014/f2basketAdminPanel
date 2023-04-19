import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import { db, storage } from '../../Firebase/FirebaseConfig'
import { addDoc, collection, deleteDoc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './ManageProducts.css'
import { doc } from "firebase/firestore";
import { async } from '@firebase/util';
import firebase from 'firebase/app'
import 'firebase/firestore'


const ManageProducts = () => {
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


    const [products, setproducts] = useState(null)
    const getallproducts = () => {
        let temp = []
        getDocs(collection(db, "productData"))
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.data())
                    temp.push({ ...doc.data(), id: doc.id })
                });
                setproducts(temp)
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });

        // setproducts(temp)
    }

    useEffect(() => {
        getallproducts()
    }, [])



    const [keyword, setKeyword] = useState('')


    const [editpage, seteditpage] = useState(false)
    const [productName, setproductName] = useState('')
    const [productPrice, setproductPrice] = useState('')
    const [productImage, setproductImage] = useState('')
    const [productCategory, setproductCategory] = useState('')
    const [productpriceunit, setproductpriceunit] = useState('')
    const [productdescription, setproductdescription] = useState('')
    const [productavailability, setproductavailability] = useState('IN STOCK')
    const [productwholesaleprice, setproductwholesaleprice] = useState('0')
    const [productwholesalequantity, setproductwholesalequantity] = useState('0')
    const [docid, setdocid] = useState('')
    const [editimage, seteditimage] = useState(false)


    const editproduct = async (product) => {
        // console.log(product)
        setproductavailability(product.productAvailability)
        setproductName(product.productName)
        setproductPrice(product.productPrice)
        setproductCategory(product.productCategory)
        setproductpriceunit(product.productpriceunit)
        setproductImage(product.productImageUrl)
        setproductdescription(product.productdescription)
        setproductwholesaleprice(product.productwholesaleprice)
        setproductwholesalequantity(product.productwholesalequantity)

        setdocid(product.id)
        seteditpage(true)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // if (editimage == false) {
        //     alert('old image')
        // }
        // else if (editimage == true) {
        //     alert(productImage)
        // }
        // console.log(productdescription)
        if (editimage == false || productImage == '') {
            //update doc
            console.log('old ', productavailability)
            updateDoc(doc(db, "productData", docid), {
                productName: productName,
                productPrice: productPrice,
                productCategory: productCategory,
                productpriceunit: productpriceunit,
                productImageUrl: productImage,
                productdescription: productdescription,
                productAvailability: productavailability ? productavailability : 'IN STOCK',
                // productwholesaleprice: productwholesaleprice ? productwholesaleprice : productPrice,
                // productwholesalequantity: productwholesalequantity ? productwholesalequantity : 1,
            })
                .then(() => {
                    alert('product updated')

                })
                .catch((error) => {
                    console.error("Error updating document: ", error);
                });
        }

        else if (editimage == true && productImage != '') {
            let date = new Date()
            const imageRef = ref(storage, `productImages/${date}`);
            uploadBytes(imageRef, productImage)
                .then((snapshot) => {
                    alert('Image uploaded successfully')
                    getDownloadURL(imageRef)
                        .then((url) => {
                            // console.log(url)
                            //update doc
                            updateDoc(doc(db, "productData", docid), {
                                productName: productName,
                                productPrice: productPrice,
                                productCategory: productCategory,
                                productpriceunit: productpriceunit,
                                productImageUrl: url,
                                productdescription: productdescription,
                                productAvailability: productavailability,
                                // productwholesaleprice: productwholesaleprice,
                                // productwholesalequantity: productwholesalequantity
                            })
                                .then(() => {
                                    alert('product updated')
                                    seteditimage(false)

                                })
                                .catch((error) => {
                                    console.error("Error updating document: ", error);
                                });
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                })
        }
    }


    const [category, setcategory] = useState('fruit')


    const deleteproduct = (id) => {
        // console.log(id)
        deleteDoc(doc(db, "productData", id))
            .then(() => {
                alert('product deleted')
                getallproducts()
            })
            .catch((error) => {
                console.error("Error removing document: ", error);
            });
    }
    return (
        <div className='manageproducts'>
            <Navbar />
            <h1 className="order-head1">Manage Products</h1>

            {/* <button onClick={() => console.log(products[0])}>click</button> */}
            <input type="text" placeholder="Search by name,price,category,unit" className='prodsearchbar'
                onChange={(e) => setKeyword(e.target.value)} />
            <select name="category" id="category" className='prodsearchbar'
                onChange={(e) => setcategory(e.target.value)}
            >
                <option value="fruit">Fruits</option>
                <option value="flower">Flower</option>
                <option value="all">All</option>
                <option value="plant">Plants</option>
            </select>
            {
                products && products.length > 0 &&
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Image</th>
                            <th scope="col">Name</th>
                            <th scope="col">Availability</th>
                            <th scope="col">Price (Retail)</th>
                            <th scope="col">Price (Wholesale)</th>
                            <th scope="col">Min QTY (Wholesale)</th>

                            <th scope="col">Category</th>
                            <th scope="col">Unit</th>
                            <th scope="col">Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products
                                .filter((product) => {
                                    if (keyword === '') {
                                        return product
                                    }
                                    else if (product.productName.toLowerCase().includes(keyword.toLowerCase())) {
                                        return product
                                    }
                                    else if (product.productPrice.toLowerCase().includes(keyword.toLowerCase())) {
                                        return product
                                    }
                                    else if (product.productCategory.toLowerCase().includes(keyword.toLowerCase())) {
                                        return product
                                    }
                                    else if (product.productpriceunit.toLowerCase().includes(keyword.toLowerCase())) {
                                        return product
                                    }
                                })
                                .filter((product) => {
                                    if (category === 'all') {
                                        return product
                                    }
                                    else if (product.productCategory === category) {
                                        return product
                                    }
                                })
                                .map((product, index) => {
                                    return (
                                        <tr className='product' key={index}>
                                            <td
                                                data-label="IMAGE"
                                            ><img src={product.productImageUrl} alt="" /></td>
                                            <td
                                                data-label="NAME"
                                            >{product.productName}</td>
                                            <td
                                                data-label="AVAILABILITY"
                                            >
                                                {
                                                    product.productAvailability ?
                                                        product.productAvailability :
                                                        'IN STOCK'
                                                }
                                            </td>
                                            <td
                                                data-label="PRICE (Retail)"
                                            >Rs. {product.productPrice}</td>
                                            {/* <td
                                                data-label="PRICE (WholeSale)"
                                            > {product.productwholesaleprice ?
                                                'Rs.' + product.productwholesaleprice : 'NOT SET'}</td>
                                            <td
                                                data-label="Wholesale Quantity"
                                            >{product.productwholesalequantity ?
                                                product.productwholesalequantity : 'NOT SET'}

                                            </td> */}
                                            <td
                                                data-label="CATEGORY"
                                            >{product.productCategory}</td>
                                            <td
                                                data-label="UNIT"
                                            >{product.productpriceunit}</td>
                                            <td
                                                data-label="EDIT"
                                            >
                                                <div className='editdel'>
                                                    <button
                                                        onClick={() => editproduct(product)}
                                                    >Edit</button>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" 
                                                        onClick={() => deleteproduct(product.id)}
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                                    </svg>

                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                        }
                    </tbody>
                </table>
            }


            {
                editpage &&
                <div className='editproductout'>
                    <buttton className='goback'
                        onClick={() => {
                            seteditpage(false)
                            seteditimage(false)
                            getallproducts()
                            setproductName('')
                            setproductPrice('')
                            setproductCategory('')
                            setproductpriceunit('')
                            setproductImage('')
                            setdocid('')
                            setproductdescription('')
                            setproductavailability('')
                            setproductwholesaleprice('')
                            setproductwholesalequantity('')
                        }}
                    >Go Back</buttton>
                    <div className="form-outer">
                        <form className="form-inner">
                            <label>Product Name</label>
                            <input type="text" name="product_name"
                                value={productName}
                                onChange={(e) => { setproductName(e.target.value) }} />
                            <br />

                            <label>Product Availability</label>
                            <select name="product_availability" onChange={(e) => { setproductavailability(e.target.value) }}>
                                <option value="IN STOCK">Select Product Availability</option>
                                <option value="IN STOCK">IN STOCK</option>
                                <option value="OUT OF STOCK">OUT OF STOCK</option>
                            </select>
                            <br />



                            <label>Product Price (Retail)</label>
                            <input type="number" name="product_price"
                                value={productPrice}
                                onChange={(e) => { setproductPrice(e.target.value) }}
                            />

                            {/* <br />
                            <label>Product Price (Wholesale)</label>
                            <input type="number" name="product_price"
                                onChange={(e) => { setproductwholesaleprice(e.target.value) }}
                                value={productwholesaleprice}
                            />
                            <label>Product Quantity (Wholesale)</label>
                            <input type="number" name="product_price"
                                onChange={(e) => { setproductwholesalequantity(e.target.value) }}
                                value={productwholesalequantity}
                            /> */}


                            <label>Product Price Unit</label>
                            <select name="product_price_unit" onChange={(e) => {
                                setproductpriceunit(e.target.value)
                            }}>
                                <option value="null">Select Product Price Unit</option>
                                <option value="kg">Kg</option>
                                <option value="piece">Piece</option>
                                <option value="dozen">Dozen</option>
                            </select>
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
                                // value={productImage}
                                onChange={(e) => {
                                    setproductImage(e.target.files[0])
                                    seteditimage(true)
                                }}
                            />
                            <br />

                            <label>Product Description</label>
                            <textarea name="product_description" id="" cols="30" rows="10"
                                value={productdescription}
                                onChange={(e) => { setproductdescription(e.target.value) }}
                            />

                            <button onClick={(e) => {
                                handleSubmit(e)
                                // seteditpage(false)
                            }}>Save product</button>
                        </form>
                    </div >
                </div>
            }

        </div>
    )
}

export default ManageProducts