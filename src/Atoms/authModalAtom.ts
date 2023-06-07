import {atom} from "recoil"


export interface AuthModalState{
    open:boolean;
    view:'login'|'signup'|'resetPassword';
}

const defaultModalState:AuthModalState={
    open:false,
    view:"login"
}

export const AuthModalState=atom<AuthModalState>({
   key:'authModalState' ,
   default:defaultModalState,
})