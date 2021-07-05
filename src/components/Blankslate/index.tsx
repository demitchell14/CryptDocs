import React from 'react';
import {Box, BoxProps} from "@primer/components";
import styled from "styled-components";

const Container = styled.div`
    text-align: center;
`;

type Props = BoxProps & {
    centered?: boolean;
};

function Blankslate(props: Props) {
    const { centered, children, ...otherBoxProps } = props;
    const Component = centered ? Container : Box;
    return (
        <Component
            as={centered ? Box : undefined}
            my={6} mx={4}
            {...otherBoxProps}
        >
            {children}
        </Component>
    );
}

Blankslate.defaultProps = {
    centered: true
}

export type BlankslateProps = Props;
export default Blankslate;