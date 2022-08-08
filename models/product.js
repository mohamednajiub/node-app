const fs = require('fs');
const path = require('path');

module.exports = class Product {
    constructor(name) {
        this.title = name;
    }

    save() {
        const savingPath = path.join(
            path.dirname(require.main.filename),
            'data',
            'products.json'
        );
        fs.readFile(savingPath, (err, fileContent) => {
            let products = [];
            if (!err) {
                products = JSON.parse(fileContent);
            }
            products.push(this);
            fs.writeFile(savingPath, JSON.stringify(products), err => {
                console.log(err);
            });
        });
    }

    static fetchAll(cb) {
        const savingPath = path.join(
            path.dirname(require.main.filename),
            'data',
            'products.json'
        );
        fs.readFile(savingPath, (err, fileContent) => {
            if (err) {
                cb([]);
            }
            cb(JSON.parse(fileContent));
        });
    }
};
