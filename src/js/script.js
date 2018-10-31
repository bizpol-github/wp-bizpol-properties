import 'code-prettify';
window.addEventListener("load", function() {
    PR.prettyPrint();
});

jQuery(document).ready(function($){
    $(document).on('click', '.js-image-upload', function(e){
        e.preventDefault();
        var $button = $(this);
        var file_frame = wp.media.frames.file_frame = wp.media({
            title: 'Select or Upload Image',
            library: {
                type: 'image'
            },
            button: {
                text: 'Select image'
            },
            multiple: false
        });

        file_frame.on('select', function(){
            var attachment = file_frame.state().get('selection').first().toJSON();
            $button.siblings('.image-uploader').val(attachment.url);
        });

        file_frame.open();
    });
});