import {createSlice} from "@reduxjs/toolkit";
import store from "@/store/store";
import {Account} from "@/store/redux/account/type";
import * as CloudAPI from "../../../modules/cloud-api/index"
import {CHAIN_IDS, WalletTypes} from "@/modules/web3/constants";

const emptyState: Account = {
    address: "",
    connection: {
        type: WalletTypes.Metamask // todo update on connect
    },
    chainId: CHAIN_IDS.Mumbai, // todo change later
    balance: {} // serepate by chains
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


async function initiateWallet(address: string, chainId?: string) {
    chainId = chainId || CHAIN_IDS.Mumbai // todo update here
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
