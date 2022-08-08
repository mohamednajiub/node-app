const products = [];

module.exports = class Product {
    constructor(name) {
        this.title = name
    }

    save() {
        products.push(this)
    }

    static getProducts() {
        return products
    }
}