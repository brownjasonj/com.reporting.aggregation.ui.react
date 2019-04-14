import { DataServerResponse } from './DataServerResponse';
import { EServerResponseEventType } from './EServerResponseEventType';

class DataServerResponseDataSetSize extends DataServerResponse {
    public rowCount: number;

    constructor(rowCount: number) {
        super(EServerResponseEventType.DataSetSize);
        this.rowCount = rowCount;
    }
}

export { DataServerResponseDataSetSize }