// Inform the background page that 
// this tab should have a page-action.


class Detector {
    
    constructor(data  = {}) {
        this.pluginsByTypes = {};
        this.searchPlugins = {};
        this._pluginData = [];

        this.detectPlugins = data;   

        this.FIND_FUNCTION_PREFIX = 'findIn_';
    }

    set detectPlugins(value) {
        if ( ! value ) return;

        this._pluginData = value;

        this._pluginData.forEach( 
            plugin => {
                if ( typeof plugin.find !== "undefinded" && typeof plugin.find.name !== "undefinded"){
                    
                    (typeof this.pluginsByTypes[ plugin.find.name ] === "undefined")
                        ? (this.pluginsByTypes[ plugin.find.name ] = []).push( plugin.name )
                        : this.pluginsByTypes[ plugin.find.name ].push( plugin.name );
                }
                this.searchPlugins[plugin.name] = plugin;
                
            }
        );   
    }

    get detectPlugins() { 
        Object.keys(this.pluginsByTypes).forEach( type => {

            let callback_fun = this.FIND_FUNCTION_PREFIX + type;

            if (typeof this[ callback_fun ] === "function") 
                this[ callback_fun ].call(this, type);
            else 
                console.warn( `Please add function: Detector.${ callback_fun }` ); 
        } );

        return this._pluginData.filter( item => this.searchPlugins[ item.name ].finded );
    }

    findIn_apiWpJson( type = "" ) {
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

    static new(data = {}) {
        let obj = new this;
        if ( ! data ) {
            return obj;
        }
        obj.detectPlugins = data;
        return obj;
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

        let d = new Detector(msg.data);
        response( { api: d.detectPlugins, html: document.querySelector('html').innerHTML } );
    }
});



