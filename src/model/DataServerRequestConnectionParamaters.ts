import { DataServerRequest } from './DataServerRequest';
import { DataServerRequestType } from './DataServerRequestType';

class DataServerRequestConnectionParameters extends DataServerRequest {
    private pricingGroupName: string;
    private marketIdName: string;

    constructor(pricingGroupName: string, marketIdName: string) {
        super(DataServerRequestType.ConnectionParameters);
        this.pricingGroupName = pricingGroupName;
        this.marketIdName = marketIdName;
    }

    public getPricingGroupName() : string {
        return this.pricingGroupName;
    }

    public getMarketIdName() : string {
        return this.marketIdName;
    }
}

export { DataServerRequestConnectionParameters }