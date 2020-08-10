// Inform the background page that 
// this tab should have a page-action.


class Detector {
    
    constructor() {
        this.pluginsByTypes = {};
        this.searchPlugins = {};
        this._pluginData = [];

        this.FIND_FUNCTION_PREFIX = 'findBy_';
    }

    set detectPlugins(value) {
        this._pluginData = value;
        
        this._pluginData.forEach( 
            plugin => {
                if ( typeof plugin.findType !== "undefinded" ){
                    
                    (typeof this.pluginsByTypes[ this.FIND_FUNCTION_PREFIX + plugin.findType ] === "undefined")
                        ? this.pluginsByTypes[ this.FIND_FUNCTION_PREFIX + plugin.findType ] = []
                        : this.pluginsByTypes[ this.FIND_FUNCTION_PREFIX + plugin.findType ].push( plugin.name );
                }
                this.searchPlugins[plugin.name] = plugin;
            }
        );    
    }

    get detectPlugins() { 
        Object.keys(this.pluginsByTypes).forEach( func => {
            if (typeof this[ func ] === "function") 
                this[ func ].call(this, func);
            else 
                console.warn( `Please add function: Detector.${ func }` ); 
        } );

        return this._pluginData.filter( item => this.searchPlugins[item.name].finded );
    }

    findBy_apiWpJson( type = "" ) {
        if ( ! type ) return;

        let wp_json_api = document.querySelector('link[rel="https://api.w.org/"]').href;
        let namespaces = get_namespaces(wp_json_api).toString();

        this.pluginsByTypes[type].forEach(
            plug_name => {
                if( ~ ( namespaces ).indexOf( plug_name ) )
                    this.searchPlugins[plug_name].finded = true;
            }
        );
    }
  
}

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

        let d = new Detector;
        d.detectPlugins = msg.data; 
        
        response( { api: d.detectPlugins, html: document.querySelector('html').innerHTML } );
    }
});



