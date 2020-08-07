// Inform the background page that 
// this tab should have a page-action.
async function get_namespaces(ajax_url) { 
    let response, json, namespaces;

    // $.ajax({
    //     url: ajax_url,
    //     dataType: 'json',
    //     async: false
    // }).done( function( data ) {
    //     namespaces = data.namespaces;
    // }).fail( function() {
    //     console.log( "error" );
    // });

    // var xhr = new XMLHttpRequest();
    // xhr.open("GET", ajax_url, false); // async=true
    // xhr.onload = function (e) {
    //     if (xhr.readyState == 4 && xhr.status == 200) {
    //         console.log(xhr.responseText);
    //     }
    // };
    // xhr.send(null);

    // await fetch(ajax_url, { credentials: 'include', mode: 'cors' })
    //     .then(response => response.json())
    //     .then(json => { return json.namespaces } );
        
    /* зараза хром все блокирует(((((((( */ 

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
