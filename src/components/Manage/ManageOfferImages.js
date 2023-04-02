import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import './ManageSlider.css'
import { db, storage } from '../../Firebase/FirebaseConfig'
import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ManageOfferImages = () => {

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

    
    const [newimage, setNewImage] = useState('')

    const uploadImage = (e) => {
        e.preventDefault()
        if (newimage != null || newimage !== '') {
            const imageRef = ref(storage, `offerimages/${newimage.name}`)
            uploadBytes(imageRef, newimage)
                .then(() => {
                    alert('Image uploaded successfully')
                    getDownloadURL(imageRef)
                        .then((url) => {
                            // console.log(url)
                            // setproductImageUrl(url)

                            const offerData = {
                                sliderImageUrl: url,
                                id: new Date().getTime().toString()
                            }

                            // console.log(productData)
                            try {
                                const docRef = addDoc(collection(db, "offerimages"), offerData);
                                alert("Data added successfully ", docRef.id);
                                getofferData()
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
        else {
            alert('Please select an image')
        }
    }


    const [offerData, setofferData] = useState([])

    const getofferData = () => {
        let temp = []
   
        getDocs(collection(db, "offerimages"))
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // console.log(doc.data())
                    temp.push({
                        id: doc.id,
                        sliderImageUrl: doc.data().sliderImageUrl
                    })
                });
                setofferData(temp)
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }


    useEffect(() => {
        getofferData()
    }, [])


    const deletedata = (id) => {
        // console.log(id)
       deleteDoc(doc(db, "offerimages", id))
            .then(() => {
                alert("Document successfully deleted!");
                getofferData()
            })
            .catch((error) => {
                console.error("Error removing document: ", error);
            });
    }
    return (
        <div className='slidercont'>
            <Navbar />
            <h1 className="order-head1">Offer Images</h1>
            <div className='addsliderimg'>
                <input type='file'
                    onChange={(e) => setNewImage(e.target.files[0])}
                />
                <button
                    onClick={(e) => uploadImage(e)}
                >Upload</button>
            </div>

            {
                offerData && offerData.length > 0 &&
                <div className='managesliderimg'>
                    {
                        offerData.map((item) => {
                            return (
                                <div className='sliderimgcont'>
                                    <img src={item.sliderImageUrl} alt='slider' className=''/>

                                    <svg 
                                        onClick={() => deletedata(item.id)}
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 deletebtn">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>

                                </div>
                            )
                        })
                    }
                </div>
            }
        </div>
    )
}

export default ManageOfferImages