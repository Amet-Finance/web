import {createSlice} from "@reduxjs/toolkit";
import store from "@/store/store";
import GraphqlAPI from "@/modules/api/graphql";
import {defaultChain} from "@/modules/utils/wallet-connect";
import {AccountState} from "@/store/redux/account/type";
import CloudAPI from "@/modules/api/cloud";

const emptyState: AccountState = {
    xp: 0,
    balances: {}
}

const counterSlice = createSlice({
    name: "account",
    initialState: {...emptyState},
    reducers: {
        updateBalance: (state, {payload}) => {
            if (payload) state.balances = payload;
        },
        updateUser: (state, {payload}) => {
            if (payload) {
                state.xp = payload.xp;
            }
        },
    },
});


async function initUser(address: string | undefined) {
    if (!address) return;
    const response = await CloudAPI.getUser(address)
    console.log(response)
    if (response) {
        store.dispatch(counterSlice.actions.updateUser(response))
    }
}

async function initBalances(address: string | undefined) {
    // todo here we need to fix this, defaultChain logic
    if (!address) return;

    const balances = await GraphqlAPI.getBalances(address, defaultChain.id);
    if (balances) {
        store.dispatch(counterSlice.actions.updateBalance(balances))
    }
}

const AccountStore = {
    counterSlice,
    reducer: counterSlice.reducer,
    initBalances,
    initUser
}
export default AccountStore;
