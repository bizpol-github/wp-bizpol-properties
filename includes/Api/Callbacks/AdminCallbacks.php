<?php

/*
 * @package wp-bizpol-properties
 */

namespace Inc\Api\Callbacks;

use Inc\Base\BaseController;

class AdminCallbacks extends BaseController{
    public function adminDashboard(){
        return require_once("$this->plugin_path/templates/wp-bizpol-properties-admin.php");
    }
    
    public function propertiesOptionGroup($input){
        return $input;
    }
    
    public function propertiesAdminSection(){
        echo 'test';
    }
    
    public function propertiesName(){
        $value = esc_attr(get_option('PropertyName'));
        echo '<input type="text" class="regular-text" name="PropertyName" value="' .  $value . '" placeholder="">';
    }
    
    public function propertiesAddress(){
        $value = esc_attr(get_option('PropertyAddress'));
        echo '<input type="text" class="regular-text" name="PropertyAddress" value="' .  $value . '" placeholder="Address">';
    }

    public function propertiesLandRegister(){
        $value = esc_attr(get_option('LandRegister'));
        echo '<input type="text" class="regular-text" name="LandRegister" value="' .  $value . '" placeholder="Land Register">';
    }

    public function propertiesConstructionYear(){
        $value = esc_attr(get_option('ConstructionYear'));
        echo '<input type="text" class="regular-text" name="ConstructionYear" value="' .  $value . '" placeholder="Construction Year">';
    }
    
}

