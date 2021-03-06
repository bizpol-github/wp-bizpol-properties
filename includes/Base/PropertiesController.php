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
	

	/**
     * Registering functions
     */
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

        add_action('wp_ajax_bp_rpc_update_properties', array($this, 'bp_rpc_update_properties'));
        add_action('wp_ajax_bp_rpc_update_incexp', array($this, 'bp_rpc_update_incexp'));
        add_action('wp_ajax_bp_rpc_update_incexp2prop', array($this, 'bp_rpc_update_incexp2prop'));

        add_action('wp_ajax_bp_rpc_get_all_properties', array($this, 'bp_rpc_get_all_properties'));
        add_action('wp_ajax_bp_rpc_get_all_incexp', array($this, 'bp_rpc_get_all_incexp'));
        add_action('wp_ajax_bp_rpc_get_all_incexp2prop', array($this, 'bp_rpc_get_all_incexp2prop'));
        add_action('wp_ajax_bp_rpc_get_cities', array($this, 'bp_rpc_get_cities'));
        add_action('wp_ajax_bp_rpc_get_zones', array($this, 'bp_rpc_get_zones'));
        add_action('wp_ajax_bp_rpc_get_streets', array($this, 'bp_rpc_get_streets'));
        
	}

    public function bp_rpc_update_properties(){
        global $wpdb;

        $data['ok'] = false;
        $data = array();
        $form = $_POST['data'];

        if (isset($form['entries'])) {

            foreach ($form['entries'] as $key => $value) {

                $form_values = array(
                    'property_name' => sanitize_text_field($value['property_name']),
                    'prefix' => sanitize_text_field($value['prefix']),
                    'address' => sanitize_text_field($value['address']),
                    'city' => sanitize_text_field($value['city']),
                    'construction_year' => $value['construction_year'],
                    'land_register' => sanitize_text_field($value['land_register']),
                    'user_id' => sanitize_text_field($value['user_id']),
                    'status' => (isset($value['status']) ? $value['status'] : 0)
                );

                if ($form['action'] == 'update') {
                    $wpdb->update('wp_bp_properties', $form_values, array('id' =>  $key));

                } elseif ($form['action'] == 'insert') {
                    $wpdb->insert('wp_bp_properties', $form_values);
                    $data['ok'] = true;
                    $new_id = $wpdb->insert_id;

                    if($new_id == 0){
                        $data['ok'] = false;
                    }                  
                } elseif ($form['action'] == 'delete') {
                    $wpdb->delete('wp_bp_properties', array('id' =>  $key));
                    $wpdb->delete('wp_bp_incexp2prop', array('property_id' =>  $key));
                } elseif ($form['action'] == 'status') {
                    $status = ($form['status'] == '1') ? '0' : '1';
                    $wpdb->update('wp_bp_properties', array('status' => $status), array('id' =>  $key));                   
                }

                $data['ok'] = true;
                
            }

        }
        $data['seba'] = 1;
        $data['form_values']  = $form;
        wp_send_json($data);
        wp_die();
    }

    public function bp_rpc_update_incexp(){
        global $wpdb;
        $data['status'] = false;

        $data = array();

        $form = $_POST['data'];
        
        $form_values = array(
            'incexp_name' => sanitize_text_field($form['incexp_name']),
            'incexp_type' => sanitize_text_field($form['incexp_type'])
        );

        if ($form['action'] == 'update') {
            

            if (isset($form['id']) && is_numeric($form['id'])) {
                $wpdb->update('wp_bp_incexp', $form_values, array( 'id' =>  $form['id']));
                $data['status'] = true;
            } else {
                $wpdb->insert('wp_bp_incexp', $form_values);
                $data['status'] = true;
                // return 0 on error
                $new_id = $wpdb->insert_id;

                if($new_id == 0){
                    $data['status'] = false;
                }
            }

        } elseif ($form['action'] == 'delete') {
            $wpdb->delete('wp_bp_incexp', array( 'id' =>  $form['id']));
            $data['status'] = true;
        }

        

        $data['form_values']  = $form_values;
        wp_send_json($data);
        wp_die();
    }

    public function bp_rpc_update_incexp2prop(){
        
        
        

        // if ($form['action'] == 'update') {
            

        //     if (isset($form['id']) && is_numeric($form['id'])) {
        //         $wpdb->update('wp_bp_incexp2prop', $form_values, array( 'id' =>  $form['id']));
        //         $data['status'] = true;
        //     } else {
        //         $form_values['property_id'] = sanitize_text_field($form['property_id']);
        //         $wpdb->insert('wp_bp_incexp2prop', $form_values);
        //         $data['status'] = true;
        //         // return 0 on error
        //         $new_id = $wpdb->insert_id;

        //         if($new_id == 0){
        //             $data['status'] = false;
        //         }
        //     }

        // } elseif ($form['action'] == 'delete') {
        //     $wpdb->delete('wp_bp_incexp2prop', array( 'id' =>  $form['id']));
        //     $data['status'] = true;
        // }

        

        // $data['form_values']  = $form_values;
        // wp_send_json($data);
        // wp_die();
        // 
        global $wpdb;

        $data['ok'] = false;
        $data = array();
        $form = $_POST['data'];

        if (isset($form['entries'])) {

            foreach ($form['entries'] as $key => $value) {

                $form_values = array(
                    'property_id' => $form['property_id'],
                    'incexp_id' => $value['incexp_id'],
                    'quantity' => $value['quantity'],
                    'value' => $value['value'],
                    'incexp_posting_month' => $value['incexp_posting_month'],
                    'incexp_posting_year' => $value['incexp_posting_year'],
                    'user_id' => $form['user_id']
                );

                if(isset($value['incexp_new']) && $value['incexp_new'] == true){

                    //check if data exist in database
                    $incexp = $wpdb->get_results("SELECT * FROM `wp_bp_incexp` WHERE incexp_name='" . $value['incexp_name'] . "' AND incexp_type='" . $value['incexp_type'] . "'");
                    
                    //add data to database
                    if (count($incexp) < 1) {
                        $incexp_values = array(
                            'incexp_name' => $value['incexp_name'],
                            'incexp_type' => $value['incexp_type'],                          
                            'user_id' => $form['user_id']
                        );


                        $wpdb->insert('wp_bp_incexp', $incexp_values);
                        $data['status_incexp'] = true;
                        // return 0 on error
                        $new_id = $wpdb->insert_id;

                        $form_values['incexp_id'] = $new_id;

                    }
                    
                }
                

                if ($form['action'] == 'update') {
                    $wpdb->update('wp_bp_incexp2prop', $form_values, array('id' =>  $key));

                } elseif ($form['action'] == 'insert') {
                    $wpdb->insert('wp_bp_incexp2prop', $form_values);
                    $data['ok'] = true;
                    $new_id = $wpdb->insert_id;

                    if($new_id == 0){
                        $data['ok'] = false;
                    }                  
                } elseif ($form['action'] == 'delete') {
                    $wpdb->delete('wp_bp_incexp2prop', array('id' =>  $key));
                } elseif ($form['action'] == 'status') {
                    $status = ($form['status'] == '1') ? '0' : '1';
                    $wpdb->update('wp_bp_incexp2prop', array('status' => $status), array('id' =>  $key));                   
                }

                $data['ok'] = true;
                
            }

        }
        $data['seba'] = 1;
        $data['form_values']  = $form;
        wp_send_json($data);
        wp_die();
    }

    public function bp_rpc_get_all_properties(){
        global $wpdb;

        $data = array();

        $data['unlogged'] = false;

        if (!is_user_logged_in()) {

            $data['unlogged'] = true;

        }

        $properties = $wpdb->get_results("SELECT * FROM `wp_bp_properties`", ARRAY_A);        
        
        $data['columns'] = $wpdb->get_col_info();

        foreach ($properties as $property) {
            $data['entries'][] = $property; 
        }

        $data['sorters'] = array('property_name' => array('type' => 'string'), 
                                 'address' => array('type' => 'string'),
                                 'construction_year' => array('type' => 'int'),
                                 'land_register' => array('type' => 'string'));

        $data['error'] = false;
        $data['total'] = count($properties);
        wp_send_json($data);
        wp_die();
    }

    public function bp_rpc_get_all_incexp(){
        global $wpdb;

        $incsexps = $wpdb->get_results("SELECT * FROM `wp_bp_incexp`", ARRAY_A);

        $data = array();

        foreach ($incsexps as $incexp) {

            $data['entries'][] = array(
                'id' => $incexp->id,
                'incexp_name' => $incexp->incexp_name,
                'incexp_type' => $incexp->incexp_type
                );
        }

        $data['error'] = false;
        $data['total'] = count($incsexps);
        wp_send_json($data);
        wp_die();
    }

    public function bp_rpc_get_all_incexp2prop(){
        global $wpdb, $wp_locale;

        $property_id = $_GET['property_id'];

        $incexp2props = $wpdb->get_results("SELECT i2p.*, i.incexp_name, i.incexp_type FROM `wp_bp_incexp2prop` i2p, `wp_bp_incexp` i WHERE i2p.property_id = " . $property_id . " AND i2p.incexp_id = i.id");

        $data = array();

        $income = 0;
        $expense = 0;

        foreach ($incexp2props as $incexp2prop) {

            $month_name = date('F', strtotime('01-'. $incexp2prop->incexp_posting_month .'-1970'));

            if ($incexp2prop->incexp_posting_month == "0") {
                $month_name = 'Zero';
            }

            $data['entries'][] = array(
                'id' => $incexp2prop->id,
                'property_id' => $incexp2prop->property_id,
                'incexp_id' => $incexp2prop->incexp_id,
                'incexp_name' => $incexp2prop->incexp_name,
                'incexp_type' => $incexp2prop->incexp_type,
                'quantity' => $incexp2prop->quantity,
                'value' => $incexp2prop->value,
                'incexp_posting_month' => $incexp2prop->incexp_posting_month,
                'incexp_posting_month_n' => $month_name,
                'incexp_posting_year' => $incexp2prop->incexp_posting_year,
                );

            if ($incexp2prop->incexp_type === 'income') {
                $income += $incexp2prop->quantity * $incexp2prop->value;
            } else {
                $expense += $incexp2prop->quantity * $incexp2prop->value;
            }
        }

        $data['summary']['income'] = number_format_i18n($income, 2);
        $data['summary']['expense'] = number_format_i18n($expense, 2);
        $data['summary']['total'] = number_format_i18n($income - $expense, 2);

        $data['filters'] = array('incexp_posting_month' => array('value' => 'incexp_posting_month_n', 'default' => 'Month'), 
                                 'incexp_posting_year' => array('value' => 'incexp_posting_year', 'dafault' => 'Year'),
                                 'incexp_type' => array('value' => 'incexp_type', 'dafault' => 'Type'));

        $data['sorters'] = array('incexp_name' => array('type' => 'string'),
                                 'quantity' => array('type' => 'int'), 
                                 'value'=> array('type' => 'int'),
                                 'incexp_posting_month' => array('type' => 'string'), 
                                 'incexp_posting_year' => array('type' => 'int'));



        $data['columns'] = $wpdb->get_col_info();

        $data['error'] = false;
        $data['total'] = count($incexp2props);
        wp_send_json($data);
        wp_die();
    }

    public function get_incexp(){
        global $wpdb;

        $incexp = $wpdb->get_results("SELECT * FROM `wp_bp_incexp`");
        return $incexp;


    }

    public function bp_rpc_get_zones(){
        global $wpdb;

        $data = array();

        $data['unlogged'] = false;

        if (!is_user_logged_in()) {

            $data['unlogged'] = true;

        }

        $data['params'] = $_GET;

        $country_id = $_GET['country_id'];

        $zones = $wpdb->get_results("SELECT * FROM `wp_bp_zones` WHERE zone_country_id = $country_id");

        foreach ($zones as $zone) {
            $data['entries'][] = $zone; 
        }

        $data['error'] = false;
        $data['total'] = count($zones);
        wp_send_json($data);
        wp_die();
    }

    public function bp_rpc_get_cities(){
        global $wpdb;

        $data = array();

        $data['unlogged'] = false;

        if (!is_user_logged_in()) {

            $data['unlogged'] = true;

        }

        $cities = $wpdb->get_results("SELECT NAZWA FROM `miejscowosci`");

        foreach ($cities as $city) {
            $data['entries'][] = $city->NAZWA; 
        }

        $data['error'] = false;
        $data['total'] = count($cities);
        wp_send_json($data);
        wp_die();
    }

    public function bp_rpc_get_streets(){
        global $wpdb;

        $data = array();

        $data['unlogged'] = false;

        if (!is_user_logged_in()) {

            $data['unlogged'] = true;

        }

        $streets = $wpdb->get_results("SELECT NAZWA_1 FROM `wp_bp_streets` WHERE WOJ = 04 AND POW = 62");        

        foreach ($streets as $street) {
            $data['entries'][] = $street->NAZWA_1;
        }

        $data['error'] = false;
        $data['total'] = count($streets);
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
			),
            array(
                'parent_slug' => 'bizpol_properties', 
                'page_title' => 'Income/Expense', 
                'menu_title' => 'Income/Expense', 
                'capability' => 'manage_options', 
                'menu_slug' => 'bizpol_incexp', 
                'callback' => array( $this->callbacks, 'adminIncExp' )
            )
		);
	}

    public function setSettings(){
        $args = array(
            [
                'option_group' => 'bp_property_settings',
                'option_name' => 'bizpol_property',
                'callback' => [$this->properties_callbacks, 'cptSanitize']
            ],
            [
                'option_group' => 'bp_incexp_settings',
                'option_name' => 'bizpol_incexp',
                'callback' => [$this->properties_callbacks, 'cptSanitize']
            ],
            [
                'option_group' => 'bp_inc2prop_settings',
                'option_name' => 'bizpol_inc2prop',
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
            ],
            [   
                'id' => 'incexp_index',
                'title' => 'Income/Expense',
                'callback' => [$this->properties_callbacks, 'propertiesSectionManager'],
                'page' => 'bizpol_incexp'
            ],
            [   
                'id' => 'inc2prop_index',
                'title' => 'Income to property',
                'callback' => [$this->properties_callbacks, 'propertiesSectionManager'],
                'page' => 'bizpol_inc2prop'
            ]
        ]; 
        
        $this->settings->setSections($args);
    }


    public function setFields(){
            $args = [
                //Properties
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
                    'min' => '3',
                    'required' => 'required'
                ]
            ],
            [
                'id' => 'country',
                'title' => 'Country',
                'callback' => [$this->properties_callbacks, 'selectCountry'],
                'page' => 'bizpol_property',
                'section' => 'property_index',
                'args' => [
                    'option_name' => 'bizpol_property',
                    'label_for' => 'country',
                    'placeholder' => 'Country',
                    'min' => '',
                    'required' => 'required'
                ]
            ],
            [
                'id' => 'city',
                'title' => 'City',
                'callback' => [$this->properties_callbacks, 'textFieldCity'],
                'page' => 'bizpol_property',
                'section' => 'property_index',
                'args' => [
                    'option_name' => 'bizpol_property',
                    'label_for' => 'city',
                    'placeholder' => 'City',
                    'min' => '1',
                    'required' => 'required'
                ]
            ],
            [
                'id' => 'zone',
                'title' => 'Zone',
                'callback' => [$this->properties_callbacks, 'textField'],
                'page' => 'bizpol_property',
                'section' => 'property_index',
                'args' => [
                    'option_name' => 'bizpol_property',
                    'label_for' => 'zone',
                    'placeholder' => 'Zone',
                    'min' => '2',
                ]
            ],
            [
                'id' => 'county',
                'title' => 'County',
                'callback' => [$this->properties_callbacks, 'textField'],
                'page' => 'bizpol_property',
                'section' => 'property_index',
                'args' => [
                    'option_name' => 'bizpol_property',
                    'label_for' => 'county',
                    'placeholder' => 'County',
                    'min' => '2',
                    'class' => 'hidden'
                ]
            ],
            [
                'id' => 'community',
                'title' => 'Community',
                'callback' => [$this->properties_callbacks, 'textField'],
                'page' => 'bizpol_property',
                'section' => 'property_index',
                'args' => [
                    'option_name' => 'bizpol_property',
                    'label_for' => 'community',
                    'placeholder' => 'Community',
                    'min' => '2',
                    'class' => 'hidden'
                ]
            ],
            [
                'id' => 'address',
                'title' => 'Address',
                'callback' => [$this->properties_callbacks, 'textFieldAddress'],
                'page' => 'bizpol_property',
                'section' => 'property_index',
                'args' => [
                    'option_name' => 'bizpol_property',
                    'label_for' => 'address',
                    'placeholder' => 'Address',
                    'min' => '2',
                    'required' => 'required'
                ]
            ],
            [
                'id' => 'construct_year',
                'title' => 'Builded',
                'callback' => [$this->properties_callbacks, 'dateField'],
                'page' => 'bizpol_property',
                'section' => 'property_index',
                'args' => [
                    'option_name' => 'bizpol_property',
                    'label_for' => 'construction_year',
                    'placeholder' => 'Construction Year',
                    'min' => '10',
                    'max' => '10',
                    'type' => 'date',
                    'patern' => '[0-9]{4}[-][0-9]{2}[-][0-9]{2}$',
                    'required' => 'required'
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
                    'patern' => '^[A-Z]{2}\d{1}[A-Z]{1}[\/]\d{8}[\/]\d{1}$',
                    'required' => 'required'
                ],
            ],
            [
                'id' => 'status',
                'title' => 'Status',
                'callback' => [$this->properties_callbacks, 'switchField'],
                'page' => 'bizpol_property',
                'section' => 'property_index',
                'args' => [
                    'option_name' => 'bizpol_property',
                    'label_for' => 'status'
                ],
            ],
            // income/expense
            [
                'id' => 'incexp_name',
                'title' => 'Name',
                'callback' => [$this->properties_callbacks, 'textField'],
                'page' => 'bizpol_incexp',
                'section' => 'incexp_index',
                'args' => [
                    'option_name' => 'bizpol_incexp',
                    'label_for' => 'incexp_name',
                    'placeholder' => 'Name',
                    'min' => '3',
                    'required' => 'required'
                ]
            ],
            [
                'id' => 'incexp_type',
                'title' => 'Type',
                'callback' => [$this->properties_callbacks, 'incExpFieldType'],
                'page' => 'bizpol_incexp',
                'section' => 'incexp_index',
                'args' => [
                    'option_name' => 'bizpol_incexp',
                    'label_for' => 'incexp_type',
                    'placeholder' => 'Type',
                    'min' => '2',
                    'required' => 'required'
                ]
            ],
            //income to propery
            [
                'id' => 'incexp_button',
                'title' => '',
                'callback' => [$this->properties_callbacks, 'incExpButton'],
                'page' => 'bizpol_inc2prop',
                'section' => 'inc2prop_index',
                'args' => [
                    'option_name' => 'bizpol_inc2prop',
                    'label_for' => 'incexp_button',
                ]
            ],
            [
                'id' => 'incexp_id',
                'title' => 'Type',
                'callback' => [$this->properties_callbacks, 'incExpField'],
                'page' => 'bizpol_inc2prop',
                'section' => 'inc2prop_index',
                'args' => [
                    'option_name' => 'bizpol_inc2prop',
                    'label_for' => 'incexp_id',
                    'data' => $this->get_incexp(),
                    'patern' => '[^0]{1}[\d]*',
                ]
            ],
            [
                'id' => 'incexp_name',
                'title' => 'Name',
                'callback' => [$this->properties_callbacks, 'textField'],
                'page' => 'bizpol_inc2prop',
                'section' => 'inc2prop_index',
                'args' => [
                    'option_name' => 'bizpol_inc2prop',
                    'label_for' => 'incexp_name',
                    'placeholder' => 'Name',
                    'min' => '3',
                    'class' => 'hidden'
                ]
            ],
            [
                'id' => 'incexp_type',
                'title' => 'Type',
                'callback' => [$this->properties_callbacks, 'incExpFieldType'],
                'page' => 'bizpol_inc2prop',
                'section' => 'inc2prop_index',
                'args' => [
                    'option_name' => 'bizpol_inc2prop',
                    'label_for' => 'incexp_type',
                    'placeholder' => 'Type',
                    'patern' => '[^0]{1}[\d]*',
                    'class' => 'hidden'
                ]
            ],
            [
                'id' => 'quantity',
                'title' => 'Quantity',
                'callback' => [$this->properties_callbacks, 'textField'],
                'page' => 'bizpol_inc2prop',
                'section' => 'inc2prop_index',
                'args' => [
                    'option_name' => 'bizpol_inc2prop',
                    'label_for' => 'quantity',
                    'placeholder' => 'Quantity',
                    'patern' => '^[^0]{1}[\d]*$',
                    'required' => 'required'
                ]
            ],
            [
                'id' => 'value',
                'title' => 'Amount',
                'callback' => [$this->properties_callbacks, 'textField'],
                'page' => 'bizpol_inc2prop',
                'section' => 'inc2prop_index',
                'args' => [
                    'option_name' => 'bizpol_inc2prop',
                    'label_for' => 'value',
                    'placeholder' => 'Amount',
                    'patern' => '^([\d]{1,15}[\,|\.][\d]{1,4})$|^([\d]{1,16})$',
                    'required' => 'required'
                ]
            ],
        [
                'id' => 'incexp_posting_month',
                'title' => 'Month',
                'callback' => [$this->properties_callbacks, 'monthSelect'],
                'page' => 'bizpol_inc2prop',
                'section' => 'inc2prop_index',
                'args' => [
                    'option_name' => 'bizpol_inc2prop',
                    'label_for' => 'incexp_posting_month',
                    'placeholder' => 'Month',
                    'patern' => '^(1[0-2]|[1-9])$',
                    'required' => 'required'
                ]
            ],
        [
                'id' => 'incexp_posting_year',
                'title' => 'Year',
                'callback' => [$this->properties_callbacks, 'yearSelect'],
                'page' => 'bizpol_inc2prop',
                'section' => 'inc2prop_index',
                'args' => [
                    'option_name' => 'bizpol_inc2prop',
                    'label_for' => 'incexp_posting_year',
                    'placeholder' => 'Year',
                    'patern' => '(19[789]\d|20[0-6]\d)',
                    'required' => 'required'
                ]
            ]];

        $this->settings->setFields($args);
    }

}