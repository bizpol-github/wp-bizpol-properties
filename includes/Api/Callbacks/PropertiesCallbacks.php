<?php

/*
 * @package wp-bizpol-properties
 */

namespace Inc\Api\Callbacks;

/**
 * Class for properties callbacks.
 */
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


    /**
     * Creates text fields
     *
     * @param      <object>  $args   The arguments
     */
    public function textField($args){
        $name = $args['label_for'];
        $option_name = $args['option_name'];
        $value = '';
        
        if(isset($_POST['edit_post'])){
            $input = get_option($option_name);
            $value = $input[$_POST['edit_post']][$name];
        }

        echo '<input ' . (isset($args['type']) ? 'type="' . $args['type'] . '" ' : 'type="text"') . ' id="' . $name . '" name="' . $name . '" value="' . $value . '" placeholder="' . $args['placeholder'] . '" min="' . $args['min'] . '" ' . (isset($args['max']) ? ' max="' . $args['max'] . '" ' : '') . (isset($args['patern']) ? ' patern="' . $args['patern'] . '" ' : '') . (isset($args['required']) ? 'required' : '') . ' class="bp-input"><div class="status dashicons" status="null"></div>';
    }

    /**
     * Creates address text fields
     *
     * @param      <object>  $args   The arguments
     */
    public function textFieldAddress($args){
        $name = $args['label_for'];
        $option_name = $args['option_name'];
        $value = '';
        
        if(isset($_POST['edit_post'])){
            $input = get_option($option_name);
            $value = $input[$_POST['edit_post']][$name];
        }

        echo '<span class="select-input"><select name="prefix" class="prefix nocheck">
  <option value="ul">ul.</option>
  <option value="al">al.</option>
  <option value="os">os.</option>
</select><input ' . (isset($args['type']) ? 'type="' . $args['type'] . '" ' : 'type="text"') . ' class="bp-input" id="' . $name . '" name="' . $name . '" value="' . $value . '" placeholder="' . $args['placeholder'] . '" min="' . $args['min'] . '" ' . (isset($args['max']) ? 'max="' . $args['max'] . '" ' : '') . 'autocomplete="on" onfocus="bpStreetRPC.initialize(this);" required><div class="status dashicons" status="null"></div></span>';
    }

    /**
     * Creates city text fields
     *
     * @param      <object>  $args   The arguments
     */
    public function selectCountry($args){
         global $wpdb;

        $countries = $wpdb->get_results("SELECT * FROM `wp_bp_countries`");

        $name = $args['label_for'];
        $option_name = $args['option_name'];
        $value = '';
        
        if(isset($_POST['edit_post'])){
            $input = get_option($option_name);
            $value = $input[$_POST['edit_post']][$name];
        }

        echo '<span class="select-input"><select name="' . $name . '" class="bp-select" ' . (isset($args['patern']) ? ' patern="' . $args['patern'] . '" ' : '') . ' onchange="bpZoneRPC.load(this);">
                <option value="0">--Select--</option>';

        foreach ($countries as $country) {
            echo  '<option value="' . $country->countries_id . '">' . $country->countries_name . ' (' . $country->countries_iso_code_2 .')</option>';
        }


        echo '</select><div class="status dashicons" status="null"></div></span>';
    }

    /**
     * Creates city text fields
     *
     * @param      <object>  $args   The arguments
     */
    public function textFieldCity($args){
        $name = $args['label_for'];
        $option_name = $args['option_name'];
        $value = '';
        
        if(isset($_POST['edit_post'])){
            $input = get_option($option_name);
            $value = $input[$_POST['edit_post']][$name];
        }

        echo '<input ' . (isset($args['type']) ? 'type="' . $args['type'] . '" ' : 'type="text"') . ' id="' . $name . '" name="' . $name . '" value="' . $value . '" placeholder="' . $args['placeholder'] . '" min="' . $args['min'] . '" ' . (isset($args['max']) ? ' max="' . $args['max'] . '" ' : '') . (isset($args['patern']) ? ' patern="' . $args['patern'] . '" ' : '') . (isset($args['required']) ? 'required' : '') . ' class="bp-input" autocomplete="on" onfocus="bpCityRPC.initialize(this);"><div class="status dashicons" status="null"></div>';
    }

    /**
     * Creates income/expense type field
     *
     * @param      <object>  $args   The arguments
     */
    public function incExpFieldType($args){
        $name = $args['label_for'];
        $option_name = $args['option_name'];
        $value = '';
        
        if(isset($_POST['edit_post'])){
            $input = get_option($option_name);
            $value = $input[$_POST['edit_post']][$name];
        }

        echo '<span class="select-input"><select name="' . $name . '" class="bp-select" ' . (isset($args['patern']) ? ' patern="' . $args['patern'] . '" ' : '') . '>
                <option value="0">--Select--</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select><div class="status dashicons" status="null"></div></span>';
    }

    public function monthSelect($args){
        $name = $args['label_for'];
        $option_name = $args['option_name'];
        $value = '';
        
        if(isset($_POST['edit_post'])){
            $input = get_option($option_name);
            $value = $input[$_POST['edit_post']][$name];
        }

        echo '<span class="select-input"><select name="' . $name . '" class="bp-select" ' . (isset($args['patern']) ? ' patern="' . $args['patern'] . '" ' : '') . '>
                <option value="0">--Select--</option>';

                for ($i = 1; $i <= 12; $i++ ) {
                    $date = '01-'. $i .'-1970';
                $date_str = date('F', strtotime($date));
                echo '<option value="' . ($i)  .'">' . $date_str . '</option>';

                }
                
              
        echo '</select><div class="status dashicons" status="null"></div></span>';
    }

    public function yearSelect($args){
        $name = $args['label_for'];
        $option_name = $args['option_name'];
        $value = '';
        
        if(isset($_POST['edit_post'])){
            $input = get_option($option_name);
            $value = $input[$_POST['edit_post']][$name];
        }

        echo '<span class="select-input"><select name="' . $name . '" class="bp-select" ' . (isset($args['patern']) ? ' patern="' . $args['patern'] . '" ' : '') . '>
                <option value="0">--Select--</option>';

                for ($i = 1970; $i <= 2069; $i++ ) {
                    $date_now = date('Y', strtotime('now'));
                    $selected = ($date_now == $i) ? ' selected' : '';
                    echo '<option value="' . ($i)  .'"' . $selected . '>' . ($i) . '</option>';

                }
                
              
        echo '</select><div class="status dashicons" status="null"></div></span>';
    }

    public function incExpField($args){
        $name = $args['label_for'];
        $option_name = $args['option_name'];
        $value = '';
        
        if(isset($_POST['edit_post'])){
            $input = get_option($option_name);
            $value = $input[$_POST['edit_post']][$name];
        }

        echo '<span class="select-input"><select name="' . $name . '" class="bp-select" ' . (isset($args['patern']) ? ' patern="' . $args['patern'] . '" ' : '') . '>';

        echo '<option value="0">--Select--</option>';

        foreach ($args['data'] as $value) {
            echo '<option value="' . $value->id . '">' . $value->incexp_name . ' (' . $value->incexp_type . ')</option>';
        }
        echo '</select><div class="status dashicons" status="null"></div></span>';
    }

    public function incExpButton($args){
        $name = $args['label_for'];
        echo '<span class="select-input">
                <input type="button" name="' . $name . '" value="+ Add manualy" class="button button-primary" style="text-align: center; font-weight:bold;" onclick="incexp2propAdd(this);">
        </span>';
        //<span class="dashicons dashicons-plus" style=" padding-top: 3px;"></span>Add manually</span>
    }


    /**
     * Creates date fields
     *
     * @param      <object>  $args   The arguments
     */
    public function dateField($args){
        $name = $args['label_for'];
        $option_name = $args['option_name'];
        $value = '';
        
        if(isset($_POST['edit_post'])){
            $input = get_option($option_name);
            $value = $input[$_POST['edit_post']][$name];
        }

        echo '<input ' . (isset($args['type']) ? 'type="' . $args['type'] . '" ' : 'type="date"') . ' id="' . $name . '" name="' . $name . '" value="' . $value . '" placeholder="' . $args['placeholder'] . '" min="' . $args['min'] . '" ' . (isset($args['max']) ? ' max="' . $args['max'] . '" ' : '') . (isset($args['patern']) ? ' patern="' . $args['patern'] . '" ' : '') . 'class="bp-input" required><div class="status dashicons" status="null"></div>';
    }
    

    /**
     * Creates checkbox fields
     *
     * @param      <object>  $args   The arguments
     */
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

    public function switchField($args){
        $name = $args['label_for'];
        $class = $args['class'];
        $option_name = $args['option_name'];

        //echo '<div class="' . $class . '"><input type="checkbox" id="' . $name . '" name="' . $name . '" value="1" class="" checked><label for="' . $name . '"><div></div></label></div>';

        echo '<label class="switch"><input type="checkbox" id="' . $name . '" name="' . $name . '" value=""><span class="slider round"></span></label>';
    }
}

