import {createSlice} from "@reduxjs/toolkit";
import {ModalTypes} from "@/store/redux/modal/constants";
import store from "@/store/store";

const emptyModalState = {
    type: ModalTypes.None,
    additional: undefined
}

export const counterSlice = createSlice({
    name: "modal",
    initialState: {...emptyModalState},
    reducers: {
        open: (state, action) => {
            state.type = action.payload['type']
            state.additional = action.payload['additional']
        },
        close: (state, action) => {
            state.type = ModalTypes.None;
            state.additional = undefined;
        }
    },
});

const reducer = counterSlice.reducer;
const {open, close} = counterSlice.actions;


function openModal(type: string, additional?: any) {
    return store.dispatch(open({type: type, additional}))
}

function closeModal(){
    return store.dispatch(open({type: ModalTypes.None}))
}

export {
    reducer,
    closeModal,
    openModal
}