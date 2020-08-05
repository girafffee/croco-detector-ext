// Inform the background page that 
// this tab should have a page-action.
function get_wp_json(ajax_url) { 
    
    let namespaces;
    $.ajax({
        url: ajax_url,
        async: false,
        success: function( data ) {	
            console.log( data.namespaces );
            namespaces = data.namespaces;
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
      // Collect the necessary data. 
      // (For your specific requirements `document.querySelectorAll(...)`
      //  should be equivalent to jquery's `$(...)`.)
        var domInfo = {
            total: document.querySelectorAll('*').length,
            inputs: document.querySelectorAll('input').length,
            buttons: document.querySelectorAll('button').length,
            json_api_url: document.querySelector('link[rel="https://api.w.org/"]').href
        };
        domInfo.namespaces = get_wp_json(domInfo.json_api_url);

      // Directly respond to the sender (popup), 
      // through the specified callback.
        response(domInfo);
    }
  });








