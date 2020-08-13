export class Detector {
    
    constructor(data  = {}) {
        this.pluginsByTypes = {};
        this.searchPlugins = {};
        this._pluginData = [];

        this.detectPlugins = data;   

        this.FIND_FUNCTION = 'find';
        this.SET_DATA_FUNCTION = 'setData';
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
            
            this.callBy(this.SET_DATA_FUNCTION);
            this.callBy(this.FIND_FUNCTION);
        } );

        console.log(this.searchPlugins);
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

    callBy( callback = "" ) {
        if ( ! this.method ) return;

        if (typeof this[ callback ] === "function") 
                this[ callback ].call(this, this.method);
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