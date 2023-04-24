export interface SlotTime{
    id: number;
    start: string;
    end: string;
}

export interface SlotDayResponse {
    day: string;
    timings: SlotTime[];
    dayId: number;
    date: string;


}
