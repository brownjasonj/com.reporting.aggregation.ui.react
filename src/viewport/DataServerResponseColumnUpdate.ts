import { DataServerResponse } from './DataServerResponse';
import { EServerResponseEventType } from './EServerResponseEventType';

class DataServerResponseColumnUpdate extends DataServerResponse {
    public rowIndex: number;
    public columnName: string;
    public value: any;

    constructor(rowIndex: number, columnName: string, value: any) {
        super(EServerResponseEventType.ColumnUpdate);
        this.rowIndex = rowIndex;
        this.columnName = columnName;
        this.value = value;
    }
}

export { DataServerResponseColumnUpdate }