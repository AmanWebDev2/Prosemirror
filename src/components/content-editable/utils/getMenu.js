import { isIframe } from "./isFrame";

export const getProsemirrorMenu=()=>{
    let menu;
    if(isIframe) {
        const iframe = document.getElementById('kudoshub-editor-frame');
        if(!iframe) return null;
        const iframeDoc = iframe.contentWindow.document;
        if(!iframeDoc) return null;
        menu = iframeDoc.querySelector('.pm-selectionmenu');
        if(!menu) return null;
        return menu;
    }else {
        menu = document.querySelector('.pm-selectionmenu');
        if(!menu) return null;
        return menu;
    }
}