import {createWeb3Modal, defaultWagmiConfig} from '@web3modal/wagmi/react';
import {bsc, manta, optimism, polygon, polygonMumbai, polygonZkEvm, zetachainAthensTestnet} from 'wagmi/chains';
import {Chain} from "wagmi";

const projectId = '777e05ce479a4c4b6e33deaed761ef5b'

const metadata = {
    name: 'Amet Finance',
    description: 'Easily issue on-chain bonds with Amet Finance. Customize your bond and join the world of decentralized finance.',
    url: 'https://amet.finance',
    icons: ['https://amet.finance/meta/amet-logo-black.jpg']
}

const CHAINS = [polygonMumbai, manta, polygon, optimism, polygonZkEvm, zetachainAthensTestnet, bsc]
const defaultChain = CHAINS[0];
const wagmiConfig = defaultWagmiConfig({
    chains: CHAINS,
    projectId,
    metadata
})

// 3. Create modal
createWeb3Modal({
    wagmiConfig, projectId,
    chains: CHAINS,
    defaultChain,
    themeMode: "dark"
})

function getChainIcon(chainId: string | number | undefined) {
    return `/svg/chains/${chainId}.svg`;
}

function getChain(chainId: string | number| undefined): Chain|undefined {
    return CHAINS.find(item => item.id === Number(chainId))
}

export {
    wagmiConfig,
    CHAINS,
    defaultChain,
    getChainIcon,
    getChain
}
