const { Schema, model } = require('mongoose');

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
});

module.exports = model('Product', productSchema)


// const { ObjectId } = require('mongodb')
// const { getDB } = require('../util/database')

// class Product {

//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new ObjectId(id) : null;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDB();
//     let dpOp;
//     if (this._id) {
//       dpOp = db.collection('products')
//         .updateOne(
//           { _id: this._id },
//           { $set: this }
//         )
//     } else {
//       dpOp = db.collection('products')
//         .insertOne(this)
//     }

//     return dpOp.then((result) => {
//       return result
//     }).catch(error => {
//       console.log(error)
//     })
//   }

//   static fetchAll() {
//     const db = getDB();
//     return db.collection('products')
//       .find()
//       .toArray()
//       .then(products => {
//         return products
//       }).catch(error => {
//         console.log(error)
//       })
//   }

//   static findById(productId) {
//     const db = getDB();
//     return db.collection('products')
//       .find({ _id: new ObjectId(productId) })
//       .next()
//       .then(product => {
//         return product
//       }).catch(error => {
//         console.log(error)
//       })
//   }

//   static delete(productId) {
//     const db = getDB();
//     return db.collection('products').deleteOne({ _id: new ObjectId(productId) })
//       .then(result => {
//       })
//       .catch(error => {
//         console.log(error)
//       })
//   }
// }


// module.exports = Product