import {useEffect, useRef, useState} from "react";
import {BondGeneral} from "@/components/pages/bonds/pages/issue/type";
import Bond from "@/components/pages/bonds/utils/bond";
import {join} from "@/modules/utils/styles";
import {getBondsHandler} from "@/components/pages/bonds/utils/bond/functions";
import Loading from "@/components/utils/loading";
import InfoBox from "@/components/utils/info-box";
import SearchSVG from "../../../../../../public/svg/utils/search";
import {useSelector} from "react-redux";
import {RootState} from "@/store/redux/type";


export default function Explore() {
    return <>

    </>
}

function BondsContainer() {

    const generalState = useSelector((item: RootState) => item.general);
    const chainId = generalState.chainId;

    const inputRef = useRef<any>()

    const [search, setSearch] = useState({text: "", hideSold: false, hideNotVerified: false, isTrending: false});
    const [bonds, setBonds] = useState({
        isLoading: false,
        limit: 100,
        skip: 0,
        data: [] as BondGeneral[]
    })

    const {data, skip, limit, isLoading} = bonds

    const onChange = (event: any) => setSearch({
        ...search,
        [event.target.id]: event.target.value
    });

    function bondsFiltered(): BondGeneral[] {
        return data.filter(item => {
            const {total, purchased, interestTokenInfo, investmentTokenInfo, issuer, _id, trending} = item;
            const isSold = total - purchased === 0;

            const searchExists = search.text
            const isNotVerified = !item?.interestTokenInfo?.isVerified || !item?.investmentTokenInfo?.isVerified

            if (search.hideSold && isSold) {
                return false;
            }

            if (search.hideNotVerified && isNotVerified) {
                return false;
            }

            if (search.isTrending && !trending) {
                return false;
            }

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


    const filteredBonds = bondsFiltered();

    useEffect(() => {
        const interval = getBondsHandler([bonds, setBonds], {
            skip,
            limit,
            chainId
        });
        return () => clearInterval(interval);
    }, [limit, skip, chainId]);


    return <>
        <div className="flex flex-col gap-2 justify-center md:p-4 sm:p-0">
            <div className='flex justify-between w-full lg1:flex-row lg1:gap-12 sm:flex-col sm:gap-4'>
                <div className='flex md:items-center sm:items-start md:gap-8 sm:gap-2 md:flex-row sm:flex-col'>
                    <div className='flex gap-2 items-center cursor-pointer'
                         onClick={() => setSearch({...search, hideSold: !Boolean(search.hideSold)})}>
                        <div
                            className={`w-5 h-5 rounded border border-w1 ${search.hideSold ? "bg-green-500" : "bg-b4"}`}/>
                        <InfoBox info={{text: "Toggle this filter to show only available bonds."}}>
                            <span>Hide Sold Out Bonds</span>
                        </InfoBox>
                    </div>
                    <div className='flex gap-2 items-center cursor-pointer'
                         onClick={() => setSearch({...search, hideNotVerified: !Boolean(search.hideNotVerified)})}>
                        <div
                            className={`w-5 h-5 rounded border border-w1 ${search.hideNotVerified ? "bg-green-500" : "bg-b4"}`}/>
                        <InfoBox
                            info={{text: "This filter hides bonds where one or more assets involved are not verified coins by Amet Finance"}}>
                            <span>Hide Unverified Asset Bonds</span>
                        </InfoBox>
                    </div>
                    <div className='flex gap-2 items-center cursor-pointer'
                         onClick={() => setSearch({...search, isTrending: !Boolean(search.isTrending)})}>
                        <div
                            className={`w-5 h-5 rounded border border-w1 ${search.isTrending ? "bg-green-500" : "bg-b4"}`}/>
                        <InfoBox
                            info={{text: "This filter shows only bonds that are trending"}}>
                            <span>Show Trending Only</span>
                        </InfoBox>
                    </div>
                </div>
                <div
                    className='flex gap-4 justify-between px-4 py-2 bg-transparent border border-w1 border-solid rounded text-white lg1:w-[27rem] sm:w-full text-sm cursor-pointer'
                    onClick={() => inputRef?.current?.focus()}>
                    <input type="text"
                           className="placeholder:text-g2 w-full bg-transparent"
                           placeholder='Contract address, Token Symbol or Issuer address'
                           id='text'
                           onChange={onChange}
                           ref={inputRef}
                    />
                    <SearchSVG/>
                </div>
            </div>
            <BondsSection isLoading={isLoading} filteredBonds={filteredBonds}/>
        </div>
    </>
}

function BondsSection({filteredBonds, isLoading}: { filteredBonds: BondGeneral[], isLoading: boolean }) {
    if (isLoading) {
        return <div className='flex items-center justify-center w-full h-56'><Loading percent={-50}/></div>
    }

    if (!filteredBonds.length) {
        return <>
            <div
                className='flex flex-col gap-2 justify-center items-center w-full bg-neutral-950 rounded py-24 px-12 text-center'>
                <span className='md:text-3xl sm:text-2xl font-medium'>No Matching Bonds Found</span>
                <span className='text-g text-sm break-all'>We could not find any bonds that match your current search criteria. Please review your filters or explore other options.</span>
            </div>
        </>
    }

    return <>
        <div
            className="grid xl1:grid-cols-3 lg1:grid-cols-2 md:grid-cols-1 md:gap-6 sm:gap-2 sm:w-full">
            {filteredBonds.map((bond: BondGeneral) => <Bond info={bond} key={bond._id}/>)}
        </div>
    </>
}
