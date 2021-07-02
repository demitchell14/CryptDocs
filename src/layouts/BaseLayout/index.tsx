import React from 'react';
import {themeGet} from "@primer/components";
import styled from "styled-components";
import AppHeader from "../../components/AppHeader";

type Props = any;

const Container = styled.div`
    // background-color: ${themeGet('colors.bg.canvas')}
`

function BaseLayout(props: Props) {

    return (
        <>
            <AppHeader />
            <Container>
                {props.children}
            </Container>
        </>
    )
}

export type BaseLayoutProps = Props;
export default BaseLayout;
