<?php

/*
 * @package wp-bizpol-properties
 */

namespace Inc\Pages;

use \Inc\Base\BaseController;
use \Inc\Api\SettingsApi;
use \Inc\Api\Callbacks\AdminCallbacks;
use \Inc\Api\Callbacks\CallbacksManager;

class Dashboard extends BaseController{
    
    public $settings;
    
    public $callbacks;
    public $calbacks_mngr;


    public $pages = array();
    //public $subpages = array();

    public function register(){
        $this->settings = new SettingsApi();
        
        $this->callbacks = new AdminCallbacks();
        $this->callbacks_mngr = new CallbacksManager;
        
        $this->setPages();
        //$this->setSubPages();
        
        $this->setSettings();
        $this->setSections();
        $this->setFields();
                
        $this->settings->addPages($this->pages)->withSubPage('Properties')->register();
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
    
    
    
    public function setSettings(){
        $args = array(
            [
                'option_group' => 'bizpol_properties_plugin_settings',
                'option_name' => 'bizpol_properties',
                'callback' => [$this->callbacks_mngr, 'checkboxSanitize']
            ]
        );
        
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
        foreach($this->managers as $id => $title){
            $args[] = [
                'id' => $id,
                'title' => $title,
                'callback' => [$this->callbacks_mngr, 'checkboxField'],
                'page' => 'bizpol_properties',
                'section' => 'properties_admin_index',
                'args' => [
                    'option_name' => 'bizpol_properties',
                    'label_for' => $id,
                    'class' => 'ui-toggle'
                ]
            ];
        }

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

