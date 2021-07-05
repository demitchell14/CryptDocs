import React, {useEffect, useState} from 'react';

type Props = {
    load?: boolean;
    children: React.ReactChild;
    unmountOnExit?: boolean;
    fallback?: React.ReactNode | string;
};

function LazyComponent(props: Props) {
    const { children, load, unmountOnExit, fallback } = props;
    const [ opened, setOpened ] = useState(load || false);

    useEffect(() => {
        if (load && !opened) {
            setOpened(true);
        } else {
            if (unmountOnExit && !load) setOpened(false)
        }
    }, [ load ]);

    const loading = fallback || (
        <p>loading...</p>
    )

    return (
        <React.Suspense fallback={loading}>
            {opened ? children : undefined}
        </React.Suspense>
    )
}

export type LazyComponentProps = Props;
export default LazyComponent;