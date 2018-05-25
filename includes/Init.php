<?php

/*
 * @package wp-bizpol-properties
 */

namespace Inc;

final class Init{
    public static function get_services(){
        return [
            Pages\Dashboard::class,
            Base\Settings::class, 
            Base\Enqueue::class,
            Base\CustomPostTypeController::class,
            Base\GalleryController::class,
            Base\WidgetController::class,
            Base\PropertiesController::class
        ];
    }
    
    public static function register_services() {
        foreach (self::get_services() as $class){
            $service = self::instantiate($class);
            if(method_exists($service, 'register')){
                $service->register();
            }
        }
    }
    
    private static function instantiate($class){
        $service = new $class();
        return $service;
    }
}

//    use Inc\Base\Activate;
//    use Inc\Base\Deactivate;
//    use Inc\Admin\AdminPages;
//    
//    if (!class_exists('PropertiesPlugin')){
//    
//        class PropertiesPlugin{
//            public $plugin;
//
//            function __construct() {
//                add_action('init', array($this, 'custom_post_type'));
//                $this->plugin = plugin_basename(__FILE__);
//            }
//
//            function register(){
//                add_action('admin_enqueue_scripts', array($this, 'enqueue'));
//                add_action('admin_menu', array($this, 'add_admin_pages'));
//                add_filter("plugin_action_links_$this->plugin", array($this, 'setting_links'));
//            }
//
//            function custom_post_type(){
//                register_post_type('properties', ['public' => true, 'label' => 'Properties']);
//            }
//        }
//            
//        $proppertiesPlugin = new PropertiesPlugin();
//        $proppertiesPlugin->register();
//    
//    }

