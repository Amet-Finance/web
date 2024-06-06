import {createWeb3Modal, defaultWagmiConfig} from '@web3modal/wagmi/react';
import {SupportedChains, defaultChain} from "./constants"

const projectId = '777e05ce479a4c4b6e33deaed761ef5b'

const metadata = {
    name: 'Amet Finance',
    description: 'Easily issue on-chain bonds with Amet Finance. Customize your bond and join the world of decentralized finance.',
    url: 'https://amet.finance',
    icons: ['https://amet.finance/meta/amet-logo-black.jpg']
}

const wagmiConfig = defaultWagmiConfig({
    chains: SupportedChains,
    projectId,
    metadata
})

// 3. Create modal
createWeb3Modal({
    wagmiConfig, projectId,
    chains: SupportedChains,
    defaultChain,
    themeMode: "dark"
})


export {wagmiConfig}
