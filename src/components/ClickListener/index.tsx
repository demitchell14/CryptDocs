import React, {SyntheticEvent, useCallback, useMemo} from 'react'
import {createPortal} from "react-dom";
import {Box} from "@primer/components";

type Props = {
    id?: string;
    zIndex?: number;
    onClick?: (evt: SyntheticEvent) => unknown;
}

function ClickListener(props: Props) {
    const { id, zIndex, onClick: onClickProps } = props;

    const onClick = useCallback((evt: SyntheticEvent) => {
        if (onClickProps) onClickProps(evt);
    }, [onClickProps])

    const rootElement = useMemo(() => {
        let el = document.getElementById('click-listener' + (id || ''));
        if (!el) {
            el = document.createElement('div');
            el.id = 'click-listener' + (id || '');
            document.body.appendChild(el)
        }
        return el as HTMLDivElement;
    }, [id])

    const content = useMemo(() => {
        return (
            <Box
                onClick={onClick}
                sx={{
                    position: 'fixed',
                    zIndex: zIndex || 1000,
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',
                }}
            />
        )
    }, [])

    return createPortal(
        content,
        rootElement,
    )
}

export type ClickListenerProps = Props;
export default ClickListener
