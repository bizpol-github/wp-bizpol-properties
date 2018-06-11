<?php

/*
 * @package wp-bizpol-properties
 */

namespace Inc\Api\Callbacks;

class PropertiesCallbacks{
    public function propertiesSectionManager(){
        echo '<h4></h4>';
    }

    public function propertiesSanitize($input){
        $output = get_option('bizpol_property');

        if(isset($_POST['remove'])){
            unset($output[$_POST['remove']]);
            return $output;
        }

        if(count($output) == 0){
            $output[$input['post_type']] = $input;
            return $output;
        }

        foreach($output as $key => $value){
            if($input['post_type'] === $key){
                $output[$key] = $input;
            } else {
                $output[$input['post_type']] = $input;
            }
        }

        return $output;
    }

    public function textField($args){
        $name = $args['label_for'];
        $option_name = $args['option_name'];
        $value = '';
        
        if(isset($_POST['edit_post'])){
            $input = get_option($option_name);
            $value = $input[$_POST['edit_post']][$name];
        }

        echo '<input ' . (isset($args['type']) ? 'type="' . $args['type'] . '" ' : 'type="text"') . ' class="regular-text" id="' . $name . '" name="' . $name . '" value="' . $value . '" placeholder="' . $args['placeholder'] . '" min="' . $args['min'] . '" ' . (isset($args['max']) ? ' max="' . $args['max'] . '" ' : '') . (isset($args['patern']) ? ' patern="' . $args['patern'] . '" ' : '') . 'required><div class="status dashicons" status="null"></div>';
    }

    public function textFieldAddress($args){
        $name = $args['label_for'];
        $option_name = $args['option_name'];
        $value = '';
        
        if(isset($_POST['edit_post'])){
            $input = get_option($option_name);
            $value = $input[$_POST['edit_post']][$name];
        }

        echo '<span class="regular-text" style="display: inline-block;"><select name="prefix" class="prefix" style="display: inline; width: 11%; margin: 0;">
  <option value="ul">ul.</option>
  <option value="al">al.</option>
  <option value="os">os.</option>
</select><input ' . (isset($args['type']) ? 'type="' . $args['type'] . '" ' : 'type="text"') . ' style="width: 89%; margin: 0;" id="' . $name . '" name="' . $name . '" value="' . $value . '" placeholder="' . $args['placeholder'] . '" min="' . $args['min'] . '" ' . (isset($args['max']) ? 'max="' . $args['max'] . '" ' : '') . 'required><div class="status dashicons" status="null"></div></span>';
    }

    public function dateField($args){
        $name = $args['label_for'];
        $option_name = $args['option_name'];
        $value = '';
        
        if(isset($_POST['edit_post'])){
            $input = get_option($option_name);
            $value = $input[$_POST['edit_post']][$name];
        }

        echo '<input ' . (isset($args['type']) ? 'type="' . $args['type'] . '" ' : 'type="date"') . ' class="regular-text" id="' . $name . '" name="' . $name . '" value="' . $value . '" placeholder="' . $args['placeholder'] . '" min="' . $args['min'] . '" ' . (isset($args['max']) ? ' max="' . $args['max'] . '" ' : '') . (isset($args['patern']) ? ' patern="' . $args['patern'] . '" ' : '') . 'required>';
    }

    

    public function checkboxField($args){
        $name = $args['label_for'];
        $class = $args['class'];
        $option_name = $args['option_name'];
        $checked = false;

        if(isset($_POST['edit_post'])){
            $checkbox = get_option($option_name);
            $checked = isset($checkbox[$_POST['edit_post']][$name]) ?: false;
        }

        echo '<div class="' . $class . '"><input type="checkbox" id="' . $name . '" name="' . $option_name . '[' . $name . ']" value="1" class="" ' . ($checked ? 'checked' : '') . '><label for="' . $name . '"><div></div></label></div>';
    }
}

