<?php

/*
 * @package wp-bizpol-properties
 */

namespace Inc\Api\Callbacks;

use Inc\Base\BaseController;

class CallbacksManager extends BaseController{
    public function checkboxSanitize($input){
        $output = [];
        foreach($this->managers as $id => $title){
           $output[$id] = isset($input[$id]) ? true : false;
        }
        return $output;
    }
    public function test(){
        echo 'Activate';
    }
    public function checkboxField($args){
        $name = $args['label_for'];
        $class = $args['class'];
        $option_name = $args['option_name'];
        $checkbox = get_option($option_name);
        $checked = isset($checkbox[$name]) ? ($checkbox[$name] ? true : false) : false;
        echo '<div class="' . $class . '"><input type="checkbox" id="' . $name . '" name="' . $option_name . '[' . $name . ']" value="1" class="" ' . ($checked ? 'checked' : '') . '><label for="' . $name . '"><div></div></label></div>';
    }
}

