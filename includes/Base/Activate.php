<?php

/*
 * @package wp-bizpol-properties
 */

namespace Inc\Base;

class Activate{
    public static function activate(){
        flush_rewrite_rules();
        $default = array();
        
        if(!get_option('bizpol_properties')){
        	update_option('bizpol_properties', $default);
        }  

        if(!get_option('bizpol_properties_cpt')){
        	update_option('bizpol_properties_cpt', $default);
        }

        if(!get_option('bizpol_gallery')){
            update_option('bizpol_gallery', $default);
        }

        if(!get_option('bizpol_property')){
            update_option('bizpol_property', $default);
        }

        if(!get_option('bizpol_incexp')){
            update_option('bizpol_incexp', $default);
        }
    }
}

