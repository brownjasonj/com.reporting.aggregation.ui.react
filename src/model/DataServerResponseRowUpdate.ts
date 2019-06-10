import { DataServerResponse } from './DataServerResponse';
import { EServerResponseEventType } from './EServerResponseEventType';

class DataServerResponseRowUpdate<T> extends DataServerResponse {
    public row: T;
    constructor() {
        super(EServerResponseEventType.RowUpdate);
    }
}

export { DataServerResponseRowUpdate}