const { ObjectId } = require('mongodb')
const { getDB } = require('../util/database')

class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart // {items: []}
        this._id = id
    }

    save() {
        const db = getDB();
        return db.collection('users')
            .insertOne(this)
            .then(result => {
                return result
            }).catch(error => {
                console.log(error)
            })
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cartProduct => {
            console.log(cartProduct)
            return cartProduct.productId.toString() === product._id.toString();
        });

        let newQuantity = 1
        let updatedCartItems = [...this.cart.items]

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1
            updatedCartItems[cartProductIndex].quantity = newQuantity
        } else {
            updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity })
        }
        const updatedCart = {
            items: updatedCartItems,
        }

        const db = getDB();

        return db.collection('users').updateOne(
            {
                _id: new ObjectId(this._id)
            }, {
            $set: {
                cart: updatedCart
            }
        })
    }

    getCart() {
        const db = getDB();
        const productsIds = this.cart.items.map(product => {
            return product.productId
        })

        return db.collection('products').find({
            _id: {
                $in: productsIds
            }
        })
            .toArray()
            .then(products => {
                return products.map(product => {
                    return {
                        ...product,
                        quantity: this.cart.items.find(item => {
                            return item.productId.toString() === product._id.toString()
                        }).quantity
                    }
                })
            })
            .catch(error => {
                console.log(error)
            })

    }

    static findUserById(userId) {
        const db = getDB();
        return db.collection('users')
            .findOne({ _id: new ObjectId(userId) })
            .then(user => {
                return user
            }).catch(error => {
                console.log(error)
            })
    }

}

module.exports = User