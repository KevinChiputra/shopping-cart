import { createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import validateProduct from "../fakeapi";


// state interface
export interface Product {
    title: string,
    price: number,
    id: string,
}

export enum ValidationState{
    Fullfilled,
    Pending,
    Rejected,
}
// =======================================
interface ProductsSliceState {
    validationState?: ValidationState,
    errorMessage?: string 
}

export const addProductAsync = createAsyncThunk('products/addNewProduct', async(initialProduct: Product) => {
    const product = await validateProduct(initialProduct)
    return product
})

// Reducer
const initialProducts: Product[] = [
    {title: 'Escape from Tarkov', price: 60, id: 'eft'},
    {title: 'Hunt: shadow', price: 70, id: 'hunt'},
    {title: 'Valorant', price: 110, id: 'vlo'},
]

// const initialState: ProductsSliceState = {
//     products: initialProducts,
//     validationState: undefined,
//     errorMessage: undefined
// }

// getInitialState dan upsertMany (update insert) hal baru
const productAdapter = createEntityAdapter<Product>()
const initialState = productAdapter.getInitialState<ProductsSliceState>({
    errorMessage: undefined,
    validationState: undefined
})

const filledInitialState = productAdapter.upsertMany(initialState, initialProducts)
// isi dari filledInitialState
// {
//     ids: ['eft', 'hunt', 'vlo'],
//     entities: {
//       'eft': { title: 'Escape from Tarkov', price: 60, id: 'eft' },
//       'hunt': { title: 'Hunt: Shadow', price: 70, id: 'hunt' },
//       'vlo': { title: 'Valorant', price: 110, id: 'vlo' }
//     },
//     errorMessage: undefined,
//     validationState: ValidationState.Fullfilled
//   }

const prodcutsSlice = createSlice({
    name: 'products',
    initialState: filledInitialState,
    reducers: {
        addProduct: (state, action: PayloadAction<Product>) => {
            // return [action.payload, ...state]
            // state.products.push(action.payload)
            productAdapter.upsertOne(state, action.payload)
        },
        removeProduct: (state, action: PayloadAction<string>) => {
            productAdapter.removeOne(state, action.payload)
        }
        // ({
        //     ...state,
        //     products: state.products.filter(product => product.id !== action.payload)
        // })
    },
    extraReducers: builder => {
        builder.addCase(addProductAsync.fulfilled, (state,action) => {
            productAdapter.upsertOne(state, action.payload)
            state.validationState = ValidationState.Fullfilled
            state.errorMessage = undefined
        })
        // ({
        //     ...state,
        //     validationState: ValidationState.Fullfilled,
        //     errorMessage: undefined,
        //     products: [...state.products, action.payload]
        // }))
        builder.addCase(addProductAsync.rejected, (state, action) => ({
            ...state,
            validationState: ValidationState.Rejected,
            errorMessage: action.error.message
        }))
        builder.addCase(addProductAsync.pending, (state, action) => ({
            ...state,
            validationState: ValidationState.Pending,
            errorMessage: undefined
        }))
    }
})

export const { addProduct, removeProduct } = prodcutsSlice.actions

export const getProductsSelector = (state: RootState) => state.products.entities
export const getErrorMessage = (state: RootState) => state.products.errorMessage

export const {
    selectAll: selectAllProducts,
    selectById: selectProductById,
    selectEntities: selectProductEntities,
    selectIds: selectProductIds,
    selectTotal: selectTotalProduct
} = productAdapter.getSelectors<RootState>(state => state.products)

export default prodcutsSlice.reducer
