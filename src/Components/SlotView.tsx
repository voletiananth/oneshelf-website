import React from "react";
import {Button, Container, Modal, Spinner} from "react-bootstrap";
import '../css/SlotView.css'
import axios from "axios";
import Endpoints from "../Endpoints";
import {SlotDayResponse, SlotTime} from "../dto/SlotDayResponse";

interface SlotViewProps {

    onClose: () => void;
    pantryId: number;
    onSubmission: (slotDay?:SlotDayResponse,slotTime?:SlotTime) => void;


}

interface SlotViewState {
    isLoading: boolean;
    slots: SlotDayResponse[];
    selectedSlotDay?: SlotDayResponse;
    selectedSlotTime?: SlotTime;
}


export class SlotView extends React.Component<SlotViewProps,SlotViewState>{
    state:SlotViewState = {
        isLoading: false,
        slots:[]
    }

    getDefaultSlotDay(SlotDayResponse:SlotDayResponse[]) : SlotDayResponse | undefined{
        for (let i = 0; i < SlotDayResponse.length; i++) {
            if (SlotDayResponse[i].timings.length !== 0) {
                return SlotDayResponse[i]
            }
        }

        return undefined
    }


    fetchSlots() {
            this.setState({...this.state, isLoading: true})
            axios.get<SlotDayResponse[]>(Endpoints.get_slots(this.props.pantryId)).then((response) => {
                this.setState({...this.state,slots: response.data,selectedSlotDay: this.getDefaultSlotDay(response.data)})
            }).finally(() => {
                this.setState({...this.state, isLoading: false})
            })

    }

    componentDidMount() {
        this.fetchSlots()
    }






    spinnerStyle = {
        top: "50%",
        left: "50%",
        position: "absolute" as "absolute",
    }


    render() {
        console.log(this.state.selectedSlotTime  )
        console.log(this.state.selectedSlotDay  )
        return (
            <Modal id={"slots"}  show={true}>
                <Modal.Header> <h5>Reserve a time</h5> <Button onClick={this.props.onClose}>x</Button></Modal.Header>
                <Modal.Body>
                    {this.state.isLoading ? <Spinner style={this.spinnerStyle} /> : null}
                    <Container className={"slot-day-container"}>
                        {this.state.slots.map((slot) => {
                            return (
                                this.renderSlotDay(slot)
                            )
                        }
                        )}
                    </Container>
                    <h6 style={{marginTop:"16px"}}>Choose a time</h6>
                    <Container className={"slot-time-container"}>
                        {
                            this.state.selectedSlotDay?.timings.map((time)=>{
                                return (
                                    <div  onClick={() => this.setState({...this.state,selectedSlotTime: time})} className={"slot-time card-container"}>
                                        <input type={"radio"}
                                               key={time.id}
                                               value={time.start + " - " + time.end}
                                               name={"slot-time"}
                                               checked={this.state.selectedSlotTime?.id === time.id}
                                               onChange={() => {}}
                                               />
                                        <label>{time.start + " - " + time.end}</label>
                                    </div>
                                )
                            })
                        }
                    </Container>
                    <Button className={"reserve-button"}
                            disabled={this.state.selectedSlotTime === undefined || this.state.selectedSlotDay === undefined}
                            onClick={() => this.props.onSubmission(this.state.selectedSlotDay,this.state.selectedSlotTime)}>Reserve</Button>
                </Modal.Body>
            </Modal>
        )
    }




    // RoundedView with a date
    renderSlotDay(day:SlotDayResponse) {
        const options : Intl.DateTimeFormatOptions = { month: 'numeric', day: 'numeric' };

        const _date = new Date(day.date).toLocaleDateString('en-us',options)

        return this.slotDay(day,_date)
    }


    slotDay = (day:SlotDayResponse,date:string) => {
        if (this.state.selectedSlotDay?.dayId === day.dayId) {
            return  (
                <div className={"slot-day-selected slot-day"}>
                    <div className={"slot-day-date"}>{date}</div>
                </div>
            )
        }
        else if (day.timings.length === 0) {
            return (
                <div className={"slot-day-disabled slot-day"}>
                    <div className={"slot-day-date"}>{date}</div>
                </div>
            )
        }
        else {
            return (
                <div className={"slot-day-default slot-day"} onClick={() => this.setState({...this.state,selectedSlotDay: day,selectedSlotTime:undefined})}>
                    <div className={"slot-day-date"}>{date}</div>
                </div>
            )
        }
    }
}
