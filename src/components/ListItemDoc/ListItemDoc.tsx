import React from 'react';
import {Box, Flex, FlexProps, Link, Text, TextInput, themeGet, Truncate} from "@primer/components";
import {Link as RouterLink} from "react-router-dom";
import styled from "styled-components";
import {CheckIcon} from "@primer/octicons-react";

type Props = Omit<FlexProps, 'onClick'|'id'> & {
    onClick?: (evt: React.SyntheticEvent, idx: number) => unknown;
    variant?: 'list' | 'option'
    selected?: boolean;

    id: number;
    title: string;
    modifiedAt?: number;
};

const ListItem = styled.div`
    padding: ${themeGet('space.2')} ${themeGet('space.3')};
    &:hover {
        background-color: ${themeGet('colors.bg.tertiary')};
    }
    &:not(:last-child) {
        border-bottom: 1px solid ${themeGet('colors.border.primary')}
    }
`;

const SelectedCheckbox = styled.input`
    padding: ${themeGet('space.2')};
`;

function ListItemDoc(props: Props) {
    const { id, title, modifiedAt, variant, onClick, selected, ...otherFlexProps } = props;

    const modifiedAtDate = modifiedAt ? new Date(modifiedAt) : undefined;

    const onHandleClick = (evt: React.SyntheticEvent) => onClick ? onClick(evt, id) : undefined;

    let content: React.ReactNode = (<>Nothing</>);
    if (variant === 'list') {
        content = (
            <>
                <Link as={RouterLink} to={'/write'} muted sx={{ flexGrow: 1 }}>
                    {title}
                </Link>
                <Text as={'small'} color={'text.tertiary'}>
                    {modifiedAtDate?.toLocaleString() || 'N/A'}
                </Text>
            </>
        )
    }
    if (variant === 'option') {
        content = (
            <Box>
                <SelectedCheckbox onChange={(e) => { e.preventDefault(); e.stopPropagation(); }} checked={selected} type={'checkbox'} />
                <Text sx={{ flexGrow: 1 }} fontSize={14} ml={3}>
                    <Truncate title={title} maxWidth={250}>
                        {title}
                    </Truncate>
                </Text>
            </Box>
        )
    }

    return (
        <ListItem onClick={onClick ? onHandleClick : undefined} as={Flex} {...otherFlexProps}>
            {content}
        </ListItem>
    );
}

ListItemDoc.defaultProps = {
    variant: 'list'
}

export type ListItemDocProps = Props;
export default ListItemDoc;