import {createSlice} from "@reduxjs/toolkit";
import store from "@/store/store";
import GraphqlAPI from "@/modules/api/graphql";
import {defaultChain} from "@/modules/utils/wallet-connect";
import {AccountState} from "@/store/redux/account/type";

const emptyState: AccountState = {
    balances: {}
}

const counterSlice = createSlice({
    name: "account",
    initialState: {...emptyState},
    reducers: {
        updateBalance: (state, {payload}) => {
            if (payload) state.balances = payload;
        },
    },
});

const reducer = counterSlice.reducer;

const {
    updateBalance,
} = counterSlice.actions;


async function initBalances(address: string | undefined) {
    if (address) {
        // todo here we need to fix this, defaultChain logic
        const balances = await GraphqlAPI.getBalances(address, defaultChain.id);
        if (balances) {
            store.dispatch(updateBalance(balances))
        }
    }
}

const AccountStore = {
    counterSlice,
    reducer,
    initBalances,
}
export default AccountStore;
