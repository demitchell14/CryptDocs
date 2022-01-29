import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BorderBox, Box, Flex, Grid, Heading, Link, Text, themeGet} from "@primer/components"
import FeaturedDoc from "../../components/FeaturedDoc";

import testdata from './testdata.json';
import ListItemDoc from "../../components/ListItemDoc/ListItemDoc";
import LazyComponent from "../../components/LazyComponent/LazyComponent";
import Blankslate from "../../components/Blankslate";
import useIndexedDB from "../../hooks/useIndexedDB";

const PinnedDialog = React.lazy(() => import('./PinnedDialog'));


const PaddedBox = styled.div`
    padding-left: ${themeGet('space.2')};
    padding-right: ${themeGet('space.2')};
`

const ExplorerContainer = styled.div`
    // padding-left: ${themeGet('space.2')};
    // padding-right: ${themeGet('space.2')};
    // padding: ${themeGet('space.2')};
    
`;

const Divider = styled.div`
    height: 1px;
    background: ${themeGet('colors.border.primary')};
    // margin-left: -${themeGet('space.2')};
    // margin-right: -${themeGet('space.2')};
    margin-top: calc(${themeGet('space.2')} - 1px);
    // margin-bottom: ${themeGet('space.2')};
    &.even {
        margin-bottom: ${themeGet('space.2')};
    }
    &.wide {
        margin-top: calc(${themeGet('space.4')} - 1px);
        margin-bottom: ${themeGet('space.4')};
    }
`;

const ActionBox = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    &.open {
        width: 200px;
        padding: ${themeGet('space.2')};
        border-right: 1px solid ${themeGet('colors.border.primary')};
    }
`;
const ContentBox = styled.div`
    padding: ${themeGet('space.2')}
`;

const Container = styled.div`
    position: relative;
    ${ActionBox}.open + ${ContentBox} {
        margin-left: 200px;
    }
`;

const ListItem = styled.div`
    padding: ${themeGet('space.2')} ${themeGet('space.3')};
    &:not(.heading):hover {
        background-color: ${themeGet('colors.bg.tertiary')};
    }
    &:not(:last-child) {
        border-bottom: 1px solid ${themeGet('colors.border.primary')}
    }
`;

function Explorer() {
    const indexDB = useIndexedDB();
    // const [documents, setDocuments] = useState(testdata);
    const [documents, setDocuments] = useState([]);
    const [ pinnedDialogOpen, setPinnedDialogOpen ] = useState(false);
    const [selected, setSelected] = useState<number[]>([]);

    const updateSelected = (selected) => {
        Promise.all(documents.map((doc: any) => {
            doc.pinned = false
            return indexDB.update('documents-meta', doc.id, doc).then(() => '')
        })).then(() => Promise.all(selected.map((idx) => {
            const doc = documents[idx] as any;
            if (doc) {
                doc.pinned = true
                return indexDB.update('documents-meta', doc.id, doc)
            }
            return '';
        }))).then((response) => {
            const ids = response.filter((r) => r) as string[]
            const indexes: number[] = [];
            ids.forEach((key) => {
                const index = documents.findIndex((k: any) => k.id === key);
                if (index >= 0) indexes.push(index);
            })
            setSelected(indexes);
        })
    }

    useEffect(() => {
        const selectedIndexes: number[] = [];
        documents.forEach((doc: any, idx) => {
            if (doc.pinned) selectedIndexes.push(idx)
        })
        setSelected(selectedIndexes);
    }, [documents]);

    useEffect(() => {
        if (indexDB.connected) {
            indexDB.fetchAll('documents-meta').then((docs) => {
                if (docs !== null) {
                    setDocuments(docs);
                    console.log(docs);
                }
            })
        }
    }, [indexDB.connected]);

    const togglePinnedDialog = (evt?: React.MouseEvent<HTMLAnchorElement>) => {
        if (evt) evt.preventDefault();
        setPinnedDialogOpen(!pinnedDialogOpen);
    }

    return (
        <ExplorerContainer as={Box}>
            <LazyComponent unmountOnExit load={pinnedDialogOpen}>
                <PinnedDialog
                    isOpen={pinnedDialogOpen}
                    onDismiss={togglePinnedDialog}
                    selected={selected}
                    setSelected={updateSelected}
                    options={documents}

                />
            </LazyComponent>
            <Container>
                <ActionBox as={Box} className={'open'}>
                    LOL Hi
                </ActionBox>
                <ContentBox as={Box}>
                    {documents.length > 0 && (
                        <>
                            <Flex alignItems={'center'} mt={6}>
                                <Heading lineHeight={1.25} fontSize={20}>Pinned Documents</Heading>
                                <Link onClick={togglePinnedDialog} href={'#'} ml={'auto'} muted>Change pinned Documents</Link>
                            </Flex>
                            <Divider className={'even'} />
                            {selected.length > 0 ? (
                                <Grid
                                    gridTemplateColumns={`repeat(${Math.min(selected.length, 4)}, auto)`}
                                    gridGap={2}
                                    mb={4}
                                >
                                    {selected.map((data, key) => (
                                        <FeaturedDoc key={key} {...documents[data]} />
                                    ))}
                                </Grid>
                            ) : (
                                <Blankslate>
                                    Empty
                                </Blankslate>
                            )}
                        </>
                    )}

                    <BorderBox>
                        <ListItem className={'heading'} as={Flex} alignItems={'center'}>
                            <Heading fontSize={24} sx={{ flexGrow: 1 }}>
                                All Documents
                            </Heading>
                            <Text as={'small'}>Last Modified</Text>
                        </ListItem>
                        {documents.length > 0 ? documents.map((data, key) => (
                            <ListItemDoc index={key} key={key} {...data} alignItems={'center'} />
                        )) : (
                            <Blankslate minHeight={400}>
                                Empty
                            </Blankslate>
                        )}
                    </BorderBox>
                </ContentBox>
            </Container>
        </ExplorerContainer>
    );
}

export default Explorer;
