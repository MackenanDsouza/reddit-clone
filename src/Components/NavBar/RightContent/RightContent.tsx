import { Button, Flex } from '@chakra-ui/react';
import React from 'react';
import AuthButtons from './AuthButtons';
import AuthModal from '@/Components/Modal/Auth/AuthModal';
import { User, signOut } from 'firebase/auth';
import {auth} from '../../../Firebase/clientApp'
import Icons from './Icons';
import UserMenu from './UserMenu';
type RightContentProps = {
    user?:User|null;
};

const RightContent:React.FC<RightContentProps> = ({user}) => {
    
    return (<>
    <AuthModal/>
    <Flex justify='center' align='center'>
       {user? <Icons/> :(<AuthButtons/>)}
       <UserMenu user={user}/>
    </Flex>
    </>)
}
export default RightContent;