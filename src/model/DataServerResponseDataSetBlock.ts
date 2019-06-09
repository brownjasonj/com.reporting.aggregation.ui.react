import { DataServerResponse } from './DataServerResponse';
import { EServerResponseEventType } from './EServerResponseEventType';

class DataServerResponseDataSetBlock<T> extends DataServerResponse {
    public fistRow: number;
    public lastRow: number;
    public dataSet: T[];
    constructor() {
        super(EServerResponseEventType.DataSetBlock);
    }
}

export { DataServerResponseDataSetBlock}