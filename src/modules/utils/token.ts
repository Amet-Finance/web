import {useSelector} from "react-redux";
import {RootState} from "@/store/redux/type";
import {FinancialAttributeExtended, FinancialAttributeInfo} from "@/modules/api/contract-type";

function useTokensByChain(chainId: number) {
    const tokens = useSelector((item: RootState) => item.token);
    return tokens[chainId] || {};
}

function useToken(chainId: number, contractAddress: string) {
    const tokensByChain = useTokensByChain(chainId)
    return tokensByChain[contractAddress] || {};
}

function useFinancialAttributeExtended(preToken: FinancialAttributeInfo): FinancialAttributeExtended {
    const token = useToken(preToken.chainId, preToken.contractAddress);

    return {
        ...preToken,
        ...token,
    }
}

export {useTokensByChain, useToken, useFinancialAttributeExtended}
