<?php

/*
 * @package wp-bizpol-properties
 */

namespace Inc\Base;

use Inc\Base\BaseController;

class Settings extends BaseController{
    public function register(){
        add_filter("plugin_action_links_$this->plugin", array($this, 'setting_links'));
    }
    
    public function setting_links($links){
        //custom settings
        $setting_links = '<a href="admin.php?page=bizpol_properties">Settings</a>';
        array_push($links, $setting_links);
        return $links;
    }
}