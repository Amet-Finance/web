import Link from "next/link";
import CopySVG from "../../../../../public/svg/copy";
import {copyAddress} from "@/modules/utils/address";
import TwitterSVG from "../../../../../public/svg/social/twitter";
import RedditSVG from "../../../../../public/svg/social/reddit";
import TelegramSVG from "../../../../../public/svg/social/telegram";
import {useEffect, useState} from "react";
import * as CloudAPI from "@/modules/cloud-api";
import Image from "next/image";
import {useAccount, useNetwork, useSignMessage} from "wagmi";
import {AccountParams} from "@/components/pages/address/address-id/type";
import {getExplorer, shorten} from "@/modules/web3/util";
import {mainnet} from "wagmi/chains";
import makeBlockie from 'ethereum-blockies-base64';
import {defaultChain} from "@/modules/utils/wallet-connect";
import Bond from "@/components/pages/bonds/utils/bond";
import {BondsAPIParams} from "@/modules/cloud-api/type";
import Loading from "@/components/utils/loading";
import {BondGeneral} from "@/components/pages/bonds/pages/issue/type";

export default function AddressId({address}: { address: string }) {

    const account = useAccount();

    const [accountInfo, setAccountInfo] = useState<AccountParams>({})
    const [changeInfo, setChangeInfo] = useState({} as any)
    const [isTheSameAddress, setTheSameAddress] = useState(false);


    const [isEdit, setEdit] = useState(false);
    const [refresh, setRefresh] = useState(0)

    const addressExplorer = getExplorer(mainnet.id, "address", address);

    useEffect(() => {
        if (account.address) {
            setTheSameAddress(account.address.toLowerCase() === address.toLowerCase())
        }
    }, [address, account.address]);


    const message = `Please sign this message to confirm your action on Amet Finance. Make sure to review the details before proceeding. Thank you for using Amet Finance!\n\nNonce: ${Date.now()}`
    const {signMessageAsync} = useSignMessage({message});

    useEffect(() => {
        CloudAPI.getAddress({address})
            .then(responseAPI => {
                if (responseAPI) setAccountInfo(responseAPI)
            })
    }, [address, refresh])


    async function saveChanges() {
        const signature = await signMessageAsync();

        const params = {
            address: account.address,
            message,
            signature
        }

        const body = {
            ...accountInfo,
            ...changeInfo
        }

        const response = await CloudAPI.updateAddress({params, body})
        if (response) {
            console.log(`response`, response);
            setRefresh(Math.random() * 10);
            setEdit(false);
        }
    }

    function discard() {
        setEdit(false);
    }

    return <>
        <div className='flex items-start gap-24 py-24 min-h-screen md:px-32 lg1:flex-row sm:flex-col xl:px-16 sm:px-4'>
            <div className='flex flex-col items-start gap-12 w-max'>

                <div className='flex flex-col items-start gap-4 w-full'>
                    <div className='flex items-center justify-between w-full'>
                        <Image src={makeBlockie(address)} alt={address} width={102} height={102}
                               className='rounded-full border-4 border-white '/>
                    </div>

                    <div className='grid grid-cols-2 items-center gap-y-2 font-medium w-full'>
                        <span className='text-sm text-g'>Address:</span>
                        <div className='flex items-center justify-end gap-2 text-sm w-full'>
                            <Link href={addressExplorer} target='_blank'>
                                <u>{shorten(address)}</u>
                            </Link>
                            <CopySVG onClick={() => copyAddress(address)}/>
                        </div>
                    </div>
                </div>

                <Socials accountInfo={accountInfo}
                         changeHandler={[changeInfo, setChangeInfo]}
                         editHandler={[isEdit, setEdit]}/>

                {isTheSameAddress && <>
                    <div className='flex items-center gap-2 w-full'>
                        {
                            isEdit ? <>
                                <button
                                    className='w-full p-2 border border-green-500 text-green-500 rounded hover:bg-green-500 hover:text-white'
                                    onClick={saveChanges}>Save
                                </button>
                                <button
                                    className='w-full p-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white'
                                    onClick={discard}>Discard
                                </button>
                            </> : <>
                                <button className='w-full p-2 border border-w2 rounded hover:bg-white hover:text-black'
                                        onClick={() => setEdit(true)}>Edit
                                </button>
                            </>
                        }
                    </div>
                </>}

            </div>
            <div className='flex flex-col w-full xl:p-0 lg1: px-5'>
                <div className='flex md:flex-row sm:flex-col items-center justify-between gap-4 w-full pb-4'>
                    <div className='flex items-center justify-center w-96 border border-w1 animate-pulse bg-b1 h-24'>
                        <span>Generating the graph...</span>
                    </div>
                    <div className='flex flex-col gap-1 items-center'>
                        <span className='text-4xl font-bold animate-pulse'>Generating...</span>
                        <span className='text-sm text-g'>Floating balance</span>
                    </div>
                </div>
                <Contracts address={address}/>
            </div>
        </div>
    </>
}


function Socials({accountInfo, changeHandler, editHandler}: any) {
    const [isEdit] = editHandler;
    const [changeInfo, setChangeInfo] = changeHandler;

    const socialsExist = accountInfo.twitter || accountInfo.telegram || accountInfo.reddit


    const onChange = (event: any) => setChangeInfo({...changeInfo, [event.target.id]: event.target.value})

    return <>
        <div className='flex flex-col gap-2 w-full'>
            {(accountInfo.twitter || isEdit) && <>
                <div className='flex gap-4 items-center'>
                    <TwitterSVG url={`https://twitter.com/${accountInfo.twitter}`}/>
                    <div className='flex items-center gap-2 text-sm w-full'>
                        {
                            isEdit ? <input type="text"
                                            className='w-full px-2 py-0.5 bg-transparent placeholder:text-g border border-w1 rounded'
                                            onChange={onChange}
                                            defaultValue={accountInfo.twitter}
                                            id='twitter'
                                            placeholder='Your Twitter Username: @amet_finance'/> :
                                <span>@{accountInfo.twitter}</span>
                        }
                    </div>
                </div>
            </>}
            {(accountInfo.telegram || isEdit) && <>
                <div className='flex gap-4 items-center'>
                    <TelegramSVG url={`https://t.me/${accountInfo.telegram}`}/>
                    <div className='flex items-center gap-2 text-sm w-full'>
                        {
                            isEdit ? <input type="text"
                                            className='w-full px-2 py-0.5 bg-transparent placeholder:text-g border border-w1 rounded'
                                            onChange={onChange}
                                            defaultValue={accountInfo.telegram}
                                            id='telegram'
                                            placeholder='Your Telegram Username: @amet_finance'/> :
                                <span>@{accountInfo.telegram}</span>
                        }
                    </div>
                </div>
            </>}
            {(accountInfo.reddit || isEdit) && <>
                <div className='flex gap-4 items-center'>
                    <RedditSVG url={`https://www.reddit.com/user/${accountInfo.reddit}`}/>
                    <div className='flex items-center gap-2 text-sm w-full'>
                        {isEdit ? <input type="text"
                                         className='w-full px-2 py-0.5 bg-transparent placeholder:text-g border border-w1 rounded'
                                         onChange={onChange}
                                         defaultValue={accountInfo.reddit}
                                         id='reddit'
                                         placeholder='Your Reddit Username: @amet_finance'/> :
                            <span>@{accountInfo.reddit}</span>
                        }
                    </div>
                </div>
            </>}
            {socialsExist &&
                <span className='text-sm text-g mt-4 max-w-sm'>Please note that users have the ability to edit their social information. A verification badge will be displayed only when the social information associated with an address has been verified.</span>}
        </div>
    </>
}


function Contracts({address}: { address: string }) {

    const network = useNetwork();
    const chainId = network.chain?.id || defaultChain.id;

    const Types: any = {
        Issued: 'issued',
        Purchased: 'purchased'
    }

    const [type, setType] = useState(Types.Issued)
    const [balance, setBalance] = useState({});
    const [contracts, setContracts] = useState<any>([])
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        CloudAPI.getBalance({address, chainId}).then(response => {
            if (response) {
                delete response._id;
                setBalance(response)
            }
        })
    }, [address, chainId])

    useEffect(() => {

        const params: BondsAPIParams = {
            skip: 0,
            limit: 100,
            chainId,
        }

        if (type === Types.Issued) {
            params.issuer = address
        } else if (type === Types.Purchased) {
            const balanceContracts = Object.keys(balance);
            if (!balanceContracts?.length) {
                return setContracts([]);
            }
            params._id = balanceContracts
        }

        setLoading(true)
        CloudAPI.getBonds(params).then(response => setContracts(response)).finally(() => setLoading(false));
    }, [type, chainId, address, Types.Issued, Types.Purchased, balance]);


    return <>
        <div className='flex items-center'>
            {Object.keys(Types).map(title => {
                const localType = Types[title]
                const isSelected = localType === type
                const className = isSelected ? " bg-white text-black p-2 px-8" : "p-2 px-8 hover:bg-b2"
                let titleTmp = title;

                if (localType === Types.Purchased) {
                    titleTmp += `(${Object.keys(balance).length})`
                }

                return <>
                    <button className={className} onClick={() => setType(Types[title])}>{titleTmp}</button>
                </>
            })}
        </div>
        <BondsScreen isLoading={isLoading} contracts={contracts}/>
    </>
}

function BondsScreen({isLoading, contracts}: { isLoading: boolean, contracts: BondGeneral[] }) {
    if (isLoading) {
        return <div className='flex justify-center items-center w-full h-56'><Loading percent={-100}/></div>
    }

    return <>
        {contracts.length ?
            <>
                <div className="grid xl1:grid-cols-2 xl:grid-cols-1 gap-4 pt-6 w-max">
                    {contracts.map((item: any, index: number) => <Bond info={item} key={index}/>)}
                </div>
            </> : <>
                <div className='flex justify-center items-center w-full h-56'>
                    <span className='text-2xl'>No bonds found.</span>
                </div>
            </>
        }
    </>
}
