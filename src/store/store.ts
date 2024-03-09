import {configureStore} from "@reduxjs/toolkit";
import * as Modal from "./redux/modal"
import * as Account from "./redux/account"

const store = configureStore({
    reducer: {
        modal: Modal.reducer,
        account: Account.reducer
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
