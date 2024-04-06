import {useSelector} from "react-redux";
import {RootState} from "@/store/redux/type";
import {FinancialAttributeExtended, FinancialAttributeInfo} from "@/modules/api/contract-type";

function useToken(chainId: number, contractAddress: string) {
    const tokens = useSelector((item: RootState) => item.token);
    const tokensByChain = tokens[chainId] || {};
    return tokensByChain[contractAddress] || {};
}

function useFinancialAttributeExtended(preToken: FinancialAttributeInfo): FinancialAttributeExtended {
    const token = useToken(preToken.chainId, preToken.contractAddress);

    return {
        ...preToken,
        ...token,
    }
}

export {useToken, useFinancialAttributeExtended}
