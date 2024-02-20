import {ContractExtendedFormat, DescriptionEditParams} from "@/modules/cloud-api/contract-type";
import {useAccount, useSignMessage} from "wagmi";
import {useEffect, useState} from "react";
import ContractAPI from "@/modules/cloud-api/contract-api";
import {shortenString} from "@/modules/utils/string";
import SaveSVG from "../../../../../../../public/svg/utils/save";
import EditSVG from "../../../../../../../public/svg/utils/edit";

export default function DescriptionContainer({bondDetailed, setBondDetailed}: {
    bondDetailed: ContractExtendedFormat,
    setBondDetailed: (contractExtendedFormat: any) => any
}) {

    const {contractInfo, contractDescription} = bondDetailed;

    const message = `To ensure the security of your bond description update, please sign this request with your wallet. This signature is needed to verify the authenticity of the modification. Make sure to review the changes before signing. Your signature helps maintain the integrity of the information on the Amet Finance platform\n\nContract: ${contractInfo._id.toLowerCase()} \nNonce: ${Date.now()}`;

    const {address} = useAccount();
    const [isHidden, setHidden] = useState(true);
    const [isEditMode, setEditMode] = useState(false);
    const [descriptionDetails, setDescriptionDetails] = useState({
        title: "",
        description: ""
    })
    const isIssuer = contractInfo.issuer.toLowerCase() === address?.toLocaleLowerCase()

    const {signMessageAsync} = useSignMessage({message});

    useEffect(() => {
        if (contractDescription.details || isIssuer) {
            if (!contractDescription.details && isIssuer) setEditMode(true)
            setHidden(false);
        }
    }, [address, contractDescription?.details, isIssuer]);

    if (isHidden) return null;

    function edit(event: any) {
        const {id, value} = event.target;
        setDescriptionDetails({
            ...descriptionDetails,
            [id]: value
        })
    }

    async function updateDescription() {
        try {
            if (!address) {
                return;
            }

            const signature = await signMessageAsync?.()

            const params: DescriptionEditParams = {
                _id: contractInfo._id,
                address: address,
                message: message,
                title: descriptionDetails.title,
                description: descriptionDetails.description,
                signature,
            }
            const descriptionUpdated = await ContractAPI.updateContractDescription(params);
            setBondDetailed({...bondDetailed, contractDescription: descriptionUpdated})
            setEditMode(false);
        } catch (error: any) {
            console.log(error)
        }

    }

    return <>
        <div className='flex flex-col gap-4 w-full p-8 border border-neutral-900 rounded-3xl bg-neutral-950'>
            <div className='grid grid-cols-12 gap-4'>
                <div className='col-span-11'>
                    {
                        isEditMode ?
                            <input type="text"
                                   className='bg-transparent border-b-2 border-w1 placeholder:text-neutral-400'
                                   id='title'
                                   onChange={edit}
                                   defaultValue={contractDescription.details?.title}
                                   placeholder='Title'/> :
                            <h1 className='text-2xl font-bold'
                                title={contractDescription.details?.title}>{shortenString(contractDescription.details?.title, 190)}</h1>
                    }
                </div>
                <div className='col-span-1 flex justify-end'>
                    {
                        isEditMode ?
                            <SaveSVG onClick={updateDescription}/> :
                            <EditSVG onClick={() => setEditMode(true)}/>
                    }
                </div>
            </div>
            {
                isEditMode ?
                    <textarea
                        rows={5}
                        onChange={edit}
                        id='description'
                        className='bg-transparent border-b-2 border-w1 placeholder:text-neutral-400'
                        defaultValue={contractDescription.details?.description}
                        placeholder='Desribe you bonds, the purpose and etc..'/> :
                    <p className='text-sm text-neutral-400 max-h-60 overflow-y-auto'>{contractDescription.details?.description}</p>
            }
        </div>
    </>
}
