import { promises as fs } from "fs";

export default class ProductManager {
    constructor(filePath){
        this.products = [];
        this.path = filePath;
    }

    async addProduct(product) {
        if (!product.title || !product.description || !product.price 
            || !product.thumbnail || !product.code || !product.stock) {
            console.log("Please fill out all the required fields");
            return;
        }
      const prod =  this.products.find(prod => prod.code === product.code)
        if (prod) {
            console.log("The product is already in use")
        } else {
            this.products.push(product);
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
            return product;
        }
    }

    async getProducts() {
        try {
            const productsStored = await fs.readFile(this.path, "utf-8");
            this.products = JSON.parse(productsStored);
            return this.products;
        } catch (error) {
            console.error("Cannot access to the products stored:", error);
        }
    }

   async getProductById(id) {
         const content = await fs.readFile(this.path, "utf-8");
         this.products = JSON.parse(content);
         const prod = this.products.find(product => product.id === id);
            if(prod) {
                return prod
            } else {
                console.log("Product not found")
                }
            }
    
   async getProductByCode(code) {
         const content = await fs.readFile(this.path, "utf-8");
         this.products = JSON.parse(content);
         const prod = this.products.find(product => product.code === code);
            if(prod) {
                return prod;
            } else {
                console.log("Product not found")
                }
            }

   async updateProduct (id, product) {
        const content = await fs.readFile(this.path, "utf-8");
        this.products = JSON.parse(content);
        const index = this.products.findIndex(product => product.id === id);
           if(index != -1) {
            this.products[index] = { ...this.products[index], ...product };
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
           } else {
               console.log("Product not found")
               }
    }

    async deleteProduct (id) {
        const content = await fs.readFile(this.path, "utf-8");
        this.products = JSON.parse(content);
        const prod = this.products.find(product => product.id === id);
        if(prod) {
            await fs.writeFile(this.path, JSON.stringify(this.products.filter(product => product.id != id), null, 2));
        } else {
            console.log("Product not found")
        }
    }

}
