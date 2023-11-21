import {createWeb3Modal, defaultWagmiConfig} from '@web3modal/wagmi/react';
import {polygonMumbai, mainnet, polygon, bsc, bscTestnet, arbitrum, manta, polygonZkEvm} from 'wagmi/chains';

const projectId = '777e05ce479a4c4b6e33deaed761ef5b'

const metadata = {
    name: 'Amet Finance',
    description: 'Easily issue on-chain bonds with Amet Finance. Customize your bond and join the world of decentralized finance.',
    url: 'https://amet.finance',
    icons: ['https://amet.finance/meta/amet-logo-black.jpg']
}

const CHAINS = [manta, polygon, polygonZkEvm]
const defaultChain = manta;
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
    themeMode: "dark",
    // chainImages: {
    //     [mainnet.id]: `https://amet.finance/svg/chains/0x${mainnet.id.toString(16)}.svg`,
    //     [polygonMumbai.id]: `https://amet.finance/svg/chains/0x${polygonMumbai.id.toString(16)}.svg`
    // }
})

function getChainIcon(chainId: string | number | undefined) {
    return `/svg/chains/${chainId}.svg`;
}

function getChain(chainId: string | number) {
    return CHAINS.find(item => item.id === Number(chainId))
}

export {
    wagmiConfig,
    CHAINS,
    defaultChain,
    getChainIcon,
    getChain
}
