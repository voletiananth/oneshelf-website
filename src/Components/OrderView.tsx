import React from "react";
import {OrderResponse} from "../dto/OrderResponse";
import {Button, Card, Container, Image} from "react-bootstrap";
import Endpoints from "../Endpoints";
import {SlotDayResponse} from "../dto/SlotDayResponse";


interface OrderViewProps {
    order:OrderResponse
}


export class OrderView extends React.Component<OrderViewProps>{
    cardImageStyle = {
        height: "auto",
        aspectRatio: "1/1",
        maxHeight: "128px",


    }

    cardBodyStyle = {
        padding: "16px",

    }

    orderDetailsStyle = {
        textAlign: "center" as "center",
    }

    spanStyle = {
        color: "#A50000",
        fontWeight: "bold" as "bold",
    }


    render() {
        return(
            <>
                <Container id={"container"} >
                    <Container id={"left-container"}>

                        {
                            this.props.order.products.map((item) => {
                                return (
                                    <>

                                        <Container key={item.productId} className={"card-container card-container-horizontal"} >
                                            <Image  style={this.cardImageStyle} src={Endpoints.get_image(item.image)}/>
                                            <div style={this.cardBodyStyle}>
                                                <Card.Title>{item.name}</Card.Title>
                                                <p>Quantity: {item.quantity} </p>
                                            </div>
                                        </Container>
                                    </>
                                )
                            })
                        }
                    </Container>
                    <Container id={"right-container"}>

                       <Container style={this.orderDetailsStyle} className={"card-container"} >
                            <h4>Order Details</h4>
                          <Container className={"card-container"}>
                              <h1 style={{color:"#A50000"}}>{this.props.order.id}</h1>
                              <p style={{textDecoration:"underline"}}>Order No:</p>
                              <p>Pickup Date: <span style={this.spanStyle}> {this.date(this.props.order.orderDate)}</span></p>
                                <p>Pickup Time: <span style={this.spanStyle}>{this.props.order.slotTime.start} - {this.props.order.slotTime.end}</span></p>
                              <p>Order Ref: <span style={this.spanStyle}>{this.props.order.orderNo}</span></p>

                          </Container>

                           <h5 style={{marginTop:"16px"}}>Store Details</h5>
                           <p>{this.props.order.pantry.name},</p>
                            <p>{this.props.order.pantry.address},</p>
                           <p>{this.props.order.pantry.phone}.</p>

                       </Container>
                    </Container>

                </Container>
            </>
        )
    }

    date = (day:string) => {
        const options : Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', year: 'numeric',weekday:'short' };

        return  new Date(day).toLocaleDateString('en-us',options)
    }
}
