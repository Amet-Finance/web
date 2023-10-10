import {createSlice} from "@reduxjs/toolkit";
import store from "@/store/store";
import {Account} from "@/store/redux/account/type";
import * as CloudAPI from "../../../modules/cloud-api/index"
import {DEFAULT_CHAIN_ID} from "@/modules/web3/constants";

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
            state.address = payload.address;
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
    switchChain
} = counterSlice.actions;

function connectWallet(address: string) {
    store.dispatch(connect({
        address
    }))
}

function disconnectWallet() {
    return store.dispatch(disconnect())
}

async function initBalance(address: string) {
    const balance = await CloudAPI.getBalance({address, chainId: DEFAULT_CHAIN_ID});
    if (balance) {
        delete balance._id;
        store.dispatch(updateBalance(balance))
    }
}

async function initWallet(address: string) {
    connectWallet(address);
    await initBalance(address);
}

function changeChain(chainId: string) {
    store.dispatch(switchChain(chainId))
}

export {
    counterSlice,
    reducer,
    initWallet,
    connectWallet,
    initBalance,
    disconnectWallet,
    changeChain
}