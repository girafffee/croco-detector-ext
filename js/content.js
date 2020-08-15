
class Detector {
    
    constructor(data  = {}) {
        this.pluginsByTypes = {};
        this.searchPlugins = {};
        this._pluginData = [];

        this.detectPlugins = data;   

        this.FIND_FUNCTION = 'find';
        this.SET_STORAGE_FUNCTION = 'storage';
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
            
            this.setDataForType( this.callBy(this.SET_STORAGE_FUNCTION) );
            
            this.callBy( this.FIND_FUNCTION, [
                this.pluginsByTypes[ this.method ],
                this.searchPlugins,
                this.getStorage()
            ]);
        } );

        return this._pluginData.filter( item => this.searchPlugins[ item.name ].finded );
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

    setDataForType( data = "" ) {
        if ( ! this.method ) return;

        this[ this.STORAGE_TYPE_PREFIX + this.method ] = data;
    }

    getStorage() {
        if ( ! this.method ) return;

        return this[ this.STORAGE_TYPE_PREFIX + this.method ];
    } 

    callBy( callback = "" , args = []) {
        if ( ! this.method ) return;

        if (typeof this[ callback ] === "function") 
            return this[ callback ].call(this, ...args );
        else 
            console.warn( `Please add function: Detector.${ callback }` ); 
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

class ApiWpJson extends Detector {
    
    constructor( data ) {
        super( data );

        this.method = "ApiWpJson";        
    }

    // running with `this.callBy(this.SET_STORAGE_FUNCTION);` 
    // in `get Detector.detectPlugins`
    storage() { 
        let namespaces = "empty";
        $.ajax({
            url: super.wp_json_url,
            dataType: 'json',
            async: false
        }).done( data => {
            namespaces = data.namespaces.toString();    
        }).fail( function() {
            console.log( "error" );
        });

        return namespaces;
    }

    // running with `this.callBy(this.FIND_FUNCTION);` 
    // in `get Detector.detectPlugins`
    find(allPlugins, searchPlugins, storage) {

        allPlugins.forEach(
            plug_name => {
                if( ~ ( storage ).indexOf( plug_name ) ) {
                    searchPlugins[plug_name].finded = true; 
                }
            }
        );
        
    }
}


class FindTypeFactory {

    static set() {
        this.classes = {
            ApiWpJson
        };
    }

    static new( type = "" ) {
        this.set();

        if ( ! type || ! this.classes[type] ) return;

        return this.classes[ type ];
    }
}

chrome.runtime.sendMessage({
    from: 'content',
    subject: 'showPageAction',
});
  
  // Listen for messages from the popup.
chrome.runtime.onMessage.addListener( (msg, sender, response) => {
    // First, validate the message's structure.
    if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {

        //let d = new ApiWpJson(msg.data);
        let d = new (FindTypeFactory.new('ApiWpJson'))(msg.data);
        response( { api: d.detectPlugins, html: document.querySelector('html').innerHTML } );
    }
});


