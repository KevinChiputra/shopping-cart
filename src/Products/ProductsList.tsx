import React from 'react'
import { useSelector } from 'react-redux'
import { Product, getProductsSelector, removeProduct, selectAllProducts, selectProductById, selectProductEntities, selectProductIds, selectTotalProduct } from './Productsslice'
import { useAppDispatch } from '../store.hooks'
import { addToCart } from '../Cart/cart.slice'
import { RootState } from '../store'

const ProductsList: React.FC = () => {

    const products = useSelector(selectAllProducts)
    // const eft = useSelector<RootState>(state => selectProductById(state, 'eft'))
    // const totalNumberOfProducts = useSelector(selectTotalProduct)
    // const productIds = useSelector(selectProductIds)
    // const entities = useSelector(selectProductEntities)
    // console.log(products)
    // console.log(eft)
    // console.log(totalNumberOfProducts)
    // console.log(productIds)
    // console.log(entities)
    // console.log(entities['eft'])
    const dispatch = useAppDispatch()

    const removeFromStore = (id: string) => dispatch(removeProduct(id))

    const addToCartHandler = (product: Product) => dispatch(addToCart(product))

  return (
    <div>
        <h2>Games List</h2>
        {products.map(product => <div key={product.id}>
            <span>{`${product.title} : ${product.price}`}</span>
            <button onClick={() => addToCartHandler(product)}>Add to Cart</button>
            <button onClick={() => removeFromStore(product.id)}>Remove From The Store</button>
        </div>)}
    </div>
  )
}

export default ProductsList
