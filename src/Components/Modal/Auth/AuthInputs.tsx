import { AuthModalState } from '@/Atoms/authModalAtom';
import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useRecoilValue } from 'recoil';
import Login from './Login';
import SignUp from './SignUp';

type AuthInputsProps = {
    
};

const AuthInputs:React.FC<AuthInputsProps> = () => {
    const modalState=useRecoilValue(AuthModalState)
   return(
    <Flex
    direction='column' align='center' width="center" mt={4}
    >
      {modalState.view==="login" && <Login/>}  
      {modalState.view==="signup" && <SignUp/>}  
        
    </Flex>
   )
}
export default AuthInputs;