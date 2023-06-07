import { Flex, Button,Image } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { auth, firestore } from '@/Firebase/clientApp';
import { User } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { Text } from '@chakra-ui/react';



const OAuthButton:React.FC = () => {
    const [signInWithGoogle, userCred, loading, error] = useSignInWithGoogle(auth);

    const createUserDocument= async (user:User)=>{
        const userDocRef =doc(firestore,"users",user.uid);
        await setDoc(userDocRef,JSON.parse(JSON.stringify(user)))
    }

    useEffect(() => {
        if(userCred){
            createUserDocument(userCred.user)
        }
     
    
      
    }, [userCred])
    
    return (
        <>
        <Flex direction='column' width={'100%'} mb={4}>
            <Button variant={'oauth'} mb={2} isLoading={loading} onClick={()=>signInWithGoogle()}>
         <Image src='/images/googlelogo.png' height='20px'  mr={4}alt='' />
         Continue with Google

            </Button>
            <Button  variant={'oauth'} mb={2}>Some Other Provider</Button>
            {error && <Text color='red' textAlign={'center'}>{error?.message}</Text>}
        </Flex>
        </>
    )
};
export default OAuthButton;