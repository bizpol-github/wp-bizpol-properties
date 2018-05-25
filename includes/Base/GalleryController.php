<?php 
/**
 * @package  wp-bizpol-properties
 */
namespace Inc\Base;
use Inc\Api\SettingsApi;
use Inc\Base\BaseController;
use Inc\Api\Callbacks\AdminCallbacks;
use Inc\Api\Callbacks\GalleryCallbacks;
/**
* 
*/
class GalleryController extends BaseController
{
	public $callbacks;
	public $subpages = array();
	
	public function register()
	{
		$option = get_option('bizpol_properties');
        $activate = isset($option['PropertyGallery']) ? $option['PropertyGallery']  : false;

        if(!$activate){
        	return;
        }


		$this->settings = new SettingsApi();
		$this->callbacks = new AdminCallbacks();
		$this->gallery_callbacks = new GalleryCallbacks();
		$this->setSubpages();
		$this->setSettings();
        $this->setSections();
        $this->setFields();
		$this->settings->addSubPages( $this->subpages )->register();
	}
	public function setSubpages()
	{
		$this->subpages = array(
			array(
				'parent_slug' => 'bizpol_properties', 
				'page_title' => 'Gallery Manager', 
				'menu_title' => 'Gallery Manager', 
				'capability' => 'manage_options', 
				'menu_slug' => 'bizpol_gallery', 
				'callback' => array( $this->callbacks, 'adminGallery' )
			)
		);
	}

	public function setSettings(){
        $args = array(
            [
                'option_group' => 'bizpol_properties_plugin_gallery_settings',
                'option_name' => 'bizpol_gallery',
                'callback' => [$this->gallery_callbacks, 'gallerySanitize']
            ]
        );
        
        $this->settings->setSettings($args);
    }

    public function setSections(){
        $args = [
            [
                'id' => 'properties_gallery_index',
                'title' => 'Gallery Manager',
                'callback' => [$this->gallery_callbacks, 'gallerySectionManager'],
                'page' => 'bizpol_gallery'
            ]
        ]; 
        
        $this->settings->setSections($args);
    }

    public function setFields(){
            $args = [
            	[
                'id' => 'post_type',
                'title' => 'Custom Post Type',
                'callback' => [$this->gallery_callbacks, 'textField'],
                'page' => 'bizpol_gallery',
                'section' => 'properties_gallery_index',
                'args' => [
                    'option_name' => 'bizpol_gallery',
                    'label_for' => 'post_type',
                    'placeholder' => 'eg.product'
                ]
            ],
            [
				'id' => 'singular_name',
                'title' => 'Singular Name',
                'callback' => [$this->gallery_callbacks, 'textField'],
                'page' => 'bizpol_gallery',
                'section' => 'properties_gallery_index',
                'args' => [
                    'option_name' => 'bizpol_gallery',
                    'label_for' => 'singular_name',
                    'placeholder' => 'eg.product'
                ]
            ],
            [
            	'id' => 'plural_name',
                'title' => 'Plural Name',
                'callback' => [$this->gallery_callbacks, 'textField'],
                'page' => 'bizpol_gallery',
                'section' => 'properties_gallery_index',
                'args' => [
                    'option_name' => 'bizpol_gallery',
                    'label_for' => 'plural_name',
                    'placeholder' => 'eg.product'
                ]
            ],
            [
            	'id' => 'public',
                'title' => 'Public',
                'callback' => [$this->gallery_callbacks, 'checkboxField'],
                'page' => 'bizpol_gallery',
                'section' => 'properties_gallery_index',
                'args' => [
                    'option_name' => 'bizpol_gallery',
                    'label_for' => 'public',
                    'class' => 'ui-toggle'
                ]
            ],
            [
            	'id' => 'has_archive',
                'title' => 'Has Archive',
                'callback' => [$this->gallery_callbacks, 'checkboxField'],
                'page' => 'bizpol_gallery',
                'section' => 'properties_gallery_index',
                'args' => [
                    'option_name' => 'bizpol_gallery',
                    'label_for' => 'has_archive',
                    'class' => 'ui-toggle'
                ]
            ]];

        $this->settings->setFields($args);
    }
}