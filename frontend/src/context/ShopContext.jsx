import { createContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
export const ShopContext = createContext()

const ShopContextProvider = (props) => {

    const currency = '$'
    const delivery_fee = 10
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const navigate = useNavigate()
    const [token, setToken] = useState(localStorage.getItem('token') || '')
    const [products, setProducts] = useState([])
    const [name, setName] = useState(localStorage.getItem('name') || '')
    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    })

    const loginUser = async (email, password) => {
        try {
            const response = await axios.post(`${backendUrl}/api/user/login`, { email, password })
            if (response.data.success) {
                setToken(response.data.token)
                setName(response.data.name)
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('name', response.data.name)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error("Login failed: " + error.message)
        }
    }

    const registerUser = async (name, email, password) => {
        try {
            const response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password })
            if (response.data.success) {
                setToken(response.data.token)
                setName(name)
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('name', name)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error("Sign-up failed: " + error.message)
        }
    }

    const getUserAddress = async (token) => {
        if (!token) {
            toast.error('User not logged in')
            return
        }

        try {

            const response = await axios.get(backendUrl + '/api/user/address', {
                headers: { token },
            })

            if (response.data.success) {
                setAddress(response.data.address)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.error('Error fetching address:', error)
            toast.error('Failed to fetch address: ' + error.message)
        }
    }

    const updateAddress = async (address) => {
        if (!token) {
            toast.error('user not logged in')
            return
        }
        try {
            const respone = await axios.post(backendUrl + '/api/user/update-address', address, { headers: { token } })
            if (respone.data.success) {
                setAddress(address)
            }
            else {
                toast.error(respone.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Select Product Size')
            return
        }
        let cartData = structuredClone(cartItems)

        if (cartData[itemId]) {
            {/* checking if item already exists in cart */ }
            if (cartData[itemId][size]) {
                {/* checking if item&size already exists, if so, adding another, else (same item different size), adding to cart */ }
                cartData[itemId][size] += 1
            }
            else {
                {/* if item dosent exist in cart */ }
                cartData[itemId][size] = 1
            }
        }
        else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }
        setCartItems(cartData)
        toast.success("Product added to cart")

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)

            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item]
                    }

                } catch (error) {
                    console.log(error)
                    toast.error(error.message)
                }
            }
        }
        return totalCount
    }

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems)
        cartData[itemId][size] = quantity
        setCartItems(cartData)

        if (token) {

            try {

                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }

        }
    }

    const getCartAmount = () => {
        let total = 0
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items)
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        total += itemInfo.price * cartItems[items][item]
                    }
                }
                catch (error) {

                }
            }
        }
        return total
    }

    const getProductsData = async () => {
        try {

            const response = await axios.get(backendUrl + '/api/product/list')

            if (response.data.success) {
                setProducts(response.data.products)
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getUserCart = async (token) => {
        try {

            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })

            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
            else {
                console.error('Failed to fetch cart:', response.data.message)
                toast.error("get usercart error, " + response.data.message)
            }


        } catch (error) {
            console.log('Error fetching cart data:', error)
            toast.error("get usercart error 2, " + error.message)
        }
    }

    useEffect(() => {
        getProductsData()
        const storedToken = localStorage.getItem('token')
        if (storedToken) {
            setToken(storedToken)
        }
    }, [])

    useEffect(() => {
        if (token) {
            getUserCart(token)
            getUserAddress(token)

        }
    }, [token])

    const value = {
        products, currency, delivery_fee, search, setSearch, showSearch, setShowSearch, cartItems, setCartItems, addToCart, getCartCount, updateQuantity, getCartAmount, navigate, backendUrl, setToken, token, updateAddress, address, name, loginUser, registerUser, setName, setAddress
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider