import {useEffect, useRef, useState} from "react";
import IndexedDBController, {Tables} from "../controllers/indexeddb";

export default function useIndexedDB(props?) {
    const controller = useRef(new IndexedDBController('cryptdocs', 1));
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        controller.current.connect()
            .then(() => {
                console.log('connected')
                setConnected(true);
            })
            .catch((err) => {
                console.error(err);
            })
    }, []);

    const insert = async (table: Tables, index: string, data: any) => {
        if (connected) {
            return await controller.current.insert(table, index, data)
        }
        return null;
    }

    const fetch = async (table: Tables, index: string) => {
        if (connected) {
            return await controller.current.fetch(table, index);
        }
        return null;
    }

    const fetchAll = async (table: Tables, index?: string) => {
        if (connected) {
            return await controller.current.fetchAll(table, index);
        }
        return null;
    }

    const update = async (table: Tables, index: string, data: any) => {
        if (connected) {
            return await controller.current.update(table, index, data);
        }
        return null;
    }

    return {
        connected,
        fetchAll,
        fetch,
        insert,
        update,
        controller,
    }
}