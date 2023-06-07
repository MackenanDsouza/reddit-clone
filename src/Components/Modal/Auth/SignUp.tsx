import { AuthModalState } from '@/Atoms/authModalAtom';
import { auth, firestore } from '@/Firebase/clientApp';
import { FIREBASE_ERRORS } from '@/Firebase/error';
import { Input, Button, Flex ,Text} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import {useCreateUserWithEmailAndPassword} from 'react-firebase-hooks/auth'
import { User } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';


const SignUp:React.FC = () => {
    
    const setAuthModalState=useSetRecoilState(AuthModalState)
    const[signUpForm,setSignUpForm]=useState({
        email:"",
        password:"",
        confirmPassword:"",
    })
    const[error,setError]=useState('')


    const [
        createUserWithEmailAndPassword,
        userCred,
        loading,
        userError,
      ] = useCreateUserWithEmailAndPassword(auth);


     const onSubmit=(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();

        if(error)
        setError('')
        if(signUpForm.password!== signUpForm.confirmPassword){
            setError("Passwords do not match");
             return;
        }
        createUserWithEmailAndPassword(signUpForm.email,signUpForm.password)

     }
     const onChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
        setSignUpForm(prev=>({
            ...prev,
            [event.target.name]:event.target.value,
        }))
     }

     const createUserDocument= async (user:User)=>{
        await addDoc(collection(firestore,"users"),JSON.parse(JSON.stringify(user)));
     }

     useEffect(() => {
       if(userCred)
       createUserDocument(userCred.user)
     
     
     }, [userCred])
     



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
            <Input name='confirmPassword' placeholder="Confirm password" type='password'
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
        
        
            <Text textAlign={'center'} color='red' fontSize={'10pt'}>
            {error||FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
            </Text>
        
            <Button type="submit" mt={2} mb={2} width='100%' height='36px' isLoading={loading}>Sign UP</Button>
            <Flex fontSize='9pt' justifyContent='center'>
                <Text mr={1}>Already a redditor?</Text>
                <Text color="blue.500" fontWeight={700} cursor={'pointer'} 
               
               onClick={()=>setAuthModalState(prev=>({
                ...prev,
                view:'login'

               }))}>Log In</Text>
            </Flex>
        </form>
    )
}
export default SignUp;