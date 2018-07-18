import 'code-prettify';
window.addEventListener("load", function() {
    PR.prettyPrint();

    // var tabs = document.querySelectorAll('ul.nav-tabs > li');

    // for (var i=0; i<tabs.length; i++) {
    //     tabs[i].addEventListener("click", switchTab);
    // }

    // function switchTab (event) {
    //     event.preventDefault();

    //     console.log(event);

    //     document.querySelector("ul.nav-tabs li.active").classList.remove("active");
    //     document.querySelector(".tab-pane.active").classList.remove("active");

    //     var clickedTab = event.currentTarget;
    //     var anchor = event.target;
    //     var activePaneID = anchor.getAttribute("href");

    //     console.log(activePaneID);

    //     clickedTab.classList.add("active");
    //     document.querySelector(activePaneID).classList.add("active");
    // }
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

    $(document).on('click', 'ul.nav-tabs > li', function(e){
        e.preventDefault();

        var clickedTab = $(this);
        if (!clickedTab.hasClass('insertTab')) {
            console.log('nie ma clasy');
            var tabul = $(this).parent();
            var content = tabul.next();

            tabul.find("li.active").removeClass("active");
            content.find(".tab-pane.active").removeClass("active");
            var anchor = e.target;
            var activePaneID = anchor.getAttribute("href");

            clickedTab.addClass("active");
            $(activePaneID).addClass("active");
        }        
    });


});