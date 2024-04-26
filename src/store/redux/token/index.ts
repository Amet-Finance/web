import {createSlice} from "@reduxjs/toolkit";
import {TokensResponse} from "@/modules/api/type";
import CloudAPI from "@/modules/api/cloud";
import {StringKeyedObject} from "@/components/utils/types";
import store from "@/store/store";

// chainId => contractAddress => TokenResponse
const emptyState: StringKeyedObject<TokensResponse> = {}

const counterSlice = createSlice({
    name: "token",
    initialState: {...emptyState},
    reducers: {
        updateTokens: (state, {payload}: { payload: TokensResponse }) => {
            if (payload) {
                for (const tokenId in payload) {
                    const token = payload[tokenId];
                    if (!state[token.chainId]) state[token.chainId] = {};
                    state[token.chainId][token.contractAddress] = token
                }
            }
        },
    },
});

const reducer = counterSlice.reducer;

const {updateTokens,} = counterSlice.actions;


async function initTokens() {
    const tokens = await CloudAPI.getTokens({verified: true});
    if (tokens) {
        store.dispatch(updateTokens(tokens))
    }
}

const TokenStore = {
    counterSlice,
    reducer,
    initTokens,
}

export default TokenStore;
