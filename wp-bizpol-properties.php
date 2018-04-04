<?php
/*
 * Plugin Name:  Bizpol Properties
 * Version:      1.0.1
 * Author:       Netcom, sebastian@bizpol.com.pl
 * 
 * 
 * @package bizpol-properties
 */
    
    defined('ABSPATH') or die('You shall not pass!!');
    
    if(file_exists(dirname(__FILE__) . '/vendor/autoload.php')){
        require_once dirname(__FILE__) . '/vendor/autoload.php';
    }
    
    use Inc\Base\Activate;
    use Inc\Base\Deactivate;
    
    function activate_properties_plugin(){
        Activate::activate();
    }
    
    function deactivate_properties_plugin(){
        Deactivate::deactivate();
    }
    
    register_activation_hook(__FILE__, 'activate_properties_plugin');
    register_deactivation_hook(__FILE__, 'deactivate_properties_plugin');
    
    if (class_exists('Inc\\Init')){
        Inc\Init::register_services();
    }