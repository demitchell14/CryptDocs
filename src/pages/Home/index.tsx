import React, {useRef} from 'react';
import {Link, RouteComponentProps} from "react-router-dom";
import {useAppDispatch, useAppDispatch2, useAppSelector} from "../../hooks/useAppDispatch";
import {selectUser, lolHi, handleAuthentication, UserState} from "../../store/user";
import {useStore} from "react-redux";
import {Button} from "@primer/components";
import {ThunkDispatch} from "@reduxjs/toolkit";
import {RootState} from "../../store";

type Props = RouteComponentProps;


function Home(props: Props) {
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

export type HomeProps = Props;
export default Home;
