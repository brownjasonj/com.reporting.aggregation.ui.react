import { MarketEnvId } from '../id/MarkenEnvId';
import { Tcn } from '../id/Tcn';
import { RiskKind } from './RiskKind';
import { RiskType } from './RiskType';

class Risk {
    public marketEnvId: MarketEnvId;
    public bookName: string;
    public tcn: Tcn;
    public riskType: RiskType;
    public riskKind: RiskKind;
}

export { Risk };
