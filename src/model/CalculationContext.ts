import { CalculationContextId } from './id/CalculationContextId';
import { MarketEnvId } from './id/MarkenEnvId';
import { PricingGroup } from './PricingGroup';
import { RiskType } from './risks/RiskType';

class CalculationContext {
    public pricingGroup: PricingGroup;
    public calculationContextId: CalculationContextId;
    public timeStamp: Date;
    public markets: Map<RiskType, MarketEnvId> ;
}

export { CalculationContext };
