import { Community, CommunityState } from "@/Atoms/communitiesAtom";
import { auth, firestore, storage } from "@/Firebase/clientApp";
import useSelectFile from "@/Hooks/useSelectFile";
import {
  Image,
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Link,
  Stack,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { updateDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import { useSetRecoilState } from "recoil";

type AboutProps = {
  communityData: Community;
};

const About: React.FC<AboutProps> = ({ communityData }) => {
  const [user] = useAuthState(auth);

  const selectedFileRef = useRef<HTMLInputElement>(null);
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();

  const [uploadingImage, setupLoadingImage] = useState(false);
  const setCommunityStateValue = useSetRecoilState(CommunityState);
  const onUpdateImage = async () => {
    if (!selectedFile) return;
    setupLoadingImage(true);
    try {
      const imageRef = ref(storage, `communities/${communityData.id}/image`);

      await uploadString(imageRef, selectedFile, "data_url");
      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(doc(firestore, "communities", communityData.id), {
        imageURL: downloadURL,
      });

      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          ...prev.currentCommunity,
          imageURL: downloadURL,
        } as Community,
      }));
    } catch (error) {
      console.log(error);
    }
    setupLoadingImage(false);
  };

  return (
    <Box position={"sticky"} top={"14px"}>
      <Flex
        justify={"space-between"}
        align={"center"}
        bg={"blue.400"}
        color={"white"}
        borderRadius={"4px 4px 0px 0px"}
        p={3}
      >
        <Text fontSize={"10pt"} fontWeight={700}>
          About Community
        </Text>
        <Icon as={HiOutlineDotsHorizontal}></Icon>
      </Flex>
      <Flex
        direction={"column"}
        p={3}
        bg={"white"}
        borderRadius={"0px 0px 4px 4px"}
      >
        <Stack>
          <Flex width={"100%"} p={2} fontSize={"10pt"} fontWeight={700}>
            <Flex direction={"column"} flexGrow={1}>
              <Text>{communityData?.numberofMembers?.toLocaleString()}</Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction={"column"} flexGrow={1}>
              <Text>1</Text>
              <Text>Online</Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex
            align={"center"}
            width={"100%"}
            p={1}
            fontWeight={500}
            fontSize={"10pt"}
          >
            <Icon as={RiCakeLine} fontSize={18}></Icon>
            {communityData.createdAt && (
              <Text>
                Created{"  "}
                {moment(
                  new Date(communityData.createdAt.seconds * 1000)
                ).format("MMM DD,YYYY")}
              </Text>
            )}
          </Flex>
          <Link href={`/r/${communityData.id}/submit`}>
            <Button mt={3} height={"30px"}>
              Create Post
            </Button>
          </Link>
          {user?.uid === communityData.creatorId && (
            <>
              <Divider />
              <Stack spacing={1} fontSize={"10pt"}>
                <Text fontWeight={600}>Admin</Text>
                <Flex align={"center"} justify={"space-between"}>
                  <Text
                    color={"blue.500"}
                    cursor={"pointer"}
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => {
                      selectedFileRef.current?.click();
                    }}
                  >
                    Change Image
                  </Text>
                  {communityData?.imageURL || selectedFile ? (
                    <Image
                      src={selectedFile || communityData.imageURL}
                      alt="Community Image"
                      borderRadius={"full"}
                      boxSize={"40px"}
                    />
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize={40}
                      color={"brand.100"}
                      mr={2}
                    />
                  )}
                </Flex>
                {selectedFile &&
                  (uploadingImage ? (
                    <Spinner />
                  ) : (
                    <Text cursor={"pointer"} onClick={onUpdateImage}>
                      Save Changes
                    </Text>
                  ))}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/x-png,image/gif,image/jpeg"
                  hidden
                  ref={selectedFileRef}
                  onChange={onSelectFile}
                />
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};
export default About;
