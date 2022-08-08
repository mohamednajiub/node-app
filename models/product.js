const fs = require('fs');
const path = require('path');

const savingPath = path.join(
    path.dirname(require.main.filename),
    'data',
    'products.json'
);


const getProductsFromFile = cb => {

    fs.readFile(savingPath, (err, fileContent) => {
        if (err) {
            return cb([]);
        }
        cb(JSON.parse(fileContent));
    });
}

module.exports = class Product {
    constructor(name) {
        this.title = name;
    }

    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(savingPath, JSON.stringify(products), err => {
                console.log(err);
            });
        })
    }

    static fetchAll(cb) {
        getProductsFromFile(cb)
    }
};
