<?php

/* 
 * Trigger this file on Plugin unistall
 * 
 * @package bizpol-properties
 */

if (!defined('WP_UNINSTALL_PLUGIN')){
    die;
}

//Access the database via SQL
global $wpdb;
$wpdb->query("DELETE FROM wp_posts WHERE post_type = 'properties'");
$wpdb->query("DELETE FROM wp_postmeta WHERE psot-id NOT IN (SELECT id FROM wp_posts)");
$wpdb->query("DELETE FROM wp_term_relationships WHERE object_id NOT IN (SELECT id FROM wp_posts)");