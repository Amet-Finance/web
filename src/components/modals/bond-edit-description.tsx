import {useAccount, useSignMessage} from "wagmi";
import {useWeb3Modal} from "@web3modal/wagmi/react";
import {patchAPI} from "@/modules/cloud-api/util";
import {API_URL} from "@/modules/cloud-api/constants";
import {useState} from "react";
import {useRouter} from "next/router";
import {toast} from "react-toastify";
import XmarkSVG from "../../../public/svg/xmark";
import {closeModal} from "@/store/redux/modal";
import {DetailedBondResponse} from "@/modules/cloud-api/type";

export default function BondEditDescription({additional}: { additional: { bondInfo: DetailedBondResponse } }) {
    const {bondInfo} = additional;
    const {description, contractInfo} = bondInfo;
    const message = `To ensure the security of your bond description update, please sign this request with your Metamask wallet. This signature is needed to verify the authenticity of the modification. Make sure to review the changes before signing. Your signature helps maintain the integrity of the information on the Amet Finance platform\n\nContract: ${contractInfo._id.toLowerCase()} \nNonce: ${Date.now()}`;

    const {address} = useAccount();
    const {open} = useWeb3Modal();
    const router = useRouter();
    const {signMessageAsync} = useSignMessage({message})

    const [descriptionInfo, setDescriptionInfo] = useState({
        title: "",
        description: ""
    })

    function updateOnChange(event: any) {
        setDescriptionInfo({
            ...descriptionInfo,
            [event.target.id]: event.target.value
        })
    }

    async function submit(event: any) {
        try {
            event.preventDefault();

            if (!address) {
                return open()
            }


            const signature = await signMessageAsync?.()
            const response = await patchAPI({
                url: `${API_URL}/v1/contract/description`,
                body: {
                    address,
                    signature,
                    message,
                    title: descriptionInfo.title,
                    description: descriptionInfo.description
                },
                params: {
                    chainId: contractInfo.chainId,
                    _id: contractInfo._id
                }
            })

            router.reload();

            console.log(`response`, response)
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    return <>
        <form className='flex flex-col p-4 gap-3' onSubmit={submit}>
            <div className='flex justify-between items-center gap-2'>
                <span className='text-xl'>Update Bond Description:</span>
                <XmarkSVG isMedium onClick={closeModal}/>
            </div>
            <div className='flex flex-col gap-2'>
                <input type="text" placeholder='Enter a descriptive title for your bond'
                       className='bg-transparent border border-w1 p-4 py-2 rounded'
                       defaultValue={description.details?.title}
                       id='title'
                       onChange={updateOnChange}
                />
                <textarea name="" cols={45} rows={10} className='bg-transparent border border-w1 p-4 py-2 rounded'
                          placeholder='Provide a detailed description of your bond. This is your opportunity to communicate the purpose, benefits, and any other relevant information about your bond. Be transparent and informative to attract potential purchasers'
                          id='description'
                          defaultValue={description.details?.description}
                          onChange={updateOnChange}
                />
            </div>
            <button className='w-full py-2 rounded text-center border border-w1 hover:bg-white hover:text-black'
                    type='submit'>Submit
            </button>
        </form>
    </>
}
