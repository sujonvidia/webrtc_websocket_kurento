// files_list_drop = null;
is_drop = false;

function stopDefault(event) {
    event.preventDefault();
    event.stopPropagation();
}
$("body").on("drop dragover dragleave", function(event) {
    // event.preventDefault();  
    // event.stopPropagation();
    stopDefault(event);
});

function dragEnterChat(el) {
    drop_files_list = [];
    $('#dragdrop_filediv').css('display', 'flex');
}

function dragLeaveChat(label) {
    $('#dragdrop_filediv').hide();

}

function dropFilesSubmit(event) {
    //debugger;
    is_drop = true;
    // $("#attach_chat_file_list").empty();
    var dropped_files = event.target.files || event.dataTransfer.files;
    // if ($('#ChatFileUpload').is(':visible')) {
    //     if(files_list_drop == null){ files_list_drop = new DataTransfer(); }

    //     for (var i = 0; i < dropped_files.length; i++) {
    //         files_list_drop.items.add(dropped_files[i]);
    //     }
    // } else {
    //     files_list_drop = new DataTransfer();
    //     for (var i = 0; i < dropped_files.length; i++) {
    //         files_list_drop.items.add(dropped_files[i]);
    //     }
    // }

    // console.log('dropped__files', files_list_drop);
    document.getElementById("msgFile").files = dropped_files;

    if (!$('#ChatFileUpload').is(':visible')) {
        if (window.location.href.includes('/call/')) {
            chatFileUploadFunc('repmsg');
        } else {
            if ($("#threadReplyPopUp").is(':visible')) {
                chatFileUploadFunc('repmsg');
                // alert('repmsg');
            } else {
                chatFileUploadFunc('msg');
                // alert('msg');
            }

        }
    }


    $('#msgFile').trigger('change');
    $('#dragdrop_filediv').hide();
}

document.onpaste = (e) => {
    // //debugger
    var cur_focus = $(":focus").attr('id');
    if (e.clipboardData.files.length && cur_focus && cur_focus.includes('msg')) {
        document.getElementById("msgFile").files = e.clipboardData.files;
        if (cur_focus == 'msg') {
            chatFileUploadFunc('msg')
        } else if (cur_focus == 'msg_rep') {
            chatFileUploadFunc('repmsg')
        }
        $('#msgFile').trigger('change');
    }
};