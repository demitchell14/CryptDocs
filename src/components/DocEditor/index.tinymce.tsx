import React, {useEffect, useRef, useState} from 'react';
import {Editor as TinyEditor} from "@tinymce/tinymce-react";
import {BorderBox, BorderBoxProps, useTheme} from "@primer/components";

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

import {RawEditorSettings, Editor as MCEEditor, EditorEvent, Editor as TinyMCEEditor} from 'tinymce';

// import '../../scss/tinymce/oxide.scss';
// import '../../scss/tinymce/oxide-skin.scss';
import useMediaQuery from "../../hooks/useMediaQuery";
import { DocEditorProps } from '.';
import styled from "styled-components";

const Container = styled(BorderBox)`
    height: 100%;
    margin: 0;
    flex-grow: 1;
 `

const MOBILE_OPTIONS = {
    menubar: false,
    toolbar: [
        'undo redo | more'
    ]
}

function DocEditor(props: DocEditorProps) {
    const { minHeight, value, onSave, disabled, ...boxProps } = props;
    const { resolvedColorMode } = useTheme();
    const isMobile = useMediaQuery('(min-width: 600px)');
    const [loaded, setLoaded] = useState(false);
    // const loaded = useRef(false);
    const editor = useRef<TinyEditor | null>(null);
    const [config, setConfig] = useState<RawEditorSettings & {
        selector?: undefined;
        target?: undefined
    }>({
        min_height: minHeight,
        height: '100%',
        base_url: '/tinymce',
        // base_url: process.env.NODE_ENV === 'production' ? undefined : '/tinymce',
        // content_css: '/tinymce/skins/ui/oxide/content.css',
        theme_url: `/tinymce/themes/silver/theme.js`,
        content_css: resolvedColorMode === 'day' ? 'default' : 'dark',
        skin: `oxide${resolvedColorMode === 'day' ? '' : '-dark'}`,
        resize: true,
        // toolbar_mode: 'sliding',
        mobile: {
            menubar: false,
            // toolbar: 'undo redo | more',
            toolbar_mode: 'sliding'
        },
        setup: (editor) => {
        }
    });

    // useEffect(() => {
    //     console.log('isMobile', isMobile)
    //     if (isMobile) {
    //         setConfig((prev) => ({
    //             ...prev,
    //             mobile: MOBILE_OPTIONS
    //         }))
    //     }
    // }, [isMobile])

    useEffect(() => {
        setConfig((prev) => ({
            ...prev,
            skin: `oxide${resolvedColorMode === 'day' ? '' : '-dark'}`,
            content_css: resolvedColorMode === 'day' ? 'default' : 'dark'
        }))
    }, [resolvedColorMode])

    useEffect(() => { console.log('disable switched', disabled )}, [disabled]);

    useEffect(() => {
        setConfig((prev) => ({ ...prev, min_height: minHeight }));
    }, [minHeight]);

    useEffect(() => {
        if (loaded && editor.current !== null && editor.current?.editor?.initialized) {
            if (editor.current?.editor) {
                setLoaded(false);
                // loaded.current = false;
                // editor.current?.editor?.editorManager.execCommand('mceRemoveEditor', true, 'document-editor')
                // editor.current?.editor?.editorManager.execCommand('mceAddEditor', true, 'document-editor')
                editor.current?.editor.destroy()
                // @ts-ignore
                editor.current.initialise()

                // if (initialValue) editor.current?.editor?.setContent(initialValue);
            }
        }
    }, [config]);

    // useEffect(() => {
    //     if (editor.current) {
    //         const content = editor.current?.editor?.contentDocument;
    //         if (content) {
    //             content.body.classList.remove('editor-day', 'editor-night');
    //             content.body.classList.add(`editor-${resolvedColorMode}`);
    //         }
    //     }
    // }, [resolvedColorMode]);

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

    const onSaveContent = (content: string, editor: TinyMCEEditor) => {
        if (onSave) onSave(content);
    }

    return (
        <Container className={`editor-base editor-${resolvedColorMode}`} bg={'bg.canvasInset'} {...boxProps}>
            <TinyEditor
                ref={editor}
                id={'document-editor'}
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
        </Container>
    );
}

export default DocEditor;
