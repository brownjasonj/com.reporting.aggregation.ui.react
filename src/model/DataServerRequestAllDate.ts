import { DataServerRequest } from './DataServerRequest';
import { DataServerRequestType } from './DataServerRequestType';

class DataServerRequestAllData extends DataServerRequest {
    constructor() {
        super(DataServerRequestType.AllData);
    }
}

export { DataServerRequestAllData }