interface ProductImage{
    id: number;
    images: string[];
}

export interface Product{
    id: number;
    name: string;
    description: string;
    thumbnail: string;
    brand: string;
    images_details: ProductImage;

}

export interface ProductAndQuantity{
    product: Product;
    cart_quantity: number;
}
