import React, {Dispatch, SetStateAction, useState} from 'react';
import {Box, Button, Dialog, DialogProps, Flex} from "@primer/components";
import testdata from "./testdata.json";
import ListItemDoc from "../../components/ListItemDoc/ListItemDoc";

type Props = DialogProps & {
    selected?: number[];
    setSelected?: Dispatch<SetStateAction<number[]>>;
    options: Array<{
        title: string;
        modifiedAt: number;
    }>
};


function PinnedDialog(props: Props) {
    const { options, selected: defaultSelected, setSelected: onSave, onDismiss, ...otherDialogProps } = props;
    const [ selected, setSelected ] = useState(defaultSelected);
    const onSelect = (evt: React.SyntheticEvent, idx: number) => {
        evt.preventDefault();
        if (setSelected && selected) {
            const nextSelected = [...selected];
            const exists = nextSelected.indexOf(idx);
            if (exists >= 0) {
                nextSelected.splice(exists, 1)
            } else {
                nextSelected.push(idx);
            }
            setSelected(nextSelected);
        }
    }

    const onHandleSave = (evt) => {
        if (onSave) onSave(selected || []);
        if (onDismiss) onDismiss();
    }
    return (
        <Dialog height={'80%'} onDismiss={onDismiss} {...otherDialogProps}>
            <Dialog.Header minHeight={50} height={'7%'}>Header Here</Dialog.Header>
            <Box height={'calc(100% - 15%)'} maxHeight={'calc(100% - 100px)'} overflowY={'scroll'}>
                {testdata.map((data, key: number) => (
                    <ListItemDoc
                        {...data}
                        variant={'option'}
                        onClick={onSelect}
                        id={key}
                        selected={(selected || []).indexOf(key) >= 0}
                        key={key}
                        alignItems={'center'} />
                ))}
            </Box>
            <Flex minHeight={50} height={'8%'} alignItems={'center'}>
                <Button onClick={onHandleSave} color={'text.success'} ml={'auto'} mr={2} my={1}>Save Selected</Button>
            </Flex>
        </Dialog>
    );
}

export type PinnedDialogProps = Props;
export default PinnedDialog;