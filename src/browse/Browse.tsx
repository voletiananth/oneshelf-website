import React from 'react'

import {connect, ConnectedProps} from "react-redux";
import axios from "axios";
import Endpoints from "../Endpoints";
import {Category} from "../models/Category";
import {Spinner, Container, Card} from "react-bootstrap";
import {AppState} from "../models/AppState";
import {addCategories, appStore} from "../AppStore";

import {Pantry} from "../models/Pantry";
import {NavigateFunction} from "react-router";
import '../css/Components.css'

function mapStateToProps(state:AppState)
{


    return {
        pantryState: state.pantry,
        categories: state.categories,

    }
}

type State = {
    isLoading: boolean
}



const connector = connect(mapStateToProps)




interface BrowseProps extends ConnectedProps<typeof connector>{
    pantryState: Pantry | undefined,
    categories: Category[],
    navigator: NavigateFunction
}

class Browse extends React.Component<BrowseProps,State> {
    abortController = new AbortController();
    state:State = {
        isLoading: false
    }


    componentDidUpdate(prevProps: Readonly<BrowseProps>, prevState: Readonly<State>, snapshot?: any) {
        if (prevProps.pantryState !== this.props.pantryState &&
            this.props.pantryState !== undefined  && this.props.categories.length === 0 ) {
            this.setState({isLoading: true})
            this.getCategory(this.props.pantryState.id)
            console.log("updated")
        }
    }

    componentDidMount() {
        console.log(this.props.categories)
        if ( this.props.pantryState !== undefined && this.props.categories.length === 0) {
            this.setState({isLoading: true})
            this.getCategory(this.props.pantryState.id)
            console.log("mounted")
        }
    }

    componentWillUnmount() {
        this.abortController.abort()
    }


    getCategory = async (pantryId:number) => {


        this.setState({isLoading: true})
        await axios.get<Category[]>(Endpoints.get_categories(pantryId), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            signal: this.abortController.signal
        }).then((res) => {
            appStore.dispatch(addCategories(res.data))
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            this.setState({isLoading: false})
        })
    }


    imageStyle = {

        aspectRatio: "16/9",

    }



    renderCard = (card:Category,index:number) => {

        return (
            <Card className={'grid-item'} onClick={()=>{
                this.props.navigator('/'+this.props.pantryState?.name+'/products', {state: {category: card}})
            }}  style={{width:'auto',height:'auto'}} key={index}>
                <Card.Img style={this.imageStyle}   variant={"top"} src={Endpoints.get_image(card.thumbnail)} >
                </Card.Img >
                <Card.Body style={{textAlign:'center'}}>
                    <Card.Title>{card.name}</Card.Title>
                </Card.Body>
            </Card>
        )
    }





    render() {
        return (
            <Container style={{margin:'2rem',textAlign:'center',width:'auto'}}>

                {this.state.isLoading ? <div className={"loading-container"}  > <Spinner className={"align-items-center"} /> </div> : null}
                <Container className={"grid-container"}>
                    {this.props.categories.map((card,index) => this.renderCard(card,index))}
                </Container>
            </Container>

        )
    }
}


export default connector(Browse)
