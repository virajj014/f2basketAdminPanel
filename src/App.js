
import AddFoodData from './components/AddFoodData';

import OrderSection from './components/OrderSection';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ShowDetails from './components/ShowDetails';
import ManageProducts from './components/Manage/ManageProducts';
import ManageSlider from './components/Manage/ManageSlider';
import Login from './components/Login';

function App() {
  return (
    // <div className="Container">
    //   {/* <AddFoodData /> */}
    //   <OrderSection />
    // </div>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OrderSection />} />
        <Route path="/addproduct" element={<AddFoodData />} />
        <Route path="/orderdetails/:orderid" element={<ShowDetails />} />
        <Route path="/manageproducts" element={<ManageProducts />} />
        <Route path="/orders" element={<OrderSection />} />
        <Route path="/manageslider" element={<ManageSlider />} />
        <Route path="/login" element={<Login/>} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
