import AmetLogo from "../../../public/svg/amet-logo";
import {useEffect, useRef, useState} from "react";
import {useAccount, useNetwork} from "wagmi";
import {shorten} from "@/modules/web3/util";
import {getChain, getChainIcon} from "@/modules/utils/wallet-connect";
import Image from "next/image";
import {AccountInfo, LinkBase, LinkExtended} from "@/components/navbar/types";
import {useWeb3Modal} from "@web3modal/wagmi/react";
import makeBlockie from "ethereum-blockies-base64";
import {zeroAddress} from "viem";
import {NAV_LINKS} from "@/components/navbar/constants";
import Link from "next/link";
import {BasicButton} from "@/components/utils/buttons";
import BurgerSVG from "../../../public/svg/burger";
import XmarkSVG from "../../../public/svg/xmark";
import TopAnnouncement from "@/components/announcements/top-announcement";


export default function Navbar() {

    return <>
        <nav className="fixed flex flex-col w-full bg-black z-50">
            <TopAnnouncement/>
            <div className='flex justify-between items-center z-20 w-full py-4 xl1:px-52 lg:px-24 md:px-12 sm:px-8'>
                <AmetLogo/>
                <DesktopNavbar/>
                <MobileNavbar/>
            </div>
        </nav>
    </>
}

function DesktopNavbar() {
    return <>
        <div className='md:flex sm:hidden items-center gap-16'>
            <Links/>
            <WalletComponent/>
        </div>
    </>
}

function MobileNavbar() {
    const [isOpen, setOpen] = useState(false);
    const openOrClose = () => setOpen(!isOpen)
    const boxRef = useRef<any>()

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (boxRef.current && boxRef.current.contains(event.target)) setOpen(false)
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside)
    }, [boxRef]);

    return <>
        <div className='md:hidden sm:flex w-full justify-end'>
            {isOpen ? <XmarkSVG onClick={openOrClose}/> : <BurgerSVG onClick={openOrClose}/>}
            {
                isOpen && <>
                    <div className='fixed w-full bg-black top-0 left-0 flex flex-col justify-between px-6 h-full py-24'
                         ref={boxRef}>
                        <div>
                            {
                                NAV_LINKS.map((linkExtended, index) => <LinkBuilderMobile linkExtended={linkExtended}
                                                                                          key={index}/>)
                            }
                        </div>
                        <div className='flex justify-center items-center w-full'>
                            <WalletComponent/>
                        </div>
                    </div>
                </>
            }
        </div>
    </>
}

function Links() {
    return <>
        <div className='flex items-center gap-7'>
            {NAV_LINKS.map((linkExtended, index) => <LinkBuilder linkExtended={linkExtended} key={index}/>)}
        </div>
    </>
}

function LinkBuilder({linkExtended}: { linkExtended: LinkExtended}) {
    return <>
        <div className='group relative'>
            <LinkBase linkBase={linkExtended} isExtended={true}/>
            {
                linkExtended.subLinks?.length && <>
                    <div
                        className={'group-hover:flex hidden flex-col gap-4 justify-center  absolute left-0 top-full py-4 border-b-2 border-neutral-800 bg-black'}>
                        {linkExtended.subLinks.map((linkBase, index) => <LinkBase linkBase={linkBase} key={index}
                                                                                  isExtended={false}/>)}
                    </div>
                </>
            }
        </div>
    </>
}

function LinkBuilderMobile({linkExtended}: { linkExtended: LinkExtended }) {
    return <>
        <div className='group relative'>
            <LinkBase linkBase={linkExtended} isExtended={true}/>
            {
                linkExtended.subLinks?.length && <>
                    <div
                        className='flex flex-col gap-4 justify-center py-4'>
                        {linkExtended.subLinks.map((linkBase, index) => <LinkBase linkBase={linkBase} key={index}
                                                                                  isExtended={false}/>)}
                    </div>
                </>
            }
        </div>
    </>
}

function LinkBase({linkBase, isExtended}: { linkBase: LinkBase, isExtended?: boolean }) {
    return <>
        <Link href={linkBase.href} target={linkBase.target || "_self"}>
            <span
                className={`text-neutral-400 hover:text-white  whitespace-nowrap ${!isExtended && " px-4"}`}>{linkBase.title}</span>
        </Link>
    </>
}

function WalletComponent() {

    const [accountInfo, setAccountInfo] = useState({} as AccountInfo)

    const web3Modal = useWeb3Modal();
    const account = useAccount();
    const network = useNetwork();

    useEffect(() => {
        if (account.isConnected) {
            setAccountInfo({
                address: `${account.address}`,
                chainId: Number(network.chain?.id),
                isConnected: true
            })
        } else {
            setAccountInfo({
                address: "",
                chainId: 0,
                isConnected: false
            })
        }
    }, [account.address, account.isConnected, network.chain?.id])


    return <>
        <div onClick={() => web3Modal.open()} className='cursor-pointer text-white'>
            {
                accountInfo.isConnected ? <ConnectedComponent accountInfo={accountInfo}/> : <ConnectWalletComponent/>
            }
        </div>
    </>

}

function ConnectedComponent({accountInfo}: { accountInfo: AccountInfo }) {
    const chain = getChain(accountInfo.chainId);
    const chainIcon = chain ? getChainIcon(chain?.id) : makeBlockie(zeroAddress);

    return <>
        <BasicButton>
            <div className='flex items-center gap-2'>
                <Image src={chainIcon}
                       alt={chain?.name || ""}
                       width={25} height={25}
                       className='cursor-pointer rounded-full p-0 m-0'/>
                <span>{shorten(accountInfo.address, 4)}</span>
            </div>
        </BasicButton>
    </>
}


function ConnectWalletComponent() {
    return <BasicButton wMin><span className='px-4'>Connect</span></BasicButton>
}
