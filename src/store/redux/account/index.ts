import {createSlice} from "@reduxjs/toolkit";
import store from "@/store/store";
import {Account} from "@/store/redux/account/type";
import * as CloudAPI from "../../../modules/cloud-api/index"
import {DEFAULT_CHAIN_ID, WalletTypes} from "@/modules/web3/constants";

const emptyState: Account = {
    address: "",
    chainId: DEFAULT_CHAIN_ID,
    balance: {}
}

const counterSlice = createSlice({
    name: "account",
    initialState: {...emptyState},
    reducers: {
        connect: (state, {payload}) => {
            state.address = payload;
        },
        connectAndSwitch: (state, {payload}) => {
            state.address = payload.address;
            state.chainId = payload.chainId;
        },
        updateBalance: (state, {payload}) => {
            state.balance = payload
        },
        switchChain: (state, {payload}) => {
            state.chainId = payload
        },
        disconnect: (state) => {
            state.address = "";
        }
    },
});

const reducer = counterSlice.reducer;

const {
    connect,
    updateBalance,
    disconnect,
    connectAndSwitch
} = counterSlice.actions;


async function initiateWallet(address: string, chainId: string) {
    store.dispatch(connectAndSwitch({address, chainId}))

    // API calls here
    await initBalance(address, chainId);
}

function disconnectWallet() {
    return store.dispatch(disconnect())
}

async function initBalance(address: string, chainId: string) {
    const balance = await CloudAPI.getBalance({address, chainId});
    if (balance) {
        delete balance._id;
        store.dispatch(updateBalance(balance))
    }
}

export {
    counterSlice,
    reducer,
    initiateWallet,
    initBalance,
    disconnectWallet
}