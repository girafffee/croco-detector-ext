// Inform the background page that 
// this tab should have a page-action.
function get_wp_json(ajax_url) { 
    let namespaces;
    return new Promise( resolve => {
        $.ajax({
            url: ajax_url,
            async: true,
            success: function( data ) {	
                console.log( data.namespaces );
                namespaces = data.namespaces;
            }
        });
        resolve(namespaces);
    });
}

chrome.runtime.sendMessage({
    from: 'content',
    subject: 'showPageAction',
  });
  
  // Listen for messages from the popup.
  chrome.runtime.onMessage.addListener(async (msg, sender, response) => {
    // First, validate the message's structure.
    if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
      // Collect the necessary data. 
      // (For your specific requirements `document.querySelectorAll(...)`
      //  should be equivalent to jquery's `$(...)`.)
        var domInfo = {
            total: document.querySelectorAll('*').length,
            inputs: document.querySelectorAll('input').length,
            buttons: document.querySelectorAll('button').length,
            json_api_url: document.querySelector('link[rel="https://api.w.org/"]').href
        };
        await saveNamespaces(domInfo);
        
  
      // Directly respond to the sender (popup), 
      // through the specified callback.
        response(domInfo);
    }
  });

async function saveNamespaces(object) {
    object.namespaces = await get_wp_json(object.json_api_url);
}







