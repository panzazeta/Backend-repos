import {Router} from "express";
import ProductManager from "../classes/ProductManager.js";

const productManager = new ProductManager("./products.txt")
const prodsRouter = Router();

prodsRouter.get("/", async(req,res) => {
    const {limit} = req.query;
    const products= await productManager.getProducts();
    if(limit){
       const limitProducts= products.slice(0, limit);
       res.status(200).send(limitProducts);
    } else {
    res.send(products);
    }
});

prodsRouter.get("/:pid", async(req,res) => {
    const products= await productManager.getProducts();
    const productsPid = products.find(prod => prod.id === parseInt(req.params.pid));
    if(productsPid)
        res.status(200).send(productsPid)
    else
        res.status(404).send("Error: product not found")
})

prodsRouter.post("/", async (req,res) => {
    const {code} = req.body;
    const prods = await productManager.getProducts();
    const prodsIds = prods.map(prod => prod.id);
    req.body.id = Math.max(...prodsIds) +1;
    const conf = prods.find(p => p.code === code);
    if (conf) {
        res.status(400).send("Product already created")
    } else {
        const conf = await productManager.addProduct(req.body);
        if(conf) {
            res.status(200).send("Product has been created")
    }}
})

prodsRouter.put("/:id", async (req,res) => {
    const {id} = req.params;
    const conf = await productManager.getProductById(parseInt(id));
    if (conf) {
        await productManager.updateProduct(parseInt(id), req.body);
        res.status(200).send("Product has been updated")
    } else {
        res.status(404).send("Product not found")  
    }
})

prodsRouter.delete("/:id", async (req,res) => {
    const {id} = req.params;
    const conf = await productManager.getProductById(parseInt(id));
    if (conf) {
        await productManager.deleteProduct(parseInt(id));
        res.status(200).send("Product has been updated")
    } else {
        res.status(404).send("Product not found")  
    }
})

export default prodsRouter;