export default (function() {
    window.tinymce.PluginManager.add('autoheight', function(editor) {

        let editor_container;
        let bars_height = 0;

        function resizeEditor(e?) {
            console.log('fired')
            if (typeof(editor_container) === 'undefined') return;

            try {
                const element_height = parseInt(window.getComputedStyle(editor_container).height);
                /*calculate bar height only once*/
                if (bars_height === 0) {
                    const toolbars = editor_container.querySelectorAll('.mce-toolbar, .mce-statusbar, .mce-menubar');
                    /*IE11 FIX*/
                    const toolbarsLength = toolbars.length;
                    for (let i = 0; i < toolbarsLength; i++) {
                        const toolbar = toolbars[i];
                        /*skip sidebar*/
                        if (!toolbar.classList.contains('mce-sidebar-toolbar')) {
                            const bar_height = parseInt(window.getComputedStyle(toolbar).height);
                            bars_height += bar_height;
                        }
                    }
                }
                /*the extra 8 is for margin added between the toolbars*/
                const new_height = element_height - bars_height - 8;
                //@ts-ignore
                editor.theme.resizeTo('100%', new_height);
            } catch (err) {
                console.log(err);
            }
        }
        editor.on('ResizeWindow', resizeEditor);
        editor.on("init", function() {
            try {
                editor_container = editor.getContainer().parentNode;
            } catch (e) {
                console.error(e);
            }
            setTimeout(function() {
                resizeEditor();
            }, 0);
        });
    });
})();