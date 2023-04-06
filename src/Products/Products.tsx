import React from "react";
import {Container, Col, Row, ListGroup, Card, Spinner} from "react-bootstrap";
import {AppState} from "../models/AppState";
import {connect, ConnectedProps} from "react-redux";
import {NavigateFunction,Location} from "react-router";
import {Category} from "../models/Category";
import {Pantry} from "../models/Pantry";
import axios from "axios";
import Endpoints from "../Endpoints";
import {Product} from "../models/Product";


function mapStateToProps(state:AppState)
{
    return {
        categories: state.categories,
        pantry: state.pantry
    }
}


interface ProductsState {
    isLoading: boolean
    products: Product[],
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




    componentDidMount() {
        if (this.props.categories.length === 0 || this.props.pantry === undefined || this.props.selected === null){
            console.log("redirect")
            this.props.navigator("/")
        }
        if (this.props.selected !== null && this.props.pantry !== undefined){
            this.fetchProducts(this.props.selected as Category,this.props.pantry)
        }


    }
    componentDidUpdate(prevProps: Readonly<ProductsProps>, prevState: Readonly<ProductsState>, snapshot?: any) {
        if (this.props.categories.length === 0 || this.props.pantry === undefined || this.props.selected === null ){
            this.props.navigator("/")
        }
        if (this.props.selected !== null && this.props.pantry !== undefined && this.state.selected !== prevState.selected ){
            this.fetchProducts(this.props.selected as Category,this.props.pantry )
        }
    }

    componentWillUnmount() {
        this.abortController.abort();
    }


     fetchProducts = async (category: Category,pantry:Pantry) => {
        const json = JSON.stringify({
            pantryId: pantry.id,
            categoryId: category.id
        })
        this.setState({isLoading: true})

        await axios.post<Product[]>(Endpoints.get_pantry_products(),json, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            signal: this.abortController.signal


        }).then((response) => {
            this.setState({products: response.data})

        })
        .catch(
            (error) => {
                console.log(error)
            }
        ).finally(() => {
            this.setState({isLoading: false})
        }
        )
    }


     render() {
        return (
           <Container style={{margin : "16px 0"}}>
               <Row >
             <Col sm={3} >
                 <ListGroup>
                        {this.props.categories.map((category) => {
                            return (
                                <ListGroup.Item key={category.id}>
                                    <Card onClick={
                                        () => {
                                            this.setState({selected: category,products: []})
                                        }
                                    }>
                                        <Card.Body>
                                            <Card.Text>{category.name}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </ListGroup.Item>
                            )}
                        )}
                 </ListGroup>
             </Col >
               <Col sm={"auto"} >
                   <Container>
                       {this.state.isLoading ? <div className={"loading-container"}  > <Spinner className={"align-items-center"} /> </div> : null}
                       {
                            this.state.products.map((product,index) => {
                                return this.renderProduct(product,index)
                            })
                       }




                   </Container>
               </Col>
                </Row>
           </Container>
        )
    }


     renderProduct = (product:Product, index:number) => {

         return (
             <Card   style={{width:'12rem'}} key={index}>
                 <Card.Img style={{padding:'16px'}}   variant={"top"} src={Endpoints.get_category_image(product.thumbnail)} >

                 </Card.Img >
                 <Card.Body style={{textAlign:'center'}}>
                     <Card.Title>{product.name}</Card.Title>
                 </Card.Body>
             </Card>
         )
     }
 }


export default connector(ProductsView)
