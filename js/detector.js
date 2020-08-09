// Inform the background page that 
// this tab should have a page-action.
(() => {
    var s = document.createElement('script');
    s.className = 'crocodec-inject';
    s.src = chrome.runtime.getURL('js/inject.js');

    document.querySelector('body').onload = () => document.querySelector('body').appendChild(s);
})();

function get_namespaces(ajax_url) { 

    let namespaces;
    $.ajax({
        url: ajax_url,
        dataType: 'json',
        async: false
    }).done( function( data ) {
        namespaces =  data.namespaces;
    }).fail( function() {
        console.log( "error" );
    });

    console.log(namespaces);
    // var xhr = new XMLHttpRequest();
    // xhr.open("GET", ajax_url, false); // async=true
    // xhr.onload = function (e) {
    //     if (xhr.readyState == 4 && xhr.status == 200) {
    //         namespaces = JSON.parse(xhr.responseText).namespaces;
    //     }
    // };
    // xhr.send(null);

    // return await fetch(ajax_url, { credentials: 'include', mode: 'cors' })
    //     .then(response => response.json())
    //     .then(json => { 
    //         return json.namespaces; } );

    // let response = await fetch(ajax_url);

    // let json = response.json(); // читаем ответ в формате JSON
    
    return namespaces;
    /* зараза хром все блокирует(((((((( */ 
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
        let namespaces = get_namespaces(wp_json_api);
        
        let plugins = msg.data.filter(
            plug => {
                if( ~ ( namespaces.toString() ).indexOf( plug.name ) ) {
                    plug.finded = true;
                    return true;
                }
            }
        );

        find_by_headers( msg.data.filter( plug => ( ! plug.finded && plug.findType === 'headers' ) ) );

		// Directly respond to the sender (popup), 
        // through the specified callback.
        
        response( { api: plugins, html: document.querySelector('html').innerHTML } );
    }
});

function find_by_headers( search_plugins ) {
    console.log( search_plugins );
}

