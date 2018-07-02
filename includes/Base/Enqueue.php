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
                wp_enqueue_script('media_upload');
                wp_enqueue_script('jquery-ui-dialog');
                wp_enqueue_media();
                wp_enqueue_style('main', $this->plugin_url . 'assets/style.min.css');
                wp_enqueue_style('jquery-ui', '//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css');
                wp_enqueue_script('main', $this->plugin_url . 'assets/script.min.js');
                wp_enqueue_script('add', $this->plugin_url . 'assets/bp-properties-add.min.js');
                wp_enqueue_script('data-table', $this->plugin_url . 'src/js/bp-data-table.js');
                wp_enqueue_script('dialog', $this->plugin_url . 'src/js/bp-dialog.js');
    }
}