import { ItemConsumptionMethod } from "../../../../contracts/enum/meta-domain/item/item-consumption-method"; 
import { CustomSelect } from "../../../common/CustomSelect/CustomSelect";

interface Props {
    costConfig: {
        method: ItemConsumptionMethod;
    };
    onChange: (field: string, value: any) => void;
}

export function ItemCostConfig({
    costConfig,
    onChange
}: Props) {
    const labelClass = "block text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1.5";

    return (
        <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-sky-900 tracking-tight">
                Cost & Consumption Settings
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>
                        Consumption Method
                    </label>
                    <CustomSelect
                        value={
                            costConfig?.method 
                            ?? ItemConsumptionMethod.None
                        }
                        onChange={(val) =>
                            onChange("method", val)
                        }
                        options={Object.values(ItemConsumptionMethod)}
                        placeholder="Select Consumption Method"
                    />
                </div>
            </div>
        </div>
    );
}