import {ContractExtendedInfoFormat} from "@/modules/cloud-api/contract-type";
import {useEffect, useState} from "react";
import {BasicButton} from "@/components/utils/buttons";
import FixedFlexVaultController from "@/modules/web3/fixed-flex/v2/vault";
import {getChain} from "@/modules/utils/wallet-connect";
import {useAccount, useSendTransaction} from "wagmi";
import {ReferralInfo} from "@/components/pages/bonds/pages/explore-bond-id/components/actions/types";
import {nop} from "@/modules/utils/function";
import {formatLargeNumber} from "@/modules/utils/numbers";
import Loading from "@/components/utils/loading";
import {getContractInfoByType, trackTransaction} from "@/modules/web3";
import {TxTypes} from "@/modules/web3/constants";
import {toast} from "react-toastify";
import {openModal} from "@/store/redux/modal";
import {ModalTypes} from "@/store/redux/modal/constants";
import {BondFeeDetails} from "@/modules/web3/fixed-flex/v2/types";

// todo here also include a few cases
// 1. if there's no reward give the referral link so the person can refer
// 4. After claiming ask him to share in Twitter with a modal or something similar

export default function ReferralTab({contractInfo}: { contractInfo: ContractExtendedInfoFormat }) {

    const {_id, purchase} = contractInfo;
    const {address} = useAccount();
    const [contractAddress, chainId] = _id.split("_");
    const chain = getChain(chainId);

    const [isLoading, setLoading] = useState(true);
    const [isBlacklisted, setBlacklisted] = useState(false);
    const [vaultAddress, setVaultAddress] = useState();
    const [feeDetails, setFeeDetails] = useState({} as BondFeeDetails)
    const [referralInfo, setReferralInfo] = useState({} as ReferralInfo)

    const totalReward = referralInfo.quantity * purchase.amountClean * feeDetails.referrerRewardRate / 1000;

    const isBlocked = !contractInfo.isSettled || isBlacklisted || referralInfo.isRepaid || !totalReward;
    let title = !contractInfo.isSettled ? "Pending Issuer Settlement" : "Claim"
    if (isBlacklisted) title = "Address Blocked";
    if (referralInfo.isRepaid) title = "Already Repaid";

    const config = getContractInfoByType(chain, TxTypes.ClaimReferralRewards, {vaultAddress, contractAddress});
    const {sendTransactionAsync} = useSendTransaction({
        to: config.to,
        data: config.data
    })

    useEffect(() => {
        if (chain) {
            FixedFlexVaultController.getVault(chain)
                .then(response => setVaultAddress(response.address))
                .catch(nop)
        }
    }, [chain]);

    useEffect(() => {
        if (chain && address && vaultAddress) {
            setLoading(true)
            const refPromise = FixedFlexVaultController.getReferralRewards(chain, vaultAddress, contractAddress, address)
                .then(result => {
                    if (result) setReferralInfo(result)
                }).catch(nop)

            const restrictionPromise = FixedFlexVaultController.isAddressRestricted(chain, vaultAddress, address)
                .then((status) => setBlacklisted(status))
                .catch(nop)

            const feeDetailsPromise = FixedFlexVaultController.getBondFeeDetails(chain, vaultAddress, contractAddress)
                .then(response => setFeeDetails(response))
                .catch(nop)

            Promise.allSettled([refPromise, restrictionPromise, feeDetailsPromise]).then(() => setLoading(false));

        }
    }, [address, contractAddress, chain, vaultAddress])


    async function claimReferralRewards() {
        try {
            if (isBlocked) return toast.error("Action Is Blocked.");

            const response = await sendTransactionAsync();
            await trackTransaction(chain, response.hash);
            return openModal(ModalTypes.ClaimReferralRewards, {
                address,
                totalReward,
                symbol: purchase.symbol
            });
        } catch (error: any) {

        }
    }

    return <>
        <div className='flex flex-col gap-4 justify-end h-full w-full'>
            <div className='flex flex-col gap-1'>
                <span className='text-neutral-400 text-sm'>You have accumulated</span>
                {
                    isLoading ?
                        <Loading percent={40}/> :
                        <span
                            className='text-3xl text-green-500 font-bold'>{formatLargeNumber(totalReward)} {purchase.symbol}</span>
                }
                <span className='text-neutral-400 text-sm'>in referral rewards with Amet Finance</span>
            </div>
            <BasicButton isBlocked={isBlocked} onClick={claimReferralRewards}>
                <span>{title}</span>
            </BasicButton>
        </div>
    </>
}
