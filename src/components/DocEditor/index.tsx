import {BorderBoxProps} from "@primer/components";

type Props = BorderBoxProps & {
    minHeight?: number;
    value?: string;
    onSave?: (value: string) => unknown;
    disabled?: boolean;
    valueByteLength?: number
};

export { default } from './index.tinymce'
export type DocEditorProps = Props;
