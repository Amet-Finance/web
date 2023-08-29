import {useEffect, useState} from "react";
import Styles from "./index.module.css";
import {getAllowance} from "@/modules/web3/tokens";
import {BondInfo} from "@/components/pages/bonds/pages/issue/type";
import {useSelector} from "react-redux";
import {Account} from "@/store/redux/account/type";
import {getWeb3Instance, submitTransaction} from "@/modules/web3";
import {TxTypes, WalletTypes} from "@/modules/web3/constants";
import {toBN} from "web3-utils";
import Loading from "@/components/utils/loading";
import {TokenInfo} from "@/modules/web3/type";
import {toast} from "react-toastify";
import {initBalance} from "@/store/redux/account";
import ClearSVG from "../../../../../../../../public/svg/clear";
import SelectAllSVG from "../../../../../../../../public/svg/select-all";

const Actions: { [key: string]: string } = {
    Purchase: 'purchase',
    Redeem: 'redeem'
}

export default function BondActions({info, tokens}: any) {
    const [action, setAction] = useState(Actions.Purchase);
    const actionHandler = [action, setAction];

    return <>
        <div className={Styles.bondActions}>
            <div className={Styles.sectionHorizontal}>
                {
                    Object.keys(Actions)
                        .map((key: string) => <ActionButton name={key}
                                                            actionHandler={actionHandler}
                                                            key={key}/>)
                }
            </div>
            <Action actionHandler={actionHandler} info={info} tokens={tokens}/>
        </div>
    </>
}

function ActionButton({name, actionHandler}: any) {
    const [action, setAction] = actionHandler;
    const isSelected = Actions[name] === action;
    const className = `${Styles.action} ${isSelected ? Styles.selectedAction : ""}`
    const select = () => setAction(Actions[name])

    return <>
        <span className={className} onClick={select}>{name}</span>
    </>
}

function Action({actionHandler, info, tokens}: any) {
    const [action, setAction] = actionHandler;

    switch (action) {
        case Actions.Purchase: {
            return <Purchase info={info} tokens={tokens}/>
        }
        case Actions.Redeem : {
            return <Redeem info={info} tokens={tokens}/>
        }
        default: {
            return <></>
        }
    }
}

function Purchase({info, tokens}: { info: BondInfo, tokens: { [key: string]: TokenInfo } }) {

    const {
        _id,
        investmentTokenAmount,
        total,
        purchased,
        investmentToken,
        interestToken
    } = info;

    const investmentTokenInfo = investmentToken ? tokens[investmentToken] : undefined;
    const bondsLeft = Number(total) - Number(purchased);

    const [effectRefresher, setEffectRefresher] = useState(0);
    const [amount, setAmount] = useState(0);
    const [allowance, setAllowance] = useState(0)
    const account: Account = useSelector((item: any) => item.account);
    const {address} = account;

    useEffect(() => {
        getAllowance(interestToken, address, _id)
            .then(response => setAllowance(response))
            .catch(error => null)
    }, [address, effectRefresher])


    if (!investmentTokenInfo) {
        return <>
            <div className={Styles.loader}>
                <Loading/>
            </div>
        </>;
    }

    const decimals = Number(investmentTokenInfo?.decimals) || 18

    // console.log(`investmentTokenAmount, decimals`, investmentTokenAmount, decimals)
    const investmentAmountClean = toBN(`${investmentTokenAmount}`).div(toBN(10).pow(toBN(decimals)));
    const totalPrice = amount * investmentAmountClean.toNumber();

    const allowanceDivided = toBN(allowance).div(toBN(10).pow(toBN(decimals))).toNumber();

    const isApproval = totalPrice > allowanceDivided;

    // const isApproval = false;

    function onChange(event: Event | any) {
        const {value, type} = event.target;
        setAmount(Number(value) || 0);
    }

    async function submit() {
        if (isApproval) {

            const web3 = getWeb3Instance();
            const {toBN} = web3.utils;

            if (!investmentTokenInfo?.decimals || !investmentTokenAmount) {
                return;
            }

            const transaction = await submitTransaction(WalletTypes.Metamask, TxTypes.ApproveToken, {
                contractAddress: investmentToken,
                spender: _id,
                value: toBN(amount).mul(toBN(investmentTokenAmount))
            });
            console.log(transaction)
        } else {
            const transaction = await submitTransaction(WalletTypes.Metamask, TxTypes.PurchaseBonds, {
                contractAddress: _id,
                count: amount
            });
            await initBalance(account.address);
            console.log(transaction);
        }
        setEffectRefresher(Math.random());

    }

    const SubmitButton = () => {
        let title = "Purchase"
        let className = `${Styles.submit}`;
        let onClick = submit

        if (Number(amount) > Number(bondsLeft)) {
            title = `Not enough bonds left`
            className += ` ${Styles.disable}`
            onClick = async () => {
            };
        } else if (isApproval) {
            title = `Approve ${investmentTokenInfo?.symbol}`
        }

        return <button className={className} onClick={onClick}>{title}</button>
    }

    return <>
        <div className={Styles.section}>
            <input className={Styles.input}
                   type="number"
                   onChange={onChange}
                   placeholder="The amount of bonds you want to purchase"/>
            <SubmitButton/>
        </div>
    </>
}

function Redeem({info, tokens}: { info: BondInfo, tokens: { [key: string]: TokenInfo } }) {
    // todo add select all for the redeem tokens
    const {_id} = info;
    const [tokenIds, setTokenIds] = useState([] as any);
    const tokenHandlers = [tokenIds, setTokenIds]

    const account: Account = useSelector((item: any) => item.account);
    const contractAddress = info._id?.toLowerCase() || ""
    const balanceTokenIds = account.balance[contractAddress] || [];

    if (!balanceTokenIds.length) {
        return <>
            <span>There are no bonds to redeem</span>
        </>
    }

    const selectAll = () => setTokenIds(balanceTokenIds);
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
        await initBalance(account.address);
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
            <div className={Styles.redeemActions}>
                <SelectAllSVG onClick={selectAll}/>
                <ClearSVG onClick={clearAll}/>
            </div>
            <div className={Styles.tokenIds}>
                {
                    balanceTokenIds.map(tokenId => <TokenId tokenId={tokenId}
                                                            tokenHandlers={tokenHandlers}
                                                            key={tokenId}/>)
                }
            </div>
            <SubmitButton/>
        </div>
    </>
}

function TokenId({tokenId, tokenHandlers}: any) {

    const [tokenIds, setTokenIds] = tokenHandlers;
    const tokenIndex = tokenIds.indexOf(tokenId);
    const isSelected = tokenIndex !== -1;
    const className = `${Styles.tokenId} ${isSelected && Styles.selectedToken}`

    const select = () => {
        if (isSelected) {
            const tmp = [...tokenIds];
            tmp.splice(tokenIndex, 1);
            setTokenIds(tmp);
        } else {
            setTokenIds([...tokenIds, tokenId])
        }
    }

    return <>
        <span className={className} onClick={select}>{tokenId}</span>
    </>
}