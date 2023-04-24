import React from "react";
import axios, {AxiosResponse} from "axios";
import {AddCartResponse} from "../dto/AddCartResponse";
import {ProductAndQuantity} from "../models/Product";
import {appStore, fetchCart} from "../AppStore";
import Endpoints from "../Endpoints";

enum CartUpdate{
    ADD,
    REMOVE
}

interface CardQuantityProps{
    quantity: number;
    pantryId: number;
    productId: number;
    cartId: number;
    onSuccess: (response: AddCartResponse) => void;
}

export class CardQuantity extends React.Component<CardQuantityProps>{


    updateProductQuantity = async (update:CartUpdate) => {
        const json = JSON.stringify({
            pantryId: this.props.pantryId,
            productId: this.props.productId,
            quantity: update === CartUpdate.ADD ? this.props.quantity +1 : this.props.quantity -1
        });
        return await axios.put<AddCartResponse>(Endpoints.update_product_in_cart(this.props.cartId),json, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        })
    }

    increment = async () => {
        const response = this.updateProductQuantity(CartUpdate.ADD);
        response.then((value: AxiosResponse<AddCartResponse>) => {
            const data = value.data;
            appStore.dispatch(fetchCart(
                {
                    cartId: data.id,
                    pantryId:this.props.pantryId,
                }
            ));
            this.props.onSuccess(value.data);
        })
    }
    decrement = async () => {
        const response = this.updateProductQuantity(CartUpdate.REMOVE);
        response.then((value: AxiosResponse<AddCartResponse>) => {
            const data = value.data;
            appStore.dispatch(fetchCart(
                {
                    cartId: data.id,
                    pantryId:this.props.pantryId,
                }
            ));
            this.props.onSuccess(value.data);
        })
    }



    quantityStyle = {
        display:'flex',justifyContent:'space-evenly',alignItems:'center',

    }

    quantityChangeStyle = {
        width:'32px',height:'32px',border:'none',outline:'none',background:'black',color:'white',borderRadius:'50%',
        display:'flex',justifyContent:'center',alignItems:'center'
    }
    render() {
        return (
            <div style={this.quantityStyle}>
                <button style={this.quantityChangeStyle} onClick={this.decrement}>-</button>
                <p style={{margin:'0'}}>{this.props.quantity}</p>
                <button style={this.quantityChangeStyle} onClick={this.increment}>+</button>
            </div>
        );
    }
}
