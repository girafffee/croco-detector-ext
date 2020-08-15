
class Detector {
    
    constructor(data  = {}, method = "") {
        this.pluginsByTypes = {};
        this.searchPlugins = {};
        this._pluginData = [];

        this.detectPlugins = data;
        this.method = method;

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
    
    constructor( data, method ) {
        super( data, method );    
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

class SelectorDom extends Detector {
    constructor( data, method ) {
        super( data, method );      
    }

    find(allPlugins, searchPlugins) {
        allPlugins.forEach(
            plug_name => {
                if ( this._q( `link[href*="${plug_name}"]` ) )
                    searchPlugins[plug_name].finded = true;
            }
        );
    }

    storage () {
        return null;
    }
}


class FindTypeFactory {

    static classes = {
        ApiWpJson, 
        SelectorDom
    }

    static new( type = "", args = [] ) {

        if ( ! type || ! this.classes[ type ] ) return;

        return new this.classes[ type ]( ...args );
    }

    static issetClass( className ) {
        return ( className && this.classes[ className ] );
    }

    static all( data = {} ) {
        let plugins = [];
        Object.keys( this.classes ).forEach( className => {
            
            if ( this.issetClass(className) ){

                let obj = new (this.get( className ))( data, this.get( className ).name );
                
                plugins.push( obj.detectPlugins );
            }
        });

        return plugins;
    }

    // todo: find and save all types in array data
    // and then compare with `classes`
    static getTypes( data = [] ) {
        if ( ! data ) return;

        // code
    }

    static get( name = "" ) {
        if ( this.issetClass( name ) )
            return this.classes[ name ];
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

        //let d = FindTypeFactory.new( 'ApiWpJson', [ msg.data, 'ApiWpJson' ] );

        response( { api: FindTypeFactory.all(msg.data), html: document.querySelector('html').innerHTML } );
    }
});


