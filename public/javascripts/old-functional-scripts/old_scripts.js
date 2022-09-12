$("#sideBarSearch").on('blur keyup', function (e) {

    var str = $('#sideBarSearch').val();
    str = str.replace(/<\/?[^>]+(>|$)/g, "");

    var code = e.keyCode || e.which;

    if (code == 13) { //Enter keycode = 13
        e.preventDefault();

        if (str.length > 0) {

            $('.side_bar_list_item li').each(function (k, v) {
                if ($(v).attr('data-conversationid') != user_id) {
                    if (myconversation_list.indexOf($(v).attr('data-conversationid')) === -1) {
                        myconversation_list.push($(v).attr('data-conversationid'));
                    }
                }
            });

            var searchConvList = [];

            if (tagged_conv_list.length > 0) {
                $.each(tagged_conv_list, function (k, v) {
                    if (searchConvList.indexOf() === -1) {
                        searchConvList.push(v);
                    }
                });
            }

            if (setFlagConvArray.length > 0) {
                $.each(setFlagConvArray, function (k, v) {
                    if (searchConvList.indexOf() === -1) {
                        searchConvList.push(v);
                    }
                });

                var targettext = 'flag'
            } else {
                var targettext = 'text'
            }

            socket.emit('getAllDataForSearch', {
                conversation_list: (searchConvList.length > 0 ? searchConvList : myconversation_list),
                target_text: str,
                target_filter: targettext,
                user_id: user_id
            }, (callBack) => {

                if (callBack.status) {

                    if (callBack.data.length > 0) {
                        $("#conversation_list_sidebar li").hide();
                        $("#pintul li").hide();
                        $("#conversation_list_sidebar li").hide();
                        currentConv_list = [];
                        $.each(callBack.data, function (k, v) {
                            $("#conv" + v).show();
                            currentConv_list.push(v);
                        });

                        $('.user-msg>p').unhighlight();
                        $('.user-msg>p').highlight(str);

                        var c_str = str.replace(/ /g, "_");

                        searchTagList = [];
                        $('.search_tag').remove();

                        //var design 	= '<div class="tag_item search_tag" id="'+c_str+'_ed"><img src="/images/basicAssets/Search.svg"><p>'+str+'</p><img onclick="removesearchFilter(\''+c_str+'\')" src="/images/basicAssets/Close.svg"></div>';
                        var design = '<div class="tag_item search_tag" id="searchFilter_ed"><img src="/images/basicAssets/Search.svg"><p>' + str + '</p><img onclick="removesearchFilter(\'' + str + '\')" src="/images/basicAssets/Close.svg"></div>';

                        if (searchTagList.indexOf(c_str) === -1) {
                            $('.tagg_list').append(design);
                            searchTagList.push(c_str);
                        }

                        if ($(".tag_item").length > 0) {
                            $('.tagg_list').show();
                        }

                        $.each($('.msgs-form-users'), function () {
                            if ($(this).find('.highlight').length == 0) {
                                $(this).prev('.msg-separetor').hide();
                                $(this).hide();
                            } else {
                                $(this).prev('.msg-separetor').show();
                                $(this).show();
                            }
                        });

                        $("#searchText").val(str);
                        $('#sideBarSearch').val("");
                        $('#sideBarSearch').hide();
                        $(".side-bar-search-icon").show();
                    } else {

                        $("#conversation_list_sidebar li").hide();
                        $("#pintul li").hide();
                        $("#conversation_list_sidebar li").hide();

                        var c_str = str.replace(/ /g, "_");
                        searchTagList = [];
                        $('.search_tag').remove();

                        // var design 	= '<div class="tag_item search_tag" id="'+c_str+'_ed"><img src="/images/basicAssets/Search.svg"><p>'+str+'</p><img onclick="removesearchFilter(\''+c_str+'\')" src="/images/basicAssets/Close.svg"></div>';
                        var design = '<div class="tag_item search_tag" id="searchFilter_ed"><img src="/images/basicAssets/Search.svg"><p>' + str + '</p><img onclick="removesearchFilter(\'' + str + '\')" src="/images/basicAssets/Close.svg"></div>';
                        $('.tagg_list').append(design);

                        if ($(".tag_item").length > 0) {
                            $('.tagg_list').show();
                        }

                        searchTagList.push(str);
                        $("#searchText").val(str);
                        $("#errMsg").text('No Result(s) Found');
                        $("#errMsg").show();
                    }

                }
            });
        } else {
            $("#conversation_list_sidebar li").show();
            $("#conversation_list_sidebar li").show();
            $('.user-msg>p').unhighlight();
            $("#errMsg").text('');
            $("#errMsg").hide();
        }
    }

});









///////////////////////////////************ for Text editor *************/////////////////////////
function showMsgEditor(){
	var placeholder = $('#msg').attr('placeholder');

	if($('#msg').is(':visible')){
		$('#msg').hide();
		$('#msgEditor').show();

		var toolbarOptions = [
    [{
      'header': [1, 2, 3, 4, 5, 6, false]
    }],
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],
    [{
      'header': 1
    }, {
      'header': 2
    }], // custom button values
    [{
      'list': 'ordered'
    }, {
      'list': 'bullet'
    }],
    [{
      'script': 'sub'
    }, {
      'script': 'super'
    }], // superscript/subscript
    [{
      'indent': '-1'
    }, {
      'indent': '+1'
    }], // outdent/indent
    [{
      'direction': 'rtl'
    }], // text direction
    [{
      'size': ['small', false, 'large', 'huge']
    }], // custom dropdown
    [{
      'color': []
    }, {
      'background': []
    }], // dropdown with defaults from theme
    [{
      'font': []
    }],
    [{
      'align': []
    }],
    ['link', 'image'],
    ['clean'] // remove formatting button
  ];

		$('.hayven_eidtor').addClass('active');
		var quill = new Quill('#msgEditor', {
			modules: {
		    toolbar: toolbarOptions
		  },
			placeholder: placeholder,
	    theme: 'snow'
	  });
		$('#msgEditor .ql-editor.ql-blank').click();
		$('#msgEditor .ql-editor.ql-blank').focus();

	}else{
		$('.ql-toolbar.ql-snow').remove();
		$('#msgEditor').removeClass('ql-container ql-snow');
		$('#msgEditor').html('');
		$('#msgEditor').hide();
		$('#msg').show();
		$('#msg').focus();
		$('.hayven_eidtor').removeClass('active');
	}
}





// <div class="plusItem" onclick="addNewCheckItemTemp()"></div>
