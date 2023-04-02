import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import { db, storage } from '../../Firebase/FirebaseConfig'
import { addDoc, collection, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
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
                    temp.push(doc.data())
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
    const [productavailability, setproductavailability] = useState('')
    const [productwholesaleprice, setproductwholesaleprice] = useState('')
    const [productwholesalequantity, setproductwholesalequantity] = useState('')
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

        // get doc name by prodductName
        const docRef = query(collection(db, "productData"), where("productName", "==", product.productName));
        const docSnap = await getDocs(docRef);
        // console.log(docSnap.docs[0].id)
        setdocid(docSnap.docs[0].id)
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
            updateDoc(doc(db, "productData", docid), {
                productName: productName,
                productPrice: productPrice,
                productCategory: productCategory,
                productpriceunit: productpriceunit,
                productImageUrl: productImage,
                productdescription: productdescription,
                productAvailability: productavailability,
                productwholesaleprice: productwholesaleprice,
                productwholesalequantity: productwholesalequantity
            })
                .then(() => {
                    alert('product updated')
                })
                .catch((error) => {
                    console.error("Error updating document: ", error);
                });
        }

        else if (editimage == true && productImage != '') {
            const imageRef = ref(storage, `productImages/${productImage}`);
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
                                productwholesaleprice: productwholesaleprice,
                                productwholesalequantity: productwholesalequantity
                            })
                                .then(() => {
                                    alert('product updated')
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
                                            <td
                                                data-label="PRICE (WholeSale)"
                                            > {product.productwholesaleprice?
                                                'Rs.' + product.productwholesaleprice:'NOT SET'}</td>
                                            <td
                                                data-label="Wholesale Quantity"
                                            >{product.productwholesalequantity?
                                                product.productwholesalequantity:'NOT SET'}
                                                
                                                </td>
                                            <td
                                                data-label="CATEGORY"
                                            >{product.productCategory}</td>
                                            <td
                                                data-label="UNIT"
                                            >{product.productpriceunit}</td>
                                            <td
                                                data-label="EDIT"
                                            >
                                                <div>
                                                    <button
                                                        onClick={() => editproduct(product)}
                                                    >Edit</button>
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
                                <option value="null">Select Product Availability</option>
                                <option value="IN STOCK">IN STOCK</option>
                                <option value="OUT OF STOCK">OUT OF STOCK</option>
                            </select>
                            <br />



                            <label>Product Price (Retail)</label>
                            <input type="number" name="product_price"
                                value={productPrice}
                                onChange={(e) => { setproductPrice(e.target.value) }}
                            />

                            <br />
                            <label>Product Price (Wholesale)</label>
                            <input type="number" name="product_price"
                                onChange={(e) => { setproductwholesaleprice(e.target.value) }}
                                value={productwholesaleprice}
                            />
                            <label>Product Quantity (Wholesale)</label>
                            <input type="number" name="product_price"
                                onChange={(e) => { setproductwholesalequantity(e.target.value) }}
                                value={productwholesalequantity}
                            />


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