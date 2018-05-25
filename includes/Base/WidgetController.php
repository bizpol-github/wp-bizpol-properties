<?php 
/**
 * @package  wp-bizpol-properties
 */

namespace Inc\Base;

use Inc\Base\BaseController;
use Inc\Api\Widgets\MediaWidget;

class WidgetController extends BaseController{
	
	public function register()
	{
		$option = get_option('bizpol_properties');
        $activate = isset($option['CustomWidget']) ? $option['CustomWidget']  : false;

        if(!$activate){
        	return;
        }

        $media_widget = new MediaWidget();
        $media_widget->register();
	}
}