import {createWeb3Modal, defaultWagmiConfig} from '@web3modal/wagmi/react';
import {polygonMumbai, mainnet} from 'wagmi/chains';

const projectId = '777e05ce479a4c4b6e33deaed761ef5b'

const metadata = {
    name: 'Web3Modal',
    description: 'Web3Modal Example',
    url: 'https://web3modal.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, polygonMumbai]
const wagmiConfig = defaultWagmiConfig({chains, projectId, metadata})

// 3. Create modal
createWeb3Modal({
    wagmiConfig, projectId, chains,
    defaultChain: polygonMumbai,
    themeMode: "dark"
})

export  {
    wagmiConfig
}
