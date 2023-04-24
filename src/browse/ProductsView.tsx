import React from "react";
import {Container, Col, Row, ListGroup, Card, Spinner, Button, Image} from "react-bootstrap";
import {AppState} from "../models/AppState";
import {connect, ConnectedProps} from "react-redux";
import {NavigateFunction} from "react-router";
import {Category} from "../models/Category";
import {Pantry} from "../models/Pantry";
import axios, {AxiosResponse} from "axios";
import Endpoints from "../Endpoints";
import {ProductAndQuantity} from "../models/Product";

import '../css/Components.css'
import '../css/ProductsView.css'

import {appStore, fetchCart} from "../AppStore";
import {AddCartResponse} from "../dto/AddCartResponse";
import {CardQuantity} from "../Components/CardQuantity";



function mapStateToProps(state:AppState)
{
    return {
        categories: state.categories,
        pantry: state.pantry,
        cart: state.cart,
    }
}


interface ProductsState {
    isLoading: boolean
    products: ProductAndQuantity[],
    selected?: Category
}


const connector = connect(mapStateToProps)


interface ProductsProps extends ConnectedProps<typeof connector>{
    navigator: NavigateFunction,
    selected?: Category | undefined | null,
}


 class ProductsView extends React.Component<ProductsProps,ProductsState>{

    abortController = new AbortController();

    state: ProductsState = {
        isLoading: false,
        products: [],
        selected: undefined
    }

    gridStyle = {
        gridTemplateColumns: "repeat(3, 2fr)",
    }

    imageStyle = {

        aspectRatio: "1/1",

    }




    componentDidMount() {
        if (this.props.categories.length === 0 || this.props.pantry === undefined || this.props.selected === null){
            console.log("redirect")
            this.props.navigator("/")
        }
        this.setState({selected: this.props.selected as Category})

    }
    componentDidUpdate(prevProps: Readonly<ProductsProps>, prevState: Readonly<ProductsState>, snapshot?: any) {



        if (this.props.categories.length === 0 || this.props.pantry === undefined || this.props.selected === null ){
            this.props.navigator("/")
        }
        if (this.state.selected !== prevState.selected && this.props.pantry !== undefined ){
            this.fetchProducts(this.state.selected as Category,this.props.pantry )

        }
    }

    componentWillUnmount() {
        this.abortController.abort();
    }



    addProductToCart = async (product: ProductAndQuantity,) => {

        const json = JSON.stringify({
            pantryId: this.props.pantry?.id,
            productId: product.product.id,
            quantity: product.cart_quantity+1
        });
        return await axios.post<AddCartResponse>(Endpoints.add_product_to_cart(),json, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            params: {
                cartId: this.props.cart?.id
            }
        })
    }




     fetchProducts = async (category: Category, pantry: Pantry) => {
        const json = JSON.stringify({
            pantryId: pantry.id,
            categoryId: category.id,
            cartId: this.props.cart?.id
        })
        this.setState({isLoading: true})

        await axios.post<ProductAndQuantity[]>(Endpoints.get_pantry_products(),json, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            signal: this.abortController.signal


        }).then((response) => {
            this.setState({...this.state,products: response.data})

        })
        .catch(
            (error) => {
                console.log(error)
            }
        ).finally(() => {
            this.setState({...this.state,isLoading: false})
        }
        )
    }



    categoryStyle = {
        background: "white",
        color: "black",
    }

    categorySelectedStyle = {
        background: "#A50000",
        color: "white",
    }






     render() {
        return (
           <Container id={"products-view-container"} >
                <Container id={"categories-container"} >
                 <ListGroup>
                        {this.props.categories.map((category) => {

                            return (
                                <ListGroup.Item key={category.id}>
                                    <Card style={this.state.selected?.id === category.id?this.categorySelectedStyle:this.categoryStyle} onClick={
                                        () => {
                                           if (this.state.selected !== category){
                                                  this.setState({...this.state,selected: category, products: []})
                                           }
                                        }
                                    }>
                                        <Card.Body>
                                            <Card.Text >{category.name}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </ListGroup.Item>
                            )}
                        )}
                 </ListGroup>
                </Container>
                <Container id={"products-container"}>
                   <Container className={'grid-container'} style={this.gridStyle} >
                       {this.state.isLoading ? <div className={"loading-container"}  > <Spinner className={"align-items-center"} /> </div> : null}
                       {
                            this.state.products.map((product,index) => {
                                return this.renderProduct(product,index)
                            })
                       }

                   </Container>
                </Container>
           </Container>

        )
    }

    addButtonCallback = (product:ProductAndQuantity,index:number) => {
        this.addProductToCart(product).then((response) => {
            this.cartStateResponse(response,product,index)

        })


    }

    cartStateResponse = (response:AxiosResponse<AddCartResponse>,product:ProductAndQuantity,index:number,) => {
       const data = response.data
        console.log(data)

        appStore.dispatch(fetchCart({
            pantryId: this.props.pantry?.id as number,
            cartId: data.id
        }))
        this.setState({
            ...this.state,
            products: [...this.state.products.slice(0,index),{...product,cart_quantity: data.product.quantity},...this.state.products.slice(index+1)]
        })
    }



    updateProductQuantityCallback = (quantity:number,index:number) => {
        this.setState({
            ...this.state,
            products: [...this.state.products.slice(0,index),{...this.state.products[index],cart_quantity: quantity},...this.state.products.slice(index+1)]
        })
    }






     renderProduct = (product:ProductAndQuantity, index:number) => {
         return (
             <Card className={'grid-item'}  style={{width:'auto'}} key={index}>
                 <Card.Img style={this.imageStyle}   variant={"top"} src={Endpoints.get_image(product.product.thumbnail)} >

                 </Card.Img >
                 <Card.Body style={{textAlign:'center'}}>
                     <Card.Title>{product.product.name}</Card.Title>
                     {
                        product.cart_quantity>0 ?
                            <CardQuantity pantryId={this.props.pantry?.id??0}
                                          productId={product.product.id}
                                          cartId={this.props.cart?.id??0}
                                          quantity={product.cart_quantity}
                                          onSuccess={(data)=>this.updateProductQuantityCallback(data.product.quantity,index)}  />:
                            <Button onClick={() => this.addButtonCallback(product,index)
                        }>Add to cart</Button>
                     }
                 </Card.Body>
             </Card>
         )
     }

     quantityStyle = {
         display:'flex',justifyContent:'space-evenly',alignItems:'center',

     }

     quantityChangeStyle = {
         width:'32px',height:'32px',border:'none',outline:'none',background:'black',color:'white',borderRadius:'50%',
            display:'flex',justifyContent:'center',alignItems:'center'
     }


 }


export default connector(ProductsView)
