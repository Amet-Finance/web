import {arbitrum, base} from "wagmi/chains";

const SupportedChains = [base, arbitrum]
const defaultChain = SupportedChains[0];

export {
    SupportedChains,
    defaultChain
}
