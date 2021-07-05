import React from 'react';
import {Box, BoxProps, themeGet} from "@primer/components";
import styled from "styled-components";

type Props = BoxProps & {};

const ContainerBox = styled.div`
    display: none;
    overflow: hidden;
    @media (min-width: ${themeGet('breakpoints.1')}) {
        display: block;
        min-width: 200px;
        max-width: 200px;
        border-right: 1px solid ${themeGet('colors.border.primary')};
    }
    @media (min-width: ${themeGet('breakpoints.2')}) {
        display: block;
        min-width: 250px;
        max-width: 250px;
    }
`;

function DocExplorer(props: Props) {
    const { ...boxProps } = props;
    return (
        <ContainerBox as={Box} {...boxProps}>
            Hello World
        </ContainerBox>
    );
}

export type DocExplorerProps = Props;
export default DocExplorer;