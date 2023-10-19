import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import {Provider} from "react-redux";
import store from "@/store/store";
import ModalHandler from "@/components/modals";
import Headers from "@/components/headers";
import {Montserrat} from 'next/font/google'
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import GoogleAnalytics from "@/components/headers/google-analytics";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {useEffect} from "react";
import {openModal} from "@/store/redux/modal";
import {ModalTypes} from "@/store/redux/modal/constants";
import AmetLoadingFull from "@/components/utils/amet-loading-full";

const montserrat = Montserrat({subsets: ['latin']})

export default function App({Component, pageProps}: AppProps) {
    return <>
        <Provider store={store}>
            <Headers id={pageProps.pageId}/>
            <main className={"flex flex-col justify-between min-h-screen " + montserrat.className}>
                <Navbar/>
                <Component {...pageProps} />
                <Footer/>
            </main>
            <ModalHandler/>
            <ToastContainer/>
            <GoogleAnalytics/>
        </Provider>
    </>
}
