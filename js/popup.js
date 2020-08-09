// Update the relevant fields with the new data.
const LOGOS_PATH = '/logos/';
const API_URL = 'https://api.github.com/repos/girafffee/croco-detector-ext/contents/';

function get_file_content_api(filename, type = "json") {
  	let data;
	$.ajax({
		url: API_URL + filename,
		async: false,

		success: function( plugins ) {	
			switch (type) {
				case "json":
					data = JSON.parse( atob( plugins.content ) );
					break;
				default:
					data = atob( plugins.content );
					break;
			}
          
    	}
	});

  	return data;
}

function build_plugins_dom( plugins ) {
	let section = document.querySelector('.crocdec-table-content');
	plugins.forEach( ( element, index ) => {
		if ( index === 0) {
			let item_dom = document.querySelector('.crocodec-plugin-item');
			insert_data_plugin( item_dom, element );
		} else {
			let item_dom = document.querySelector('.crocodec-plugin-item').cloneNode(true);
			insert_data_plugin( item_dom, element );
			section.append( item_dom );
		}
	});
}

function insert_data_plugin( item, element ) {
	item.querySelector('.crocodec-plugin-title').innerText = element.label;
	item.querySelector('.crocodec-plugin-description').innerText = element.description;
	item.querySelector('img').src = LOGOS_PATH + element.logo_name;
}



const setDOMInfo = plugins => {	
	let plugins_finded = get_file_content_api( 'js/plugins-search.json' )
	.filter( 
		plug => ~ ( plugins.toString() ).indexOf( plug.name ) 
	);
	console.log(plugins_finded);
	console.log('get namespaces in popup: ' + new Date());

	build_plugins_dom( plugins_finded );
  };
  
  // Once the DOM is ready...
  window.addEventListener('DOMContentLoaded', () => {
    // ...query for the active tab...
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      // ...and send a request for the DOM info...
      chrome.tabs.sendMessage(
          tabs[0].id,
          {from: 'popup', subject: 'DOMInfo'},
          // ...also specifying a callback to be called 
          //    from the receiving end (content script).
          setDOMInfo);
    });
  });