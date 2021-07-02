import React, {useEffect, useRef, useState} from 'react';
import {Editor as TinyEditor, IAllProps} from "@tinymce/tinymce-react";
import {BorderBox, BorderBoxProps, Box, themeGet, useTheme} from "@primer/components";

import "tinymce/tinymce";
import "tinymce/icons/default/icons";
// import "tinymce/themes/silver";
import "tinymce/plugins/paste";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/imagetools";
import "tinymce/plugins/save";
import "tinymce/plugins/table";
import "tinymce/plugins/code";
import "tinymce/plugins/hr";
import "tinymce/plugins/contextmenu";
import "tinymce/plugins/lists";
import "tinymce/plugins/advlist";
// import "../../tinymce/autoheight";

import {RawEditorSettings, Editor as MCEEditor, EditorEvent, Editor as TinyMCEEditor} from 'tinymce';

// import '../../scss/tinymce/oxide.scss';
import '../../scss/tinymce/oxide-skin.scss';

type Props = BorderBoxProps & {
    minHeight?: number;
    value?: string;
    onSave?: (value: string) => unknown;
    disabled?: boolean;
    valueByteLength?: number
};

function DocEditor(props: Props) {
    const { minHeight, value, onSave, disabled, ...boxProps } = props;
    const { resolvedColorMode } = useTheme();
    const [loaded, setLoaded] = useState(false);
    // const loaded = useRef(false);
    const editor = useRef<TinyEditor | null>(null);
    const [config, setConfig] = useState<RawEditorSettings & {
        selector?: undefined;
        target?: undefined
    }>({
        min_height: minHeight,
        height: '100%',
        base_url: process.env.NODE_ENV === 'production' ? undefined : '/tinymce1',
        content_css: '/tinymce/skins/ui/oxide/content.css',
        theme_url: `/tinymce/theme/silver/theme.js`,
        setup: (editor) => {

        }
    });

    useEffect(() => { console.log('disable switched', disabled )}, [disabled]);

    useEffect(() => {
        setConfig((prev) => ({ ...prev, min_height: minHeight }));
    }, [minHeight]);

    useEffect(() => {
        if (loaded && editor.current !== null && editor.current?.editor?.initialized) {
            if (editor.current?.editor) {
                setLoaded(false);
                // loaded.current = false;
                editor.current?.editor.destroy()
                //@ts-ignore
                editor.current.initialise()

                // if (initialValue) editor.current?.editor?.setContent(initialValue);
            }
        }
    }, [config]);

    useEffect(() => {
        if (editor.current) {
            const content = editor.current?.editor?.contentDocument;
            if (content) {
                content.body.classList.remove('editor-day', 'editor-night');
                content.body.classList.add(`editor-${resolvedColorMode}`);
            }
        }
    }, [resolvedColorMode]);

    const onInit = (e) => {
        // console.log('init fired', loaded, initialValue?.length);
        const app = editor.current?.editor?.editorContainer;
        const content = editor.current?.editor?.contentDocument;
        if (content) {
            content.body.classList.add(`editor-${resolvedColorMode}`);
        }
        if (app) {
            // app.style.height = '100%'
        }
        // loaded.current = true;
        setLoaded(true);
    }

    const onSaveContent = (evt: EditorEvent<any>, editor: TinyMCEEditor) => {
        if (onSave) onSave(evt);
    }

    return (
        <BorderBox className={`editor-base editor-${resolvedColorMode}`} bg={'bg.canvasInset'} {...boxProps}>
            <TinyEditor
                ref={editor}
                init={config}
                onInit={onInit}
                value={value}
                onEditorChange={onSaveContent}
                disabled={disabled}
                plugins={[
                    "lists",
                    "advlist",
                    "link",
                    "image",
                    "imagetools",
                    "save",
                    "table",
                    "code",
                    "hr",
                    // "autoheight",
                    // "contextmenu",
                ]}
                toolbar={'undo redo | styleselect  fontsizeselect forecolor | bold italic underline | alignleft aligncenter alignright alignjustify | hr link image media | bullist numlist | outdent indent | emoticons'}
                // toolbar={['link']}
            />
        </BorderBox>
    );
}

export type DocEditorProps = Props;
export default DocEditor;