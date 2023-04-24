export interface  CartItem {
    productId: number,
    quantity: number
    name: string,
    image: string,

}

export interface Cart {
    id: number,
    products: CartItem[]
}
