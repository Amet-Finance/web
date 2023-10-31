import Styles from './index.module.css';
import {useEffect, useState} from "react";
import {BondGeneral, BondInfo} from "@/components/pages/bonds/pages/issue/type";
import Bond from "@/components/pages/bonds/utils/bond";
import {join} from "@/modules/utils/styles";
import {getBondsHandler} from "@/components/pages/bonds/utils/bond/functions";
import {useSelector} from "react-redux";
import {RootState} from "@/store/redux/type";


export default function Explore() {
    return <>
        <div className={Styles.container}>
            <div className={Styles.texts}>
                <h1 className={join([Styles.headline, "font-bold"])}>
                    Explore <span className="text-black bg-white px-1">On-Chain Bonds:</span><br/> Find, Filter, and
                    Invest
                </h1>
                <hr className={Styles.line}/>
                <p className={Styles.secondary}>Discover a range of on-chain bonds through advanced filters and
                    intuitive search options.</p>
            </div>
            <BondsContainer/>
        </div>
    </>
}

function BondsContainer() {

    const account = useSelector((item: RootState) => item.account)
    const [search, setSearch] = useState({
        text: ""
    });
    const [bonds, setBonds] = useState({
        isLoading: false,
        limit: 100,
        skip: 0,
        data: [] as BondGeneral[]
    })

    const onChange = (event: any) => setSearch({
        ...search,
        [event.target.id]: event.target.value
    });
    const bondsHandler = [bonds, setBonds]

    const bondsFiltered = () => {
        return bonds.data.filter(item => {
            const {interestTokenInfo, investmentTokenInfo, issuer, _id} = item;
            const searchExists = search.text
            if (Boolean(searchExists)) {
                const regex = new RegExp(search.text, 'i')
                const toTest = [interestTokenInfo.symbol, investmentTokenInfo.symbol, issuer, _id]

                for (const type of toTest) {
                    if (regex.test(type)) {
                        return true
                    }
                }
                return false
            } else {
                return true
            }
        })
    }

    useEffect(() => {
        const config = {
            skip: bonds.skip,
            limit: bonds.limit,
            chainId: account.chainId
        }
        const interval = getBondsHandler(bondsHandler, config);
        return () => {
            clearInterval(interval)
        }

    }, [bonds.limit, bonds.skip, account.chainId]);


    return <>
        <div className={Styles.bonds}>
            <div className='flex items-start'>
                <input type="text"
                       className="placeholder:text-g2 px-4 py-2 bg-transparent border border-w1 border-solid rounded text-white w-52 text-sm "
                       placeholder='Contract address, Token Symbol or Issuer address'
                       id='text'
                       onChange={onChange}
                />
            </div>
            <div className="grid xl1:grid-cols-3 lg1:grid-cols-2 md:grid-cols-1 gap-6 p-4 sm1:w-max sm:w-full">
                {bondsFiltered().map((bond: BondInfo, index: number) => <Bond info={bond as any} key={index}/>)}
            </div>
            {/*<div className='flex gap-4'>*/}
            {/*    <span className='cursor-pointer px-2.5 p-1 border border-w1 text-center'>1</span>*/}
            {/*    <span className='cursor-pointer px-2.5 p-1 border border-w1 text-center'>2</span>*/}
            {/*    <span className='cursor-pointer px-2.5 p-1 border border-w1 text-center'>3</span>*/}
            {/*</div>*/}
        </div>
    </>
}
