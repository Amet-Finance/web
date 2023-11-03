import Styles from "./index.module.css";
import Image from "next/image";
import {useRef} from "react";
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
        <main className="relative flex flex-col min-h-screen md:pt-20 sm:pt-10 gap-20">
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
                    <p className={Styles.paragraphText}>{Texts.pMain}</p>
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
                    {/*<h2 className="text-2xl font-bold">Bonds</h2>*/}
                    <div
                        className='flex justify-center md:gap-32 sm:gap-14 w-full md:flex-row sm:flex-col md:items-start sm:items-center'>
                        <div className={join([Styles.bondImage])}>
                            <Image src={'./svg/Bond.svg'} alt={"Bond"} fill/>
                        </div>
                        <div className={Styles.bondInfoTexts}>
                            <div className={Styles.bondInfoText}>
                                <h3 className='text-xl font-bold'>Decentralized Access</h3>
                                <p className={Styles.bondInfoParagraph}>{Texts.pBondsDa}</p>
                            </div>
                            <div className={Styles.bondInfoText}>
                                <h3 className='text-xl font-bold'>Enhanced Liquidity and Versatility</h3>
                                <p className={Styles.bondInfoParagraph}>{Texts.pBondsELV}</p>
                            </div>
                            <div className={Styles.bondInfoText}>
                                <h3 className='text-xl font-bold'>Smart Contract Security</h3>
                                <p className={Styles.bondInfoParagraph}>{Texts.pBondsSs}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={Styles.statsAndDocs}>
                <div className={Styles.statistics}>
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
                <Link href={URLS.Docs} target="_blank">
                    <div className={Styles.documentation}>
                        <h3 className="absolute text-4xl font-bold z-10">DOCUMENTATION</h3>
                        <BackgroundDocumentsSVG/>
                    </div>
                </Link>
            </div>
        </main>
    </>
}
