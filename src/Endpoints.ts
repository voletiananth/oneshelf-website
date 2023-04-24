class Endpoints {
    static get_categories(pantryId:number): string {
        return  Endpoints.get_pantries+ pantryId+ "/categories/";
    }

    static get_image(imageUrl:string): string {
        return  Endpoints.baseUrl +this.api_client+ imageUrl;
    }

    static get_pantry_products(): string {
        return  Endpoints.get_pantries+ "products/";
    }



    static get baseUrl(): string {
        return "http://localhost:2195/";
    }

    static get api_client(): string {
        return "api/v1/client/";
    }

    static get get_pantries(): string {
        return Endpoints.baseUrl + Endpoints.api_client + "pantry/";
    }


    static add_product_to_cart() {
        return Endpoints.baseUrl + Endpoints.api_client + "cart/";
    }

    static update_product_in_cart(cartId:number | undefined) {
        return Endpoints.baseUrl + Endpoints.api_client + "cart/" + cartId + "/";
    }

    static get_Cart() {
        return this.add_product_to_cart()+"details/";
    }

    static get_slots(pantryId:number){
        return Endpoints.get_pantries+ pantryId+ "/slots/";
    }

    static place_order(){
        return Endpoints.baseUrl + Endpoints.api_client + "order/";
    }


}
export default Endpoints;
