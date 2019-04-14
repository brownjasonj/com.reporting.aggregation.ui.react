import { DataServerResponse } from './DataServerResponse';
import { EServerResponseEventType } from './EServerResponseEventType';

class DataServerResponseDataSet<T> extends DataServerResponse {
    public dataSet: T[];
    constructor() {
        super(EServerResponseEventType.DataSet);
    }
}

export { DataServerResponseDataSet}