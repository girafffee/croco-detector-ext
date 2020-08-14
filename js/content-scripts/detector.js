// Inform the background page that 
// this tab should have a page-action.
import { ApiWpJson } from './apiwpjson-class';
// const classes = { 
//     ApiWpJson
// };


class FindTypeFactory {

    static new( type = "" ) {
        if ( ! type || ! classes[type] ) return;

        return new classes[ type ]();
    }
}


chrome.runtime.sendMessage({
    from: 'content',
    subject: 'showPageAction',
});
  
  // Listen for messages from the popup.
chrome.runtime.onMessage.addListener( (msg, sender, response) => {
    // First, validate the message's structure.
    if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
        console.log(msg.data);

        let d = new ApiWpJson(msg.data);
        response( { api: d.detectPlugins, html: document.querySelector('html').innerHTML } );
    }
});



