import React, {useEffect} from 'react';
import {Button, Header, StyledOcticon, themeGet, useTheme} from "@primer/components";
import {Link} from "react-router-dom";
import {MoonIcon, SunIcon} from "@primer/octicons-react";
import {useAppDispatch, useAppSelector} from "../../hooks/useAppDispatch";
import {selectLayout, setNight, setDay} from "../../store/layout";
import styled from "styled-components";

type Props = any;

const StyledLink = styled.a`
    color: ${themeGet('colors.text.primary')};
    &:hover, &:focus {
        color: ${themeGet('colors.text.link')};
    }
`


function AppHeader(props: Props) {
    const dispatcher = useAppDispatch();
    const selector = useAppSelector(selectLayout);
    const { theme, resolvedColorMode, setColorMode } = useTheme();

    const modeTitle = resolvedColorMode === 'day' ? 'Switch to Night Mode' : 'Switch to Light Mode'
    const modeIcon = resolvedColorMode === 'day' ? MoonIcon : SunIcon;

    useEffect(() => {
        setColorMode(selector.mode);
    }, [selector.mode]);

    useEffect(() => {
        if (resolvedColorMode)
            document.body.setAttribute('color-scheme', resolvedColorMode)
    }, [resolvedColorMode]);

    const handleModeSwitch = React.useCallback(() => dispatcher(selector.mode === 'day' ? setNight() : setDay()), [selector.mode]);
    // const handleModeSwitch = React.useCallback(() => setColorMode(resolvedColorMode === 'day' ? 'night' : 'day'), [resolvedColorMode]);

    return (
        <Header bg={'auto.gray.2'}>
            <Header.Item>
                <Header.Link as={StyledLink} forwardedAs={Link} to={'/home'}>
                    CryptDocs
                </Header.Link>
            </Header.Item>

            <Header.Item>
                <Header.Link as={StyledLink} forwardedAs={Link} to={'/explore'}>
                    Explore
                </Header.Link>
            </Header.Item>

            <Header.Item>
                <Header.Link as={StyledLink} forwardedAs={Link} to={'/write'}>
                    Write
                </Header.Link>
            </Header.Item>

            <Header.Item ml={'auto'}>
                <Button onClick={handleModeSwitch} variant={'small'} title={modeTitle}><StyledOcticon icon={modeIcon} /></Button>
            </Header.Item>
        </Header>
    );
}

export type AppHeaderProps = Props;
export default AppHeader;