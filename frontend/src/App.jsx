import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";

import LoadingSpinner from "./components/LoadingSpinner";
import Navbar from "./components/Navbar";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import CategoryPage from "./pages/CategoryPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import OrderPage from "./pages/OrderPage";
import ProductPage from "./pages/ProductPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import SignUpPage from "./pages/SignUpPage";
import Wishlist from "./pages/Wishlist";
import { useCartStore } from "./stores/useCartStore";
import { useUserStore } from "./stores/useUserStore";

function App() {
    const { user, checkAuth, checkingAuth } = useUserStore();
    const { getCartItems } = useCartStore();

    useEffect(() => {
        checkAuth(); // Check user authentication status on mount
    }, [checkAuth]);

    

    useEffect(() => {
        if (user) {
            getCartItems(); // Fetch cart items if user is authenticated
        }
    }, [getCartItems, user]);

    if (checkingAuth) return <LoadingSpinner />; // Display loading spinner while checking auth

    return (
        <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
            {/* Background gradient */}
            <div className='absolute inset-0 overflow-hidden'>
                <div className='absolute inset-0'>
                    <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
                </div>
            </div>

            <div className='relative z-50 pt-20'>
                <Navbar />
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
                    <Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
                    <Route path='/product/:id' element={<ProductPage />} />
                    <Route path='/wishlist' element={user ? <Wishlist /> : <Navigate to='/login' />} />
                    <Route path='/secret-dashboard' element={user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' />} />
                    <Route path='/category/:category' element={<CategoryPage />} />
                    <Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
                    <Route path='/purchase-success' element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />} />
                    <Route path='/purchase-cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />
                    <Route path='/orders' element={user ? <OrderPage /> : <Navigate to='/login' />} />
                </Routes>
            </div>
            <Toaster />
        </div>
    );
}

export default App;
