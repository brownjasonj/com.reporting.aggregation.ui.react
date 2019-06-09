import { EServerResponseEventType } from "./EServerResponseEventType";

class DataServerResponse {
    public dataResponseType: EServerResponseEventType;

    constructor(dataResponseType: EServerResponseEventType) {
        this.dataResponseType = dataResponseType;
    }
}

export { DataServerResponse };
