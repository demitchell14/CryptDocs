import React, {useEffect, useRef, useState} from 'react';
import styled from "styled-components";
import {
    Box,
    Button,
    Flex,
    Grid,
    Heading,
    StyledOcticon,
    Text,
    TextInput,
    themeGet
} from "@primer/components";
import DocEditor from "../../components/DocEditor";
import {EyeClosedIcon, EyeIcon, LockIcon, UnlockIcon} from "@primer/octicons-react";
import { encrypt, decrypt } from '../../controllers/encryption';
import {bitLengthToString} from "../../util";

type Props = any;

const Divider = styled.div`
    height: 1px;
    background: ${themeGet('colors.border.primary')};
    margin-left: -${themeGet('space.2')};
    margin-right: -${themeGet('space.2')};
    margin-top: calc(${themeGet('space.3')} - 1px);
    margin-bottom: ${themeGet('space.3')};
`;

const DeleteButton = styled.button`
    color: ${themeGet('colors.btn.danger.text')};
    &:hover, &:focus {
        background-color: ${themeGet('colors.btn.danger.hoverBg')};
        color: ${themeGet('colors.btn.danger.hoverText')};
        border-color: ${themeGet('colors.btn.danger.hoverBorder')};
    }
    &:active {
        background-color: ${themeGet('colors.btn.danger.selectedBg')};
        color: ${themeGet('colors.btn.danger.selectedText')};
        border-color: ${themeGet('colors.btn.danger.selectedBorder')};
    }
`;

const ActionButton = styled.button`
    @media (min-width: ${themeGet('breakpoints.2')}) {
        margin-right: ${themeGet('space.2')};
    }
`;

const ActionFlex = styled.div`
    flex-direction: column;
    @media (min-width: ${themeGet('breakpoints.0')}) {
        flex-direction: row;
    }
    ${ActionButton}, ${DeleteButton} {
        margin: ${themeGet('space.2')};
        flex-grow: 1;
        @media (min-width: ${themeGet('breakpoints.2')}) {
            flex-grow: 0;
        }
    }
    ${DeleteButton} {
        flex-grow: 0;
     }
`;

const InfoGrid = styled.div`
    display: block;
    width: 100%;
    @media (min-width: ${themeGet('breakpoints.2')}) {
        width: unset;
        display: grid;
    }
`;

const ResponsiveBox = styled.div`
    flex-direction: column;
    @media (min-width: ${themeGet('breakpoints.2')}) {
        flex-direction: row;
    }
`;

const ActionBox = styled.div`
    width: 100%;
    @media (min-width: ${themeGet('breakpoints.2')}) {
        width: unset;
        text-align: right;
    }    
`;

const WriteContainer = styled.div`
    display: flex
`

const EditorContainer = styled.div`
    // margin-left: ${themeGet('space.4')};
    // margin-right: ${themeGet('space.4')};
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: 100%;
`

const encryptedCheck = `<!--encrypted-->
<pre>-----BEGIN PGP MESSAGE-----`

function Write(props: Props) {
    const container = useRef<HTMLDivElement | null>(null);
    const header = useRef<HTMLDivElement | null>(null);
    const footer = useRef<HTMLDivElement | null>(null);
    const contentSize = useRef(0);
    const encryptedSize = useRef(0);
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [locked, setLocked] = useState(false);
    const [ content, setContent ] = useState<string | undefined>();
    const [ encrypted, setEncrypted ] = useState<string | undefined>();

    const showEncrypted = typeof content === 'undefined' && typeof encrypted === 'string'

    const onSaveContent = (nextContent: string) => {
        if (nextContent.startsWith(encryptedCheck))
            return;
        contentSize.current = new Blob(Array.from(nextContent)).size;
        setContent(nextContent)
    }

    useEffect(() => {
        console.log({
            contentLength: bitLengthToString(contentSize.current),
            encryptedLength: bitLengthToString(encryptedSize.current)
        })
    }, [content, encrypted]);

    const showHidePassword = passwordHidden ? EyeIcon : EyeClosedIcon;
    const togglePasswordHidden = () => setPasswordHidden(!passwordHidden);

    const lockedIcon = locked ? UnlockIcon : LockIcon;
    const lockedTitle = locked ? 'Decrypt the document using the password provided' : 'Encrypt the document and hide it from view.'
    const handleLockedState = async () => {
        if (locked) {
            // TODO handle decrypting the content
            if (typeof encrypted === 'undefined') {
                return;
            }
            const decryptedData = await decrypt(encrypted, 'password');
            setEncrypted(undefined);
            setContent(decryptedData as string);
            setLocked(false);
        } else {
            // TODO encrypt the content and remove the regular content
            if (!(content && content.length > 0))
                return;
            const encryptedString = await encrypt('noname', content,'password', true);
            encryptedSize.current = new Blob(Array.from(encryptedString)).size;
            setEncrypted(encryptedString);
            setContent(undefined);
            setLocked(true);
        }
    }

    const onSaveDocument = async () => {
        if (!(content && content.length > 0)) {
            return;
        }
        const encryptedString = await encrypt('noname', content, 'password', true);
        console.log(encryptedString);
        setEncrypted(encryptedString);
        alert('actually save this somewhere, ofc...');
    }

    // -- Resize Handlers
    const resizeEditor = () => {
        if (container.current && header.current && footer.current) {
            container.current.style.height = `${window.innerHeight - container.current.offsetTop + footer.current.offsetHeight}px`
        }
    }
    useEffect(() => {
        resizeEditor();
        window.addEventListener('resize', resizeEditor);
        return () => window.removeEventListener('resize', resizeEditor)
    }, []);
    // -- End Resize Handlers

    return (
        <WriteContainer>
            <div>
                {/*left panel*/}
            </div>
            <EditorContainer ref={container}>
                <Box px={2} ref={header}>
                    <Heading>Document Editor</Heading>
                    <Text as={'p'} mb={2} mt={0}>
                        In order to utilize this app, each document must be secured with a password.
                        Without this password, the document will be unreadable, as it will be an encrypted openPGP
                        string. With an account, you have the ability to create a {'"'}master password{'"'} that will be used
                        encrypt documents that you choose not to create dedicated passwords for.
                    </Text>
                    <Divider />
                    <ResponsiveBox as={Box} display={'flex'} my={2} alignItems={'flex-end'}>
                        <InfoGrid
                            as={Grid}
                            mr={'auto'}
                            gridTemplateColumns={"repeat(3, auto)"}
                            gridGap={2}
                            alignItems={'center'}
                        >
                            <Box><Text mr={2} as={'label'}>Document Title:</Text></Box>
                            <Box><TextInput width={'100%'} type={'text'} /></Box>
                            <Box>TODO status/info??</Box>
                            <Box><Text mr={2} as={'label'}>Document Password:</Text></Box>
                            <Box display={'flex'}>
                                <TextInput sx={{ flexGrow: 1 }} type={passwordHidden ? 'password' : 'text'} />
                                <Button ml={1} title={'Show/Hide Password'} onClick={togglePasswordHidden}>
                                    <StyledOcticon icon={showHidePassword} />
                                </Button>
                            </Box>
                            <Box>TODO status/info??</Box>
                        </InfoGrid>

                        {bitLengthToString(contentSize.current, true)}

                        <ActionBox as={Box}>
                            <Text as={'small'} display={'block'} color={'text.secondary'}>Last Save: {new Date().toString()}</Text>
                            <ActionFlex as={Flex} mt={2} gridGap={2}>
                                <ActionButton as={Button} title={lockedTitle} onClick={handleLockedState}>
                                    <StyledOcticon icon={lockedIcon} />
                                    {' '}
                                    {locked ? 'Unlock' : 'Lock'}
                                </ActionButton>
                                <ActionButton onClick={onSaveDocument} as={Button}>Save Document</ActionButton>
                                <DeleteButton as={Button}>Delete Document</DeleteButton>
                            </ActionFlex>
                        </ActionBox>
                    </ResponsiveBox>
                </Box>
                <DocEditor
                    value={showEncrypted ? `<!--encrypted--><pre>${encrypted}</pre>` : content}
                    valueByteLength={contentSize.current}
                    onSave={onSaveContent}
                    disabled={showEncrypted}
                />
                <div ref={footer}>
                    <Text as={'small'} display={'block'} color={'text.tertiary'}>
                        All documents created using CryptDocs are stored <Text fontWeight={'bold'}>Locally</Text> within
                        your browser, encrypted using the openPGP standard. If you have an account with us, we offer
                        the ability to store your encrypted documents on our servers, so you can sync your account across
                        any device that can use this app.
                    </Text>
                    <Text as={'small'} display={'block'} color={'text.tertiary'}>
                        This app is also fully offline capable, meaning even if you do not have an internet connection,
                        you{"'"}ll still be able to create and view documents (as long as you don{"'"}t clear the browser data
                        associated with this website, of course).
                    </Text>
                </div>
            </EditorContainer>
        </WriteContainer>
    );
}

export type WriteProps = Props;
export default Write;