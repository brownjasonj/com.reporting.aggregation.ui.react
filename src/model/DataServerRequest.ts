import { DataServerRequestType } from './DataServerRequestType';

class DataServerRequest {
    public requestType: DataServerRequestType;

    protected constructor(requestType: DataServerRequestType) {
        this.requestType = requestType;
    }
}

export { DataServerRequest };