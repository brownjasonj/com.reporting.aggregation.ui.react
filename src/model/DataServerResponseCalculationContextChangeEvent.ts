import { CalculationContext } from './CalculationContext';
import { DataServerResponse } from './DataServerResponse';


class DataServerResponseCalculationContextChangeEvent extends DataServerResponse { 
    public calculationContext: CalculationContext;
}

export { DataServerResponseCalculationContextChangeEvent };
