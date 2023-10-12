import {BondInfoDetailed, TokenInfo} from "@/modules/web3/type";
import Styles from "@/components/pages/bonds/pages/explore-id/components/bond-actions/index.module.css";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {RootState} from "@/store/redux/type";
import {getTokensPurchaseDates} from "@/modules/web3/zcb";
import {formatTime} from "@/modules/utils/dates";
import {toast} from "react-toastify";
import {submitTransaction} from "@/modules/web3";
import {TxTypes, WalletTypes} from "@/modules/web3/constants";
import * as AccountSlice from "@/store/redux/account";
import Loading from "@/components/utils/loading";
import SelectAllSVG from "../../../../../../../../public/svg/select-all";
import ClearSVG from "../../../../../../../../public/svg/clear";

export default function Redeem({info, tokens}: { info: BondInfoDetailed, tokens: { [key: string]: TokenInfo } }) {

    const {_id, redeemLockPeriod} = info;
    const [tokenIds, setTokenIds] = useState([] as any);
    const [loading, setLoading] = useState(false);
    const tokenHandlers = [tokenIds, setTokenIds]

    const account = useSelector((item: RootState) => item.account);
    const contractAddress = info._id?.toLowerCase() || ""
    const balanceTokenIds = account.balance[contractAddress] || [];
    const [holdings, setHoldings] = useState([])
    // todo calculate as well the amount that is left there
    //  so I won't be able to choose it if there's no secured redemption amount

    useEffect(() => {
        setLoading(true)
        AccountSlice.initBalance(account.address, account.chainId)
            .then(() => setLoading(false))
    }, [])

    //todo add here a loader
    useEffect(() => {
        if(balanceTokenIds.length) {
            if(!holdings.length) {
                setLoading(true);
            }
            getTokensPurchaseDates(contractAddress, balanceTokenIds)
                .then(response => {
                    const utcTimestamp = Date.now() / 1000;
                    const tokensWithDates = response.map((date: number, index: number) => {
                        const isValid = utcTimestamp - Number(redeemLockPeriod) > Number(date)
                        const timeLeft = Number(date) + Number(redeemLockPeriod) - utcTimestamp
                        return {
                            id: balanceTokenIds[index],
                            purchaseDate: Number(date),
                            isValid,
                            timeLeft: isValid ? "0" : formatTime(timeLeft)
                        }
                    })

                    // console.log(tokensWithDates)
                    setHoldings(tokensWithDates);
                })
                .catch(error => console.log(`getTokensPurchaseDates`, error))
                .finally(() => setLoading(false))
        }
    }, [account.address, account.balance[contractAddress]])

    if (!holdings.length && !loading) {
        return <>
            <div className='flex items-center justify-center p-4'>
                <span className='text-g'>There are no bonds to redeem</span>
            </div>
        </>
    }

    const selectAll = () => {
        // todo refactor this and use one loop
        const tokenIdsLocal = holdings.filter((item: any) => item.isValid).map((item: any) => item.id);
        setTokenIds(tokenIdsLocal);
    }
    const clearAll = () => setTokenIds([]);

    async function submit() {
        if (!tokenIds.length) {
            toast.error("You did not select a bond");
            return;
        }

        const transaction = await submitTransaction(WalletTypes.Metamask, TxTypes.RedeemBonds, {
            contractAddress: _id,
            ids: tokenIds
        });
        setTimeout(() => {
            AccountSlice.initBalance(account.address, account.chainId);
        }, 5000);
        setTokenIds([]);
        console.log(transaction)
    }

    const SubmitButton = () => {
        let className = `${Styles.submit}`;
        let onClick = submit;


        if (!tokenIds.length) {
            className += ` ${Styles.disable}`
            onClick = async () => {
            }
        }

        return <button className={className} onClick={onClick}>Redeem</button>
    }

    return <>
        <div className={Styles.redeem}>
            {
                loading ?
                    <>
                        <div className={Styles.loader}>
                            <Loading/>
                        </div>
                    </>
                    :
                    <>
                        <div className="flex justify-between items-center gap-4">
                            <SelectAllSVG onClick={selectAll}/>
                            <ClearSVG onClick={clearAll}/>
                        </div>
                        <div className={Styles.tokenIds}>
                            {
                                holdings.map((tokenInfo: any) => <TokenId tokenInfo={tokenInfo}
                                                                          tokenHandlers={tokenHandlers}
                                                                          key={tokenInfo.id}/>)
                            }
                        </div>
                        <SubmitButton/>
                    </>
            }
        </div>
    </>
}

function TokenId({tokenInfo, tokenHandlers}: any) {

    const tokenId = tokenInfo.id;
    const purchaseDate = tokenInfo.purchaseDate;
    const {isValid, timeLeft} = tokenInfo;

    // const isValid = purchaseDate * 1000;
    const [tokenIds, setTokenIds] = tokenHandlers;
    const tokenIndex = tokenIds.indexOf(tokenId);
    const select = () => {
        if (isSelected) {
            const tmp = [...tokenIds];
            tmp.splice(tokenIndex, 1);
            setTokenIds(tmp);
        } else {
            setTokenIds([...tokenIds, tokenId])
        }
    }
    const isSelected = tokenIndex !== -1;

    const className = `${Styles.tokenId} ${isSelected && Styles.selectedToken} ${!isValid && Styles.disable}`
    const title = !isValid ? `You can redeem the bond after ${timeLeft}` : `Select to redeem #${tokenId} Bond`
    const onClick = isValid ? select : () => null;


    return <>
        <span className={className} onClick={onClick} title={title}>{tokenId}</span>
    </>
}