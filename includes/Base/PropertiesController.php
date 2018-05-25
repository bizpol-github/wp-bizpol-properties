<?php 
/**
 * @package  wp-bizpol-properties
 */
namespace Inc\Base;
use Inc\Api\SettingsApi;
use Inc\Base\BaseController;
use Inc\Api\Callbacks\AdminCallbacks;
use Inc\Api\Callbacks\PropertiesCallbacks;
/**
* 
*/
class PropertiesController extends BaseController
{
	public $callbacks;
    public $properties_callbacks;
	public $subpages = array();
	
	public function register()
	{
		$option = get_option('bizpol_properties');
        $activate = isset($option['Properties']) ? $option['Properties']  : false;

        if(!$activate){
        	return;
        }

		$this->settings = new SettingsApi();
		$this->callbacks = new AdminCallbacks();
		$this->properties_callbacks = new PropertiesCallbacks();
		$this->setSubpages();

        $this->setSettings();
        $this->setSections();
        $this->setFields();

		$this->settings->addSubPages( $this->subpages )->register();

        add_action('wp_ajax_bp_dialog_rpc', array($this, 'bp_dialog_rpc'));
        add_action('wp_ajax_bp_get_all_properties', array($this, 'bp_get_all_properties'));
	}

    public function bp_dialog_rpc(){
        global $wpdb;
        $data['status'] = false;

        $data = array();

        $form = $_POST['data'];
        
        $form_values = array(
            'property_name' => sanitize_text_field($form['property_name']),
            'prefix' => sanitize_text_field($form['prefix']),
            'address' => sanitize_text_field($form['address']),
            'construction_year' => $form['construction_year'],
            'land_register' => sanitize_text_field($form['land_register'])
        );

        if ($form['action'] == 'update') {
            

            if (isset($form['id']) && is_numeric($form['id'])) {
                $wpdb->update('wp_bp_properties', $form_values, array( 'id' =>  $form['id']));
                $data['status'] = true;
            } else {
                $wpdb->insert('wp_bp_properties', $form_values);
                $data['status'] = true;
                // return 0 on error
                $new_id = $wpdb->insert_id;

                if($new_id == 0){
                    $data['status'] = false;
                }
            }

        } elseif ($form['action'] == 'delete') {
            $wpdb->delete('wp_bp_properties', array( 'id' =>  $form['id']));
            $data['status'] = true;
        }

        

        $data['form_values']  = $form_values;
        wp_send_json($data);
        wp_die();
    }

    public function bp_get_all_properties(){
        global $wpdb;

        $properties = $wpdb->get_results("SELECT * FROM `wp_bp_properties`");

        $data = array();

        foreach ($properties as $property) {

            $data['entries'][] = array(
                'id' => $property->id,
                'property_name' => $property->property_name,
                'address' => $property->address,
                'construction_year' => $property->construction_year,
                'land_register' => $property->land_register
                );
        }

        $data['error'] = false;
        $data['total'] = count($properties);
        wp_send_json($data);
        wp_die();
    }

	public function setSubpages()
	{
        global $wpdb;

		$this->subpages = array(
			array(
				'parent_slug' => 'bizpol_properties', 
				'page_title' => 'Add Property', 
				'menu_title' => 'Add Property', 
				'capability' => 'manage_options', 
				'menu_slug' => 'bizpol_property', 
				'callback' => array( $this->callbacks, 'adminProperties' )
			)
		);
	}

    public function setSettings(){
        $args = array(
            [
                'option_group' => 'bp_property_settings',
                'option_name' => 'bizpol_property',
                'callback' => [$this->properties_callbacks, 'cptSanitize']
            ]
        );
        
        $this->settings->setSettings($args);
    }

    public function setSections(){
        $args = [
            [
                'id' => 'property_index',
                'title' => 'Add/Edit Property',
                'callback' => [$this->properties_callbacks, 'propertiesSectionManager'],
                'page' => 'bizpol_property'
            ]
        ]; 
        
        $this->settings->setSections($args);
    }

    public function setFields(){
            $args = [
                [
                'id' => 'property_name',
                'title' => 'Property Name',
                'callback' => [$this->properties_callbacks, 'textField'],
                'page' => 'bizpol_property',
                'section' => 'property_index',
                'args' => [
                    'option_name' => 'bizpol_property',
                    'label_for' => 'property_name',
                    'placeholder' => 'Name',
                    'min' => '3'
                ]
            ],
            [
                'id' => 'prefix',
                'title' => '',
                'callback' => [$this->properties_callbacks, 'textField'],
                'page' => 'bizpol_property',
                'section' => 'property_index',
                'args' => [
                    'option_name' => 'bizpol_property',
                    'label_for' => 'prefix',
                    'placeholder' => 'ex. ul',
                    'min' => '2',
                    'max' => '2'
                ]
            ],
            [
                'id' => 'address',
                'title' => 'Address',
                'callback' => [$this->properties_callbacks, 'textField'],
                'page' => 'bizpol_property',
                'section' => 'property_index',
                'args' => [
                    'option_name' => 'bizpol_property',
                    'label_for' => 'address',
                    'placeholder' => 'Address',
                    'min' => '2'
                ]
            ],
            [
                'id' => 'construct_year',
                'title' => 'Builded',
                'callback' => [$this->properties_callbacks, 'textField'],
                'page' => 'bizpol_property',
                'section' => 'property_index',
                'args' => [
                    'option_name' => 'bizpol_property',
                    'label_for' => 'construction_year',
                    'placeholder' => 'Construction Year',
                    'min' => '10',
                    'max' => '10',
                    'type' => 'date'
                ]
            ],
            [
                'id' => 'land_register',
                'title' => 'Land Register',
                'callback' => [$this->properties_callbacks, 'textField'],
                'page' => 'bizpol_property',
                'section' => 'property_index',
                'args' => [
                    'option_name' => 'bizpol_property',
                    'label_for' => 'land_register',
                    'placeholder' => 'Land Register',
                    'min' => '15',
                    'max' => '15'
                ]
            ]];

        $this->settings->setFields($args);
    }

}