import Styles from "./index.module.css";
import Image from "next/image";
import {useRef, useState} from "react";
import BackgroundDocumentsSVG from "../../../../public/svg/background-documents";
import Link from "next/link";
import {join} from "@/modules/utils/styles";
import {URLS} from "@/modules/utils/urls";


const Texts = {
    pMain: "Welcome to Amet Finance, your gateway to the future of decentralized finance. We empower individuals and communities by providing innovative DeFi solutions, enabling you to take control of your financial future.",
    pBonds1: "Discover the power of on-chain bonds with Amet Finance. Our bond offerings open up a world of possibilities, allowing you to invest, trade, and grow your assets seamlessly in the decentralized finance (DeFi) space.",
    pBonds2: "With a user-friendly interface, transparent processes, and robust security, Amet Finance bonds are designed to provide you with a trusted and rewarding investment experience. Explore our diverse bond options and start shaping your financial future today.",
    pBondsDa: "Experience financial inclusivity like never before. On-chain bonds give you direct access to bond markets, breaking down the walls of traditional finance.",
    pBondsELV: "On-chain bonds offer increased liquidity and versatility, empowering users to trade and manage their bond investments effortlessly, while adapting their strategies to suit their unique needs and preferences.",
    pBondsSs: "Trust in smart contract technology. On-chain bonds are backed by secure, transparent smart contracts, safeguarding your investments and eliminating intermediaries."
}

export default function Home() {
    const bondsRef = useRef<any>(null);
    const scrollToView = () => bondsRef.current.scrollIntoView({behavior: "smooth", block: "start", inline: "start"})

    return <>
        <main className="relative flex flex-col min-h-screen md:pt-20 sm:pt-10 gap-24">
            <div className={Styles.sections}>
                <div className="absolute right-0 md:flex sm:hidden">
                    <Image src='./svg/VectorHash.svg' width={450} height={780} alt={"K"}/>
                </div>
                <div className="relative flex flex-col gap-8 w-full md:items-start sm:items-center">
                    <h1 className="font-bold lg:text-6xl lg:leading-tight sm:text-5xl sm:leading-normal">
                        Empowering <span className="bg-white text-black px-1">Your</span><br/>
                        Financial Future <br/>
                        In DeFI
                    </h1>
                    <div className="h-px md:w-1/5 sm:w-full bg-white"/>
                    <p className="text-g max-w-[45%]">{Texts.pMain}</p>
                    <div className="flex md:flex-row sm:flex-col items-center gap-8 w-full">
                        <Link href='/bonds' className='md:w-max sm:w-full'>
                            <button className={join([Styles.btn, "w-full"])}>Get Started</button>
                        </Link>
                        <Link href={URLS.FAQ_WIAF} target="_blank" className='md:w-max sm:w-full'>
                            <button className={join([Styles.learnMore, Styles.btn, "w-full"])}>Learn More</button>
                        </Link>
                    </div>
                </div>
                <div className={Styles.sectionDown + " animate-bounce"} onClick={scrollToView}>
                    <div className={Styles.hz}/>
                    <div className={Styles.cl}>
                        <span>B</span>
                    </div>
                </div>
            </div>
            <div className={Styles.sections}>
                <div className={join([Styles.bondBackgroundImage, "md:flex sm:hidden"])}>
                    <Image src={'./svg/Circle.svg'} alt={"C"} fill/>
                </div>
                <div className={Styles.bondsSection} ref={bondsRef}>
                    <h2 className="text-3xl font-bold">On-Chain Bonds</h2>
                    <div
                        className='flex justify-center md:gap-32 sm:gap-14 w-full md:flex-row sm:flex-col md:items-start sm:items-center'>
                        <div className={Styles.bondImage}>
                            <Image src='./svg/Bond.svg' alt={"Bond"} fill/>
                        </div>
                        <div className={Styles.bondInfoTexts}>
                            <div className={Styles.bondInfoText}>
                                <h3 className='text-xl font-bold'>Decentralized Access</h3>
                                <p className="text-g max-w-[400px]">{Texts.pBondsDa}</p>
                            </div>
                            <div className={Styles.bondInfoText}>
                                <h3 className='text-xl font-bold'>Enhanced Liquidity and Versatility</h3>
                                <p className="text-g max-w-[400px]">{Texts.pBondsELV}</p>
                            </div>
                            <div className={Styles.bondInfoText}>
                                <h3 className='text-xl font-bold'>Smart Contract Security</h3>
                                <p className="text-g max-w-[400px]">{Texts.pBondsSs}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={Styles.statistics + " py-10"}>
                <div className={Styles.stat}>
                    <span className="font-bold text-4xl">$100K+</span>
                    <span className="text-xs text-g">Total Value Locked (TVL)</span>
                </div>
                <div className={Styles.stat}>
                    <span className="font-bold text-4xl">2,500+</span>
                    <span className="text-xs text-g">Number of Active Users</span>
                </div>
                <div className={Styles.stat}>
                    <span className="font-bold text-4xl">250+</span>
                    <span className="text-xs text-g">Total Bonds Issued</span>
                </div>
                <div className={Styles.stat}>
                    <span className="font-bold text-4xl">85%</span>
                    <span className="text-xs text-g">Bond Redemption Rate</span>
                </div>
            </div>
            <div className={Styles.sections}>
                <FAQ/>
            </div>

            <Link href='/bonds' target="_blank">
                <div
                    className='flex justify-center items-center bg-b4 w-full hover:bg-white hover:text-black py-20 cursor-pointer'>
                    <span className='font-bold text-2xl'>Start Growing Your Wealth!</span>
                </div>
            </Link>

        </main>
    </>
}


function FAQ() {
    const [selectedId, selectId] = useState(1);
    const questions = [
        {
            title: "What are On-Chain Bonds?",
            answer: "On-Chain Bonds are a novel financial instrument that allows token owners and traders to raise capital, execute trading strategies, and engage with their communities directly. They combine the power of blockchain technology with decentralized finance (DeFi) principles.",
        },
        {
            title: "How can I issue bonds for my project?",
            answer: "Issuing bonds is simple on Amet Finance. Go to the 'Issue' page, connect your wallet, and fill out the necessary details, including the total bond amount, lock period, investment token, and interest token. Read and accept the terms, and you're ready to issue bonds.",
        },
        {
            title: "What's the benefit for bond purchasers?",
            answer: "Purchasers can support projects they believe in, earn interest on their investments, and engage directly with token owners. It's a win-win situation that fosters community participation and trust.",
        },
        {
            title: "What's the use-case for alpha traders?",
            answer: "Alpha traders can utilize bonds to amplify trading strategies by gaining access to additional capital. They can issue bonds to fund profitable trades, manage risks, and engage with their trading communities.",
        },
        {
            title: "Why choose On-Chain Bonds over traditional fundraising methods?",
            answer: "On-Chain Bonds offer a less aggressive and more community-oriented way to raise funds compared to selling tokens in the open market. They allow projects to foster community growth, engage supporters, and build trust while maintaining token price stability.",
        },
    ];

    return <>
        <h4 className='text-3xl font-semibold'>Frequently Asked Questions</h4>
        <div className='flex flex-col gap-4 w-full'>
            {questions.map((item, index) => {
                const isSelected = index === selectedId;
                const selectItemId = () => selectId(isSelected ? -1 : index)

                return <>
                    <div className='flex flex-col gap-4 w-full text-start'>
                        <div className='flex flex-col gap-2 w-full'>
                            <div className='flex justify-between items-center cursor-pointer' onClick={selectItemId}>
                                <span className='text-start text-xl font-semibold'>{item.title}</span>
                                <button className='text-3xl font-semibold'>{isSelected ? "-" : "+"}</button>
                            </div>
                            {isSelected && <span className='text-g text-sm max-w-[80%]'>{item.answer}</span>}
                        </div>
                        <div className='h-px bg-g5 w-full'/>
                    </div>
                </>
            })}
        </div>
    </>
}
