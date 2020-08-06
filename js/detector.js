// Inform the background page that 
// this tab should have a page-action.
function get_namespaces(ajax_url) { 
    let namespaces;

    $.ajax({
        url: ajax_url,
        async: false,
        dataType: 'json',
       
        success: function( data ) {	
            namespaces = data.namespaces;
        },
        error: function ( data ) {
            console.log( data );
        }
    });
    return namespaces;
}

chrome.runtime.sendMessage({
    from: 'content',
    subject: 'showPageAction',
});
  
  // Listen for messages from the popup.
chrome.runtime.onMessage.addListener( (msg, sender, response) => {
    // First, validate the message's structure.
    if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {

        let wp_json_api = document.querySelector('link[rel="https://api.w.org/"]').href;
        let plugins = get_namespaces(wp_json_api);

		// Directly respond to the sender (popup), 
        // through the specified callback.
        
        response( plugins );
    }
});
