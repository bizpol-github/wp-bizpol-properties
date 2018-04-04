<?php

/*
 * @package wp-bizpol-properties
 */

namespace Inc\Base;

class Activate{
    public static function activate(){
        flush_rewrite_rules();
    }
}

