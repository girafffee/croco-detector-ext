// Update the relevant fields with the new data.
const LOGOS_PATH = '/logos/';
const API_URL = 'https://api.github.com/repos/girafffee/croco-detector-ext/contents/';
const CONTENT_CLASS = '.crocdec-table-content';
const PLUGIN_ITEM_CLASS = '.crocodec-plugin-item';
const PLUGIN_TITLE_CLASS = '.crocodec-plugin-title'; 
const PLUGIN_DESC_CLASS = '.crocodec-plugin-description';
const PLUGIN_LOGO_CLASS = '.crocodec-plugin-logo';
const LOADER_CLASS = '.crocodec-loader';

function _q(selector) {
	let element = document.querySelector(selector);
	
	if ( element ) return element;
	else return false; 
}


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
	let section = _q(CONTENT_CLASS);
	plugins.forEach( ( element, index ) => {
		if ( index === 0) {
			let item_dom = _q(PLUGIN_ITEM_CLASS);
			insert_data_plugin( item_dom, element );
		} else {
			let item_dom = _q(PLUGIN_ITEM_CLASS).cloneNode(true);
			insert_data_plugin( item_dom, element );
			
			section.append( item_dom );
		}
	});
}


function insert_data_plugin( item, element ) {
	item.querySelector(PLUGIN_TITLE_CLASS).innerText = element.label;
	item.querySelector(PLUGIN_DESC_CLASS).innerText = element.description;
	item.querySelector(PLUGIN_LOGO_CLASS).src = LOGOS_PATH + element.logo_name;
}

function displayElement( { element, show = true } ) {
	show ? element.style.display = 'block' : element.style.display = 'none';
}

const setDOMInfo = plugins => {	
	let plugins_finded = get_file_content_api( 'js/plugins-search.json' )
	.filter( 
		plug => ~ ( plugins.toString() ).indexOf( plug.name ) 
	);
	console.log(plugins_finded);
	console.log('get namespaces in popup: ' + new Date());

	build_plugins_dom( plugins_finded );

	_q(LOADER_CLASS).remove();
	displayElement( { element: _q(CONTENT_CLASS) } );
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