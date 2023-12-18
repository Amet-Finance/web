import {useState} from "react";
import {useAccount, useSignMessage} from "wagmi";
import {useWeb3Modal} from "@web3modal/wagmi/react";
import Image from "next/image";


const States = {
    BecomeAReferralPartner: 'BecomeAReferralPartner',
    ReferralPartnerForm: "ReferralPartnerForm"
}

export default function Referral() {
    const [state, setState] = useState(States.BecomeAReferralPartner);
    const stateHandler = [state, setState];

    return <>
        <div className='relative flex justify-center items-center min-h-[90vh]'>
            <Image src='/svg/images/bg-referral.svg' alt='Bond abstract image'  fill className='absolute top-full left-0'/>
            <div className='flex justify-center items-center z-10'>
                <BecomeAReferralPartner stateHandler={stateHandler}/>
                <ReferralPartnerForm stateHandler={stateHandler}/>
            </div>
        </div>
    </>
}

function BecomeAReferralPartner({stateHandler}: { stateHandler: any }) {

    const [state, setState] = stateHandler;
    if (state !== States.BecomeAReferralPartner) {
        return null;
    }

    return <>
        <div className='flex flex-col gap-4 items-center'>
            <div className='flex flex-col gap-2 items-center text-center'>
                <h1 className='text-3xl font-bold'>Unlock Earnings with Amet Finance Referral Program</h1>
                <p className='max-w-3xl text-g'>{`Share the power of innovative bond solutions with your network, and earn attractive rewards for
                    every successful referral. Become a part of our mission to revolutionize the world of decentralized
                    finance.`}</p>
            </div>
            <button className='border border-w1 p-1.5 px-8 rounded hover:text-black hover:bg-white'
                    onClick={() => setState(States.ReferralPartnerForm)}>
                Start Referring & Earning
            </button>
        </div>
    </>
}

function ReferralPartnerForm({stateHandler}: { stateHandler: any }) {
    const [state, setState] = stateHandler;
    const {open} = useWeb3Modal();
    const {address} = useAccount();
    const [info, setInfo] = useState({
        name: ""
    })

    const message = `I, ${info.name}, affirm that I am applying for the Amet Finance Referral Program. By signing this message with my wallet, I verify the accuracy of the information provided and express my commitment to promoting Amet Finance responsibly.\n\nWallet address: ${address}\nNonce: ${Date.now()}`
    const {signMessageAsync} = useSignMessage({message})


    if (state !== States.ReferralPartnerForm) {
        return null;
    }

    function onChange(event: any) {
        setInfo({
            ...info,
            [event.target.id]: event.target.value
        })
    }

    async function submit() {
        try {
            if (!address) {
                return open();
            }

            const messageHash = await signMessageAsync?.()
        } catch (error) {
            console.log(error)
        }
    }


    return <>
        <div className='flex flex-col justify-center items-center gap-4'>

            <div className='flex flex-col gap-2 text-center'>
                <h1 className='text-3xl font-bold'>Become a Referral Partner with Amet Finance</h1>
                <p className='max-w-3xl'>{`Empower yourself with our referral partner program. Fill out the form below, and unlock the potential to earn commissions by promoting Amet Finance's revolutionary on-chain bonds. Join us on this rewarding journey`}</p>
            </div>

            <div className='flex flex-col gap-2 max-w-lg'>
                <input type="text" className='bg-transparent border border-w1 rounded min-w-500 py-1 px-2'
                       id='name'
                       onChange={onChange}
                       placeholder='Name' required/>
                <input type="email" className='bg-transparent border border-w1 rounded min-w-500 py-1 px-2'
                       id='email'
                       onChange={onChange}
                       placeholder='Email' required/>
                <input type="text" className='bg-transparent border border-w1 rounded min-w-500 py-1 px-2'
                       id='telegram'
                       onChange={onChange}
                       placeholder='Telegram handle: @amet_finance'/>
                <input type="text" className='bg-transparent border border-w1 rounded min-w-500 py-1 px-2'
                       id='discord'
                       onChange={onChange}
                       placeholder='Discord username: @amet_finance'/>
                <button className='border border-w1 w-full py-1 rounded' onClick={submit}>Apply Now</button>
            </div>
        </div>
    </>
}
