import { Flex, Button,Image, Stack } from '@chakra-ui/react';
import React, { useRef } from 'react';

type ImageUploadProps = {
    selectedFile?:string;
    onSelectImage:(event:React.ChangeEvent<HTMLInputElement>)=>void
    setSelectedTab:(value:string)=>void
    setSelectedFile:(value:string)=>void
};

const ImageUpload:React.FC<ImageUploadProps> = ({
    selectedFile,
    onSelectImage,
    setSelectedFile,
    setSelectedTab,
}) => {
    const selectedFileRef=useRef<HTMLInputElement>(null);
    
    return <Flex justify='center' align='center' width="100%" direction={'column'}>

     {selectedFile?(
        <>
        <Image  alt=""src={selectedFile} maxWidth="400px" maxHeight="400px" />
        <Stack direction='row' mt={4}>
            <Button height={"28px"} onClick={()=>setSelectedTab("Post")}>Back to Post</Button>
            <Button variant='outline' height={'28px'} onClick={()=>setSelectedFile('')}>Remove</Button>

        </Stack>
        </>
     )  :
     
     (<Flex
        justify='center'
        align='center'
        p={20}
        border={"1px dashed"}
        borderColor={"gray.200"}
        width='100%'
        direction='column'
        >
           
        <Button variant={'outline'} onClick={()=>{selectedFileRef.current?.click()}}>Upload </Button>
        <input ref={selectedFileRef} type="file" hidden
        onChange={onSelectImage}
        />

        </Flex>)}
    </Flex>
}
export default ImageUpload;