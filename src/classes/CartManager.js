import { promises as fs } from "fs";
import Cart from "./Cart.js";

export default class CartManager {
    constructor(filePath) {
        this.path = filePath;
        this.nextId = 1;
        this.carts = []
    }

    saveToFile = async() => {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error("Error at saving cart:", error);
        }
    }

    createCart = async() => {
        await this.getAllCarts();
        const newCart = new Cart(this.nextId);
        this.carts.push(newCart);
        this.saveToFile();
        return newCart;
    }

    getAllCarts = async() => {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            if (data.length > 0) {
                this.carts = JSON.parse(data);
                const maxIdCart = this.carts.reduce((prev, curr) => (prev.id > curr.id) ? prev : curr);
                this.nextId = maxIdCart.id + 1;
            }
            return this.carts;
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log("Carts file doesn´t exists. A new one will be created");
                return [];
            } else {
                console.error("Error reading carts file:", error);
            }
        }
    }
  
    getCartById = async(id) => {
        await this.getAllCarts();
        const cart = this.carts.find(cart => cart.id === parseInt(id));
        if (cart) {
            return cart;
        } else {
            console.log('Cart not found');
            return null;
        }
    }

    addProductToCart = async (cartId, productId) => {
        const cartContent = await this.getCartById(cartId);
        if (!cartContent) {
            throw new Error('Cart not found');
        } else {
            const { products } = cartContent;
            const existingProductIndex = products.findIndex(p => p.product === parseInt(productId));
            
            if (existingProductIndex !== -1) {
                products[existingProductIndex].quantity++;
            } else {
                products.push({ product: parseInt(productId), quantity: 1 });
            }
            console.log(`Product ID: ${productId} added to Cart: ${cartId}`);
            await this.saveToFile();
        }
    }

}
