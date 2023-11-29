import {useState} from "react";
import {useAccount, useSignMessage} from "wagmi";
import {useWeb3Modal} from "@web3modal/wagmi/react";

const States = {
    BecomeAnAffiliate: 'BecomeAnAffiliate',
    AffiliateForm: "AffiliateForm"
}

export default function Affiliate() {
    const [state, setState] = useState(States.BecomeAnAffiliate);
    const stateHandler = [state, setState];

    return <>
        <div className='flex justify-center items-center min-h-[90vh]'>
            <BecomeAnAffiliate stateHandler={stateHandler}/>
            <AffiliateForm stateHandler={stateHandler}/>
        </div>
    </>
}

function BecomeAnAffiliate({stateHandler}: { stateHandler: any }) {

    const [state, setState] = stateHandler;
    if (state !== States.BecomeAnAffiliate) {
        return null;
    }

    return <>
        <div className='flex flex-col gap-4 items-center'>
            <div className='flex flex-col gap-2 items-center text-center'>
                <h1 className='text-3xl font-bold'>Unlock Earnings with Amet Finance Affiliate Program</h1>
                <p className='max-w-3xl text-g'>Join our affiliate program to earn rewards by promoting on-chain bonds.
                    Sign up now and start earning with every bond issued through your referral link</p>
            </div>
            <button className='border border-w1 p-1.5 px-8 rounded hover:text-black hover:bg-white'
                    onClick={() => setState(States.AffiliateForm)}>
                Become an Affiliate
            </button>
        </div>
    </>
}

function AffiliateForm({stateHandler}: { stateHandler: any }) {
    const [state, setState] = stateHandler;
    const {open} = useWeb3Modal();
    const {address} = useAccount();
    const [info, setInfo] = useState({
        name: ""
    })

    const message = `I, ${info.name}, affirm that I am applying for the Amet Finance Affiliate Program. By signing this message with my wallet, I verify the accuracy of the information provided and express my commitment to promoting Amet Finance responsibly.\n\nWallet address: ${address}\nNonce: ${Date.now()}`
    const {signMessageAsync} = useSignMessage({message})


    if (state !== States.AffiliateForm) {
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
                <h1 className='text-2xl font-bold'>Become an Affiliate with Amet Finance</h1>
                <p className='max-w-3xl'>{`Empower yourself with our affiliate program. Fill out the form below, and unlock the potential to earn commissions by promoting Amet Finance's revolutionary on-chain bonds. Join us on this rewarding journey`}</p>
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
