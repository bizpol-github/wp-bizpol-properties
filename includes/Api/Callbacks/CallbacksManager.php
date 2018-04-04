<?php

/*
 * @package wp-bizpol-properties
 */

namespace Inc\Api\Callbacks;

use Inc\Base\BaseController;

class CallbacksManager extends BaseController{
    public function checkboxSanitize($input){
        //return filter_var($input, FILTER_SANITIZE_NUMBER_INT);
        return (isset($input) ? true : false);
    }
    public function test(){
        echo 'Activate';
    }
    public function checkboxField($args){
        $name = $args['label_for'];
        $class = $args['class'];
        $checkbox = get_option($name);
        echo '<div class="' . $class . '"><input type="checkbox" id="' . $name . '" name="' . $name . '" value="1" class="" ' . ($checkbox ? 'checked' : '') . '><label for="' . $name . '"><div></div></label></div>';
    }
}

