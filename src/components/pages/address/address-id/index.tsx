import Link from "next/link";
import CopySVG from "../../../../../public/svg/copy";
import {copyAddress} from "@/modules/utils/address";
import TwitterSVG from "../../../../../public/svg/social/twitter";
import RedditSVG from "../../../../../public/svg/social/reddit";
import TelegramSVG from "../../../../../public/svg/social/telegram";
import {useEffect, useState} from "react";
import * as CloudAPI from "@/modules/cloud-api";
import {getIpfsData} from "@/modules/cloud-api/ipfs";
import {format} from "@/modules/utils/numbers";
import {useAccount, useNetwork, useSignMessage} from "wagmi";
import {AccountParams} from "@/components/pages/address/address-id/type";
import {getExplorer, shorten} from "@/modules/web3/util";
import {mainnet} from "wagmi/chains";


export default function AddressId({address}: {address: string}) {

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
    }, [account.address]);


    const message = `Please sign this message to confirm your action on Amet Finance. Make sure to review the details before proceeding. Thank you for using Amet Finance!\n\nNonce: ${Date.now()}`
    const {signMessageAsync} = useSignMessage({message})
    useEffect(() => { // todo fix this mess
        CloudAPI.getAddress({address})
            .then(responseAPI => {
                console.log(`response`, responseAPI)
                if (responseAPI?.ipfsHash) {
                    getIpfsData(responseAPI.ipfsHash).then(ipfsResponse => {
                        console.log(`ipfsResponse`, ipfsResponse)
                        if (ipfsResponse) {
                            setAccountInfo(ipfsResponse)
                        }
                    })
                }
            })
    }, [refresh])

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
            console.log(response)
            setRefresh(Math.random() * 10);
            setEdit(false);
        }
    }

    function discard() {
        setEdit(false);
    }

    return <>
        <div className='flex items-start gap-4 px-32 py-24 h-screen'>
            <div className='flex flex-col items-start gap-12 w-1/4'>

                <div className='flex flex-col items-start gap-4'>
                    <div className='flex'>
                        <div className='rounded-full w-24 h-24 bg-gray-400'/>
                    </div>

                    <div className='grid grid-cols-2 items-center gap-y-2 font-medium'>
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
            <div className='flex flex-col w-full'>
                <div className='flex justify-end gap-4 w-full  border-b pb-4 border-w1'>
                    {/*<div className='w-80 h-20 bg-fuchsia-200'/>*/}
                    <div className='flex flex-col gap-1 items-center'>
                        <span className='text-4xl font-bold'>${format(34250)}</span>
                        <span className='text-sm text-g'>Floating balance</span>
                    </div>
                </div>
                <div className='w-full h-full '/>
            </div>
        </div>
    </>
}


function Socials({accountInfo, changeHandler, editHandler}: any) {
    const [isEdit, setEdit] = editHandler;
    const [changeInfo, setChangeInfo] = changeHandler;
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
        </div>
    </>
}
