import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBarComp from "./Components/NavBarComp";
import {BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import Home from "./Components/Home";
import About from "./Components/About";
import Browse from "./browse/Browse";
import PantryModal from "./Pantry/PantryModal";
import ProductsView from "./browse/ProductsView";
import {Category} from "./models/Category";
import CartView from "./Components/CartView";
import { OrderView } from './Components/OrderView';




const BrowseNavigation = () => {
    const navigate = useNavigate();
    return (
        <>
           <Browse navigator = {navigate} />
        </>
    )
}

const ProductsNavigation = () => {
    const navigate = useNavigate();
    const _location = useLocation();
    return (
        <>
            <ProductsView navigator = {navigate}  selected={_location.state.category as Category} />
        </>
    )
}


const CartNavigation = () => {
    const navigate = useNavigate();
    return (
        <>
            <CartView navigator = {navigate} />
        </>
    )
}


const OrderNavigation = () => {
    const _location = useLocation();

    return (
        <>
            <OrderView order={_location.state.order}/>
        </>
            )
}


function App() {

  return (
    <>
        <PantryModal />
        <BrowserRouter>

            <Routes>

                <Route path="/" element={<NavBarComp />}>
                    <Route index element={<Navigate to="/home" />} />
                    <Route  path="/home" element={<Home />} />
                    <Route path="/browse" element={<BrowseNavigation  />} />
                    <Route path="/about" element={<About />} />
                    <Route path={"/:pantryName/products"} element={<ProductsNavigation />}/>
                </Route>

                <Route path={"/cart"} element={<CartNavigation />}/>
                <Route path="*" element={<Navigate to="/" />} />
                <Route path={"/order"} element={<OrderNavigation/>} />
            </Routes>
        </BrowserRouter>
    </>
  );
}

export default App;
