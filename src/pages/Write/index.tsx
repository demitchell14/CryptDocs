import React, {ReactNode, KeyboardEvent, useCallback, useEffect, useRef, useState, useMemo} from 'react';
import styled from "styled-components";
import {
    Box,
    Button, ButtonDanger, ButtonGroup, Flash, FlashProps,
    Flex,
    Grid,
    Heading, Popover,
    StyledOcticon,
    Text,
    TextInput,
    themeGet, useTheme
} from "@primer/components";
import DocEditor from "../../components/DocEditor";
import {EyeClosedIcon, EyeIcon, LockIcon, UnlockIcon} from "@primer/octicons-react";
import { encrypt, decrypt } from '../../controllers/encryption';
import {bitLengthToString} from "../../util";
import DocExplorerSidebar from "../../components/DocExplorerSidebar";
import useIndexedDB from "../../hooks/useIndexedDB";
import {nanoid} from "@reduxjs/toolkit";
import {useParams} from 'react-router-dom';
import ClickListener from "../../components/ClickListener";
import useMediaQuery from "../../hooks/useMediaQuery";

type AlertMessage = {
    message: string | ReactNode;
    variant?: FlashProps['variant'];
}

type Params = {
    id?: string;
}

const FormGrid = styled(Grid)``

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

const InfoGrid = styled(Grid)`
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

function Write() {
    const isMobile = useMediaQuery('(min-width: 600px)');
    const { id: documentId } = useParams<Params>()
    const { theme } = useTheme();
    const indexedDB = useIndexedDB();
    const container = useRef<HTMLDivElement | null>(null);
    const header = useRef<HTMLDivElement | null>(null);
    const footer = useRef<HTMLDivElement | null>(null)
    const contentSize = useRef(0);
    const encryptedSize = useRef(0);
    const storedEncryptedString = useRef<string | undefined>();
    const storedPassword = useRef<string>('');
    const confirmPasswordInput = useRef<HTMLInputElement | null>(null)
    const otherMeta = useRef<any>({});
    const [enabled, setEnabled] = useState(true);
    const [title, setTitle] = useState('');
    const [password, setPassword] = useState('');
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [showChangePasswordPopover, setShowChangePasswordPopover] = useState(false);
    const [locked, setLocked] = useState(typeof documentId !== 'undefined');
    const [ content, setContent ] = useState<string | undefined>();
    const [ encrypted, setEncrypted ] = useState<string | undefined>();
    const [hasError, setHasError] = useState<string | undefined>();
    const [alertMessage, setAlertMessage] = useState<AlertMessage | undefined>()

    const showEncrypted = useMemo(() => typeof content === 'undefined' && typeof encrypted === 'string', [content, encrypted]);

    const onChangeTitle = useCallback((e: React.SyntheticEvent<HTMLInputElement>) => setTitle(e.currentTarget.value), [])
    const onChangePassword = useCallback((e: React.SyntheticEvent<HTMLInputElement>) => setPassword(e.currentTarget.value), []);

    const onSaveContent = useCallback((nextContent: string) => {
        if (nextContent.startsWith(encryptedCheck))
            return;
        contentSize.current = new Blob(Array.from(nextContent)).size;
        setContent(nextContent)
    }, [encryptedCheck])


    const showHidePassword = useMemo(() => passwordHidden ? EyeIcon : EyeClosedIcon, [passwordHidden]);
    const togglePasswordHidden = useCallback(() => {
        setHasError(undefined);
        setPasswordHidden((prev) => !prev);
    }, []);

    const lockedIcon = useMemo(() => locked ? UnlockIcon : LockIcon, [locked]);
    const lockedTitle = useMemo(() => locked ? 'Decrypt the document using the password provided' : 'Encrypt the document and hide it from view.', [locked])
    const handleLockedState = useCallback(async () => {
        if (locked) {
            // TODO handle decrypting the content
            if (typeof encrypted === 'undefined') {
                return;
            }
            decrypt(encrypted, password)
                .then((decryptedData) => {
                    storedPassword.current = password
                    setEncrypted(undefined);
                    setContent(decryptedData as string);
                    setAlertMessage(undefined)
                    setHasError(undefined)
                    setLocked(false);
                })
                .catch((err) => {
                    console.error(err);
                    setAlertMessage({
                        message: 'You entered an incorrect password.',
                        variant: 'danger'
                    })
                    setHasError('password');
                });
        } else {
            // TODO encrypt the content and remove the regular content
            if (!(content && content.length > 0))
                return;

            const usedPassword = password || storedPassword.current;

            if (storedEncryptedString.current) {
                const decrypted = await decrypt(storedEncryptedString.current, usedPassword).catch((err) => err)
                if (decrypted instanceof Error) {
                    setShowChangePasswordPopover(true)
                    return;
                }
            }

            console.log({ password, storedPassword: storedPassword.current, b: !password && storedPassword.current })

            if (!password && storedPassword.current) {
                console.log('show alert')
                setAlertMessage({
                    message: 'Locked document with current password.'
                })
            }

            const encryptedString = await encrypt(title, content, usedPassword);
            encryptedSize.current = new Blob(Array.from(encryptedString)).size;
            storedPassword.current = ''
            setEncrypted(encryptedString);
            setContent(undefined);
            setLocked(true);
            setPassword('');
        }
    }, [locked, encrypted, password]);

    const onSaveDocument = useCallback((newPassword = false) => async () => {
        if (!(content && content.length > 0)) {
            return;
        }

        if ([storedPassword.current, ''].indexOf(password) === -1 && !newPassword) {
            setShowChangePasswordPopover(true);
            return
        }

        if (newPassword && storedPassword.current !== password) {
            if (password !== confirmPasswordInput.current?.value) {
                console.error('confirm password incorrect')
                setHasError('confirmPassword')
                return;
            }
        }

        const modifiedAt = new Date();
        const encryptedString = await encrypt(title, content, password || storedPassword.current)
        encryptedSize.current = new Blob(Array.from(encryptedString)).size;
        setEncrypted(encryptedString);

        if (documentId) {
            await indexedDB.update('documents-meta', documentId, { ...otherMeta.current, title, modifiedAt, encryptedSize: encryptedSize.current, contentSize: contentSize.current });
            await indexedDB.update('documents-data', documentId, encryptedString);
        } else {
            const index = nanoid(64);
            await indexedDB.insert('documents-meta', index, { ...otherMeta.current, title, modifiedAt, encryptedSize: encryptedSize.current, contentSize: contentSize.current });
            await indexedDB.insert('documents-data', index, encryptedString);
        }

        setHasError(undefined)
        if (confirmPasswordInput.current) {
            confirmPasswordInput.current.value = ''
        }
        storedEncryptedString.current = encryptedString;
        closeChangePassword()

        setAlertMessage({
            message: !password && storedPassword.current
                ? 'Saved document with current password.'
                : 'Successfully saved document.'
        })
    }, [content, title, password, indexedDB]);

    const onPasswordEntered = useCallback((evt: KeyboardEvent) => {
        if (evt.key !== 'Enter') {
            return
        }
        handleLockedState()
    }, [handleLockedState])

    const closeChangePassword = useCallback(() => setShowChangePasswordPopover(false), []);

    // -- Resize Handlers
    const resizeEditor = useCallback(() => {
        if (container.current && header.current && footer.current) {
            if (isMobile) {
                container.current.style.height = `${window.innerHeight - container.current.offsetTop + footer.current.offsetHeight}px`
            } else if (container.current.style.height !== 'unset') {
                container.current.style.height = 'unset';
            }
        }
    }, [container, header, footer, isMobile])

    useEffect(() => {
        console.log({
            contentLength: bitLengthToString(contentSize.current),
            encryptedLength: bitLengthToString(encryptedSize.current)
        })
    }, [content, encrypted]);

    useEffect(() => {
        if (!indexedDB.connected)
            return;

        if (documentId) {
            Promise.all([
                indexedDB.fetch('documents-meta', documentId),
                indexedDB.fetch('documents-data', documentId)
            ]).then((data) => {
                const meta = data[0];
                const encryptedString = data[1]?.data;

                if (!(meta && encryptedString)) {
                    console.log('file not found')
                    setEnabled(false)
                    setAlertMessage({
                        message: <Box>
                            <Text as={'h3'} mt={0} mb={2}>File Not Found</Text>
                            <Text as={'p'}>The file you are looking for could not be found. </Text>
                            <ButtonDanger>Go Back</ButtonDanger>
                        </Box>,
                        variant: 'danger',
                    })
                    return;
                }

                otherMeta.current = { ...meta };
                storedEncryptedString.current = encryptedString
                encryptedSize.current = new Blob(Array.from(encryptedString)).size;
                setTitle(meta.title);
                setEncrypted(encryptedString);
            })
        } else {
            otherMeta.current = {}
            storedPassword.current = ''
            storedEncryptedString.current = ''
            if (confirmPasswordInput.current) confirmPasswordInput.current.value = ''
            encryptedSize.current = 0
            contentSize.current = 0
            setHasError(undefined)
            setTitle('')
            setEncrypted('')
            setContent('')
            setLocked(false)
            setEncrypted('')
            setAlertMessage(undefined)
            setShowChangePasswordPopover(false)
            setPassword('')
            setEnabled(true)
        }
    }, [indexedDB.connected, documentId]);

    useEffect(() => {
        resizeEditor();
        window.addEventListener('resize', resizeEditor);
        return () => window.removeEventListener('resize', resizeEditor)
    }, [resizeEditor]);
    // -- End Resize Handlers

    return (
        <WriteContainer>
            {showChangePasswordPopover && (
                <ClickListener onClick={closeChangePassword} />
            )}
            {/*<DocExplorerSidebar width={200} />*/}
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
                    {!!alertMessage && (
                        <Flash variant={alertMessage.variant} mb={3}>
                            {alertMessage.message}
                        </Flash>
                    )}
                    <ResponsiveBox as={Box} display={'flex'} my={2} alignItems={'flex-end'}>
                        <InfoGrid
                            as={'form'}
                            autoComplete={'off'}
                            onSubmit={(e) => e.preventDefault()}
                            mr={'auto'}
                            gridTemplateColumns={"repeat(3, auto)"}
                            gridGap={2}
                            alignItems={'center'}
                        >
                            <Box><Text mr={2} as={'label'}>Document Title:</Text></Box>
                            <Box>
                                <TextInput
                                    disabled={!enabled}
                                    value={title}
                                    onChange={onChangeTitle}
                                    width={'100%'}
                                    type={'text'}
                                />
                            </Box>
                            <Box>TODO status/info??</Box>
                            <Box><Text mr={2} as={'label'}>Document Password:</Text></Box>
                            <Box display={'flex'}>
                                <Box flexGrow={1} sx={{ position: 'relative' }}>
                                    <TextInput
                                        value={password}
                                        onChange={onChangePassword}
                                        onKeyUp={onPasswordEntered}
                                        autoComplete={'off'}
                                        disabled={!enabled}
                                        block
                                        sx={{
                                            borderColor: hasError === 'password' ? theme?.colors?.border?.danger : undefined,
                                        }}
                                        type={passwordHidden ? 'password' : 'text'}
                                    />

                                    <Popover sx={{ zIndex: 2000 }} mt={2} open={showChangePasswordPopover} caret={isMobile ? 'top-left' : 'top'}>
                                        <Popover.Content width={'unset'}>
                                            <Text as={'p'} m={0} sx={{ minWidth: isMobile ? 300 : undefined }}>Are you sure you want to change the document password?</Text>

                                            <Box display={'flex'} mt={2}>
                                                <TextInput
                                                    block
                                                    placeholder={'Confirm new password'}
                                                    ref={confirmPasswordInput}
                                                    autoComplete={'off'}
                                                    disabled={!enabled}
                                                    sx={{
                                                        borderColor: hasError === 'confirmPassword' ? theme?.colors?.border?.danger : undefined,
                                                    }}
                                                    type={passwordHidden ? 'password' : 'text'}
                                                />
                                                <Button type={'button'} disabled={!enabled} ml={1} title={'Show/Hide Password'} onClick={togglePasswordHidden}>
                                                    <StyledOcticon icon={showHidePassword} />
                                                </Button>
                                            </Box>

                                            {hasError === 'confirmPassword' && (
                                                <Text ml={2} as={'small'} color={theme?.colors?.text?.danger}>Confirm Password does not match.</Text>
                                            )}
                                            <ButtonGroup display={'flex'} mt={3}>
                                                <ButtonDanger type={'button'} onClick={onSaveDocument(true)}>Save Password</ButtonDanger>
                                                <Button type={'button'} onClick={closeChangePassword}>Cancel</Button>
                                            </ButtonGroup>
                                        </Popover.Content>
                                    </Popover>
                                </Box>
                                <Button type={'button'} disabled={!enabled} ml={1} title={'Show/Hide Password'} onClick={togglePasswordHidden}>
                                    <StyledOcticon icon={showHidePassword} />
                                </Button>
                            </Box>
                            <Box>TODO status/info??</Box>
                        </InfoGrid>

                        <ActionBox as={Box}>
                            <Text as={'small'} display={'block'} color={'text.secondary'}>Last Save: {otherMeta.current?.modifiedAt?.toString() || 'Unsaved'}</Text>
                            <ActionFlex as={Flex} mt={2} gridGap={2}>
                                <ActionButton disabled={!enabled} as={Button} title={lockedTitle} onClick={handleLockedState}>
                                    <StyledOcticon icon={lockedIcon} />
                                    {' '}
                                    {locked ? 'Unlock' : 'Lock'}
                                </ActionButton>
                                <ActionButton disabled={!enabled} onClick={onSaveDocument()} as={Button}>Save Document</ActionButton>
                                <DeleteButton disabled={!enabled} as={Button}>Delete Document</DeleteButton>
                            </ActionFlex>
                        </ActionBox>
                    </ResponsiveBox>
                </Box>
                <DocEditor
                    sx={{
                        height: !isMobile ? `${window.outerHeight - 80}px !important` : undefined
                    }}
                    value={showEncrypted ? `<!--encrypted--><pre>${encrypted}</pre>` : content}
                    valueByteLength={contentSize.current}
                    onSave={onSaveContent}
                    disabled={showEncrypted || !enabled}
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

export default Write;
