import CartManager from "../classes/CartManager.js";
import { Router } from "express";

const cartsRouter = Router();
const cartManager = new CartManager("./carts.txt");

cartsRouter.post("/", async (req, res) => {
    await cartManager.createCart();
    res.status(200).send("New cart created");
})

cartsRouter.get("/", async (req, res) => {
    res.send( await cartManager.getAllCarts());
})

cartsRouter.get("/:pid", async (req, res) => {
    const cart = await cartManager.getCartById(req.params.pid);
    if (cart) {
        res.status(200).send(cart.products);
    } else {
        res.status(404).send("Cart not found");
    }
});


cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    await cartManager.addProductToCart(req.params.cid, req.params.pid);
    res.status(200).send("Product added to cart");
});


export default cartsRouter