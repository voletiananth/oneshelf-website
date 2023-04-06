import React from "react";
import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import {PaletteTree} from "./palette";
import NavBarComp from "../Components/NavBarComp";
import Browse from "../browse/Browse";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/NavBarComp">
                <NavBarComp/>
            </ComponentPreview>

        </Previews>
    );
};

export default ComponentPreviews;
