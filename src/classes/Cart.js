export default class Cart {
    constructor(id) {
        this.id = id;
        this.products = [];
    }

    addProduct(productId) {
        const productIndex = this.products.findIndex(p => p.product === productId);
        if(productIndex === -1) {
            this.products.push({product: productId, quantity: 1});
        } else {
            this.products[productIndex].quantity += 1;
        }
    }
}