import {createSlice} from "@reduxjs/toolkit";
import store from "@/store/store";
import {Account, ConnectPayload} from "@/store/redux/account/type";
import * as CloudAPI from "../../../modules/cloud-api/index"

const emptyState: Account = {
    address: "",
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
        disconnect: (state) => {
            state.address = "";
        }
    },
});

const reducer = counterSlice.reducer;

const {connect, updateBalance, disconnect} = counterSlice.actions;

function connectWallet({address}: ConnectPayload) {
    store.dispatch(connect({
        address
    }))
}

function disconnectWallet() {
    return store.dispatch(disconnect())
}

async function initBalance(address: string) {
    const balance = await CloudAPI.getBalance(address);
    if (balance) {
        delete balance._id;
        store.dispatch(updateBalance(balance))
    }
}

async function initWallet(address: string) {
    connectWallet({address});
    await initBalance(address);
}

export {
    counterSlice,
    reducer,
    initWallet,
    connectWallet,
    initBalance,
    disconnectWallet
}