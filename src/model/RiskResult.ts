import { MarketEnvId } from './id/MarkenEnvId';
import { RiskRunId } from './id/RiskRunId';
import { TradePopulationId } from './id/TradePopulationId';
import { Risk } from './risks/Risk';

class RiskResult<R extends Risk> {
    public timeStamp: Date;
    public marketEnvId: MarketEnvId;
    public tradePopulationId: TradePopulationId;
    public riskRunId: RiskRunId;
    public fragmentCount: number;
    public fragmentNo: number;
    public risk: R;
    public isDeleteEvent: boolean; 
}

export { RiskResult };
