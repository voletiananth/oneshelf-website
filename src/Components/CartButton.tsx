import {Button, Container, Image} from "react-bootstrap";
import React from "react";
import {NavigateFunction} from "react-router";
import {AppState} from "../models/AppState";
import {connect} from "react-redux";
import {ConnectedProps} from "react-redux/es/exports";
import {useNavigate} from "react-router-dom";
import {Cart} from "../models/Cart";






interface CartButtonProps  {
    navigator: NavigateFunction,
    cart?: Cart
}





export class CartButton extends React.Component<CartButtonProps> {
    cartContainerStyle  = {
        display: "flex",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        spaceBetween: "4px",

    }


    cartButtonStyle = {
        height: "40px",background: "white",
        color: "black",border: "none",outline: "none",width:"auto"

    }

    cartQuantityCounterStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0px 8px 0px 0px",
        borderRadius:'50%',background:'#A50000',color:'white',
        padding: "4px 8px 4px 8px"
    }




    countTotalItems():number {
        const quantity = this.props.cart?.products.map((item) => {
            return item.quantity
        })

        return  (quantity !== undefined && quantity?.length > 0)  ?  quantity.reduce((a, b) => a + b) : 0
    }



    render() {
        return (
            <>

                   <Button style={this.cartButtonStyle} onClick={
                       () => {
                           this.props.navigator('/cart')
                       }
                   } >
                       <div style={this.cartContainerStyle}>
                           {(this.props.cart?.products.length !== undefined && this.props.cart?.products.length !==0 ) ? <p style={this.cartQuantityCounterStyle}>{this.countTotalItems()}</p> : null}
                           <Image style={{width:'24px',height:'20px' }} src={'cart.png'}/>
                           <p style={{textAlign:'center',margin:'0px 0px 0px 4px'}}>Cart</p>
                       </div>
                   </Button>

            </>
        )
    }
}






