import {configureStore} from "@reduxjs/toolkit";
import AccountStore from "./redux/account"
import TokenStore from "@/store/redux/token";
import ModalStore from "./redux/modal";

const store = configureStore({
    reducer: {
        modal: ModalStore.reducer,
        account: AccountStore.reducer,
        token: TokenStore.reducer
    }
    // todo open if need to hide something
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware({
    //         serializableCheck: {
    //             // Ignore these action types
    //             ignoredActions: ["wallet/initWallet"],
    //             // Ignore these field paths in all actions
    //             ignoredActionPaths: ["meta.arg", "payload.timestamp"],
    //             // Ignore these paths in the state
    //             ignoredPaths: ["wallet.openWalletPopup"],
    //         },
    //     }),
});

export default store;
