import React, {useCallback, useEffect, useMemo, useState} from 'react';
import * as serviceWorker from '../../serviceWorker';
import {createPortal} from "react-dom";
import {Box, BoxProps, Button, ButtonPrimary, Heading, Text, useTheme} from "@primer/components";
import styled, { keyframes, css } from "styled-components";

type Props = {
    initialize?: boolean;
}
type ContentProps = BoxProps & {
    visible: boolean;
}

const Entrance = keyframes({
    '0%': {
        transform: `translateY(1000px) translateX(1000px)`,
        opacity: 0
    },
    '100%': {
        transform: `translateY(0) translateX(0)`,
        opacity: 1
    }
})

const entranceMixin = css`
    animation: ${Entrance} 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
`

const Content = styled(Box)<ContentProps>`
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
    line-height: 1.5;
    position: fixed;
    bottom: ${props => props.theme.space[3]};
    right: ${props => props.theme.space[3]};
    padding: ${props => props.theme.space[2]} ${props => props.theme.space[3]} ${props => props.theme.space[3]} ${props => props.theme.space[4]};
    border-radius: ${props => props.theme.radii[2]};
    background: ${props => props.theme.colors.bg.canvas};
    color: ${props => props.theme.colors.text.primary};
    box-shadow: ${props => props.theme.shadows.overlay.shadow};
    ${entranceMixin}
    max-width: 400px;
`

function generateContainer(id: string) {
    let el = document.getElementById(id);
    if (!el) {
        el = document.createElement('div');
        el.id = id;
        document.body.appendChild(el)

    }
    return el as HTMLDivElement;
}

function ServiceWorkerComponent(props: Props) {
    const { initialize } = props;
    const { theme } = useTheme()
    const [worker, setWorker] = useState<ServiceWorker | null>(null)
    const [shouldReload, setShouldReload] = useState(false)

    const onSWSuccess = useCallback((registration: ServiceWorkerRegistration) => {
        console.log('success')
        setWorker(registration.waiting);
    }, [])

    const onSWUpdate = useCallback((registration: ServiceWorkerRegistration) => {
        console.log('waiting')
        setWorker(registration.waiting)
        setShouldReload(true)
    }, []);

    const handleUpdate = useCallback(() => {
        worker?.postMessage({ type: 'SKIP_WAITING' });
        setShouldReload(false)
        window.location.reload()
    }, [worker]);

    useEffect(() => {
        if (initialize) {
            serviceWorker.register(window, {
                onUpdate: onSWUpdate,
                onSuccess: onSWSuccess,
            })
        }
    }, [initialize])

    const content = useMemo(() => {
        return (
            <Content visible={shouldReload}>
                <Heading m={0} as={'h4'}>An Update is Available!</Heading>
                <Text as={'p'} m={0} mb={2}>
                    The CryptDocs app has been updated! Click the button below to reload and update.
                </Text>
                <Box display={'flex'} sx={{ gap: 2 }}>
                    <ButtonPrimary onClick={handleUpdate}>Update Now</ButtonPrimary>
                    <Button onClick={() => setShouldReload(false)}>Update Later</Button>
                </Box>
            </Content>
        )
    }, [theme]);


    if (!shouldReload)
        return null;

    const container = generateContainer('sw-update')

    return createPortal(
        content,
        container
    )
}

export type ServiceWorkerProps = Props;
export default ServiceWorkerComponent;
