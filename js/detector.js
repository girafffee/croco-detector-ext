// Inform the background page that 
// this tab should have a page-action.


class Detector {
    
    constructor(data  = {}) {
        this.pluginsByTypes = {};
        this.searchPlugins = {};
        this._pluginData = [];

        this.detectPlugins = data;   

        this.FIND_FUNCTION_PREFIX = 'findIn_';
        this.SET_DATA_FUNCTION_PREFIX = 'setDataFor_';
        this.STORAGE_TYPE_PREFIX = 'storage_';

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
            
            this.callBy(this.SET_DATA_FUNCTION_PREFIX, type);
            this.callBy(this.FIND_FUNCTION_PREFIX, type);
        } );

        return this._pluginData.filter( item => this.searchPlugins[ item.name ].finded );
    }

    findIn_ApiWpJson( type = "" ) {
        if ( ! type ) return;

        this.pluginsByTypes[type].forEach(
            plug_name => {
                if( ~ ( this.getStorage( type ) ).indexOf( plug_name ) )
                    this.searchPlugins[plug_name].finded = true;
            }
        );
    }

    setDataFor_ApiWpJson( type = "" ) {
        this.setDataForType( type, get_namespaces(this.wp_json_url).toString() );
    }

    

    findIn_SelectorDom( type = "" ) {
        if ( ! type ) return;

        this.pluginsByTypes[ type ].forEach(
            plug_name => {
                if ( this._q( `link[href*="${plug_name}"]` ) )
                    this.searchPlugins[plug_name].finded = true;
            }
        );
    }

    setDataForType( type = "" , data = "") {
        if ( ! type ) return;

        this[ this.STORAGE_TYPE_PREFIX + type ] = data;
    }

    getStorage( type = "" ) {
        return this[ this.STORAGE_TYPE_PREFIX + type ];
    } 

    callBy( pref = "", type = "" ) {
        if ( ! type ) return;

        let callback_function = pref + type;

        if (typeof this[ callback_function ] === "function") 
                this[ callback_function ].call(this, type);
        else 
            console.warn( `Please add function: Detector.${ callback_function }` ); 
    }

    get site_url() {
        return this._q('link[rel="canonical"]').href;
    }

    get plugins_url() {
        return (this.site_url + 'wp-content/plugins/');
    }

    get wp_json_url() {
        return (this.site_url + 'wp-json/');
    }

    // findIn_HardCheck() {

    // }

    _q(selector, isLast = false) {
        let element;
        isLast 
            ? element = Array.from(document.querySelectorAll(selector)).pop() 
            : element = document.querySelector(selector);
        
        if ( element ) return element;
        else return false; 
    }
  
}

class FindMethod {

    constructor(method  = "") {
        this.method = method;        
    }

}

class ApiWpJson {
    
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



