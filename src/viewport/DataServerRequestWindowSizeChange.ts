import { DataServerRequest } from './DataServerRequest';
import { DataServerRequestType } from './DataServerRequestType';

class DataServerRequestWindowSizeChange extends DataServerRequest {
    public requestType: DataServerRequestType;
    public firstRow: number;
    public lastRow: number;

    constructor(firstRow:number, lastRow:number) {
        super(DataServerRequestType.WindowChangeSize);
        this.firstRow = firstRow;
        this.lastRow = lastRow;
    }
}

export { DataServerRequestWindowSizeChange };