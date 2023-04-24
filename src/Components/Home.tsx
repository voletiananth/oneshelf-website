import React, { Component } from 'react'
import {Image} from "react-bootstrap";

export default class Home extends Component {
    render() {
        return (
            <div style={{height:"100%"}} >
                <Image src={"banner.avif"} style={{width:"100%",aspectRatio:'16/9'}}>

                </Image>
            </div>
        )
    }
}
