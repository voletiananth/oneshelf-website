class Endpoints {
    static get_categories(pantryId:number): string {
        return  Endpoints.get_pantries+ pantryId+ "/categories/";
    }

    static get_category_image(imageUrl:string): string {
        return  Endpoints.baseUrl +this.api_client+ imageUrl;
    }

    static get_pantry_products(): string {
        return  Endpoints.get_pantries+ "products/";
    }



    static get baseUrl(): string {
        return "https://oneshelf.up.railway.app/";
    }

    static get api_client(): string {
        return "api/v1/client/";
    }

    static get get_pantries(): string {
        return Endpoints.baseUrl + Endpoints.api_client + "pantry/";
    }


}
export default Endpoints;
