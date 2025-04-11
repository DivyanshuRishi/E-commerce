

import toast from "react-hot-toast";
import { create } from "zustand";
// import axios from "../lib/axios";
import axiosInstance from "../lib/axios";

export const useProductStore = create((set) => ({
    products: [],
    loading: false,
    product: null, // Added a state for a single product
    error: null, // State to store error messages

    setProducts: (products) => set({ products }),
    createProduct: async (productData) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.post("/products", productData);
            set((prevState) => ({
                products: [...prevState.products, res.data],
                loading: false,
            }));
            toast.success("Product created successfully!");
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to create product");
            set({ loading: false });
        }
    },
    fetchAllProducts: async () => {
        set({ loading: true });
        try {
            const response = await axiosInstance.get("/products");
            set({ products: response.data.products, loading: false });
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to fetch products");
            set({ error: "Failed to fetch products", loading: false });
        }
    },
    fetchProductsByCategory: async (category) => {
        set({ loading: true });
        try {
            const response = await axiosInstance.get(`/products/category/${category}`);
            set({ products: response.data.products, loading: false });
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to fetch products");
            set({ error: "Failed to fetch products", loading: false });
        }
    },
    deleteProduct: async (productId) => {
        set({ loading: true });
        try {
            await axiosInstance.delete(`/products/${productId}`);
            set((prevProducts) => ({
                products: prevProducts.products.filter((product) => product._id !== productId),
                loading: false,
            }));
            toast.success("Product deleted successfully!");
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to delete product");
            set({ loading: false });
        }
    },
    toggleFeaturedProduct: async (productId) => {
        set({ loading: true });
        try {
            const response = await axiosInstance.patch(`/products/${productId}`);
            set((prevProducts) => ({
                products: prevProducts.products.map((product) =>
                    product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
                ),
                loading: false,
            }));
            toast.success("Product featured status updated!");
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to update product");
            set({ loading: false });
        }
    },
    fetchFeaturedProducts: async () => {
        set({ loading: true });
        try {
            const response = await axiosInstance.get("/products/featured");
            set({ products: response.data, loading: false });
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to fetch featured products");
            set({ error: "Failed to fetch products", loading: false });
        }
    },

    fetchProductById: async (productId) => {
        set({ loading: true }); // Changed isLoading to loading for consistency
        try {
            const response = await axiosInstance.get(`/products/${productId}`); // Adjusted API endpoint to match the backend
            set({ product: response.data, loading: false });
        } catch (error) {
            console.error("Error fetching product:", error);
            toast.error(error.response?.data?.error || "Failed to fetch product");
            set({ loading: false });
        }
    },
}));
