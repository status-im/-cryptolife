import uuid from 'react-native-uuid';
import findIndex from 'lodash/findIndex';

class ProductBatch {
    constructor(name, quantity, price) {
        this.id = uuid.v4()
        this.name = name;
        this.quantity = quantity;
        this.price = price;
    }

    sell(n=1){
        if( this.quantity-n < 0) {
            throw new Error(`Only ${this.quantity} ${this.name} available`);
        }

        this.quantity = this.quantity-n;
    }

    isOutOfStock(){
        return this.quantity < 1;
    }
}

const products = [
    {
        name: 'Coffee',
        quantity: 200,
        price: 2
    },
    {
        name: 'Salmon sandwitch',
        quantity: 10,
        price: 6
    },
    {
        name: 'Ice Cream',
        quantity: 100,
        price: 5
    },
];

export default class Inventory {
    constructor() {
        this.db = products.map( p => new ProductBatch(p.name, p.quantity, p.price));
    }

    get() {
        return this.db.filter(p => p.isOutOfStock() )
    }
}

export class Basket {
    constructor() {
        this.db = {};
    }

    add(p){
        if(p.isOutOfStock()) throw new Error(`Only ${p.quantity} ${p.name} available`);

        this.db[p.id] = {
            quantity: 1
        }
    }

    findProduct(id) {
        if( !this.db[id] ) {
            // Token does not exist
            this.db[p.id] = {
                quantity: 0
            }
        }
        return idx;
    }

    rm(p){
        
    }
}

const I = new Inventory();
const catalog = I.get();
console.log('catalog', catalog);

const b = new Basket();

b.add(b[0])