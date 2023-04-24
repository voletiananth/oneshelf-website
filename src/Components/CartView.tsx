import React from "react";
import {Button, Card, Container, Image, Modal} from "react-bootstrap";
import {AppState} from "../models/AppState";
import {connect, ConnectedProps} from "react-redux";
import {NavigateFunction} from "react-router";
import Endpoints from "../Endpoints";
import {CardQuantity} from "./CardQuantity";
import '../css/CartView.css';
import {SlotView} from "./SlotView";
import {SlotDayResponse, SlotTime} from "../dto/SlotDayResponse";
import axios from "axios";
import {Navigate} from "react-router-dom";
import {addOrder, appStore, removeCart} from "../AppStore";
import {OrderResponse} from "../dto/OrderResponse";

function mapStateToProps(state: AppState) {
    return {
        cart: state.cart,
        pantry: state.pantry
    }
}

let connector = connect(mapStateToProps)

interface CartViewProps  extends ConnectedProps<typeof connector>{
    navigator: NavigateFunction,
}

interface CartViewState {
    totalItems: number,
    showSlotView: boolean,
    slotDay?: SlotDayResponse,
    slotTime?: SlotTime,
    isLoading: boolean,
}


class CartView extends React.Component<CartViewProps,CartViewState>{


    state: CartViewState = {
        totalItems: 0,
        showSlotView: false,
        slotDay: undefined,
        slotTime: undefined,
        isLoading: false,
    }


    cardImageStyle = {
        height: "auto",
        aspectRatio: "1/1",
        maxHeight: "128px",


    }

    cardBodyStyle = {
       padding: "16px",

    }

    quantityStyle = {
        width: "120px",
        marginTop: "16px",
        fontStyle: "extrabold",
        fontSize: "20px",

    }

   countTotalItems():number {
       const quantity = this.props.cart?.products.map((item) => {
            return item.quantity
        })

       return  (quantity !== undefined && quantity?.length > 0)  ?  quantity.reduce((a, b) => a + b) : 0
    }



    componentDidMount() {
        if (this.props.pantry === undefined) {
            this.props.navigator('/browse')
        }

        this.setState({
            totalItems: this.countTotalItems()
        })

    }


    componentDidUpdate(prevProps: Readonly<CartViewProps>, prevState: Readonly<CartViewState>, snapshot?: any) {
        if (this.props.pantry === undefined) {
            this.props.navigator('/browse')
        }

        if (prevProps.cart !== this.props.cart) {
            this.setState({
                totalItems: this.countTotalItems()
            })
        }
    }

    renderSlotTime = () => {
      return(  <>
            {
                this.state.slotDay !== undefined && this.state.slotTime !== undefined ?
                    <p>{this.state.slotDay.day} ({this.date(this.state.slotDay)}) {this.state.slotTime.start}
                        - {this.state.slotTime.end} <span>(<span onClick={()=>{
                            this.setState({...this.state,showSlotView:true})

                        }} id={"slot-change"} >Change</span>)</span> </p> : <></>
            }
        </>)
    }

    continueCallback = () => {
        this.setState({
            ...this.state,
            showSlotView: true,
        })
    }

    placeOrderCallback = () => {
        const data = JSON.stringify({
            "cartId": this.props.cart?.id,
            "pantryId": this.props.pantry?.id,
            "dayId": this.state.slotDay?.dayId,
            "timeId": this.state.slotTime?.id,
        })

        this.setState({...this.state, isLoading: true});
        axios.post<OrderResponse>(Endpoints.place_order(),data,{
            headers: {
                'Content-Type': 'application/json',
                'Allow-Control-Allow-Origin': '*'
            }
        }).then((response) => {
            appStore.dispatch(addOrder(response.data))
            appStore.dispatch(removeCart())
            this.props.navigator('/order',{
                replace: true,
                state: {
                    order: response.data
                }
            })

        }).finally(() => {
            this.setState({...this.state, isLoading: false});
        })


    }



    renderLoading = () => {
        return (
            <>
                <Modal  style={{background:"transparent"}} show={this.state.isLoading} centered>
                    <Modal.Body style={{background:"transparent"}} >
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border" role="status">
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </>
        )
    }


    renderSlotView = () => {
        return (
            <>

                {this.state.showSlotView ? <SlotView
                    onClose={() => {
                        this.setState(
                            {
                                ...this.state,
                                showSlotView: false,
                            }
                        )

                    }}

                    onSubmission={(slotDay , slotTime) => {
                        this.setState(  {
                            ...this.state,
                            showSlotView: false,
                            slotDay: slotDay,
                            slotTime: slotTime,
                        })
                    }}

                    pantryId={this.props.pantry?.id ?? 0}/> : <></>
                }
            </>
        )
    }



    render() {


        return (
            <>
            <Container id={"container"} >
                <Container id={"left-container"}>
                    {( this.props.cart?.products === undefined ||  this.props.cart?.products.length === 0) ? <>

                        <div className={"empty-cart"}>
                            <h1>Cart is Empty</h1>
                            <p>Looks like you haven't added anything to your cart yet.</p>
                            <Button onClick={()=>{
                                this.props.navigator('/browse')
                            }} variant={"primary"}>Continue Shopping</Button>
                        </div> </> : <> </>}
                    {
                        this.props.cart?.products.map((item) => {
                            return (
                                <>

                                <Container key={item.productId} className={"card-container card-container-horizontal"} >
                                    <Image  style={this.cardImageStyle} src={Endpoints.get_image(item.image)}/>
                                    <div style={this.cardBodyStyle}>
                                        <Card.Title>{item.name}</Card.Title>
                                        <div style={this.quantityStyle}>
                                            <CardQuantity
                                                quantity={item.quantity} pantryId={this.props.pantry?.id??0}
                                                productId={item.productId} cartId={this.props.cart?.id??0}
                                                onSuccess={()=>{}}/>
                                        </div>

                                    </div>
                                </Container>
                                </>
                            )
                        })
                    }
                </Container>
                <Container id={"right-container"}>
                    <Container className={"card-container order-details"} >
                       <h1 >Order Summary</h1>
                        <p>{this.props.pantry?.name}</p>
                        <p>{this.props.pantry?.address}</p>
                        <p>{this.props.pantry?.phone}</p>
                        <p>Total Items: {this.state.totalItems}  </p>
                        {this.renderSlotTime()  }

                        {
                            (this.state.totalItems > 0 && this.state.slotDay === undefined && this.state.slotTime === undefined )
                                ? <Button className={"reserve-button"} onClick={this.continueCallback} >Checkout</Button> : <></>
                        }
                        {
                            (this.state.totalItems > 0 && this.state.slotDay !== undefined && this.state.slotTime !== undefined) ?
                                <Button onClick={this.placeOrderCallback}
                                className={"reserve-button"}>Place Order</Button> : <></>

                        }
                    </Container>
                </Container>
                {this.renderSlotView()}
                {this.renderLoading()}

            </Container>
            </>
        )
    }

    date = (day:SlotDayResponse) => {
        const options : Intl.DateTimeFormatOptions = { month: 'numeric', day: 'numeric' };

        return  new Date(day.date).toLocaleDateString('en-us',options)
    }
}

export default connector(CartView)
