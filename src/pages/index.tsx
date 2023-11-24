import Home from "@/components/pages/main";
import {useEffect} from "react";
import {getTokenBalance} from "@/modules/web3/tokens";
import {bsc} from "wagmi/chains";

export default function HomePage() {
    return <Home/>
}
