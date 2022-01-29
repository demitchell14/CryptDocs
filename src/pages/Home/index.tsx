import React, {useRef} from 'react';
import {Link} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks/useAppDispatch";
import {selectUser, lolHi, handleAuthentication} from "../../store/user";
import {Button} from "@primer/components";



function Home() {
    const dispatcher = useAppDispatch()
    const selector = useAppSelector(selectUser);
    const authenticator = useRef<any>(null);

    const onClick = () => {
        dispatcher(lolHi())
    }

    const onAuthenticate = async () => {
        if (authenticator.current !== null) {
            authenticator.current.abort('restarting');
        }
        authenticator.current = dispatcher(handleAuthentication())

        authenticator.current.then((response) => {
            console.log(response);
            authenticator.current = null;
        }).catch((err) => {
            console.error(err);
        })
    }

    return (<div>
        <div onClick={onClick}>{selector.hello}</div>
        <Button onClick={onAuthenticate}>Authenticate</Button>

        <Button as={Link} to={'/write'}>Create a Doc</Button>
    </div>);
}

export default Home;
