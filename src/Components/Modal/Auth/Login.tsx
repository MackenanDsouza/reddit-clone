import { AuthModalState } from '@/Atoms/authModalAtom';
import { Button, Flex, Input,Text } from '@chakra-ui/react';
import React, { FormEvent, useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/Firebase/clientApp';
import { useSetRecoilState } from 'recoil';
import { FIREBASE_ERRORS } from '@/Firebase/error';

type LoginProps = {
    
};

const Login:React.FC<LoginProps> = () => {
    const setAuthModalState=useSetRecoilState(AuthModalState)
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useSignInWithEmailAndPassword(auth);
    const[loginForm,setLoginForm]=useState({
        email:"",
        password:"",
    })
     const onSubmit=(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        signInWithEmailAndPassword(loginForm.email,loginForm.password)

     }
     const onChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
        setLoginForm(prev=>({
            ...prev,
            [event.target.name]:event.target.value,
        }))
     }
    return (
        <form onSubmit={onSubmit}>
            <Input name='email' placeholder="Email"
            type='email'
            mb={2} 
            onChange={onChange}
            fontSize='10pt'
            _placeholder={{color:"gray.500"}}
            _hover={{
                bg:'white',
                border:"1px solid",
                borderColor:'blue.500',
            }}
            _focus={{
                outline:'none',
                bg:'white',
                border:"1px solid",
                borderColor:'blue.500',

            }}
            bg="gray.50"
            required/>
            <Input name='password' placeholder="Password" type='password'
            mb={2}
            onChange={onChange}
            fontSize='10pt'
            _placeholder={{color:"gray.500"}}
            _hover={{
                bg:'white',
                border:"1px solid",
                borderColor:'blue.500',
            }}
            _focus={{
                outline:'none',
                bg:'white',
                border:"1px solid",
                borderColor:'blue.500',

            }}
            bg="gray.50"
            required/>
                <Text color={'red'}  textAlign={'center'} fontSize={'10pt'}>{FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}</Text>
            <Button type="submit" mt={2} mb={2} width='100%' height='36px' isLoading={loading}>Log In</Button>
            <Flex mb={2} fontSize='9pt' justifyContent='center'>
                <Text mr={1}>Forgot your password?</Text>
                <Text color="blue.500" fontWeight={700} cursor={'pointer'} 
               
               onClick={()=>setAuthModalState(prev=>({
                ...prev,
                view:'resetPassword'

               }))}>Reset</Text>
            </Flex>
            <Flex fontSize='9pt' justifyContent='center'>
                <Text mr={1}>New here?</Text>
                <Text color="blue.500" fontWeight={700} cursor={'pointer'} 
               
               onClick={()=>setAuthModalState(prev=>({
                ...prev,
                view:'signup'

               }))}>SIGN UP</Text>
            </Flex>
        </form>
    )
}
export default Login;