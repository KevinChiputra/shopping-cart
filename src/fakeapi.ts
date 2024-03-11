import { Product } from "./Products/Productsslice";

const validateProduct = (product: Product): Promise<Product> => new Promise((resolve, reject) => setTimeout(() => {
    if(product.title.length === 0){
        reject('no Title')
    }
    if(product.price <= 0){
        reject('price is incorrect')
    }

    resolve(product)
}, 500))

export default validateProduct