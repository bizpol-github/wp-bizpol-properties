<?php

/*
 * @package wp-bizpol-properties
 */

namespace Inc\Base;

use \Inc\Base\BaseController;

class Enqueue extends BaseController{
    public function register(){
        add_action('admin_enqueue_scripts', array($this, 'enqueue'));
    }
    
    function enqueue(){
                //enqueue all scripts
                wp_enqueue_style('main', $this->plugin_url . 'assets/style.min.css');
                wp_enqueue_script('main', $this->plugin_url . 'assets/script.min.js');
            }
}