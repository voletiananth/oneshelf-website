import {Modal,Spinner} from "react-bootstrap";
import '../Components/Components.css'
import React from "react";
import Endpoints from "../Endpoints";
import axios from "axios";
import {connect, ConnectedProps} from "react-redux";
import {appStore, addPantry} from '../AppStore'
import {Pantry} from "../models/Pantry";
import {AppState} from "../models/AppState";



type State = {
    selectedPantry: any,
    zipcode: number,
    pantryList: Pantry[],
    loading: boolean,
}


const mapStateToProps  = (state:AppState) => {
    return {
        pantryState: state.pantry
    }
}


const  connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector>

class PantryModal extends React.Component<Props,State> {
        axiosController = new AbortController();




        componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any) {
            if (prevProps.pantryState !== this.props.pantryState) {
                this.setState({selectedPantry: this.props.pantryState})
            }
        }


    state:State ={
            selectedPantry: this.props.pantryState,
        zipcode: -1,
        pantryList: [],
        loading: false,
    }

    searchPantry = async (val: number) => {
        this.setState({loading: true})

        await axios.get<Pantry[]>(Endpoints.get_pantries,{
            signal: this.axiosController.signal,
            params: {
                zipcode: val
            },
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }).then((res) => {
            this.setState({pantryList: res.data})
            console.log(res.data)
        }
        ).catch((err) => {
            console.log(err)
        }
        )
    }


   onChange = (e:any) => {
        this.setState({zipcode: e.target.value})
       if (e.target.value.length === 5) {
           this.searchPantry(e.target.value).then(() => {
               this.setState({loading: false});
           })
       }
   }






    render() {


        return (
            <div>
                <Modal key={this.state.selectedPantry} show={this.state.selectedPantry === undefined} centered={true} className="modal fade">
                    <Modal.Body>
                        <div>
                            <input className="w-100"
                                   size={5}
                                   maxLength={5}
                                   max={99999}
                                   min={10000}
                                   id={"zipcode"}
                                   name={"zipcode"}
                                   type="number"
                                   value={this.state.zipcode === -1 ? "" : this.state.zipcode}
                                   placeholder="Enter ZipCode"
                                      onChange={this.onChange}
                            />
                            <div className={"pantry-list-container"}>
                                {this.state.loading ? <Spinner/> : null}
                                {this.state.pantryList.map((pantry: any) => {
                                    return (
                                        <div key={pantry.id} className={"pantry-list-item"} onClick={
                                            () => {
                                                appStore.dispatch(addPantry(pantry))

                                            }
                                        }>
                                            <div className={"pantry-list-item-name"}>{pantry.name}</div>
                                            <div className={"pantry-list-item-address"}>{pantry.address}</div>
                                            <div className={"pantry-list-item-phone"}>{pantry.phone}</div>
                                        </div>
                                    )
                                })
                                }
                            </div>

                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        )

    }
}


export default connector(PantryModal)
