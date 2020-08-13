import { Detector } from './detector';

export class ApiWpJson extends Detector {
    
    constructor( data ) {
        super( data );

        this.method = "ApiWpJson";        
    }

    setData() { 

        $.ajax({
            url: super.wp_json_url,
            dataType: 'json',
            async: false
        }).done( data => {
            super.setDataForType( data.namespaces );    
        }).fail( function() {
            console.log( "error" );
        });
        
    }

    find() {
        this.pluginsByTypes[ this.method ].forEach(
            plug_name => {
                if( ~ ( this.getStorage() ).indexOf( plug_name ) )
                this.searchPlugins[plug_name].finded = true;
            }
        );
    }
}