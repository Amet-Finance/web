import {createSlice} from "@reduxjs/toolkit";
import store from "@/store/store";
import {Account} from "@/store/redux/account/type";
import * as CloudAPI from "../../../modules/cloud-api/index"

const emptyState: Account = {
    balance: {} // serepate by chains
}

const counterSlice = createSlice({
    name: "account",
    initialState: {...emptyState},
    reducers: {
        updateBalance: (state, {payload}) => {
            const {balance, chainId} = payload;
            state.balance[chainId] = balance;
        },
    },
});

const reducer = counterSlice.reducer;

const {
    updateBalance,
} = counterSlice.actions;


async function initBalance(address: string | undefined, chainId: number) {
    if (address) {
        const balance = await CloudAPI.getBalance({address, chainId});
        if (balance) {
            delete balance._id;
            store.dispatch(updateBalance({balance, chainId}))
        }
    }
}

export {
    counterSlice,
    reducer,
    initBalance,
}
