<?php

/*
 * @package wp-bizpol-properties
 */

namespace Inc\Pages;

use \Inc\Base\BaseController;
use \Inc\Api\SettingsApi;
use\ Inc\Api\Callbacks\AdminCallbacks;
use\ Inc\Api\Callbacks\CallbacksManager;

class Admin extends BaseController{
    
    public $settings;
    
    public $callbacks;
    public $calbacks_mngr;


    public $pages = array();
    public $subpages = array();

    public function register(){
        $this->settings = new SettingsApi();
        
        $this->callbacks = new AdminCallbacks();
        $this->callbacks_mngr = new CallbacksManager;
        
        $this->setPages();
        $this->setSubPages();
        
        $this->setSettings();
        $this->setSections();
        $this->setFields();
                
        $this->settings->addPages($this->pages)->withSubPage('Properties')->addSubPages($this->subpages)->register();
    }
    
    public function setPages(){
        $this->pages =  [
            [            
            'page_title' => 'Properties',
            'menu_title' => 'Properties',
            'capability' => 'manage_options',
            'menu_slug' => 'bizpol_properties',
            'callback' => [$this->callbacks, 'adminDashboard'],
            'icon_url'=> 'dashicons-admin-home',
            'position' => 90
            ]
        ];
    }
    
    public function setSubPages(){
        $this->subpages = [
            [
            'parent_slug' => 'bizpol_properties',
            'page_title' => 'Owners',
            'menu_title' => 'Owners',
            'capability' => 'manage_options',
            'menu_slug' => 'bizpol_properties_owner',
            'callback' => function(){ echo '<h1>Properties</h1>'; }
            ]
        ];
    }
    
    public function setSettings(){
        $args = [
            [
                'option_group' => 'bizpol_properties_plugin_settings',
                'option_name' => 'PropertyName',
                'callback' => [$this->callbacks, 'propertiesOptionGroup']
            ],
            [
                'option_group' => 'bizpol_properties_plugin_settings',
                'option_name' => 'PropertyAddress'
            ],
            [
                'option_group' => 'bizpol_properties_plugin_settings',
                'option_name' => 'LandRegister'
            ],
            [
                'option_group' => 'bizpol_properties_plugin_settings',
                'option_name' => 'ConstructionYear'
            ],
            [
                'option_group' => 'bizpol_properties_plugin_settings',
                'option_name' => 'test',
                'callback' => [$this->callbacks_mngr, 'checkboxSanitize']
            ],
            [
                'option_group' => 'bizpol_properties_plugin_settings',
                'option_name' => 'test2',
                'callback' => [$this->callbacks_mngr, 'checkboxSanitize']
            ]
        ]; 
        
        $this->settings->setSettings($args);
    }
    
    public function setSections(){
        $args = [
            [
                'id' => 'properties_admin_index',
                'title' => 'Settings',
                'callback' => [$this->callbacks, 'propertiesAdminSection'],
                'page' => 'bizpol_properties'
            ]
        ]; 
        
        $this->settings->setSections($args);
    }
    
    public function setFields(){
        $args = [
            [
                'id' => 'PropertiesName',
                'title' => 'Name',
                'callback' => [$this->callbacks, 'propertiesName'],
                'page' => 'bizpol_properties',
                'section' => 'properties_admin_index',
                'args' => [
                    'label_for' => 'PropertiesName',
                    'class' => 'ex-class'
                ]
            ],
            [
                'id' => 'PropertiesAddress',
                'title' => 'Address',
                'callback' => [$this->callbacks, 'propertiesAddress'],
                'page' => 'bizpol_properties',
                'section' => 'properties_admin_index',
                'args' => [
                    'label_for' => 'PropertiesAddress',
                    'class' => 'ex-class'
                ]
            ],
            [
                'id' => 'LandRegister',
                'title' => 'Land Register',
                'callback' => [$this->callbacks, 'propertiesLandRegister'],
                'page' => 'bizpol_properties',
                'section' => 'properties_admin_index',
                'args' => [
                    'label_for' => 'LandRegister',
                    'class' => 'ex-class'
                ]
            ],
            [
                'id' => 'ConstructionYear',
                'title' => 'Construction Year',
                'callback' => [$this->callbacks, 'propertiesConstructionYear'],
                'page' => 'bizpol_properties',
                'section' => 'properties_admin_index',
                'args' => [
                    'label_for' => 'ConstructionYear',
                    'class' => 'ex-class'
                ]
            ],
            [
                'id' => 'test',
                'title' => 'test',
                'callback' => [$this->callbacks_mngr, 'checkboxField'],
                'page' => 'bizpol_properties',
                'section' => 'properties_admin_index',
                'args' => [
                    'label_for' => 'test',
                    'class' => 'ui-toggle'
                ]
            ],
            [
                'id' => 'test2',
                'title' => 'test2',
                'callback' => [$this->callbacks_mngr, 'checkboxField'],
                'page' => 'bizpol_properties',
                'section' => 'properties_admin_index',
                'args' => [
                    'label_for' => 'test2',
                    'class' => 'ui-toggle'
                ]
            ]
        ]; 
        
        $this->settings->setFields($args);
    }



//    public function add_admin_pages(){
//        add_menu_page('Settings', 'Settings', 'manage_options', 'bizpol_properties_settings', array($this, 'admin_settings'), '', 110);
//    }
//
//    public function admin_settings(){
//        //template requierd
//        require_once $this->plugin_path . 'templates/wp-bizpol-properties-settings.php';
//    }
}

