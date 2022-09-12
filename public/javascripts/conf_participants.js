//alert(window.name);
var lastMsg = false;
var div_gap = 3;

function call_icon_toggle(el) {
    if ($(el).attr('data-visible') == 'true') {
        $(el).attr('data-visible', 'false');
        $('.call-btn-div:not(#call_icon_toggle)').hide("slide", { direction: "down" });
        $('#call_img_toggle').attr('src', '/images/call/icon-up-arrow.svg');
        $('#call_icon_toggle').animate({ 'right': '50%' }).attr({ 'data-balloon': 'Click to show icons', 'data-balloon-pos': 'up' });
        $('#call_span_toggle').html('Icons');

    } else {
        $(el).attr('data-visible', 'true');
        $('#call_img_toggle').attr('src', '/images/call/icon-down-arrow.svg');
        $('#call_icon_toggle').animate({ 'right': '5px' }).attr({ 'data-balloon': 'Click to hide icons', 'data-balloon-pos': 'up-right' });
        $('#call_span_toggle').html('Icons');
        $('.call-btn-div:not(#call_icon_toggle)').show("slide", { direction: "down" });
    }
}

function setMediaBitrates(sdp) {
    return setMediaBitrate(setMediaBitrate(sdp, "video", 100), "audio", 10);
}

function handle_offer_sdp(offer) {
    let sdp = offer.sdp.split('\r\n'); //convert to an concatenable array
    let new_sdp = '';
    let position = null;
    sdp = sdp.slice(0, -1); //remove the last comma ','
    for (let i = 0; i < sdp.length; i++) { //look if exists already a b=AS:XXX line
        if (sdp[i].match(/b=AS:/)) {
            position = i; //mark the position
        }
    }
    if (position) {
        sdp.splice(position, 1); //remove if exists
    }
    for (let i = 0; i < sdp.length; i++) {
        if (sdp[i].match(/m=video/)) { //modify and add the new lines for video
            new_sdp += sdp[i] + '\r\n' + 'b=AS:' + '100' + '\r\n';
        } else {
            if (sdp[i].match(/m=audio/)) { //modify and add the new lines for audio
                new_sdp += sdp[i] + '\r\n' + 'b=AS:' + 64 + '\r\n';
            } else {
                new_sdp += sdp[i] + '\r\n';
            }
        }
    }
    return new_sdp; //return the new sdp
}

function setMediaBitrate(sdp, media, bitrate) {
    var lines = sdp.split("\n");
    var line = -1;
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].indexOf("m=" + media) === 0) {
            line = i;
            break;
        }
    }
    if (line === -1) {
        console.debug("Could not find the m line for", media);
        return sdp;
    }
    console.debug("Found the m line for", media, "at line", line);

    // Pass the m line
    line++;

    // Skip i and c lines
    while (lines[line].indexOf("i=") === 0 || lines[line].indexOf("c=") === 0) {
        line++;
    }

    // If we're on a b line, replace it
    if (lines[line].indexOf("b") === 0) {
        console.debug("Replaced b line at line", line);
        lines[line] = "b=AS:" + bitrate;
        return lines.join("\n");
    }

    // Add a new b line
    console.debug("Adding new b line before line", line);
    var newLines = lines.slice(0, line)
    newLines.push("b=AS:" + bitrate)
    newLines = newLines.concat(lines.slice(line, lines.length))
    return newLines.join("\n")
}

function closeVideoCall() {
    stopMedia_all();
    stopMedia_tracks();
    stopScreen_share();
}

function call_window_close() {
    // cleanup_flag = false;

}

function stopMedia_tracks() {
    $('#participants video').each(function(i, v) {
        if ($(v)[0].srcObject) {
            let tracks = $(v)[0].srcObject.getTracks();
            tracks.forEach(track => track.stop());
            $(v)[0].srcObject = null;
            console.log('webrtc:track:close:', $(v).attr('id'));
        }

    });
}

function setClipboardURL() {
    var tempInput = document.createElement("input");
    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = location.href;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    $('#warningsPopupCall .popup_title').text('Alert !');
    $('#warningsPopupCall .warningMsg').text('URL copied to clipboard.');
    $('#warningsPopupCall').css('display', 'flex');
    closeAllPopUpMsgReject();
}
blackVideoTrack = ({ width = 640, height = 480 } = {}) => {
        var leftVideo = document.getElementById('leftVideo');
        document.getElementById('leftVideo').play();
        if (is_chrome) {
            var stream = leftVideo.captureStream();
        } else {
            var stream = leftVideo.mozCaptureStream();
        }
        return stream.getVideoTracks();
    }
    // blackAudioTrack = ({ width = 640, height = 480 } = {}) => {
    // 	var leftAudio = document.getElementById('leftAudio');
    // 	document.getElementById('leftAudio').play();
    // 	if (is_chrome) {
    // 		var stream = leftAudio.captureStream();
    // 	} else {
    // 		var stream = leftAudio.mozCaptureStream();
    // 	}
    // 	return stream.getAudioTracks();
    // }
audioOutputSel.disabled = !('sinkId' in HTMLMediaElement.prototype);
// CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
// 	if (width < 2 * radius) radius = width / 2;
// 	if (height < 2 * radius) radius = height / 2;
// 	this.beginPath();
// 	this.moveTo(x + radius, y);
// 	this.arcTo(x + width, y, x + width, y + height, radius);
// 	this.arcTo(x + width, y + height, x, y + height, radius);
// 	this.arcTo(x, y + height, x, y, radius);
// 	this.arcTo(x, y, x + width, y, radius);
// 	this.closePath();
// 	return this;
// }
function handleError(error) {
    console.trace(error.name + ": " + error.message);
    $('#warningsPopup').css('display', 'flex');
    $('#warningsPopup .warningMsg').text(error.name + ": " + error.message);
    $('#screen_share_loader').hide();

}
async function changeAudioDestination() {
    // alert('ttt');
    if ($('#audioOutputSel').is(':enabled')) {
        if (isMobile == true || devicetype == 'android') {
            alert('Not supported');
        } else {
            setCookieCall('deviceid_output', $('#audioOutputSel').val());
            var arr_element = [];
            // //debugger;
            $('#room video').each(function(i, element) {
                if ($(element).attr('data-uid') != user_id) {
                    arr_element.push(element);
                }
            });
            for (const element of arr_element) {
                await attachSinkId(element, $('#audioOutputSel').val());
            }
        }
    }


}
// Attach audio output device to video element using device/sink ID.
async function attachSinkId(element, sinkId) {
    console.log('attach_SinkId:call');
    return new Promise(async(resolve, reject) => {
        console.log('attach_SinkId:exec');
        if (typeof element.sinkId !== 'undefined') {
            element.setSinkId(sinkId).then(() => {
                console.log(`attach_SinkId:Success: ${sinkId}`);
                resolve();
            }).catch(error => {
                console.error('attach_SinkId', error);
                resolve();
            });
        } else {
            // alert('Browser does not support output device selection.');
            resolve();
        }
    });

}

function closeModalRegister(is_apply) {
    $('#registerDialogDiv').hide();
    // document.querySelector('#regVideoPreview').pause();
    // stopPreview_all();

    if (is_register == false) {
        if (join_who == 'guest') {
            $('#guest_container_form,#guest_thankyou_div').show();
            $('#call_container_form').hide();
            stopPreview_all();
        }
        window.close();
    } else {
        if (getAudioPreviewStatus() != getAudioStatus()) { toggleMuteConf(); }
        if (getVideoPreviewStatus() != getVideoStatus()) { toggleVideoConf(); }
    }

}

function responsive_profile_pic(element) {
    // console.log('responsive__profile_pic', element);
    if ($(window).width() <= 640) var percent_size = 1.5;
    else var percent_size = 1;
    var div_ratio = $(element).width() / $(element).height();
    var per_font = ($(element).width() * $(element).height()) / 10000;
    if (per_font > 14) per_font = 14;
    else if (per_font < 10) per_font = 10;
    $(element).css('font-size', Math.floor(per_font) + 'px');

    if (div_ratio < 1.5) { var main_size = $(element).width(); } else { var main_size = $(element).height(); }

    var new_size = (main_size * percent_size) / 3.5;
    if (new_size > 150) new_size = 150;
    $(element).find('.img_audio_poster').css({
        "width": new_size + 'px',
        "height": new_size + 'px',
        "left": 'calc(50% - ' + new_size / 2 + 'px)',
        "top": 'calc(45% - ' + new_size / 2 + 'px)'
    });
    let $el = $(element).find('.img_audio_poster')
    let img_bottom = $el.position().top + $el.outerHeight(true) + 20;

    $(element).find('.txt_user_msg').css({
        "top": img_bottom + 'px'
    });

    $(element).find('.loading-cam').css({
        "width": new_size + 'px',
        "height": new_size + 'px',
        "left": 'calc(50% - ' + new_size / 2 + 'px)',
        "top": 'calc(40% - ' + new_size / 2 + 'px)'
    });
}
// file upload
function checklistView() {
    $.each(allUserTagList, function(k, v) {
        $('.tag_name_view_' + v.tag_id).text(v.title);
    })
}
// function getAllUserTag() {
// 	// if (socket.connected) {
// 		// socket.emit('getCompanyTag', { user_id: user_id }, function (res) {
// 			if(allUserdata[0].company_tag.status){
// 				allUserTagList = allUserdata[0].company_tag.data;
// 				console.log('allUserTagList', allUserTagList);
// 				$.each(allUserTagList, function (k, v) {
// 					$('#filterUserTag').append('<div class="tag_list filter_tag_' + v.tag_id + '" onclick="filter_OR_operation(event,\'tag\')" tag-id="' + v.tag_id + '">' + v.title + '</div>')
// 				})
// 				checklistView();
// 			} else {
// 				console.log("No data found" , allUserdata[0].company_tag);
// 			}
// 		// });
// 	// }
// }
// getAllUserTag();
function tagForAttach(elm) {
    var tag_id = $(elm).attr('data-id');
    if ($(elm).attr('data-type') == 'addedTag') {
        $(elm).removeAttr('data-type')
        removeA(tempAttachmentTag, tag_id);
    } else {
        var design = ' <div class="item"><p class="valtext">' + $(elm).text() + '</p><span class="valremove" data-val="dalim" tag-title="' + $(elm).text() + '" tag-id="' + tag_id + '"  onclick="removeTemppAtag(this)"></span></div>';
        if ($('#ChatFileUpload').is(':visible')) {
            $('#AttachmentTagHolder').prepend(design);
            tempAttachmentTag.push(tag_id);
            $(elm).remove();
            $('#AttachmentTagHolder').next('input').val('').focus();
        } else {
            $('#RepAttachmentTagHolder').prepend(design);
            tempAttachmentTag.push(tag_id);
            $(elm).remove();
            $('#RepAttachmentTagHolder').next('input').val('').focus();
        }

    }
    // console.log($('#AttachmentTagHolder').html())
    if ($('#AttachmentTagHolder').find('.item').length > 0) {
        $('#AttachmentTagHolderInput').attr('placeholder', '');
    } else {
        $('#AttachmentTagHolderInput').attr('placeholder', 'Tag upload(s) to be more organized...');
    }
    $('#AttachmentTagHolderInput').focus();
}
var iconsInterval = false;

function update_call_ended_msg() {
    var total_mem = $('.participant.memdiv').length;
    var total_ended = $('.callended_div:visible').length;
    var total_left = total_mem - total_ended;
    console.log('update_msg:total_left:' + total_left);

    if (total_left <= 1) {
        $('.callended_img_div').attr({
            'data-balloon': 'Close this conference',
            'data-balloon-pos': 'down'
        });
        $('.callended_message_tab').html('There are no more participants left on the call.<br>Close this window to become available for new calls.').show();
    } else {
        $('.callended_img_div').attr({
            'data-balloon': 'Close this section',
            'data-balloon-pos': 'down'
        });
        $('.callended_message_tab').text('You may close this section now.').show();
    }
}

function call_end_user_div(uid, user_name, hangup_id, hangup_name, msg) {
    // //debugger;
    console.log('call_end_user__div', uid, hangup_id, hangup_name, user_id);
    if (typeof callCleanupLogic === 'function' && window.name === 'calling') {
        $('.container2icon[uid="' + uid + '"]').hide();
        $('.img_audio_poster[uid="' + uid + '"]').hide();
        $('.container2text[uid="' + uid + '"]').hide();
        if (uid == hangup_id) {
            if (msg && parseInt(msg) == 5) {
                if (uid == user_id) {
                    $('.callended_message[uid="' + uid + '"]').text("You have lost connection. Trying to reconnect...");
                    $('.txt_user_connecting[uid="' + uid + '"]').hide();
                    networkdown = true;
                    // var pp = participants;
                } else {
                    $('.callended_message[uid="' + uid + '"]').text(user_name + " has lost connection.");
                    $('.txt_user_connecting[uid="' + uid + '"]').hide();
                }
            } else {
                $('.callended_message[uid="' + uid + '"]').text(user_name + " left the call.");
                $('.txt_user_connecting[uid="' + uid + '"]').hide();
                update_call_ended_msg();
            }
        } else {
            if (msg && parseInt(msg) == 5) {
                if (uid == user_id) {
                    $('.callended_message[uid="' + uid + '"]').text("You have lost connection. Trying to reconnect...");
                    $('.txt_user_connecting[uid="' + uid + '"]').show();
                    var pp = participants;
                    networkdown = true;
                } else {
                    $('.callended_message[uid="' + hangup_id + '"]').text(hangup_name + " has lost connection.");
                    $('.txt_user_connecting[uid="' + hangup_id + '"]').hide();
                }

            } else {
                if (hangup_name) {
                    $('.callended_message[uid="' + hangup_id + '"]').text(hangup_name + " has ended the call.");
                }
                $('.txt_user_connecting[uid="' + hangup_id + '"]').remove();
                update_call_ended_msg();
            }

            closeVideoCall()
        }
        $('.callended_div[data-userid="' + uid + '"]').show();
        $('.loadingDiv[data-uid="' + uid + '"]').hide();
        $('.init-loader,.txt_main_connecting,.txt_main_connecting_user').hide();
        $('#participants').css('visibility', 'visible');
    }
}

function setIconsToggleMenu() {
    if (iconsInterval != false) {
        clearTimeout(iconsInterval);
        iconsInterval = false;
    }

    iconsInterval = setTimeout(() => {
        if (parseInt($('.unreadMsgCount').text()) == 0) { // hide icons after 5 seconds
            $('#icons').animate({ height: '0%' }, function() {
                $('#icons').hide();
            });
            $('#room').animate({ height: '95%' }, function() {
                redrawConf();
            });
        }
    }, 5000);
}

function dumpStats(o) {
    var s = "";
    if (o.mozAvSyncDelay !== undefined || o.mozJitterBufferDelay !== undefined) {
        if (o.mozAvSyncDelay !== undefined) s += "A/V sync: " + o.mozAvSyncDelay + " ms";
        if (o.mozJitterBufferDelay !== undefined) {
            s += " Jitter buffer delay: " + o.mozJitterBufferDelay + " ms";
        }
        s += "<br>";
    }
    s += "Timestamp: " + new Date(o.timestamp).toTimeString() + " Type: " + o.type + "<br>";
    if (o.ssrc !== undefined) s += "SSRC: " + o.ssrc + " ";
    if (o.packetsReceived !== undefined) {
        s += "Recvd: " + o.packetsReceived + " packets";
        if (o.bytesReceived !== undefined) {
            s += " (" + (o.bytesReceived / 1024000).toFixed(2) + " MB)";
        }
        if (o.packetsLost !== undefined) s += " Lost: " + o.packetsLost;
    } else if (o.packetsSent !== undefined) {
        s += "Sent: " + o.packetsSent + " packets";
        if (o.bytesSent !== undefined) s += " (" + (o.bytesSent / 1024000).toFixed(2) + " MB)";
    } else {
        s += "<br><br>";
    }
    s += "<br>";
    if (o.bitrateMean !== undefined) {
        s += " Avg. bitrate: " + (o.bitrateMean / 1000000).toFixed(2) + " Mbps";
        if (o.bitrateStdDev !== undefined) {
            s += " (" + (o.bitrateStdDev / 1000000).toFixed(2) + " StdDev)";
        }
        if (o.discardedPackets !== undefined) {
            s += " Discarded packts: " + o.discardedPackets;
        }
    }
    s += "<br>";
    if (o.framerateMean !== undefined) {
        s += " Avg. framerate: " + (o.framerateMean).toFixed(2) + " fps";
        if (o.framerateStdDev !== undefined) {
            s += " (" + o.framerateStdDev.toFixed(2) + " StdDev)";
        }
    }
    if (o.droppedFrames !== undefined) s += " Dropped frames: " + o.droppedFrames;
    if (o.jitter !== undefined) s += " Jitter: " + o.jitter;
    return s;
}
// function updateSwitchLabels(stream) {
// 	if (stream.getVideoTracks().length > 0) {
// 		// if(stream.getVideoTracks()[0].getCapabilities()){
// 		setCookieCall('label_video', stream.getVideoTracks()[0].label, 1);
// 		// alert('label_video'+stream.getVideoTracks()[0].label);
// 		// }


// 	}
// 	if (stream.getAudioTracks().length > 0) {
// 		// if(stream.getAudioTracks()[0].getCapabilities()){
// 		setCookieCall('label_audio', stream.getAudioTracks()[0].label, 1);
// 		// alert('label_audio'+stream.getAudioTracks()[0].label);
// 		// }
// 	}
// }
function hide_Emoji_Div() {
    $('.emoji_div').remove();
};
var open_todo_emoji = () => {
    if ($('.emoji_div').length == 0) {
        var design = emoji_div_draw();
        $('.todos-chat-write').append(design);
        $('.msg-separetor').hide();
        $('.msg-separetor-unread').hide();
        insert_emoji('msg_rep');
    } else {
        $('.msg-separetor').show();
        $('.msg-separetor-unread').show();
        $('.emoji_div').remove();
    }
    overlayScrollbars();
}
var emoji_div_draw = () => {
    if (getCookie('recentEmo') != "") {
        var drawRecent = JSON.parse(getCookie('recentEmo'));
    } else {
        var drawRecent = 0;
    }

    var emojiNumber;
    emoCount = 0;
    var design = '<div class="emoji_div">';
    design += '<div class="remove" onclick="hide_Emoji_Div()"></div>';

    // design += '<div class="lodingDiv"><img src = "/images/typing-indicator.gif" ></div>';
    if (drawRecent.length > 0) {
        design += '<div class="emoji-container-name recentEmo">Recent reaction</div>';
        design += '<div class="emoji-container overlayScrollbars recentEmo" style="height: auto;">';
        var commonEmoji = [];
        $.each(drawRecent, function(k, v) {
            // design += '<img src="/images/emojiPacks/' + v + '">';
            if (commonEmoji.indexOf(v) == -1) {
                if (commonEmoji.length <= 28) {
                    commonEmoji.push(v);
                }
            }
        });
        $.each(commonEmoji, function(k, v) {
            design += '<span>' + v + '</span>';
        });
        design += '</div>';
    }
    design += '<div class="emoji-container-name">Pick your reaction</div>';
    design += '<div class="emoji-container overlayScrollbars pickingReactDiv">';
    // for (emojiNumber = 1; emojiNumber < 65; emojiNumber++) {
    // 	design += '<img src="'+ file_server +'emoji/hv' + emojiNumber + '.svg">';
    // 	emoCount++;
    // }
    design += '<p class="emojiHeading">Smileys</p>'
    for (var i = 0; i < emojiArray.length;) {
        design += '<span>' + emojiArray[i] + '</span>';
        i++;
    }

    design += '<p class="emojiHeading">People and Fantasy</p>'
    for (var i = 0; i < peopleFantasy.length;) {
        design += '<span>' + peopleFantasy[i] + '</span>';
        i++;
    }
    design += '<p class="emojiHeading">Clothing and Accessories</p>'
    for (var i = 0; i < clothingAccessories.length;) {
        design += '<span>' + clothingAccessories[i] + '</span>';
        i++;
    }
    design += '<p class="emojiHeading">Pale Emojis</p>'
    for (var i = 0; i < paleEmojis.length;) {
        design += '<span>' + paleEmojis[i] + '</span>';
        i++;
    }
    design += '<p class="emojiHeading">Cream White Emojis</p>'
    for (var i = 0; i < creamWhiteEmojis.length;) {
        design += '<span>' + paleEmojis[i] + '</span>';
        i++;
    }
    design += '<p class="emojiHeading">Moderate Brown Emojis</p>'
    for (var i = 0; i < moderateBrownEmojis.length;) {
        design += '<span>' + moderateBrownEmojis[i] + '</span>';
        i++;
    }
    design += '</div>';
    design += '</div>';
    return design;
};
var open_emoji = () => {
    if ($('.emoji_div').length == 0) {
        var design = emoji_div_draw();
        $('.send-msgs').append(design);
        if (emoCount === $('.emoji_div .pickingReactDiv>img').length) {
            $(".lodingDiv").fadeOut(300, function() { $(this).remove(); });
        }
        insert_emoji('msg');
    } else {
        $('.emoji_div').remove();
    }
    overlayScrollbars();

}
var insert_emoji = (id) => {
    $('.emoji_div .emoji-container>span').on('click', function() {
        var emoji_name = $(this).html();
        // let name = emoji_name.split('/');
        // if (recentEmo.indexOf(name[name.length - 1]) === -1) {
        // 	recentEmo.push(name[name.length - 1]);
        // }
        recentEmo.push(emoji_name);
        setCookie('recentEmo', JSON.stringify(recentEmo), 1);
        // $('#' + id).append('<img src="' + emoji_name + '" style="width:20px; height:20px; vertical-align: middle;" />&nbsp;');
        $('#' + id).append('<span>' + emoji_name + '</span>');
        // open_emoji();
        var el = document.getElementById(id);
        placeCaretAtEnd(el);
        // $('.emoji_div').remove(); // remove emoji div after insert.
    });
};
var open_rep_emoji = (event) => {
    var offsetval = $(event.target).offset();
    if ($('.emoji_div').length == 0) {
        var design = emoji_div_draw();
        $(design).insertBefore('.rep-typing-indicator');
        if (emoCount === $(event.target).next('.emoji_div').find('.pickingReactDiv img').length) {
            $(".lodingDiv").fadeOut(300, function() { $(this).remove(); });
        }
        insert_emoji('msg_rep');
        // $('.emoji_div').css('top', offsetval.top - 314);
        // $('.emoji_div').css('left', offsetval.left);
        // $('.emoji_div').css('bottom', 'unset');
        $('.emoji_div').css('z-index', 9);
        // $('.emoji_div').css({'top': (offset.top - 314), 'left': offset.left, 'bottom': 'unset'});
    } else {
        $('.emoji_div').remove();
    }
};
var placeCaretAtEnd = (el) => {
    el.focus();
    if (typeof window.getSelection != "undefined" &&
        typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
};
var draw_rep_count = (msgid) => {
    var noofreply = Number($('.msg_id_' + msgid).find('.no-of-replies').text());
    if (noofreply > 0) {
        $('.msg_id_' + msgid).find('.no-of-replies').text(noofreply + 1);
        $('.msg_id_' + msgid).find('.last_rep_text').html('Last reply ' + moment(new Date()).fromNow() + ' <b><i>You</i></b>');
    } else {
        var html = per_msg_rep_btn(noofreply + 1, new Date(), "You", '');
        $('.msg_id_' + msgid).find('.user-msg').append(html);
    }
    $('.reply-separetor p').html((noofreply + 1) + ' Reply');
};
var overlayScrollbars = () => {
    $(function() {
        $('.overlayScrollbars').overlayScrollbars({
            className: "os-theme-dark",
            resize: "none",
            sizeAutoCapable: true,
            paddingAbsolute: true,
            overflowBehavior: {
                x: "hidden",
                y: "scroll"
            },
            scrollbars: {
                visibility: "auto",
                autoHide: "move",
                autoHideDelay: 500,
                dragScrolling: true,
                clickScrolling: true,
                touchSupport: true
            },
        });
    });
};
overlayScrollbars();

function redrawMaxConf() {
    // //debugger;
    var cal_top = 0;
    var total_members = $('.participant.memdiv').length;
    if (total_members > 1 && total_members < 6) {
        var req_height = $('#participants').height() / (total_members - 1);
        var req_scroll = 3;
    } else {
        var req_height = $('#participants').height() / 4;
        var req_scroll = 3;
    }

    $('.participant.memdiv').each(function(key, element) {
        $(element).find('.container2text').css({ "textAlign": "center", "left": '' });
        if ($(element).attr('data-window') == 'max') { // maximize it
            $(element).css({
                width: ($('#participants').width() - div_gap) + 'px',
                height: ($('#participants').height() - div_gap) + 'px',
                right: '',
                top: '0px',
                left: '0px',
            }).appendTo('#participants');
        } else { // turn others to minimize
            $(element).css({
                width: ($('#participants_min').width() - req_scroll) + 'px',
                height: (req_height - div_gap) + 'px',
                right: '',
                top: cal_top + 'px',
                left: '0px'
            }).appendTo('#participants_min');

            cal_top += req_height;
        }
        responsive_profile_pic(element);
    });

}

function redrawConf() { // rrr
    // //debugger;
    $(".youDiv").prependTo("#participants");
    var total_members = $('.participant.memdiv').length;
    if (total_members > 0) {
        if (total_members == 1) {
            var parcent_width = $('#participants').width() / 1;
            var parcent_height = $('#participants').height() / 1;
            var cal_left = 0;
            var cal_top = 0;

            $('.participant.memdiv').each(function(key, element) {
                $(element).find('.container2text').css({ "textAlign": "center", "left": '' });
                $(element).css({
                    width: (parcent_width - div_gap) + 'px',
                    height: (parcent_height - div_gap) + 'px',
                    left: cal_left + 'px',
                    top: cal_top + 'px'
                }).appendTo('#participants');
                responsive_profile_pic(element);
            });
        } else if (total_members == 2) { // one2one call
            if ($(window).width() <= 640) { // mobile
                if ($('.participant.memdiv[data-window="max"]').length == 0) {
                    $('#participants_min').css({ 'width': '0', 'display': 'none' });
                    $('#participants').css({ 'width': '100%', 'display': 'inline-block' });
                    var parcent_width = $('#participants').width() / 1;
                    var parcent_height = $('#participants').height() / 1;
                    var cal_left = parcent_width + 1;
                    var cal_top = 0;
                    var cal_bottom = $('#icons').height() + div_gap;

                    $('.participant.memdiv').each(function(key, element) {
                        if (key == 0) {
                            $(element).find('.container2text').css({ "textAlign": "center", "left": '' });
                            $(element).css({
                                width: (parcent_width / 3 - div_gap) + 'px',
                                height: (parcent_height / 3 - div_gap) + 'px',
                                right: '10px',
                                bottom: cal_bottom + 'px',
                                left: '',
                                top: ''
                            }).appendTo('#participants');
                        } else {
                            $(element).find('.container2text').css({ "textAlign": "start", "left": '10px' });
                            $(element).css({
                                width: (parcent_width - div_gap) + 'px',
                                height: (parcent_height - div_gap) + 'px',
                                left: '0px',
                                top: '0px'
                            }).appendTo('#participants');
                        }
                        responsive_profile_pic(element);
                    });
                } else {
                    redrawMaxConf();
                }
            } else { // web
                if ($('.participant.memdiv[data-window="max"]').length == 0) {
                    $('#participants_min').css({ 'width': '0', 'display': 'none' });
                    $('#participants').css({ 'width': '100%', 'display': 'inline-block' });
                    var parcent_width = $('#participants').width() / 2;
                    var parcent_height = $('#participants').height() / 1;
                    var cal_left = parcent_width + 1;
                    var cal_top = 0;
                    $('.participant.memdiv').each(function(key, element) {
                        $(element).find('.container2text').css({ "textAlign": "center", "left": '' });
                        if (key == 0) {
                            $(element).css({
                                width: (parcent_width - div_gap) + 'px',
                                height: (parcent_height - div_gap) + 'px',
                                left: '0px',
                                top: '0px'
                            }).appendTo('#participants');
                        } else {
                            $(element).css({
                                width: (parcent_width - div_gap) + 'px',
                                height: (parcent_height - div_gap) + 'px',
                                left: cal_left + 'px',
                                top: cal_top + 'px'
                            }).appendTo('#participants');
                        }
                        responsive_profile_pic(element);
                    });
                } else {
                    redrawMaxConf();
                }
            }
        } else if (total_members > 2) { // conference call
            if ($(window).width() <= 640 && total_members < 5) {
                if (total_members == 3) {
                    if ($('.participant.memdiv[data-window="max"]').length == 0) {
                        $('#participants_min').css({ 'width': '0', 'display': 'none' });
                        $('#participants').css({ 'width': '100%', 'display': 'inline-block' });
                        $('.participant.memdiv').each(function(key, element) {
                            $(element).find('.container2text').css({ "textAlign": "center", "left": '' });
                            if (key == 0) {
                                $(element).css({
                                    width: ($('#participants').width() / 1 - div_gap) + 'px',
                                    height: ($('#participants').height() / 2 - div_gap) + 'px',
                                    left: '0px',
                                    top: '',
                                    right: '',
                                    bottom: '0px'
                                }).appendTo('#participants');
                            } else if (key == 1) {
                                $(element).css({
                                    width: ($('#participants').width() / 2 - div_gap) + 'px',
                                    height: ($('#participants').height() / 2 - div_gap) + 'px',
                                    right: '0px',
                                    top: '0px',
                                    left: '',
                                    bottom: ''
                                }).appendTo('#participants');
                            } else if (key == 2) {
                                $(element).css({
                                    width: ($('#participants').width() / 2 - div_gap) + 'px',
                                    height: ($('#participants').height() / 2 - div_gap) + 'px',
                                    left: '0px',
                                    top: '0px',
                                    right: '',
                                    bottom: ''
                                }).appendTo('#participants');
                            }
                            responsive_profile_pic(element);
                        });
                    } else {
                        redrawMaxConf();
                    }
                } else if (total_members == 4) {
                    if ($('.participant.memdiv[data-window="max"]').length == 0) {
                        $('#participants_min').css({ 'width': '0', 'display': 'none' });
                        $('#participants').css({ 'width': '100%', 'display': 'inline-block' });
                        $('.participant.memdiv').each(function(key, element) {
                            $(element).find('.container2text').css({ "textAlign": "center", "left": '' });
                            if (key == 0) {
                                $(element).css({
                                    width: ($('#participants').width() / 2 - div_gap) + 'px',
                                    height: ($('#participants').height() / 2 - div_gap) + 'px',
                                    left: '',
                                    right: '0px',
                                    top: '',
                                    bottom: '0px'
                                }).appendTo('#participants');
                            } else if (key == 1) {
                                $(element).css({
                                    width: ($('#participants').width() / 2 - div_gap) + 'px',
                                    height: ($('#participants').height() / 2 - div_gap) + 'px',
                                    left: '0px',
                                    right: '',
                                    top: '',
                                    bottom: '0px'
                                }).appendTo('#participants');
                            } else if (key == 2) {
                                $(element).css({
                                    width: ($('#participants').width() / 2 - div_gap) + 'px',
                                    height: ($('#participants').height() / 2 - div_gap) + 'px',
                                    left: '',
                                    right: '0px',
                                    top: '0px',
                                    bottom: ''
                                }).appendTo('#participants');
                            } else if (key == 3) {
                                $(element).css({
                                    width: ($('#participants').width() / 2 - div_gap) + 'px',
                                    height: ($('#participants').height() / 2 - div_gap) + 'px',
                                    left: '0px',
                                    right: '',
                                    top: '0px',
                                    bottom: ''
                                }).appendTo('#participants');
                            }
                            responsive_profile_pic(element);

                        });
                    } else {
                        redrawMaxConf();
                    }
                }
            } else {

                if ($('.participant.memdiv[data-window="max"]').length == 0) {
                    $('#participants_min').css({ 'width': '0', 'display': 'none' });
                    $('#participants').css({ 'width': '100%', 'display': 'inline-block' });
                    var pos_left = 0;
                    var pos_cur = 0;
                    var odd_pos = (Math.ceil(total_members / 2));
                    var parcent_width = $('#participants').width() / odd_pos;
                    var parcent_height = $('#participants').height() / 2;
                    $('.participant.memdiv').each(function(key, element) {
                        $(element).find('.container2text').css({ "textAlign": "center", "left": '' });
                        pos_cur++;
                        var pos_top = 0;
                        if (odd_pos > pos_cur) { // upper row
                            $(element).css({
                                width: (parcent_width - div_gap) + 'px',
                                height: (parcent_height - div_gap) + 'px',
                                left: pos_left + 'px',
                                top: '0px'
                            }).appendTo('#participants');
                            pos_left += parcent_width;
                            responsive_profile_pic(element);

                        } else if (odd_pos == pos_cur && total_members % 2 != 0) { // odd row
                            $(element).css({
                                width: (parcent_width - div_gap) + 'px',
                                height: (parcent_height * 2 - div_gap) + 'px',
                                left: pos_left + 'px',
                                top: '0px'
                            }).appendTo('#participants');
                            responsive_profile_pic(element);
                            pos_left = 0;
                        } else if (odd_pos == pos_cur && total_members % 2 == 0) { // even row
                            $(element).css({
                                width: (parcent_width - div_gap) + 'px',
                                height: (parcent_height - div_gap) + 'px',
                                left: pos_left + 'px',
                                top: '0px'
                            }).appendTo('#participants');
                            responsive_profile_pic(element);
                            pos_left = 0;
                        } else { // lower row
                            pos_top = parcent_height + 1;
                            $(element).css({
                                width: (parcent_width - div_gap) + 'px',
                                height: (parcent_height - div_gap) + 'px',
                                left: pos_left + 'px',
                                top: pos_top + 'px'
                            }).appendTo('#participants');
                            pos_left += parcent_width;
                            responsive_profile_pic(element);
                        }
                    });
                } else {
                    redrawMaxConf();
                }
            }
        }
    }
}

function redrawDyn() {

    if ($('#memberListBackWrap').is(":visible") || $('#chat_container').is(":visible") || $('#device_container').is(":visible")) { // sidebar opened

        if (isMobile == true || devicetype == 'android' || $(window).width() <= 640) { // mobile
            $('#chat_container,#memberListBackWrap,#device_container').css({ 'width': '100%' });
            $('.main-icons .call_btn_label').hide();
            $('.main-icons .call-btn').css({ 'height': "100%" });
        } else { // web
            if ($('.toggle_action_label[data-status="show"]').length > 0) {
                $('.main-icons .call_btn_label').show();
                // $('.main-icons .call-btn').css({ 'height': "50%" });
            } else {
                $('.main-icons .call_btn_label').hide();
                // $('.main-icons .call-btn').css({ 'height': "80%" });
            }

            // $('#participants,#icons,#groupcalltitle').css('width', '70%').attr('data-status', 'min');
            $('#call_container_form').css('width', '69%').attr('data-status', 'min');
            $('#chat_container,#memberListBackWrap,#device_container').css({ 'width': '30%' });

        }
    } else { // sidebar closed
        if (isMobile == true || devicetype == 'android' || $(window).width() <= 640) { // mobile
            $('#chat_container,#memberListBackWrap,#device_container').css({ 'width': '0%' });
            $('.main-icons .call_btn_label').hide();
            $('.main-icons .call-btn').css({ 'height': "95%" });
        } else { // web
            if ($('.toggle_action_label[data-status="show"]').length > 0) {
                $('.main-icons .call_btn_label').show();
                // $('.main-icons .call-btn').css({ 'height': "50%" });
            } else {
                $('.main-icons .call_btn_label').hide();
                // $('.main-icons .call-btn').css({ 'height': "80%" });
            }

            $('#call_container_form').css('width', '100%').attr('data-status', 'max');
            $('#chat_container,#memberListBackWrap,#device_container').css({ 'width': '0%' });
        }
    }
    redrawConf();
    // }
}

function openChatShare() {
    if ($('#chat_container').is(":visible") == false) {
        $('#chat_container').show();
        setTimeout(() => {
            placeCaretAtEnd($('#msg_rep')[0]);
            // $('#msg_rep').focus();
        }, 0);

        $('.unreadMsgCount').text('0').hide();
    } else {
        $('#chat_container').hide();
    }

    if ($('#memberListBackWrap').is(":visible") || $('#device_container').is(":visible")) {
        $('#device_container').hide();
        $('#memberListBackWrap').hide();
    } else {
        redrawDyn();
    }
    closeAllPopUpMsgReject();
}

function viewAddParticipant() {
    if (socket.connected) {
        closeAllPopUpMsgReject();
        if ($('#memberListBackWrap').is(":visible") == false) {
            socket.emit('getCallMemberList', {
                conversation_id: conversation_id // cid
            }, function(arrUserList, arrModList) {
                console.log('get_CallMemberList', arrUserList, arrModList);
                var html = '';
                var user_list = _.orderBy(access_user_list, ["fullname"], ["asc"]);

                $.each(user_list, function(ky, va) {
                    if (va.id != user_id) {
                        var checkedst = 'no',
                            disabledst = '',
                            userst = '',
                            adminst = '';
                        if (arrUserList != null && arrUserList.indexOf(va.id) > -1) {
                            checkedst = 'tagcheck';
                            userst = 'In call';
                            checkedst = 'call';
                        }

                        if (join_who != 'initiator') disabledst = 'disabled';
                        else disabledst = 'enabled';

                        html += '<li style="display:none" data-status="' + disabledst + '" onclick="memAddRemCall(\'' + va.id + '\')" class="showEl">';
                        html += '<div class="list" id="member' + va.id + '">';
                        html += '<img src="' + file_server + 'profile-pic/Photos/' + va.img + '">';
                        html += '<span class="online_' + va.id + ' ' + (onlineUserList.indexOf(va.id) === -1 ? "offline" : "online") + '"></span>';
                        html += '<h1 data-uid="' + va.id + '" class="memberName">' + va.fullname + '</h1>';
                        if (arrModList != null && arrModList.indexOf(va.id) > -1) {
                            html += '<p class="admin-text">(moderator)</p>';
                        }
                        html += '<span data-status="' + checkedst + '" data-uid="' + va.id + '" class="tagcheck forActive">' + userst + '</span>';
                        html += '</div>';
                        html += '</li>';
                    }
                });

                overlayScrollbars();
                $('#suggested_list_add').html('').append(html);
                $('#memberListBackWrap .suggested-list li:first').addClass('selected default');
                $('#memberListBackWrap').show();
                $('.searchMember').focus();
                $('.remove.searchClear').on('click', function() {
                    $('.searchMember').val('');
                    $('.adminContainer li').show();
                    $(this).hide();
                    $('.memberName').unhighlight();
                    refreshOnlineUsersList();
                });
                tooltipForBackWrap();
                popupMouseEnter();
                searchClearInput();
                refreshOnlineUsersList();

                if ($('#chat_container').is(":visible") || $('#device_container').is(":visible")) {
                    if ($('#device_container').is(":visible")) $('#device_container').hide();
                    if ($('#chat_container').is(":visible")) $('#chat_container').hide();
                    redrawDyn();
                } else {
                    redrawDyn();
                }

                $('.tagcheck.forActive').each(function(i, el) {
                    $(el).closest('li').prependTo("#memberListBackWrap .suggested-list")
                });

            });
        } else {
            $('#memberListBackWrap').hide();
            redrawDyn();
        }
    }
}
// function fun_switchcall() {
// 	// if (callwaiting == 'no') {
// 	if ($('#device_container').is(":visible") == false) {
// 		var arr_participants = [user_id, partner_id];

// 		if (devicetype == 'web') var targetdevice = 'android';
// 		else var targetdevice = 'web';

// 		socket.emit('ringCall', {
// 			rootId: user_id,
// 			arr_participants: arr_participants,
// 			conversation_init: conversation_init,
// 			conversation_type: 'switchchk',
// 			targetdevice: targetdevice,
// 			user_id: user_id,
// 			session_id: session_id

// 		}, function (cbdata) {
// 			console.log('ring Call chk ', cbdata);

// 			if (cbdata.length > 0) {
// 				$('#device_container').show();
// 				$('.devicelist-history').empty();
// 				$.each(cbdata, function (index, val) {
// 					var imgsrc = '';
// 					var clientdata_name = 'Unknown';
// 					var clientdata_ver = 'Unknown';
// 					var osdata_name = 'Unknown';
// 					if (val.clientData != null) {
// 						if (val.clientData.name.startsWith("Chrome")) {
// 							imgsrc = '/images/call/device_chrome.png';
// 						} else if (val.clientData.name.startsWith("Firefox")) {
// 							imgsrc = '/images/call/device_firefox.png';
// 						} else if (val.clientData.name.startsWith("Opera")) {
// 							imgsrc = '/images/call/device_opera.png';
// 						}
// 						clientdata_name = val.clientData.name;
// 						clientdata_ver = val.clientData.version;
// 					}
// 					if (val.osData != null) {
// 						osdata_name = val.osData;
// 					}


// 					var html = '<div onclick="ringAnotherDevice(this)" data-socketid="' + val.socketid + '" data-sessionid="' + val.sessionid + '" class="main-thread-msgs rep_msg_undefined" style="margin-top:18px;">'
// 						+ '<div class="thread-user-photo">'
// 						+ '<img src="' + imgsrc + '" alt=""></div>'
// 						+ '<div class="thread-user-msg">'
// 						+ '<h4>' + clientdata_name + ' ' + clientdata_ver + '</h4>'
// 						+ '<p>' + osdata_name + '</p>'
// 						+ '</div></div>';
// 					if ($('.devicelist-history .main-thread-msgs[data-sessionid="' + val.sessionid + '"]').length == 0) {
// 						$('.devicelist-history').append(html);
// 					}

// 				});

// 				if ($('#chat_container').is(":visible") || $('#memberListBackWrap').is(":visible")) {
// 					if ($('#memberListBackWrap').is(":visible")) $('#memberListBackWrap').hide();
// 					if ($('#chat_container').is(":visible")) $('#chat_container').hide();
// 				} else {
// 					redrawDyn();
// 				}


// 			} else {
// 				$.alert({
// 					title: false,
// 					useBootstrap: false,
// 					boxWidth: '100%',
// 					content: 'Another device not connected.',
// 				});

// 			}
// 		});
// 	} else {
// 		$('#device_container').hide();
// 		redrawDyn();
// 	}


// }
function closeDeviceWindow() {
    $('#device_container').hide();
    redrawDyn();
}

function searchClearInput() {
    $('.remove.searchClear').on('click', function() {
        $('.searchMember').val('');
        $('.adminContainer li').addClass('showEl');
        $('.adminContainer li').show();
        $('.adminContainer li.showEl').removeClass('selected');
        $('.adminContainer li.showEl:first').addClass('selected');
        $('.add-team-member').val('');
        $('#s-l-def li').show();
        $('#s-l-def li').addClass('showEl');
        $('#s-l-def li.showEl').removeClass('selected');
        $('#s-l-def li.showEl:first').addClass('selected');
        $(this).hide();
        $('.memberName').unhighlight();
        refreshOnlineUsersList();
    });

}
var tooltipForBackWrap = () => {
    $('.adminContainer .closeBackwrap').mouseenter(function() {
        $(this).attr({
            'data-balloon': 'Press Esc to close',
            'data-balloon-pos': 'left'
        });

    });
}
var searchMember = (event, value) => {
    if (event.keyCode !== 40 && event.keyCode !== 38 && event.keyCode !== 13) {
        $(".adminContainer .remove.searchClear").each(function() {
            if (value.length > 0) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
        $(".memberName").each(function() {
            if ($(this).text().toLowerCase().search(value.toLowerCase()) > -1) {
                $(this).closest('li').show();
                $(this).closest('li').addClass('showEl');
            } else {
                $(this).closest('li').hide();
                $(this).closest('li').removeClass('showEl');
            }
        });

        $('.memberName').unhighlight();
        $('.memberName').highlight(value);
        $("#memberListBackWrap li").removeClass('selected');
        $("#memberListBackWrap li.showEl:first").addClass('selected');
        refreshOnlineUsersList();
    }


}

function hangupSpecificMember(targetid) {
    if (socket.connected) {
        socket.emit('hangupDynCall', {
            targetid: targetid,
            rootId: user_id,
            user_id: user_id,
            hanguptype: 'terminate',
            name: name, // uid
            user_fullname: user_fullname,
            conversation_id: conversation_id,
            conference_id: conference_id,
            conversation_type: conversation_type,
            conversation_init: conversation_init,
            rootImg: user_img,
            rootFullname: user_fullname,
            arr_participants: arr_participants,
            call_type_route: call_type_route,
            reloadstatus: 'newconf',
            isRefresh: null,
            // joinstatus: join_who,
            join_who: join_who,
            reg_status: 'webcam',
            data_conf: {
                conversation_id: conversation_id,
                user_fullname: user_fullname,
                msgid: msgid,
            },
            msgid: msgid,
            msg: -1,
            participants_admin: participants_admin,
            'close_window': close_window,
            user_role: user_role
        }, function(cbdata) {
            if (cbdata == true) {
                $('.forActive[data-uid="' + targetid + '"]').text('').attr('data-status', 'no');
            } else {
                $('#warningsPopup').css('display', 'flex');
                $('#warningsPopup .warningMsg').text('Sorry! Only administrators can terminate other calls.');
            }

        });
    }
}

function memAddRemCall(memUUID) {
    if (socket.connected) {
        if (user_role == 'moderator') {
            if ($('.forActive[data-uid="' + memUUID + '"]').attr('data-status') == "no") {
                var arr_participants = [user_id, memUUID];
                socket.emit('ringCallAdd', {
                    call_option: 'ring',
                    name: name, // uid
                    user_id: user_id,
                    rootId: user_id,
                    user_fullname: user_fullname,
                    sender_name: user_fullname,
                    conversation_id: conversation_id,
                    rootImg: user_img,
                    sender_img: user_img,
                    rootFullname: user_fullname,
                    arr_participants: arr_participants,
                    conversation_init: conversation_init,
                    conversation_type: 'addparticipant',
                    call_type_route: call_type_route,
                    reloadstatus: 'newconf',
                    isRefresh: null,
                    join_who: 'initiator',
                    reg_status: 'webcam',
                    'data_conf': {
                        'conversation_id': conversation_id,
                        'user_fullname': user_fullname,
                        'msgid': msgid,
                    },
                    msgid: msgid,
                    repid: repid,
                    // initiatorid: call_data.initiatorid,
                    set_calltype: call_data.set_calltype,
                    convname: call_data.convname,
                    member_id: memUUID,
                    conference_id: conference_id,
                    'close_window': close_window,
                    company_id: company_id
                }, function(cbdata) {
                    if (cbdata.status == 'send') {
                        $('.forActive[data-uid="' + memUUID + '"]').text('Connecting...').attr('data-status', 'connecting');
                    } else {
                        $('#warningsPopup').css('display', 'flex');
                        $('#warningsPopup .warningMsg').text('User is busy in another call.');
                    }
                });
            }
            // else if ($('.forActive[data-uid="' + memUUID + '"]').attr('data-status') == "call") {
            else {
                $('#mypopupcall_div').attr({ 'data-type': 'adduser_hangup', 'data-uid': memUUID }).show();
                $('#mypopupcall_msg').text('Do you want to disconnect this user?');

            }

            // if ($('.checkGroupCall[checked]').length == 0) {
            // 	$('#btnMakecall').attr('disabled', 'disabled');
            // } else {
            // 	$('#btnMakecall').removeAttr('disabled');
            // }
        } else {
            $('#warningsPopup').css('display', 'flex');
            $('#warningsPopup .warningMsg').text('Only moderators of this call will be able to invite other members to join.');
        }
    }
}

function mypopupcall_yes() {
    if ($('#mypopupcall_div').attr('data-type') == 'adduser_hangup') {
        hangupSpecificMember($('#mypopupcall_div').attr('data-uid'));
    } else {
        close_window = false;
        sendAcceptInfo($('.myCallModal[data-index="' + $('#mypopupcall_div').attr('data-index') + '"]'));
    }
    closeModal('mypopupcall_div');
}

function mypopupcall_no() {
    // //debugger;
    if ($('#mypopupcall_div').attr('data-type') == 'adduser_hangup') {
        closeModal('mypopupcall_div');
    } else {
        close_window = false;
        sendRejectInfo($('.myCallModal[data-index="' + $('#mypopupcall_div').attr('data-index') + '"]'), -33);
    }
    closeModal('mypopupcall_div');
}

var searchAddMember = (value) => {
    $("#addParticipantHolder li").each(function() {

        if ($(this).find('label').text().toLowerCase().search(value.toLowerCase()) > -1) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });

    $("#addParticipantHolder li").unhighlight();
    $("#addParticipantHolder li").highlight(value);
}
var loadingInterval = setInterval(function() {
    $('#participants .loading-cam,#participants_min .loading-cam').each(function(kv, el) {
        var uid = $(el).attr('data-uid');
        if ($('#video-' + uid).length > 0 && $('#video-' + uid)[0].src != '') {
            $('.txt_user_connecting[uid="' + uid + '"]').hide();
            if ($(el).attr('data-calltype') == 'audio' && $(el).closest('.participant.memdiv').attr('data-screenstatus') == 'no') {
                $('#video-' + uid).hide();
                $('.img_audio_poster[uid="' + uid + '"]').show();
            } else {
                $('#video-' + uid).show();
                $('.img_audio_poster[uid="' + uid + '"]').hide();
            }
            $(el).removeClass('loading-cam').hide();
        }
    });
    // main timer ================================================
    if (timerstarted_main) {
        ++totalSeconds_main;
        let hour2 = Math.floor(totalSeconds_main / 3600);
        let minute2 = Math.floor((totalSeconds_main - hour2 * 3600) / 60);
        let seconds2 = totalSeconds_main - (hour2 * 3600 + minute2 * 60);
        $('.conf_main_timer').text(hour2 + ":" + minute2 + ":" + seconds2);

    }
    // participant timers ==========================================

    $('.span-timer').each(function(i, obj) {
        if ($(obj).attr('data-timerstarted') == 'true') {
            let totalSeconds = parseInt($(obj).attr('data-totalSeconds'));
            ++totalSeconds;
            $(obj).attr('data-totalSeconds', totalSeconds);
            let hour = Math.floor(totalSeconds / 3600);
            let minute = Math.floor((totalSeconds - hour * 3600) / 60);
            let seconds = totalSeconds - (hour * 3600 + minute * 60);
            obj.innerHTML = hour + ":" + minute + ":" + seconds;

        }

    });
}, 1000);

function openFullscreen(elem) {
    $('.container2icon').hide();
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

function closeFullscreen() {
    $('.container2icon').show();
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
}
if (document.addEventListener) {
    document.addEventListener('webkitfullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
}

function exitHandler() {

    if (document.webkitIsFullScreen === false) {
        $('.per_fullscreen_tog_icon').attr('data-status', 'off');
        $('.per_fullscreen_tog_icon').attr('src', '/images/call/fullscreen-show.svg');
        $('.container2icon').show();
    } else if (document.mozFullScreen === false) {
        $('.per_fullscreen_tog_icon').attr('data-status', 'off');
        $('.per_fullscreen_tog_icon').attr('src', '/images/call/fullscreen-show.svg');
        $('.container2icon').show();
    } else if (document.msFullscreenElement === false) {
        $('.per_fullscreen_tog_icon').attr('data-status', 'off');
        $('.per_fullscreen_tog_icon').attr('src', '/images/call/fullscreen-show.svg');
        $('.container2icon').show();
    }
}

function cancelAddCall() {
    // alert('cancel');
    $('.addParticipantPopup').hide();

}

function get_isrefresh() {
    var isRefresh = true;
    var sessionAlive = sessionStorage.getItem("sessionAlive");
    if (sessionAlive === null) {
        isRefresh = 'new';
        sessionStorage.setItem("sessionAlive", true);
    }
    return sessionAlive;
}
$('#msg_rep').on('keydown', function(event) {

    // arrowAndEnterFormen(event,'replymention_user');
    var code = event.keyCode || event.which;
    if (code == 13 && !event.shiftKey) { //Enter keycode = 13
        event.preventDefault();
        rep_msg_send_fn_call();
        var containerHeight = $(".replies-container").height();
        $('.forScrollBar .os-viewport').animate({ scrollTop: containerHeight }, 1);
    }

    // When typing start into reply message box
    if (typing === false) {
        typing = true;
        // var convid = $('#threadReplyPopUp .main-thread-msgs').find('.thread-user-msg').attr('data-rep_con_id');
        // var msgid = $('#threadReplyPopUp .main-thread-msgs').find('.thread-user-msg').attr('data-rep_msg_id');
        var convid = $('#threadReplyPopUp .main-thread-msgs').find('.thread-user-msg').attr('data-rep_con_id');
        var msgid = $('#threadReplyPopUp .main-thread-msgs').find('.thread-user-msg').attr('data-rep_msg_id');
        socket.emit('client_typing', { display: true, room_id: to, sender_id: user_id, sender_name: user_fullname, sender_img: user_img, conversation_id: conversation_id, reply: true, msg_id: msgid });
        timeout = setTimeout(timeoutFunction, 2000);
    }
});
var timeoutFunction = () => {
    var rep = false;
    var msgid = false;
    if ($('#threadReplyPopUp').is(':visible')) {
        msgid = $('#threadReplyPopUp .main-thread-msgs').find('.thread-user-msg').attr('data-rep_msg_id');
        rep = true;
    }
    typing = false;
    socket.emit("client_typing", { display: false, room_id: to, sender_id: user_id, sender_name: user_fullname, sender_img: user_img, conversation_id: conversation_id, reply: rep, msg_id: msgid });
};
var scrollToBottom = (target) => {
    $(target).animate({ scrollTop: $(target).prop("scrollHeight") }, 800);
};
// draw todo live chat per msg
var per_todo_msg = (data, append = true) => {

    var attach_show = true,
        deletebtn_active = true,
        permanently = false;

    /* Start Date Group By */
    var msg_date = moment(data.created_at).calendar(null, {
        sameDay: '[Today]',
        lastDay: '[Yesterday]',
        lastWeek: function(now) { return '[' + this.format("MMM Do, YYYY") + ']'; },
        sameElse: function(now) { return '[' + this.format("MMM Do, YYYY") + ']'; }
    });
    var temp_date = msg_date;

    if (append) {
        $.each($('.msg-separetor'), function(k, v) {
            if ($(v).text() == msg_date) {
                msg_date = null;
                return 0;
            }
        });
        if (msg_date !== null && $('.msg-separetor-unread').length == 0) {
            var date_html = '<div class="msg-separetor" data-date="' + msg_date + '"><p style="z-index:100">' + msg_date + '</p></div>';
            $(".chat-history").append(date_html);
        }
    }
    /* End Date Group By */

    var html = '<div class="chat-message clearfix todo_msgid_" data-msgid="">';
    html += '<img class="user-imgs" src="' + file_server + 'profile-pic/Photos/' + data.sender_img + '" alt="' + data.sender_img + '">';
    html += '<div class="chat-message-content clearfix" data-sendername="' + data.sender_name + '">';
    html += '<h5>';
    html += data.sender_name + '<span class="chat-time">' + moment(data.created_at).format('h:mm a') + '</span>';
    html += '</h5>';
    html += '<p class="chating_para_2">' + data.msg_body + '</p>';

    html += '</div>';


    $(".chat-history").append(html);
};

function closeRoomBeforeKurento() {
    if (typeof callCleanupLogic == 'function' && window.name === 'calling') {
        window.close();
    }
}

function call_leave_button(exec_type) {
    // socket.emit('getCallAdminList', {
    // 	conversation_id: conversation_id,
    // 	participants_admin: call_data.participants_admin
    // }, function (admin_list) {
    // //debugger;
    if (participants && Object.keys(participants).length > 0) {
        var mod_count = 0;
        for (let pt in participants) {
            if (participants[pt].user_role == 'moderator') mod_count++;
        }
        // alert(mod_count);
        // if (admin_list != null) {
        if (user_role == "moderator" && mod_count > 1) {
            $('#warning_op1').show();
            $('#warning_op2').show();
        } else if (user_role == "moderator" && mod_count <= 1) {
            $('#warning_op1').hide();
            $('#warning_op2').show();
        } else if (user_role != "moderator") {
            $('#warning_op1').show();
            $('#warning_op2').hide();
        }
        // } 
    } else {
        $('#warning_op1').show();
        $('#warning_op2').show();
    }

    $('#warningPopup #warningMessage').text('Would you like to leave this conference?');
    $('#warningPopup').css('display', 'flex');
    // });
}

function call_leave_choice(type) {
    if (type == 'leave') {
        callCleanupLogic('-1', 'endcall', 'leave', true);
    } else {
        callCleanupLogic('-1', 'endcall', 'finish', true);
    }
    closeModal('warningPopup');
}

function toggleScreenShare() {
    if ($('#screen_share_img').attr('data-enabled') == 'yes') {
        if ($('#screen_share_loader').is(':visible') == false) {
            $('#screen_share_loader').show();
            if ($('#screen_share_img').attr('data-status') == 'no') {
                participants[name].rtcPeer.changeScreenShare('on');
            } else {
                participants[name].rtcPeer.changeScreenShare('off');
            }
            closeAllPopUpMsgReject();
        }
    }

}
// ====================== STATUS ==========================================
// audio status =========================================================
function setAudioStatus(status) {
    if (status == 'on') {
        $('#tog_audio_img')
            .attr('data-status', 'no')
            .attr('data-muted', 'no')
            .attr('src', '/images/call/microphone-solid.svg');

        $('#mute_audio_label').html('Mute');

    } else if (status == 'off') {
        $('#tog_audio_img')
            .attr('data-status', 'yes')
            .attr('data-muted', 'yes')
            .attr('src', '/images/call/mute-off_48px_red.svg');

        $('#mute_audio_label').html('Unmute');
    }
}

function getAudioStatus() {
    if ($('#tog_audio_img').attr('data-status') == 'no') {
        return 'on';
    } else {
        return 'off';
    }
}

function setAudioPreviewStatus(status) {
    if (status == 'off') {
        $('#mute_audio_preview')
            .attr('data-muted', 'yes')
            .attr('src', '/images/call/mute-off_48px_red.svg');
    } else if (status == 'on') {
        $('#mute_audio_preview')
            .attr('data-muted', 'no')
            .attr('src', '/images/call/microphone-solid.svg');
    }
}

function getAudioPreviewStatus() {
    if ($('#mute_audio_preview').attr('data-muted') == 'yes') {
        return 'off';
    } else {
        return 'on';
    }
}
// video status ================================================================
function setVideoStatus(status) {
    if (status == 'on') {
        $('#tog_video_img').attr({ 'data-status': 'yes', 'data-muted': 'no' }).attr('src', '/images/call/video-on_48px.svg');
        // $('#mute_video_label').html('Camera');
        call_type_route = 'video';
        call_data.set_calltype = 'video';
        call_data.call_type_route = 'video';

    } else if (status == 'off') {
        $('#tog_video_img').attr({ 'data-status': 'no', 'data-muted': 'yes' }).attr('src', '/images/call/video-off_48px_red.svg');
        // $('#mute_video_label').html('Camera');
        call_type_route = 'audio';
        call_data.set_calltype = 'audio';
        call_data.call_type_route = 'audio';
    }
}

function getVideoStatus() {
    if ($('#tog_video_img').attr('data-status') == 'yes') {
        return 'on';
    } else {
        return 'off';
    }
}

function setVideoPreviewStatus(status) {
    if (status == 'off') {
        $('#mute_video_preview').attr('data-muted', 'yes').attr('src', '/images/call/video-off_48px_red.svg');
    } else if (status == 'on') {
        $('#mute_video_preview').attr('data-muted', 'no').attr('src', '/images/call/video-on_48px.svg');
    }
}

function getVideoPreviewStatus() {
    if ($('#mute_video_preview').attr('data-muted') == 'yes') {
        return 'off';
    } else {
        return 'on';
    }
}
// ======================== STATUS ==============================================
// ======================== TOGGLE =========================================
function toggleAudioPreview() {
    if (getAudioPreviewStatus() == 'off') {
        setAudioPreviewStatus('on');
    } else {
        setAudioPreviewStatus('off');
    }
}

function toggleVideoPreview() {
    if ($('#videoSourceSel option').length > 0) { // video on here
        if (getVideoPreviewStatus() == 'off') {
            setVideoPreviewStatus('on');
        } else { // video off here
            setVideoPreviewStatus('off');
        }
    } else {
        $('#warningsPopup .warningMsg').text('Camera not found.');
        $('#warningsPopup').css('display', 'flex');
    }

}

function toggleVideoConf() {
    if ($('#tog_video_img').attr('data-enabled') == 'yes') {
        if ($('#videoSourceSel option').length > 0) {
            $('#screen_share_loader').show();
            if ($('#screen_share_img').attr('data-status') == 'no') { // screen off
                if (getVideoStatus() == 'off') { // video off => on
                    setVideoStatus('on');
                    participants[name].rtcPeer.changeVideoShare(true);
                } else { // mute video
                    setVideoStatus('off');
                    participants[name].rtcPeer.changeVideoShare(false);
                }
            } else {
                // alert('Turn off screen sharing first.');
                $('#warningsPopup').css('display', 'flex');
                $('#warningsPopup .warningMsg').text('Turn off screen sharing first.');
                $('#screen_share_loader').hide();
            }
        } else {
            $('#warningsPopup .warningMsg').text('Camera not found.');
            $('#warningsPopup').css('display', 'flex');
        }
    }
}

function toggleMuteConf() {
    if ($('#tog_audio_img').attr('data-enabled') == 'yes') {
        if (getAudioStatus() == 'on') { // turn audio off
            setAudioStatus('off');

            socket.emit('send_mute_user_conf', {
                name: name,
                user_id: user_id, // uid
                conversation_id: conversation_id, // cid
                mute_status: 'yes'
            }, function(cbdata) {

            });
            // participants[name].rtcPeer.changeAudioShare(false);

        } else { // turn audio on
            setAudioStatus('on');

            socket.emit('send_mute_user_conf', {
                name: name,
                user_id: user_id, // uid
                conversation_id: conversation_id, // cid
                mute_status: 'no'
            }, function(cbdata) {

            });
            participants[name].rtcPeer.changeAudioShare(true);
        }
    }

}
// ==============================================================================
function batch_mute_audio(e) {
    e.stopPropagation();
    if ($(e.currentTarget).attr('data-status') == 'unmuted') {
        // $('.per_audio_tog_icon[data-status="on"]').click();
        $(e.currentTarget).attr('data-status', 'muted');
        $(e.currentTarget).find('.hyvenCheckboxBefore').css('visibility', 'visible');
        if (user_role == 'moderator') {
            socket.emit('admin_mute_status', {
                user_id: user_id, // uid
                conversation_id: conversation_id, // cid
                status: 'mute',
                who: 'all',
            }, function(cbdata) {});
        }
    } else if ($(e.currentTarget).attr('data-status') == 'muted') {
        // $('.per_audio_tog_div').each(function (key, element) {
        // 	$('.per_audio_tog_icon[data-status="off"]').click();
        // });
        $(e.currentTarget).attr('data-status', 'unmuted');
        $(e.currentTarget).find('.hyvenCheckboxBefore').css('visibility', 'hidden');
        if (user_role == 'moderator') {
            socket.emit('admin_mute_status', {
                user_id: user_id, // uid
                conversation_id: conversation_id, // cid
                status: 'unmute',
                who: 'all',
            }, function(cbdata) {});
        }

    }
}

function batch_mute_screen(e) {
    e.stopPropagation();
    if ($(e.currentTarget).attr('data-status') == 'unmuted') {
        // $('.per_screen_tog_icon[data-status="on"]').click();
        $(e.currentTarget).attr('data-status', 'muted');
        $(e.currentTarget).find('.hyvenCheckboxBefore').css('visibility', 'visible');

        socket.emit('admin_screenshare_status', {
            user_id: user_id, // uid
            conversation_id: conversation_id, // cid
            status: 'mute',
            who: 'all',
        }, function(cbdata) {});
    } else if ($(e.currentTarget).attr('data-status') == 'muted') {
        // $('.per_screen_tog_icon[data-status="off"]').click();
        $(e.currentTarget).attr('data-status', 'unmuted');
        $(e.currentTarget).find('.hyvenCheckboxBefore').css('visibility', 'hidden');

        socket.emit('admin_screenshare_status', {
            user_id: user_id, // uid
            conversation_id: conversation_id, // cid
            status: 'unmute',
            who: 'all',
        }, function(cbdata) {});
    }
}

function batch_mute_video(e) {
    e.stopPropagation();
    if ($(e.currentTarget).attr('data-status') == 'unmuted') {
        // $('.per_video_tog_icon[data-status="on"]').click();
        $(e.currentTarget).attr('data-status', 'muted');
        $(e.currentTarget).find('.hyvenCheckboxBefore').css('visibility', 'visible');
        socket.emit('admin_video_status', {
            user_id: user_id, // uid
            conversation_id: conversation_id, // cid
            status: 'mute',
            who: 'all',
        }, function(cbdata) {});
    } else if ($(e.currentTarget).attr('data-status') == 'muted') {
        // $('.per_video_tog_icon[data-status="off"]').click();
        $(e.currentTarget).attr('data-status', 'unmuted');
        $(e.currentTarget).find('.hyvenCheckboxBefore').css('visibility', 'hidden');
        socket.emit('admin_video_status', {
            user_id: user_id, // uid
            conversation_id: conversation_id, // cid
            status: 'unmute',
            who: 'all',
        }, function(cbdata) {});
    }

}

function toggleGuestAuto(e) {
    if ($('.toggle_guest_auto').attr('data-status') == 'manual') {
        $('.toggle_guest_auto').attr('data-status', 'auto');
        $(e.currentTarget).find('.hyvenCheckboxBefore').css('visibility', 'visible');
    } else {
        $('.toggle_guest_auto').attr('data-status', 'manual');
        $(e.currentTarget).find('.hyvenCheckboxBefore').css('visibility', 'hidden');
    }
}

function toggleParticipantAuto(e) {
    if ($('.toggle_participant_auto').attr('data-status') == 'manual') {
        $('.toggle_participant_auto').attr('data-status', 'auto');
        $(e.currentTarget).find('.hyvenCheckboxBefore').css('visibility', 'visible');
    } else {
        $('.toggle_participant_auto').attr('data-status', 'manual');
        $(e.currentTarget).find('.hyvenCheckboxBefore').css('visibility', 'hidden');
    }
}

function toggleTimerMember(e) {
    if ($('.toggle_member_timer').attr('data-status') == 'show') {
        $('.toggle_member_timer').attr('data-status', 'hide');
        $(e.currentTarget).find('.hyvenCheckboxBefore').css('visibility', 'hidden');
    } else {
        $('.toggle_member_timer').attr('data-status', 'show');
        $(e.currentTarget).find('.hyvenCheckboxBefore').css('visibility', 'visible');
    }
    $('.span-timer').slideToggle();
}

function toggleActionLabels(e) {
    if ($('.toggle_action_label').attr('data-status') == 'show') {
        $('.toggle_action_label').attr('data-status', 'hide');
        $(e.currentTarget).find('.hyvenCheckboxBefore').css('visibility', 'visible');
        // $('.call-btn').css({ 'height': '80%' });
        $('.call_btn_label').hide();
        $('.toggle_action_icons').hide();
    } else {
        $('.toggle_action_label').attr('data-status', 'show');
        $(e.currentTarget).find('.hyvenCheckboxBefore').css('visibility', 'hidden');
        $('.toggle_action_icons').show();

        if ($('.toggle_action_label[data-status="show"]').length > 0) {
            $('.main-icons .call_btn_label').show();
            // $('.call-btn').css({ 'height': '50%' });
        } else {
            $('.main-icons .call_btn_label').hide();
        }
    }
}

function toggleActionIcons(e) {
    // //debugger;
    if ($('.toggle_action_icons').attr('data-status') == 'show') {
        $('.toggle_action_icons').attr('data-status', 'hide');
        $(e.currentTarget).find('.hyvenCheckboxBefore').css('visibility', 'visible');
        $('.toggle_action_label').hide();

        $('.call-btn').fadeOut('fast');
        $('#icons').animate({ height: '5%' }, "fast", function() {
            $('#room').animate({ height: '90%' }, function() {
                redrawConf();
            });
        });

    } else {
        $('.toggle_action_icons').attr('data-status', 'show');
        $(e.currentTarget).find('.hyvenCheckboxBefore').css('visibility', 'hidden');
        $('.toggle_action_label').show();
        $('#room').animate({ height: '85%' }, function() {
            redrawConf();
            $('#icons').animate({ height: '10%' }, "fast", function() {
                $('.call-btn').fadeIn('fast');
            });
        });


    }
}
// kurento handle =================================================================
function Participant(namept) { // ********************* Constructor function
    console.log('webrc=>new_participant', namept);
    if (namept.user_fullname != undefined) {
        this.user_id = namept.user_id;
        this.name = namept.name;
        this.conversation_id = namept.conversation_id;
        this.user_fullname = namept.user_fullname;
        this.user_img = namept.user_img;
        this.join_time = namept.join_time;
        this.call_type_route = namept.call_type_route;
        this.mute_status = namept.mute_status;
        this.hold_status = namept.hold_status;
        this.screenstatus = namept.screenstatus;
        this.user_role = namept.user_role;

        var container = document.createElement('div');
        container.id = this.name;
        $(container)
            .attr('class', 'participant memdiv')
            .attr('data-screenstatus', namept.screenstatus)
            .attr('data-window', 'normal')
            .attr('data-calltype', namept.call_type_route)

        container.ondblclick = function() {
            if (isMobile == true || devicetype == 'android' || $(window).width() <= 640) return;
            var uid = $(this).attr('id');
            // var full_status = $(this).attr('data-window');
            if (is_fullscreen == true) {
                $('.per_fullscreen_tog_icon[uid="' + uid + '"]').click();
            } else {
                $('.per_maxmin_tog_icon[uid="' + uid + '"]').click();
            }

        };
        // hold div start ===============================================================
        var onhold_message = document.createElement('p');
        $(onhold_message)
            .attr('uid', this.name)
            .attr('data-userid', this.user_id)
            .attr('class', "onhold_message");
        if (namept.name == name) {
            onhold_message.textContent = "You are in another call.";
        } else {
            onhold_message.textContent = this.user_fullname + " is in another call.";
        }
        container.appendChild(onhold_message);
        // hold div end =================================================================

        // call ended div start ====================================================
        var callended_div = document.createElement('div');
        $(callended_div)
            .attr('uid', this.name)
            .attr('data-userid', this.user_id)
            .attr('class', "callended_div");
        container.appendChild(callended_div);

        var callended_message = document.createElement('p');
        callended_message.className = "callended_message";
        callended_message.setAttribute('uid', this.name);
        // callended_message.innerHTML = this.user_fullname + " left the call.";
        callended_div.appendChild(callended_message);

        var callended_message_tab = document.createElement('p');
        callended_message_tab.className = "callended_message_tab";
        callended_message_tab.setAttribute('uid', this.name);
        callended_message_tab.innerHTML = "";
        callended_div.appendChild(callended_message_tab);

        var callended_img_div = document.createElement('div');
        callended_img_div.className = "callended_img_div create-todo";
        callended_img_div.setAttribute('data-balloon', 'Close Window');
        callended_img_div.setAttribute('data-balloon-pos', 'down');
        callended_img_div.onclick = function() {
            // //debugger;
            var total_mem = $('.participant.memdiv').length;
            var total_ended = $('.callended_div:visible').length;
            var total_left = total_mem - total_ended;
            if (total_left == 1) {
                callCleanupLogic("-1", 'endcall', 'finish', true);
            } else {
                $('#' + namept.name).remove();
                redrawConf();
            }
        };
        callended_div.appendChild(callended_img_div);

        var callended_img = document.createElement('p');
        callended_img.textContent = "Close";
        // callended_img.className = "callended_img";
        // callended_img.setAttribute('src', '/images/call/call_ended_close.svg');
        callended_img.setAttribute('uid', this.name);
        callended_img_div.appendChild(callended_img);
        // call ended div end ====================================================

        // upper client icons start ====================================================
        var mute_audio_client = document.createElement('img');
        $(mute_audio_client)
            .attr('class', "mute_audio_client cls_upper_indicator")
            .attr('src', '/images/call/mute-speaker-client.svg')
            .attr('uid', this.name)
        container.appendChild(mute_audio_client);

        var mute_video_client = document.createElement('img');
        $(mute_video_client).attr('class', "mute_video_client cls_upper_indicator")
            .attr('src', '/images/call/mute-video-client.svg')
            .attr('uid', this.name);
        container.appendChild(mute_video_client);

        var mute_screen_client = document.createElement('img');
        $(mute_screen_client)
            .attr('class', "mute_screen_client cls_upper_indicator")
            .attr('src', '/images/call/mute-screen-client.svg')
            .attr('uid', this.name)
        container.appendChild(mute_screen_client);
        if (this.name != user_id) {
            var more_options_client = document.createElement('img');
            $(more_options_client)
                .attr('class', "more_options_client cls_upper_indicator")
                .attr('src', '/images/call/ellipsis_v.svg')
                .attr('uid', this.name)
                .click(function() {
                    var uid = $(this).attr('uid');
                    $('#more_html_div' + uid).toggle();
                });
            container.appendChild(more_options_client);
            var moht_id = "more_html_div" + this.name;
            var moht = '';
            moht += '<div id="' + moht_id + '" class="more_call_option_div" data-uid="' + this.name + '">';
            moht += '	<div class="options_container">';
            moht += '		<div class="option toggle_audio" onmouseup="toggle_audio(this)" data-uid="' + this.name + '" data-status="unmuted">';
            moht += '			<div class="text">mute audio</div>';
            moht += '		</div>';
            moht += '		<div class="option toggle_video" onmouseup="toggle_video(this)" data-uid="' + this.name + '" data-status="unmuted">';
            moht += '			<div class="text">mute video</div>';
            moht += '		</div>';
            moht += '		<div class="option toggle_screen" onmouseup="toggle_screen(this)" data-uid="' + this.name + '" data-status="unmuted">';
            moht += '			<div class="text">disallow screen sharing</div>';
            moht += '		</div>';
            moht += '		<div class="option toggle_zoom" onmouseup="toggle_zoom(this)" data-uid="' + this.name + '" data-status="unmuted">';
            moht += '			<div class="text">zoom in</div>';
            moht += '		</div>';
            // moht += '		<div class="option toggle_fullscreen" onmouseup="toggle_fullscreen(this)" data-uid="'+this.name+'" data-status="unmuted">';
            // moht += '			<div class="text">toggle fullscreen</div>';
            // moht += '		</div>';
            moht += '		<div class="option toggle_hangup" onmouseup="toggle_hangup(this)" data-uid="' + this.name + '" data-status="unmuted">';
            moht += '			<div class="text">hangup</div>';
            moht += '		</div>';
            moht += '	</div>';
            moht += '</div>';
            $(container).append(moht);
        }


        // upper client icons end ====================================================
        // ==============================================================================
        // lower server icons start ----------------------------------------------------
        var mute_audio_server = document.createElement('img');
        $(mute_audio_server)
            .attr('class', 'mute_audio_server cls_lower_indicator')
            .attr('src', '/images/call/mute-speaker-server.svg')
            .attr('uid', this.name)
            .appendTo(container)
            .click(function() {
                var uid = $(this).attr('uid');
                if (uid != user_id) {
                    if ($('.per_audio_tog_icon[uid="' + uid + '"]').is(':visible')) {
                        $('.per_audio_tog_icon[uid="' + uid + '"]').click();
                    }

                }
            });

        var mute_hand_server = document.createElement('img');
        $(mute_hand_server)
            .attr('class', 'mute_hand_server cls_lower_indicator')
            .attr('src', '/images/call/raise-hand.svg')
            .attr('uid', this.name)
            .attr('data-state', 'off')
            .attr('data-state-old', 'none')
            .appendTo(container)
            .click(function() {
                var uid = $(this).attr('uid');
                if (uid != user_id) {
                    if ($(this).attr('data-state') == 'off') { // turn on : make green
                        socket.emit('admin_hand_status', {
                            user_id: user_id, // uid
                            conversation_id: conversation_id, // cid
                            hand_status: 'on',
                            uid: uid
                        }, function(cbdata) {});
                    } else if ($(this).attr('data-state') == 'on') { // make hide
                        socket.emit('admin_hand_status', {
                            user_id: user_id, // uid
                            conversation_id: conversation_id, // cid
                            hand_status: 'off',
                            uid: uid
                        }, function(cbdata) {});
                    }
                }
            });

        var mute_hand_msg = document.createElement('div');
        $(mute_hand_msg)
            .attr('class', 'mute_hand_msg')
            .text('Permission granted')
            .attr('uid', this.name)
            .appendTo(container)
            // lower server icons end ====================================================

        // middle poster start ====================================================
        var img_audio_poster = document.createElement('img');
        img_audio_poster.className = "img_audio_poster";
        img_audio_poster.setAttribute('src', file_server + 'profile-pic/Photos/' + this.user_img);
        img_audio_poster.setAttribute('uid', this.name);
        container.appendChild(img_audio_poster);

        if (namept.call_type_route == 'audio') {
            $('.img_audio_poster[uid="' + this.name + '"]').show();
        } else {
            $('.img_audio_poster[uid="' + this.name + '"]').hide();
        }
        // middle poster end ====================================================

        // connecting div start ====================================================
        var txt_user_connecting = document.createElement('p');
        $(txt_user_connecting)
            .attr('class', 'txt_user_connecting')
            .attr('uid', this.name)
            .html('Connecting...')
            .appendTo(container);
        // connecting div end ====================================================

        // newmsg div start ====================================================
        if (this.name != user_id) {
            var txt_user_msg = document.createElement('p');
            $(txt_user_msg)
                .attr('class', 'txt_user_msg')
                .attr('uid', this.name)
                .html('New Message')
                .appendTo(container);

        }
        // newmsg div end ====================================================

        // loading div start ===================================================
        var loading_div = document.createElement('div');
        $(loading_div)
            .attr('class', "loading-cam loadingDiv")
            .attr('data-uid', this.name)
            .attr('data-calltype', namept.call_type_route);
        container.appendChild(loading_div);

        // loading div end ===================================================

        // url container start ======================================================================================
        $('<div id="videourl' + this.name + '" class="video-url-container"><input class="video-url-text autofocus" readonly="" type="text" tabindex="0" style="direction: ltr;" dir="ltr"><button onclick="videoUrlClose(this)"  class="video-url-closebtn">Close</button></div>').appendTo(container);
        // url container end ======================================================================================

        // canvas container start ===================================================================
        var source, context, analyser, fbc_array, bars = 16,
            animation_id = null;

        function initMp3Player() {
            context = new AudioContext(); // AudioContext object instance
            analyser = context.createAnalyser(); // AnalyserNode method
            analyser.fftSize = 32;
            if (is_chrome) {
                var streambar = video.captureStream();
            } else {
                var streambar = video.mozCaptureStream();
            }
            if (streambar) {
                source = context.createMediaStreamSource(streambar);
                source.connect(analyser);
                frameLooper();
            }
        }
        var fps = 30;

        function frameLooper() {
            animation_id = window.requestAnimationFrame(frameLooper);
            fbc_array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(fbc_array);
            let sum_L = 0.0;
            let avg_L = 0.0;
            for (var i = 0; i < bars; i++) { sum_L += fbc_array[i]; }
            avg_L = sum_L / 16;
            $(img_audio_poster).css('box-shadow', '0 0 1px ' + Math.floor(avg_L / 20) + 'px rgba(92,212,239,0.9),0 0 1px ' + Math.floor(avg_L / 10) + 'px rgba(2,61,103,0.9)');
        }
        // canvas container end ===========================================================================
        // ============================================================================================
        // video container start ============================================================================
        var container_video = document.createElement('div');
        $(container_video)
            .attr('data-calltype', namept.call_type_route)
            .attr('uid', this.name)
            .attr('class', "container2div");
        container.appendChild(container_video);

        var video = document.createElement('video');
        video.setAttribute('data-uid', this.name);
        video.setAttribute('poster', '/images/call/black-background.jpg');
        video.setAttribute('webkit-playsinline', 'webkit-playsinline');
        video.setAttribute('playsinline', '');
        video.id = 'video-' + this.name;
        video.autoplay = true;
        video.controls = false;
        video.ondurationchange = function() {
            console.log("==>Media::The video duration has changed", namept.name);
            stream_count++;
            if (stream_count > 1) {
                $('#participants').css('visibility', 'visible');
                $('.init-loader,.txt_main_connecting,.txt_main_connecting_user').hide();
            }

            if (namept.name == user_id) { // self
                video.muted = true; // not need

            } else { // others
                if (namept.mute_status == 'yes') {
                    video.muted = true;
                } else {
                    video.muted = false;
                }
            }

        };
        video.onerror = function() {
            console.log("==>Media::Error! Something went wrong", namept.name);
            $('#screen_share_loader').hide();
        };
        video.onsuspend = function() {
            console.log("==>Media::Loading of the media is suspended", namept.name);
            $('#screen_share_loader').hide();
        };
        video.onstalled = function() {
            console.log("==>Media::Media data is not available", namept.name);
            $('#screen_share_loader').hide();
        };
        container_video.appendChild(video);
        if (namept.name == user_id) { // self
            if (namept.mute_status == 'yes') {
                $(mute_audio_server).show();
            } else {
                $(mute_audio_server).hide();
            }
        } else { // others
            if (namept.mute_status == 'yes') {
                $(mute_audio_server).show();
            } else {
                $(mute_audio_server).hide();
            }
        }

        if (isMobile == false || devicetype != 'android') {
            attachSinkId(video, getCookieCall('deviceid_output'));
        }
        video.onplaying = function() {
            if (isMobile == false || devicetype != 'android') initMp3Player();
        };
        // video container end ==================================================================
        // lower text container start ===========================================================
        var container_text = document.createElement('div');
        $(container_text)
            .attr('data-calltype', namept.call_type_route)
            .attr('uid', this.name)
            .attr('class', "container2text");
        container.appendChild(container_text);

        var span_name = document.createElement('p');
        $(span_name)
            .attr('uid', this.name)
            .attr('class', "span-name");
        container_text.appendChild(span_name);

        var user_name_span = document.createElement('span');
        user_name_span.className = "span-user-name";

        var user_role_span = document.createElement('span');
        user_role_span.className = "span-user-role";
        user_role_span.innerHTML = namept.user_role;

        if (this.name != user_id) {
            user_name_span.innerHTML = this.user_fullname;
            span_name.appendChild(user_name_span);
            span_name.appendChild(user_role_span);
            $(container).addClass('participantsDiv');
        } else {
            user_name_span.innerHTML = 'You';
            span_name.appendChild(user_name_span);
            // span_name.appendChild(document.createTextNode('You'));
            span_name.appendChild(user_role_span);
            $(container).addClass('youDiv');
        }

        var timer_div = document.createElement('p');
        $(timer_div)
            .attr('uid', this.name)
            .attr('class', "span-timer")
            .attr('data-timerstarted', 'false')
            .attr('data-totalSeconds', '0');
        container_text.appendChild(timer_div);
        if ($('.toggle_member_timer').attr('data-status') == 'show') {
            $(timer_div).show();
        } else {
            $(timer_div).hide();
        }
        // lower text container end ===========================================================

        // upper participants icons start =====================================================================
        var container2icon = document.createElement('div');
        $(container2icon)
            .attr('uid', this.name)
            .attr('class', "container2icon");
        container.appendChild(container2icon);

        if (this.name != user_id) { // sss
            // Mute speaker icon ----------------------------------------------
            var per_audio_tog_div = document.createElement('div');
            $(per_audio_tog_div).css('display', 'inline-block')
                .attr('data-status', 'on')
                .attr('data-enable', 'yes')
                .attr('class', "per_audio_tog_div")
                .attr('uid', this.name)
                .attr('data-balloon', 'Mute / Unmute microphone')
                .attr('data-balloon-pos', 'down')
                .appendTo(container2icon)
            var per_audio_tog_icon = document.createElement('img');
            $(per_audio_tog_icon).attr('src', '/images/call/speaker-on_56px.svg')
                .attr('uid', this.name)
                .attr('data-status', 'on')
                .attr('class', "per_audio_tog_icon")
                .appendTo(per_audio_tog_div)
                .click(function(e) {
                    e.stopPropagation();
                    var uid = $(this).attr('uid');
                    if ($(this).attr('data-status') == 'on') {
                        $(this).attr('data-status', 'off');
                        $(this).attr('src', '/images/call/speaker-off_56px.svg');
                        $('#video-' + uid)[0].muted = true;
                        $('.mute_audio_client[uid="' + uid + '"]').show();
                        $('.toggle_audio[data-uid="' + uid + '"] .text').text('unmute audio');
                    } else {
                        $(this).attr('data-status', 'on');
                        $(this).attr('src', '/images/call/speaker-on_56px.svg');
                        $('.mute_audio_client[uid="' + uid + '"]').hide();
                        $('.toggle_audio[data-uid="' + uid + '"] .text').text('mute audio');

                        if ($('.per_audio_tog_div[uid="' + uid + '"]').attr('data-enable') == 'yes') {
                            $('#video-' + uid).prop('muted', false);
                            // $('#video-' + uid)[0].muted = false;
                        }
                    }
                });
            // Mute video icon ----------------------------------------------------------
            var per_video_tog_div = document.createElement('div');
            per_video_tog_div.setAttribute('uid', this.name);
            $(per_video_tog_div)
                .attr('class', "per_video_tog_div")
                .attr('data-balloon', 'Mute / Unmute video of this participant')
                .attr('data-balloon-pos', 'down')
                .appendTo(container2icon);
            var per_video_tog_icon = document.createElement('img');
            $(per_video_tog_icon)
                .attr('src', '/images/call/video-on_48px.svg')
                .attr('uid', this.name)
                .attr('data-status', 'on')
                .attr('class', 'per_video_tog_icon')
                .appendTo(per_video_tog_div)
                .click(function(e) {
                    e.stopPropagation();
                    var uid = $(this).attr('uid');
                    if ($(this).attr('data-status') == 'on') {
                        $(this).attr('data-status', 'off');
                        per_video_tog_icon.setAttribute('src', '/images/call/video-off_48px_cross.svg');
                        $('.mute_video_client[uid="' + uid + '"]').show();
                        $('.toggle_video[data-uid="' + uid + '"] .text').text('unmute video');
                        if ($('#' + uid).attr('data-calltype') != 'screen') { // dont hide video if screen sharing on
                            $('#video-' + uid).hide();
                            $('.img_audio_poster[uid="' + uid + '"]').show();
                            // $('.audio_canvas[uid="' + uid + '"]').show();
                        }

                    } else {
                        $(this).attr('data-status', 'on');
                        per_video_tog_icon.setAttribute('src', '/images/call/video-on_48px.svg');
                        $('.mute_video_client[uid="' + uid + '"]').hide();
                        $('.toggle_video[data-uid="' + uid + '"] .text').text('mute video');

                        if ($('.per_video_tog_div[uid="' + uid + '"]').attr('data-enable') == 'yes') {
                            $('#video-' + uid).show();
                            $('.img_audio_poster[uid="' + uid + '"]').hide();
                        }
                    }
                });
            if (namept.call_type_route == 'audio') {
                $(per_video_tog_div).attr('data-enable', 'no');
            } else {
                $(per_video_tog_div).attr('data-enable', 'yes');
            }
            // disallow screen icon for moderator --------------------------------------------------
            var per_screen_tog_div = document.createElement('div');
            per_screen_tog_div.setAttribute('uid', this.name);
            $(per_screen_tog_div)
                .attr('data-enable', 'no')
                .attr('class', "per_screen_tog_div")
                .attr('data-balloon', 'Allow / disallow screen sharing')
                .attr('data-balloon-pos', 'down')
                .css('display', 'inline-block')
                .appendTo(container2icon);
            var per_screen_tog_icon = document.createElement('img');
            $(per_screen_tog_icon)
                .attr('data-status', 'on')
                .attr('class', 'per_screen_tog_icon')
                .attr('src', '/images/call/screen-share-off_48px.svg')
                .attr('uid', this.name)
                .appendTo(per_screen_tog_div)
                .click(function(e) {
                    e.stopPropagation();
                    var uid = $(this).attr('uid');
                    if ($(this).attr('data-status') == 'on') {
                        $(this).attr('data-status', 'off').attr('src', '/images/call/screen-share-on_48px.svg');
                        $('.mute_screen_client[uid="' + uid + '"]').show();
                        $('.toggle_screen[data-uid="' + uid + '"] .text').text('allow screen sharing');
                        if ($('#' + uid).attr('data-calltype') != 'video') {
                            $('#video-' + uid).hide();
                            $('.img_audio_poster[uid="' + uid + '"]').show();
                            // $('.audio_canvas[uid="' + uid + '"]').show();
                        }
                        socket.emit('admin_screenshare_status', {
                            user_id: user_id, // uid
                            conversation_id: conversation_id, // cid
                            status: 'mute',
                            who: 'user',
                            mute_uid: uid
                        }, function(cbdata) {});
                    } else {
                        $(this).attr('data-status', 'on').attr('src', '/images/call/screen-share-off_48px.svg');
                        $('.mute_screen_client[uid="' + uid + '"]').hide();
                        $('.toggle_screen[data-uid="' + uid + '"] .text').text('disallow screen sharing');
                        if ($('.per_screen_tog_div[uid="' + uid + '"]').attr('data-enable') == 'yes') { // server status
                            $('#video-' + uid).show();
                            $('.img_audio_poster[uid="' + uid + '"]').hide();
                            // $('.audio_canvas[uid="' + uid + '"]').hide();
                        }
                        socket.emit('admin_screenshare_status', {
                            user_id: user_id, // uid
                            conversation_id: conversation_id, // cid
                            status: 'unmute',
                            who: 'user',
                            mute_uid: uid
                        }, function(cbdata) {});
                    }
                });

            // max/min icon -----------------------------------------------------
            var per_maxmin_tog_icon = document.createElement('img');
            $(per_maxmin_tog_icon)
                .attr('src', '/images/call/webcam-max.svg')
                .attr('data-status', 'off')
                .attr('uid', this.name)
                .attr('class', "per_maxmin_tog_icon")
                .click(function(e) {
                    var uid = $(this).attr('uid');
                    if ($(this).attr('data-status') == 'off') { // off to on
                        $('.toggle_zoom[data-uid="' + uid + '"] .text').text('zoom out');
                        $('#participants').css('width', '85%');
                        $('#participants_min').css({ 'width': '13%', 'display': 'inline-block' });
                        $('.participant.memdiv').each(function(key, element) {
                            var curid = $(element).attr('id');
                            if (curid == uid) { // maximize it
                                $(element).attr('data-window', 'max');
                                $('.per_maxmin_tog_icon[uid="' + curid + '"]').attr({
                                    'data-status': 'on',
                                    'src': '/images/call/webcam-min.svg',
                                });

                            } else { // turn others to minimize
                                $(element).attr('data-window', 'min');
                                // if (!$(element).hasClass('youDiv')) {
                                $('.per_maxmin_tog_icon[uid="' + curid + '"]').attr({
                                    'data-status': 'off',
                                    'src': '/images/call/webcam-max.svg',
                                });
                            }
                        });

                    } else { // on to off
                        $('.toggle_zoom[data-uid="' + uid + '"] .text').text('zoom in');
                        $('#participants').css('width', '100%');
                        $('#participants_min').css({ 'width': '0', 'display': 'none' });
                        $('.participant.memdiv').attr('data-window', 'normal'); // todo: others also
                        $('.per_maxmin_tog_icon[uid="' + uid + '"]').attr({
                            'data-status': 'off',
                            'src': '/images/call/webcam-max.svg',
                        });
                    }
                    redrawConf();
                });
            var per_maxmin_tog_div = document.createElement('div');
            $(per_maxmin_tog_div)
                .css('display', 'inline-block')
                .attr('class', "per_maxmin_tog_div")
                .attr('data-balloon', 'Enlarge / Minimize')
                .attr('data-balloon-pos', 'down');
            container2icon.appendChild(per_maxmin_tog_div);
            per_maxmin_tog_div.appendChild(per_maxmin_tog_icon);

            // fullscreen icon -------------------------------------------------------
            var per_fullscreen_tog_icon = document.createElement('img');
            per_fullscreen_tog_icon.setAttribute('src', '/images/call/fullscreen-show.svg');
            per_fullscreen_tog_icon.setAttribute('uid', this.name);
            per_fullscreen_tog_icon.setAttribute('data-status', 'off');
            per_fullscreen_tog_icon.className = "per_fullscreen_tog_icon";
            per_fullscreen_tog_icon.onclick = function() {
                var uid = $(this).attr('uid');
                if ($(this).attr('data-status') == 'off') { // off => on
                    is_fullscreen = true;
                    $(this).attr('data-status', 'on');
                    // $('#' + uid).attr('data-window', 'full');
                    // per_fullscreen_tog_icon.setAttribute('src', '/images/call/fullscreen-hide.svg');
                    $('.participant.memdiv').each(function(key, element) {
                        if ($($(element).find('.per_maxmin_tog_icon')).attr('uid') == uid) {
                            openFullscreen(element);
                        }
                    });
                } else {
                    $(this).attr('data-status', 'off');
                    // $('#' + uid).attr('data-window', 'normal');
                    per_fullscreen_tog_icon.setAttribute('src', '/images/call/fullscreen-show.svg');
                    closeFullscreen();
                }
            };
            var per_fullscreen_tog_div = document.createElement('div');
            $(per_fullscreen_tog_div).css('display', 'inline-block');
            per_fullscreen_tog_div.className = "per_fullscreen_tog_div";
            per_fullscreen_tog_div.setAttribute('data-balloon', 'Go fullscreen / Exit fullscreen');
            per_fullscreen_tog_div.setAttribute('data-balloon-pos', 'down');
            container2icon.appendChild(per_fullscreen_tog_div);
            per_fullscreen_tog_div.appendChild(per_fullscreen_tog_icon);

            // hangup icon for moderator ---------------------------------------------------
            // if (user_role == 'moderator') {
            var admin_endusercall_icon = document.createElement('img');
            admin_endusercall_icon.setAttribute('src', '/images/call/hang-up_56px.svg');
            admin_endusercall_icon.setAttribute('data-uid', this.name);
            admin_endusercall_icon.setAttribute('data-userid', this.user_id);
            admin_endusercall_icon.className = "admin_endusercall_icon";
            admin_endusercall_icon.onclick = function() {
                var userid = $(this).attr('data-userid');
                hangupSpecificMember(userid);
            };
            var admin_endusercall_div = document.createElement('div');
            $(admin_endusercall_div).css('display', 'inline-block');
            admin_endusercall_div.className = "admin_endusercall_div";
            admin_endusercall_div.setAttribute('data-balloon', 'Hangup Participant');
            admin_endusercall_div.setAttribute('data-balloon-pos', 'down');
            container2icon.appendChild(admin_endusercall_div);
            admin_endusercall_div.appendChild(admin_endusercall_icon);
            // }
        }
        // upper participants icons end=====================================================================
        if ($('#' + namept.name).length > 0) { // needed
            if ($('#' + namept.name).parent().attr('id') == 'participants_min') {
                document.getElementById('participants_min').replaceChild(container, $('#' + namept.name)[0]);
            } else {
                document.getElementById('participants').replaceChild(container, $('#' + namept.name)[0]);
            }
        } else {
            document.getElementById('participants').appendChild(container);
        }

        if (namept.screenstatus == 'yes') {
            var loadingtxt = 'Screen sharing...';
            $('#tog_video_img').attr('data-enabled', 'no');
            $('.img_audio_poster[uid="' + this.name + '"]').hide();
            // $('.audio_canvas[uid="' + this.name + '"]').hide();
            $("#video-" + this.name).show();
        } else {
            var loadingtxt = 'Connecting...';
            $('#tog_video_img').attr('data-enabled', 'yes');
        }
        if (user_role == 'moderator' && namept.user_role != 'moderator') {
            $(per_screen_tog_div).show();
            $(admin_endusercall_div).show();
            $('.toggle_screen[data-uid="' + this.name + '"]').show();
            $('.toggle_hangup[data-uid="' + this.name + '"]').show();

        } else {
            $(per_screen_tog_div).hide();
            $(admin_endusercall_div).hide();
            $('.toggle_screen[data-uid="' + this.name + '"]').hide();
            $('.toggle_hangup[data-uid="' + this.name + '"]').hide();
        }

        timervar = null;
        this.countTimer = function() {
            // if ($(timer_div).attr('data-timerstarted') == 'false') {
            $(timer_div).attr('data-timerstarted', 'true');
            // }
        }
        this.stopTimer = function(hangup_id, hangup_name, msg) {
            // if (timervar) clearInterval(timervar);
            $(timer_div).attr('data-timerstarted', 'stop');
            call_end_user_div(this.name, this.user_fullname, hangup_id, hangup_name, msg);
            // update_call_ended_msg();
        }
        this.getElement = function() {
            return container;
        }
        this.getVideoElement = function() {
            return video;
        }
        this.offerToReceiveVideo = function(error, offerSdp, wp) {
            let _this = this;
            if (error) return console.error("webrtc:error:offerTo_ReceiveVideo:" + _this.user_fullname);
            console.log('socket:emit:offerTo_ReceiveVideo:(new)' + user_fullname + '=>' + _this.user_fullname);
            socket.emit('message_voip', {
                id: "receiveVideoFrom",
                // socketid_list: socketid_list,
                user_id: user_id,
                user_fullname: user_fullname,
                sender: this.name,
                sender_name: this.user_fullname,
                sdpOffer: offerSdp,
                conversation_id: conversation_id
            }, function(res) {
                if (!res) {
                    if (_this.name == user_id) {
                        webrtc_timeout = null;
                        if (participants.length > 0 && participants[user_id]) {
                            participants[user_id].dispose('ended', user_id, user_fullname, 5);
                            delete participants[user_id];
                        }
                        registerVoip();
                    }
                } else {
                    console.log('socket:callback:receive_VideoFrom:(new)' + _this.user_fullname);
                }
            });
        }
        this.onIceCandidate = function(candidate, wp) {
            let _this = this;
            // console.log('socket:emit:onIce_Candidate:(new):' + user_fullname + '=>' + _this.user_fullname);
            socket.emit('message_voip', {
                id: 'onIceCandidate',
                // socketid_list: socketid_list,
                candidate: candidate,
                sender: this.name,
                sender_name: this.user_fullname,
                user_id: user_id,
                user_fullname: user_fullname,
                conversation_id: conversation_id
            }, function(res) {
                if (!res) {
                    // console.error('kurento_asdf:onIce_Candidate:', _this.user_fullname, candidate);
                    if (_this.name == user_id) {

                        // $('#chat_container').hide();
                        // $('#call_container_form').hide();
                        // $('#guest_container_form').show();
                        // $('#guest_again_div').hide();
                        // $('#guest_thankyou_div').hide();
                        // $('#guest_msg_span').html('Your connection is lost.');
                        // $('#beforecallicons').hide();
                        // $('#guest_msg_div').show();
                        // closeVideoCall();
                        // webrtc_timeout = null;
                        // if (participants.length > 0 && participants[user_id]) {
                        // 	participants[user_id].dispose('ended', user_id, user_fullname, 5);
                        // 	delete participants[user_id];
                        // }

                        // setTimeout(() => {
                        // 	window.close();
                        // }, 10000);
                    }
                } else {
                    // console.log('kurento:callback:onIce_Candidate:', _this.user_fullname,candidate);
                }

            });
        }
        Object.defineProperty(this, 'rtcPeer', { writable: true });
        this.dispose = function(reloadstatus, hangup_id, hangup_name, msg = null) {
            console.trace('webrtc:dispose:' + this.user_id);
            // //debugger;
            if (reloadstatus != 'switch_server') {
                participants[this.name].stopTimer(hangup_id, hangup_name, msg);
                this.rtcPeer.dispose();
                if (animation_id) cancelAnimationFrame(animation_id);
                return;
            } else {
                if (container.parentNode) {
                    container.parentNode.removeChild(container);
                }
            }
        };
        // $(container).contextmenu(function (e) {
        // 	var uid = $(e.currentTarget).attr('id');

        // 	if ($('#videourl' + uid).css('display') != 'block') {
        // 		var left = e.clientX;
        // 		var top = e.clientY;

        // 		menuBox = window.document.querySelector(".menuVideoContext");
        // 		menuBox.setAttribute('data-uid', uid);
        // 		menuBox.style.left = left + "px";
        // 		menuBox.style.top = top + "px";
        // 		menuBox.style.display = "block";

        // 		e.preventDefault();

        // 		menuDisplayed = true;

        // 	}

        // });
    }
}

function onNewParticipant(request) { // ********


    console.log('xyz:kurento => newParticipantArrived:', request);
    $('.forActive[data-uid="' + request.name + '"]').text('In Call').attr('data-status', 'call');
    receiveVideo({
        name: request.name,
        user_id: request.user_id,
        user_fullname: request.user_fullname,
        user_img: request.user_img,
        join_time: request.join_time,
        call_type_route: request.call_type_route,
        mute_status: request.mute_status,
        hold_status: request.hold_status,
        screenstatus: request.screenstatus,
        media_permission: request.media_permission,
        kurentoIP: request.kurentoIP,
        conversation_id: request.conversation_id,
        user_role: request.user_role
    });
    redrawConf();
    if (request.conversation_type == 'addparticipant' && join_who == 'initiator') {
        if (callList_username.indexOf(request.user_fullname) === -1) {
            callList_username.push(request.user_fullname);
            setCookieCall('callList_username', JSON.stringify(callList_username), 1);
        }
    }
    update_call_ended_msg();

}

function receiveVideoAnswer(result) {
    if (participants[result.name]) {
        participants[result.name].rtcPeer.processAnswer(result.sdpAnswer, function(error) {
            if (error) console.error('webrtc:receiveVideo_Answer => processAnswer', error);
            else {
                console.log('kurento:done:receive_VideoAnswer:(new)' + result.name);
                if (result.name == user_id && call_option == 'window') {
                    $('.init-loader,.txt_main_connecting,.txt_main_connecting_user').hide();
                    $('#participants').css('visibility', 'visible');
                }
                let live_part = Object.keys(participants).length;
                if (live_part > 2) {
                    if (participants[user_id]) participants[user_id].rtcPeer.updateBandwidth(500 / (live_part - 1));
                } else {
                    if (participants[user_id]) participants[user_id].rtcPeer.updateBandwidth(500);
                }
            }
        });
    }

}

function callResponse(message) {
    if (message.response != 'accepted') {
        alert('Call not accepted by peer. Closing call');
        stop();
    } else {
        webRtcPeer.processAnswer(message.sdpAnswer, function(error) {
            if (error) console.error(error);
        });
    }
}

function onExistingParticipants(msg) {
    // alert('onExistingParticipants');
    console.log('kurento:onExisting_Participants:(new) ' + name + " registered in room: " + room);
    is_register = true;
    var constraints = { audio: { deviceId: $('#audioSourceSel').val() } };
    if (getVideoPreviewStatus() == 'off') {
        constraints.video = false;
    } else {
        constraints.video = { deviceId: $('#videoSourceSel').val(), width: 320, height: 240 }
    }
    // $('#screen_share_img').attr('data-status', 'no').attr('src', '/images/call/screen-share-on_48px.svg');
    var participant = new Participant({
        name: name,
        user_id: user_id,
        user_fullname: user_fullname,
        user_img: user_img,
        join_time: msg.join_time,
        call_type_route: msg.call_type_route,
        mute_status: msg.mute_status,
        hold_status: msg.hold_status,
        screenstatus: msg.screenstatus,
        media_permission: msg.media_permission,
        kurentoIP: msg.kurentoIP,
        conversation_id: msg.conversation_id,
        user_role: msg.user_role
    });
    participants[name] = participant;
    var video = participant.getVideoElement();
    var options = {
        localVideo: video,
        mediaConstraints: constraints,
        sendSource: 'webcam',
        configuration: obj_config,
        onicecandidate: participant.onIceCandidate.bind(participant),
    }
    participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, function(error) {
        if (error) {
            console.error('webrtc:error:WebRtcPeer_Sendonly:' + user_fullname);
            if ($('#screen_share_img').attr('data-status') == 'yes') {}
            console.error(error.message);
            console.error(error.name);
            console.error(error.code);
            $('#screen_share_loader').hide();
        } else {
            log('webrtc:created:WebRtcPeer_Sendonly:' + user_fullname);
            this.generateOffer(participant.offerToReceiveVideo.bind(participant));
            networkdown = false;
        }
    });
    redrawConf();
    msg.data.forEach(receiveVideo);
}

function receiveVideo(sender) {
    console.log('kurento:receiveVideo(new):', sender);
    var participant = new Participant(sender);
    participants[sender.user_id] = participant;
    var video = participant.getVideoElement();
    var options = {
        remoteVideo: video,
        onicecandidate: participant.onIceCandidate.bind(participant),
        // sendSource: 'screen',
        configuration: obj_config
    }
    participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, function(error) {
        if (error) {
            console.error('kurento => WebRtcPeer_Recvonly:' + error);
        } else {
            this.generateOffer(participant.offerToReceiveVideo.bind(participant));
            log('webrtc:created:WebRtcPeer_Recvonly:(new):', sender);

        }
    });

    redrawConf();
}

function onParticipantLeft(request) {
    console.log('Participant:Left: ', request);
    if (request.data.reloadstatus && request.data.reloadstatus == 'refresh') {
        $('#video-' + request.name).remove();
        $('.img_audio_poster[uid="' + request.name + '"]').hide();
        $('.txt_user_connecting[uid="' + request.name + '"]').show();
        $('.loadingDiv[data-uid="' + request.name + '"]').addClass('loading-cam');
    } else {
        var participant = participants[request.name];
        if (participant) {
            participant.dispose(request.data.reloadstatus, request.data.hangup_id, request.data.hangup_name, request.data.msg);
            delete participants[request.name];
        }
        let live_part = Object.keys(participants).length;
        if (live_part > 2) {
            if (participants[user_id]) participants[user_id].rtcPeer.updateBandwidth(500 / (live_part - 1));
        } else {
            if (participants[user_id]) participants[user_id].rtcPeer.updateBandwidth(500);
        }
        $('.forActive[data-uid="' + request.name + '"]').text('').attr('data-status', 'no');
    }
    $('#participants').css('visibility', 'visible');
    $('.init-loader,.txt_main_connecting,.txt_main_connecting_user').hide();
    update_call_ended_msg();
    redrawConf();
}
$(document).on("click","#videoSourceSel", function () {
    if($('#videoSourceSel option').length == 1){
        // debugger;
        changeStreamTrack('video');
    }
    
 });
 $(document).on("click","#audioSourceSel", function () {
    if($('#audioSourceSel option').length == 1){
        // debugger;
        changeStreamTrack('audio')
    }
    
 });
 $(document).on("click","#audioOutputSel", function () {
    if($('#audioOutputSel option').length == 1){
        // debugger;
        changeAudioDestination()
    }
    
 });
function gotDevices(deviceInfos) {
    // debugger
    console.log('got_Devices', deviceInfos);

    const valuesReg = selectorsReg.map(select => select.value);
    selectorsReg.forEach(select => { while (select.firstChild) { select.removeChild(select.firstChild); } });
    for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        const option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'audioinput') {
            // alert(deviceInfo.deviceId);
            option.text = deviceInfo.label || `microphone ${audioInputReg.length + 1}`;
            audioInputReg.appendChild(option);
        } else if (deviceInfo.kind === 'audiooutput') {
            option.text = deviceInfo.label || `speaker ${audioOutputSel.length + 1}`;
            audioOutputSel.appendChild(option);
        } else if (deviceInfo.kind === 'videoinput') {
            option.text = deviceInfo.label || `camera ${videoInputReg.length + 1}`;
            videoInputReg.appendChild(option);
        } else {
            console.log('Some other kind of source/device: ', deviceInfo);
        }
    }
    selectorsReg.forEach((select, selectorIndex) => {
        if (Array.prototype.slice.call(select.childNodes).some(n => n.value === valuesReg[selectorIndex])) {
            select.value = valuesReg[selectorIndex];
        }
    });

    var get_status_video = false;
    var get_status_audio = false;
    // //debugger;
    if ($('#videoSourceSel option').length == 0) {
        $('#prev_nocamera_txt').show();
        setVideoPreviewStatus('off');
    } else {
        if (!$('#videoSourceSel').val() && typeof $('#videoSourceSel').val() == 'string') { // no id
            get_status_video = true;
            setVideoPreviewStatus('off');
            setAudioPreviewStatus('off');
            // $('#regDialogOk').hide();
            $('#callRingBtn').css("background-color", "red");
        } else {
            $('#prev_nocamera_txt').hide();
            // $('#regDialogOk').show();
            $('#callRingBtn').css("background-color", "#023d67");
            setVideoPreviewStatus('on');
        }
    }

    if ($('#audioSourceSel option').length == 0) {
        setAudioPreviewStatus('off');
    } else {
        if (!$('#audioSourceSel').val() && typeof $('#audioSourceSel').val() == 'string') {
            get_status_audio = true;
            // $('#regDialogOk').hide();
            $('#callRingBtn').css("background-color", "red");
            setAudioPreviewStatus('off');
        } else {
            // $('#regDialogOk').show();
            $('#callRingBtn').css("background-color", "#023d67");
            setAudioPreviewStatus('on');
        }
    }

    if (call_type_route == 'video') {
        if ($('#videoSourceSel option').length == 0) { // no video source
            setVideoPreviewStatus('off');
            call_type_route = 'audio';
            // $('#regDialogOk').show();
            $('#callRingBtn').css("background-color", "#023d67");
        } else { // video source found
            if (!$('#videoSourceSel').val() && typeof $('#videoSourceSel').val() == 'string') { // no id
                get_status_video = true;
                setVideoPreviewStatus('off');
                setAudioPreviewStatus('off');
                // $('#regDialogOk').hide();
                $('#callRingBtn').css("background-color", "red");

            } else {
                // $('#regDialogOk').show();
                $('#callRingBtn').css("background-color", "#023d67");
                setVideoPreviewStatus('on');
            }
        }
    }
    if (call_type_route == 'audio') {
        setVideoPreviewStatus('off');
        if ($('#audioSourceSel option').length == 0) {
            // $('#regDialogOk').hide();
            $('#callRingBtn').css("background-color", "red");
            setAudioPreviewStatus('off');
        } else {
            if (!$('#audioSourceSel').val() && typeof $('#audioSourceSel').val() == 'string') {
                get_status_audio = true;
                // $('#regDialogOk').hide();
                $('#callRingBtn').css("background-color", "red");
                setAudioPreviewStatus('off');
            } else {
                // $('#regDialogOk').show();
                $('#callRingBtn').css("background-color", "#023d67");
                setAudioPreviewStatus('on');
            }
        }
    }
    if ($('#audioOutputSel option').length > 0) {
        if (isMobile == true || devicetype == 'android') {
            $('#audioOutputSel').attr('disabled', 'disabled');
        } else {
            $('#audioOutputSel').removeAttr('disabled');
        }
    } else {
        $('#audioOutputSel').attr('disabled', 'disabled');
    }

    if (get_status_video == true || get_status_audio == true) { // permission error 
        let constraints_req = {
            audio: get_status_audio,
            video: get_status_video
        };
        navigator.mediaDevices.getUserMedia(constraints_req).then(function(mediaStream) {
            navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
        }).catch(function(err) {
            console.log(err.name + ": " + err.message);
            if (err.name == "NotAllowedError") {
                $('#warningsPopup .warningMsg').text('Permission Error! You must allow camera/microphone access then try to call again.');
                $('#warningsPopup').css('display', 'flex');
            }
        });

    }
    // else if (get_status_audio == null) {
    // 	$('#warningsPopup .warningMsg').text('Microphone not found!'); $('#warningsPopup').css('display', 'flex');
    // 	navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
    // }
    else { // permission ok
        if (getCookieCall('deviceid_video') != '') {
            $('#videoSourceSel option[value="' + getCookieCall('deviceid_video') + '"]').prop('selected', true);
        }
        if (getCookieCall('deviceid_audio') != '') {
            $('#audioSourceSel option[value="' + getCookieCall('deviceid_audio') + '"]').prop('selected', true);
        }
        if (getCookieCall('deviceid_output') != '') {
            $('#audioOutputSel option[value="' + getCookieCall('deviceid_output') + '"]').prop('selected', true);
        }
        // alert(window.name);
        if (call_data.link_type == 'app') { // jjj
            if (typeof callCleanupLogic == 'function' && window.name === 'calling') {
                if (init_id != user_id && conversation_type == 'personal' && call_option == 'window') {
                    ring_guest_call();
                } else {
                    $('#guest_container_form').hide();
                    $('#call_container_form').show();

                    if (isMobile == true || devicetype == 'android') {
                        // $('#audioSourceSel option').prop("selected", false);
                        if (call_type_route == 'audio') {
                            mic2earphone();
                        } else {
                            mic2speaker();
                        }
                        registerVoip();
                    } else {
                        
                        // if (localStorage.getItem('call.setting.window') == null) {
                            showPreviewStream();
                            $('#registerDialogDiv').show().attr('data-reg', 'normal');
                        // } 
                        // else {
                        //     registerVoip();
                        // }
                    }
                }

            } else {
                $('#call_container_form,#guest_thankyou_div, #guest_again_div, #guest_msg_div').hide();
                $('#guest_container_form').show();
            }
        } else { // link visit
            if (user_role != 'guest') { $('#guest_fullname').attr('readonly', 'readonly'); }
            if (guest_status == 'ringing' && typeof callCleanupLogic == 'function' && window.name === 'calling') {
                if (user_role == 'guest') {
                    ring_guest_call();
                } else if (call_running == false) {
                    ring_guest_call();
                } else if (conversation_type == 'personal' && call_option == 'window') {
                    ring_guest_call();
                } else {
                    $('#guest_container_form').hide();
                    $('#call_container_form').show();
                    registerVoip();
                }
            } else { // other status
                updateServiceWorker();
                $('#guest_container_form').hide();
                $('#call_container_form').show();
                showPreviewStream();
                $('#registerDialogDiv').show().attr('data-reg', 'others');
                setTimeout(() => {
                    $('#guest_fullname')[0].focus();
                }, 0);
            }
            // }
        }
    }
}

function registerRejoin() {
    $('#call_container_form').show();
    $('#guest_container_form').hide();
    registerVoip();
}

function registerVoip() { // guest / web / android *************************************
    // //debugger;
    
    localStorage.setItem('call.setting.window', 'yes');
    if ($('#callRingBtn').css("background-color") == "rgb(255, 0, 0)") {
        $('#mediasourceCall').css('display', 'flex');
        return;
    }
    if (getVideoPreviewStatus() == 'on') { setVideoStatus('on'); } else { setVideoStatus('off'); }
    if (getAudioPreviewStatus() == 'on') { setAudioStatus('on'); } else { setAudioStatus('off'); }

    if (typeof callCleanupLogic == 'function' && window.name == 'calling') {
        // if (user_role == 'guest') { alert('Not allowed'); return; }
        $('#registerDialogDiv').hide();
        socket.emit('message_voip', {
            id: 'joinRoom',
            // socketid_list: socketid_list,
            user_role: user_role, // 'participant' / 'guest' / 'moderator' 
            reloadstatus: call_data.reloadstatus, // newconf
            reg_status: 'webcam', // webcam
            isRefresh: get_isrefresh(), // null
            name: name,
            user_id: user_id,
            rootId: user_id,
            rootImg: user_img,
            user_fullname: user_fullname,
            rootFullname: user_fullname,
            user_email: user_email,
            privacy: privacy,
            partner_id: partner_id,
            conference_id: conference_id, // ?
            conversation_id: conversation_id,
            conversation_init: conversation_init,
            conversation_type: conversation_type,
            convname: call_data.convname,
            msgid: msgid, // ?
            repid: repid, // ?
            tabid: tabid, // ?
            arr_participants: arr_participants,
            participants_admin: participants_admin, // ?
            call_type_route: call_type_route,
            call_type_init: call_data.set_calltype,
            tokencount: tokencount,
            join_who: join_who,
            device_type: devicetype,
            jointime: moment.utc().format(),
            mute_status: $('#tog_audio_img').attr('data-status'),
            screenstatus: $('#screen_share_img').attr('data-status'),
            isMobile: isMobile,
            call_data: call_data,
            // allUserdata: access_user_list,
            prev_convid: prev_convid,
            callwaiting: callwaiting, // no
            waiting_running: waiting_running,
            status_type: 'join',
            callRingBtn: $('#callRingBtn').attr('data-type'),
            'close_window': close_window,
            init_id: init_id // ?
        }, function(res) {
            if (res.status == true) {
                $('#beforecallicons').show();
                timerConf = setTimeout(function() {
                    clean_timer_user();
                    $('#chat_container,#call_container_form,#guest_again_div,#guest_thankyou_div').hide();
                    $('#guest_container_form,#guest_msg_div').show();
                    $('#guest_msg_span').html('Connection lost.');
                    $('#beforecallicons').hide();
                    closeVideoCall();
                    if (participants[user_id]) {
                        participants[user_id].dispose('ended', user_id, user_fullname, 5);
                        delete participants[user_id];
                    }
                }, 30000);
                setCookieCall('reloadstatus', 'newconf', 1);
            } else {
                $('#chat_container,#call_container_form,#guest_again_div,#guest_thankyou_div').hide();
                $('#guest_container_form').show();
                if (res.reason == 'load') {
                    $('#guest_msg_span').html('Server is busy. Please try again later.');
                } else {
                    $('#guest_msg_span').html('Call ended. You can close this window.');
                }
                $('#beforecallicons').hide();
                $('#guest_msg_div').show();
                // window.close();
            }
            $('#warningsPopup').css('display', 'none');
        });
    } else {
        check_guest_call();
    }
    // } else {
    // 	$('#warningsPopup').css('display', 'flex');
    // 	$('#warningsPopup .warningMsg').text('Connection lost.');
    // }
}

function check_guest_call() {
    if ($('#guest_fullname').val() != "") {
        user_fullname = $('#guest_fullname').val();
        setCookieCall('call.guest.fullname', user_fullname, 10);

        var ww = screen.availWidth * 0.8;
        var hh = screen.availHeight * 0.8;
        var left = (screen.width / 2) - (ww / 2);
        var top = (screen.height / 2) - (hh / 2);
        win_voip = window.open("", "calling", "width=" + ww + ",height=" + hh + ', top=' + top + ', left=' + left);

        socket.emit('get_isbusy_guest', {
            name: name, // uid
            user_id: user_id,
            rootId: user_id,
            guestId: user_id,
            user_email: user_email,
            user_role: user_role,
            rootImg: user_img,
            conversation_id: conversation_id,
            conference_id: conference_id,
            tabid: tabid,
            msgid: msgid,
            repid: repid,
            user_fullname: user_fullname,
            rootFullname: user_fullname,
            arr_participants: arr_participants,
            participants_admin: participants_admin,
            conversation_init: conversation_init,
            conversation_type: 'guest',
            convname: call_data.convname,
            call_type_route: call_type_route,
            reloadstatus: 'newconf',
            isRefresh: null,
            reg_status: 'webcam',
            callwaiting: 'no',
            tokencount: tokencount,
            guest_status: 'ringing',
            privacy: privacy,
            // allUserdata: access_user_list
        }, function(cbdata) {
            console.log('ring_Call_guset', cbdata);
            // //debugger;
            // call_clear_guest();
            if (cbdata.status == true) {
                $('#call_container_form,#guest_again_div,#guest_msg_div').hide();
                $('#guest_container_form,#guest_thankyou_div,#guest_thankyou_btn').show();
                win_voip.location.href = '/call/' + conference_id + '/' + call_type_route + '/guest';
                stopPreview_all();
                socket.close();
            } else {
                win_voip.close();
                if (cbdata.reason == 'offline') {
                    $('#warningsPopup .warningMsg').text('Sorry! Conference members are offline.');
                } else if (cbdata.reason == 'timeout') {
                    $('#warningsPopup .warningMsg').text('Timeout! Please try again after a moment.');
                } else if (cbdata.reason == 'busy') {
                    $('#warningsPopup .warningMsg').text('Sorry! You are busy in another call.');
                } else if (cbdata.reason == 'pipeline') {
                    $('#warningsPopup .warningMsg').text('Sorry! Room is busy, Please try again after a moment.');
                } else if (cbdata.reason == 'another') {
                    $('#warningsPopup .warningMsg').text('Sorry! User is busy in another call.');
                }
                $('#warningsPopup').css('display', 'flex');
            }
        });

    } else {
        $('#warningsPopup').css('display', 'flex');
        $('#warningsPopup .warningMsg').text('Please enter your name.');
    }
    // } else {
    // 	alert('Please check network!');
    // }
}

function ring_guest_call() {
    $('#call_container_form,#guest_thankyou_div,#guest_again_div').hide();
    $('#guest_container_form,#guest_msg_div').show();
    $('#callRingBtn').attr('data-join', 'direct');
    socket.emit('ringCallGuest', {
        rootId: user_id,
        guestId: user_id,
        user_id: user_id,
        call_option: 'ring',
        msg_body: 'video',
        set_calltype: call_type_route,
        call_type_route: call_type_route,
        sender_img: user_img,
        sender_name: user_fullname,
        name: name, // uid
        user_role: user_role,
        call_running: call_running,
        rootImg: user_img,
        conversation_id: conversation_id,
        conference_id: conference_id,
        tabid: tabid,
        msgid: msgid,
        repid: repid,
        user_fullname: user_fullname,
        rootFullname: user_fullname,
        room_name: user_fullname,
        arr_participants: arr_participants,
        conversation_init: conversation_init,
        conversation_type: 'guest',
        convname: call_data.convname,
        reloadstatus: 'newconf',
        isRefresh: null,
        reg_status: 'webcam',
        callwaiting: 'no',
        tokencount: tokencount,
        guest_status: 'ringing',
        privacy: privacy,
        // allUserdata: access_user_list,
        participants_admin: participants_admin,
        participants_all: participants_all
    }, function(cbdata) {
        if (cbdata) {
            $('#guest_msg_span').text('Requesting Access...');
            $('#guest_again_div,#guest_thankyou_div').hide();
            $('#call_container_form').hide();
            $('#guest_container_form,#guest_msg_div').show();
        } else {
            $('#guest_msg_span').text('Request Denied...');
            $('#guest_again_div,#guest_thankyou_div').hide();
            $('#call_container_form').hide();
            $('#guest_container_form,#guest_msg_div').show();

        }
    });
}
var handlelv = setInterval(function() {
    if (document.getElementById("leftVideo").readyState == 4) {
        clearInterval(handlelv);
        document.getElementById('leftVideo').play();
        // document.getElementById('leftAudio').play();
        navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
    }
}, 1);
// **************************************************************************************
// attachment
var countFiles = (action, type) => {
    if (action == 'add') {
        filesCount = (parseInt(filesCount) + 1);
        $('#conversationFileView').text('Files (' + filesCount + ')');
    }
}

function show_noti(event) {
    $("#prepar_download").show();
}
var activethisimg = (curimg, imgsn, img, msgBody, original_name) => {
    window.open(curimg);
    // var name = curimg.split('/');
    // var unixt = Number(name[name.length-1].substring(name[name.length-1].lastIndexOf('%') + 1, name[name.length-1].lastIndexOf('.')));
    // if(! unixt > 0)
    // 	unixt = Number(name[name.length-1].substring(name[name.length-1].lastIndexOf('@') + 1, name[name.length-1].lastIndexOf('.')));
    // $('.image-popup-slider').find('.currentimg').attr('src', curimg);
    // $('.image-popup-slider').find('.shared-by-user-photo>img').attr('src', file_server +'profile-pic/Photos/' + img);
    // $('.image-popup-slider').find('.shared-by-user-photo').remove();
    // var newsplitimg = curimg.split('/');
    // var imgorginalnamesplit = newsplitimg[newsplitimg.length - 1].split('@');
    // var thisimgext = imgorginalnamesplit[imgorginalnamesplit.length - 1].split('.');
    // thisimgext = thisimgext[thisimgext.length - 1];
    // imgorginalnamesplit[imgorginalnamesplit.length - 1] = '.'+thisimgext;
    // imgorginalnamesplit = imgorginalnamesplit.join('');

    // $('.image-popup-slider').find('.shared-by-user-details>h3').html(original_name);

    // $('.image-popup-slider').find('.shared-by-user-details>p').html('Uploaded by '+ imgsn +' on ' + moment(unixt).format('MMMM Do YYYY @ h:mm a'));
    // $('.image-popup-slider').find('.show-picture-comment>p').html(msgBody);
    // $('.image-popup-slider').find('.slide-image-download').attr('data-href', curimg);
    // $('.image-popup-slider').find('.slide-image-share').attr('data-value', curimg);
    // $('.slider-footer-all-images img').removeClass('active');
    // $.each($('.slider-footer-all-images img'), function (k, v) {
    // 	if ($(v).attr('src') == curimg)
    // 		$(v).addClass('active');
    // });
    // reset_zoom();
    // // call_panzoom();
};

function copyShareLink(elm) {
    $('#shareLink').select();
    document.execCommand("copy");
    closeModal('shareLinkPop');
}

function viewShreImgPop(e, elm) {
    // if($('#threadReplyPopUp').is(':visible')){
    // 	$('#shareLinkPop').attr('thread-view',true);
    // 	$('#threadReplyPopUp').hide();
    // }else{
    // 	$('#shareLinkPop').attr('thread-view',false);
    // }
    e.preventDefault();
    e.stopImmediatePropagation();
    var value = $(elm).attr('data-value')
    $('#shareLinkPop').show();
    $('#shareLink').html(value);
    $('#shareLink').focus();
    $('#shareLink').select();
}
// function reset_zoom(){
// 	$('#zoomer').val(1);
// 	$('#mediaFilePreview .currentimg').css({'transform':'unset', 'top':'unset', 'left':'unset'});
// }
function changeZoomerVal(type) {
    if (type == 'max') {
        $('#zoomer').val(Number($('#zoomer').val()) + 0.3);
        deepdive();

    } else if (type == 'min') {
        $('#zoomer').val((Number($('#zoomer').val()) - 0.3));
        if (Number($('#zoomer').val()) == 1) reset_zoom();
        deepdive();

    }
}

function viewImgHov(ele, type) {
    // threadReplyPopUp
    // if($('#threadReplyPopUp').is(':visible')){
    // 	$('#mediaFilePreview').attr('thread-view',true);
    // 	$('#threadReplyPopUp').hide();
    // }else{
    // 	$('#mediaFilePreview').attr('thread-view',false);
    // }
    $('#zoomer').val(1);
    // $('#mediaFilePreview .currentimg').css('transform','unset')
    if (type == 'message') {
        $(ele).parents('.msg_per_img_div').find('.img_attach').trigger('click');
        if ($(ele).parents('.msg_per_img_div').length == 0) {
            $(ele).parents('.fil_attach.attach-file').find('.file-name').trigger('click');
        }
    } else if (type == 'mediaImg') {
        $(ele).parents('.all-images').find('.img-name').trigger('click');
    }
    // call_panzoom();
}
var convert = (str) => {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    var text1 = str.replace(exp, "<a target='_blank' href='$1'>$1</a>");
    var exp2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    return text1.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>');
};
var removeloader = (event) => {
    $(event.target).closest('.msg_per_img_div').find('.imgLoader').remove();
};
var msgimgload = (event) => {
    $(event.target).css({ "width": "unset", "height": "unset" });
};
var per_msg_img_attachment = (msg_attach_img, sender_name, sender_img, data_msg, totalattachLength) => {
    if (totalattachLength == undefined) {
        totalattachLength = 0;
    }
    var html = "";
    var strWindowFeatures = "menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=600,height=400";
    var n = totalattachLength + 1;
    $.each(msg_attach_img, function(k, v) {
        var namespl = v.split('/');
        var fileName = namespl[namespl.length - 1];
        var extspl = fileName.split('.');
        var f_ext = extspl[extspl.length - 1];
        var org_namespl = fileName.split('@');
        var originalname = org_namespl[0] + '.' + f_ext;
        var is_hide = false;
        var id = "";
        var divkeyclass = "";
        var filesize = 0;
        for (var i = 0; i < per_conv_all_files.length; i++) {
            if (v == per_conv_all_files[i].bucket + '/' + per_conv_all_files[i].key) {
                if (per_conv_all_files[i].voriginalName != undefined) {
                    originalname = per_conv_all_files[i].voriginalName;
                } else {

                    originalname = per_conv_all_files[i].originalname;
                }
                id = per_conv_all_files[i].key;
                divkeyclass = per_conv_all_files[i].key.replace(/[^\w\s]/gi, '');
                is_hide = per_conv_all_files[i].is_delete == 1 ? true : false;
                filesize = per_conv_all_files[i].file_size == undefined ? per_conv_all_files[i].size : per_conv_all_files[i].file_size;
            }
        }
        var hidethis = n > 4 ? "hidden" : "";
        let imgFilesSize = bytesToSize2(filesize);
        if (is_hide) {
            html += '<div class="msg_per_img_div perimgsl_' + n + ' ' + hidethis + '" data-img="true">';
            // html += '<p style="font-size:16px; color:#F00; padding:30px;word-break: break-word;">'+ originalname +' has been deleted by Account Admin ('+ sender_name +')</p>';
            html += '<p style="font-size:16px; color:#F00; padding:30px;word-break: break-word;"></p>';
        } else {
            html += '<div data-file-src="' + file_server + v + '" class="calling_file_src msg_per_img_div progressImg perimgsl_' + n + ' ' + hidethis + ' ' + divkeyclass + '" data-img="true">';
            html += '<img class="img_attach blazy" style="max-width:250px; max-height:200px" src="" data-fileid="' + id + '" data-src="' + file_server + v + '" data-originalname="' + originalname + '" data-msg="" data-sender_name="' + sender_name + '" data-sender_img="' + sender_img + '" data-filesize="' + imgFilesSize + '" onclick="showImageSliderCall(event, this, \'' + imgFilesSize + '\')" data-o="aa">';
            // html += '</div>';
            html += '<div class="meter" style="width:0%" data-value="0">'
            html += '</div>';
        }
        html += '</div>';
        var modeval = hidethis == "" ? 4 : 5;
        // if(msg_attach_img.length > 4){
        // 		html += '<div data-length="'+msg_attach_img.length+'" class="msg_per_img_div viewAllFiles showmore_'+n+' '+hidethis+'" onclick="loadnext8(this, '+n+');" style="cursor:pointer">';
        // 		html +=		'<br>Show All ('+ (msg_attach_img.length) +')';
        // 		html += '</div>';
        //
        // }
        n++;
        countFiles('add', 'img');
    });
    return html;
}
var per_msg_img_attachment_without_inview = (msg_attach_img, sender_name, sender_img, data_msg, ) => {
    var html = "";
    var strWindowFeatures = "menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=600,height=400";
    var n = 1;
    $.each(msg_attach_img, function(k, v) {
        var namespl = v.split('/');
        var fileName = namespl[namespl.length - 1];
        var extspl = fileName.split('.');
        var f_ext = extspl[extspl.length - 1];
        var org_namespl = fileName.split('@');
        var originalname = org_namespl[0] + '.' + f_ext;
        var is_hide = false;
        var id = "";
        var divkeyclass = "";
        var filesize = 0;
        var file_tbl_id = '';
        for (var i = 0; i < per_conv_all_files.length; i++) {
            if (v == per_conv_all_files[i].bucket + '/' + per_conv_all_files[i].key) {
                if (per_conv_all_files[i].voriginalName != undefined) {
                    originalname = per_conv_all_files[i].voriginalName;
                } else {

                    originalname = per_conv_all_files[i].originalname;
                }
                id = per_conv_all_files[i].key;
                file_tbl_id = per_conv_all_files[i].id;
                filesize = per_conv_all_files[i].file_size == undefined ? per_conv_all_files[i].size : per_conv_all_files[i].file_size;
                divkeyclass = per_conv_all_files[i].key.replace(/[^\w\s]/gi, '');
                is_hide = per_conv_all_files[i].is_delete == 1 ? true : false;
            }
        }
        let imgFileSize = bytesToSize2(filesize);
        var hidethis = n > 4 ? "hidden" : "";
        if (is_hide) {
            html += '<div class="msg_per_img_div perimgsl_' + n + ' ' + hidethis + '" data-img="true">';
            // html += '<p style="font-size:16px; color:#F00; padding:30px;word-break: break-word;">'+ originalname +' has been deleted by Account Admin ('+ sender_name +')</p>';
            html += '<p style="font-size:16px; color:#F00; padding:30px;word-break: break-word;"></p>';
        } else {
            html += '<div data-file-src="' + file_server + v + '" class="calling_file_src msg_per_img_div perimgsl_' + n + ' ' + hidethis + ' ' + divkeyclass + '" data-img="true">';
            html += '<img class="img_attach blazy" style="max-width:250px; max-height:200px" data-fileid="' + id + '" src="' + file_server + v + '" data-originalname="' + originalname + '" data-msg="' + data_msg + '" data-sender_name="' + sender_name + '" data-sender_img="' + sender_img + '" onclick="showImageSliderCall(event, this, \'' + imgFileSize + '\')" data-filesize="' + imgFileSize + '">';
            html += '<div class="file-name"><span class="name_span file_title_' + file_tbl_id + '">' + originalname + '</span><span class="fileSize">' + imgFileSize + '</span></div>';
            html += '<div class="per_img_hover_opt">';
            html += '<p class="img_action view_ico" onclick="viewImgHov(this,\'message\')" data-balloon="Preview" data-balloon-pos="up" data-originalname="' + originalname + '"></p>';
            html += '<p class="img_action download_ico" data-balloon="Download" data-balloon-pos="up">';
            //html +=         	'<a download="'+ originalname +'" onclick="show_noti(event)" href="/alpha2/download/' + id +'" target="_blank" href="' + file_server + v + '">';
            // html +=             '<img src="/images/basicAssets/Download.svg" alt=""/>';
            //html +=             '</a>';
            html += '</p>';
            // html += 		'<p class="img_action tag_ico" data-balloon="Tag" data-balloon-pos="up"  onclick="viewTagForFiles(this)"><img style="width:16px;" src="/images/basicAssets/custom_not_tag.svg" alt=""/></p>';
            html += '<p class="img_action forward_ico" data-balloon="forward" data-balloon-pos="up"  onclick="forwardOneFileFun(event,this)" data-id="' + file_tbl_id + '"><img style="width:16px;" src="/images/basicAssets/shareHayven_white.svg" alt=""/></p>';
            html += '<p class="img_action shareimg share_ico" data-balloon="Share" data-balloon-pos="up" onclick="viewShreImgPop(event,this)" data-value="' + file_server + v + '"></p>';
            html += '</div>';
            html += '<div class="meter" style="width:0%" data-value="0">'
            html += '</div>';
        }
        html += '</div>';
        var modeval = hidethis == "" ? 4 : 5;
        // if(msg_attach_img.length > 4){
        // 	html += '<div data-length="'+msg_attach_img.length+'" class="msg_per_img_div viewAllFiles showmore_'+n+' '+hidethis+'" onclick="loadnext8(this, '+n+');" style="cursor:pointer">';
        // 	html +=		'<br>Show All ('+ (msg_attach_img.length) +')';
        // 	html += '</div>';
        // }
        n++;
        countFiles('add', 'img');
    });
    return html;
}
var per_msg_video_attachment = (msg_attach_video, sender_name, totalattachLength) => {
        if (totalattachLength == undefined) {
            totalattachLength = 0
        }
        var n = totalattachLength + 1;
        var html = "";
        $.each(msg_attach_video, function(k, v) {
            var namespl = v.split('/')[v.split('/').length - 1];
            namespl = namespl.split('@');
            if (namespl.length > 2) {
                removeA(namespl, namespl[namespl.length - 1]);
            } else {
                namespl = namespl[0];
            }

            var classV = namespl + Date.now();
            classV = classV.replace(/[\s&\/\\@#,+()$~%.'":*?<>{}]/g, '');

            var file_type = v.split('.').pop().toLowerCase();

            var is_hide = false;
            var originalname = "";
            var divkeyclass = "";
            var filesize = 0;
            var id = "";
            var file_tbl_id = "";
            for (var i = 0; i < per_conv_all_files.length; i++) {
                if (v == per_conv_all_files[i].bucket + '/' + per_conv_all_files[i].key) {
                    if (per_conv_all_files[i].voriginalName != undefined) {
                        originalname = per_conv_all_files[i].voriginalName;
                    } else {

                        originalname = per_conv_all_files[i].originalname;
                    }
                    id = per_conv_all_files[i].key;
                    file_tbl_id = per_conv_all_files[i].id;
                    originalname = per_conv_all_files[i].originalname;
                    //is_hide = per_conv_all_files[i].is_delete == 1 ? true : false;
                    divkeyclass = per_conv_all_files[i].key.replace(/[^\w\s]/gi, '');
                    filesize = per_conv_all_files[i].file_size == undefined ? per_conv_all_files[i].size : per_conv_all_files[i].file_size;
                }
            }

            if (is_hide) {
                html += '<div class="msg_per_img_div fil_attach attach-file lightbox" >';
                // html += '<p style="font-size:16px; color:#F00; padding:30px;word-break: break-word;">'+ originalname +' has been deleted by Account Admin ('+ sender_name +')</p>';
                html += '<p style="font-size:16px; color:#F00; padding:30px;word-break: break-word;"></p>';
                html += '</div>';
            } else {
                // if(file_type.indexOf('avi') > -1){
                html += '<div data-file-src="' + file_server + v + '" class="calling_file_src ' + divkeyclass + '">';
                // } else{
                // html += '<div data-file-src="' + file_server + v + '" class="calling_file_src video_container '+ divkeyclass +'">';
                // }

                // if(file_type.indexOf('avi') > -1){
                html += '<div class="fil_attach attach-file lightbox" data-sender_name="' + sender_name + '" data-filetype="video/' + file_type + '" data-src="' + file_server + v + '" data-file_name="' + v + '">';
                html += '	<img onclick="triggerFileCall(this)" src="/images/basicAssets/' + file_type + '.svg">';
                html += '	<div class="file-name" onclick="triggerViewCall(this)">';
                html += '		<span class="name_span file_title_' + file_tbl_id + '">' + originalname + '</span>';
                html += '		<span class="fileSize">' + bytesToSize2(filesize) + '</span>';
                html += '	</div>';

                // }

                // if(file_type.indexOf('avi') > -1){
                html += '<div class="per_img_hover_opt">';
                // html += 		'<p class="img_action view_ico" on-click="downloadFilePopup(this,\'frmMsg\')" data-href="' + file_server + v + '" file-name="'+originalname +'" data-balloon="Preview" data-balloon-pos="up">';
                // html +=				'<img src="/images/basicAssets/view.svg" alt=""/>';
                //html += 			'<a download target="_blank" class="download_link" href="' + file_server + v + '" style="display:none"></a>';
                // html +=			'</p>';
                // html += 		'<p class="img_action download_ico" data-balloon="Download" data-balloon-pos="up">';
                //html += 		'	<a download="'+originalname +'" onclick="show_noti(event)" target="_blank" href="/alpha2/download/' + id + '" >';
                // html += 		'		<img src="/images/basicAssets/Download.svg" alt=""/>';
                //html += 		'	</a>';
                // html += 		'</p>';
                // html += 		'<p class="img_action tag_ico" data-balloon="Tag" data-balloon-pos="up"  onclick="viewTagForFiles(this)"><img style="width:16px;" src="/images/basicAssets/custom_not_tag.svg" alt=""/></p>';
                html += '<p class="img_action forward_ico" data-balloon="forward" data-balloon-pos="up"  onclick="forwardOneFileFun(event,this)" data-id="' + file_tbl_id + '"><img style="width:16px;" src="/images/basicAssets/shareHayven_white.svg" alt=""/></p>';
                html += '<p class="img_action shareimg share_ico" data-balloon="Share" data-balloon-pos="up" onclick="viewShreImgPop(event,this)" data-value="' + file_server + v + '"></p>';
                html += '</div>';

                html += '</div>';
                // }
                html += '</div>';
                countFiles('add', 'video');
                var url2 = file_server + v;
                var data = {
                        url: url2,
                        cls: classV
                    }
                    // fileSizeStore.push(data);
            }
        });

        return html;
    }
    // var per_msg_file_attachment = (msg_attach_file, sender_name, totalattachLength) => {
    // 	if (totalattachLength == undefined) {
    // 		totalattachLength = 0;
    // 	}
    // 	var html = "";
    // 	var n = totalattachLength + 1;
    // 	$.each(msg_attach_file, function (k, v) {
    // 		// var hidethis = n>4?"hidden":"";
    // 		var hidethis = "";
    // 		var file_type = v.split('.').pop().toLowerCase();
    // 		var is_img = false;
    // 		switch (file_type) {
    // 			case 'ai':
    // 			case 'apk':
    // 			case 'mp3':
    // 			case 'avi':
    // 			case 'mp4':
    // 			case 'wmv':
    // 			case 'mkv':
    // 			case 'm4v':
    // 			case 'mpg':
    // 			case 'doc':
    // 			case 'docx':
    // 			case 'exe':
    // 			case 'indd':
    // 			case 'js':
    // 			case 'sql':
    // 			case 'pdf':
    // 			case 'ppt':
    // 			case 'pptx':
    // 			case 'psd':
    // 			case 'xls':
    // 			case 'xlsx':
    // 			case 'zip':
    // 			case 'rar':
    // 				ext = file_type;
    // 				break;
    // 			case 'jpg':
    // 			case 'jpeg':
    // 			case 'gif':
    // 			case 'png':
    // 			case 'svg':
    // 				ext = file_type;
    // 				is_img = true;
    // 				break;
    // 			default:
    // 				ext = 'other';
    // 		}
    // 		var namespl = v.split('/');
    // 		var fileName = namespl[namespl.length - 1];
    // 		var extspl = fileName.split('.');
    // 		var f_ext = extspl[extspl.length - 1];
    // 		var org_namespl = fileName.split('@');
    // 		var originalname = org_namespl[0] + '.' + f_ext;
    // 		// var thisfilename = v.substring(0, v.lastIndexOf('@'));
    // 		// thisfilename = thisfilename.substring(thisfilename.lastIndexOf('/')+1);
    // 		var classN = originalname + Date.now();
    // 		classN2 = classN.replace(/[\s&\/\\@#,+()$~%.'":*?<>{}]/g, '');
    // 		// html += '<a href="' + file_server + v + '" target="_blank">';

// 		var is_hide = false;
// 		var id = "";
// 		var divkeyclass = "";
// 		var filesize = 0;
// 		var file_tbl_id = '';
// 		for (var i = 0; i < per_conv_all_files.length; i++) {
// 			if (v == per_conv_all_files[i].bucket + '/' + per_conv_all_files[i].key) {
// 				if (per_conv_all_files[i].voriginalName != undefined) {
// 					originalname = per_conv_all_files[i].voriginalName;
// 				} else {

// 					originalname = per_conv_all_files[i].originalname;
// 				}
// 				originalname = per_conv_all_files[i].originalname;
// 				id = per_conv_all_files[i].key;
// 				file_tbl_id = per_conv_all_files[i].id;
// 				is_hide = per_conv_all_files[i].is_delete == 1 ? true : false;
// 				divkeyclass = per_conv_all_files[i].key.replace(/[^\w\s]/gi, '');
// 				filesize = per_conv_all_files[i].file_size == undefined ? per_conv_all_files[i].size : per_conv_all_files[i].file_size;
// 			}
// 		}

// 		if (is_hide) {
// 			html += '<div class="msg_per_img_div fil_attach attach-file lightbox ' + hidethis + '">';
// 			// html += '<p style="font-size:16px; color:#F00; padding:30px;word-break: break-word;">'+ originalname +' has been deleted by Account Admin ('+ sender_name +')</p>';
// 			html += '<p style="font-size:16px; color:#F00; padding:30px;word-break: break-word;"></p>';
// 			html += '</div>';
// 		} else {
// 			html += '<div data-file-src="' + file_server + v + '" class="calling_file_src fil_attach attach-file lightbox ' + divkeyclass + ' perfiles_' + n + ' ' + hidethis + '" data-sender_name="' + sender_name + '" data-filetype="' + ext + '" data-src="' + file_server + v + '" data-file_name="' + v + '">';
// 			if (is_img)
// 				html += '<img onclick="showImageSliderCall(event)" src="' + file_server + v + '" data-src="' + file_server + v + '" alt="' + originalname + '">';
// 			else
// 				html += '<img onclick="triggerFileCall(this)" src="/images/basicAssets/' + ext + '.svg" alt="' + v + '">';
// 			html += '<div class="file-name" onclick="' + (is_img ? 'showImageSliderCall(event)' : 'triggerViewCall(this)') + '" data-src="' + file_server + v + '"><div class="name_span file_title_' + file_tbl_id + '">' + originalname + '</div><div class="fileSize">' + bytesToSize2(filesize) + '</div></div>';
// 			html += '	<div class="file-time">' + moment().format('h:mm a') + '</div>';
// 			html += '	<div class="per_img_hover_opt" style="display: flex;">';
// 			if (ext == 'pdf') {
// 				html += '<p class="img_action view_ico" file-type="pdf" data-balloon="Preview" data-balloon-pos="up">';
// 				//html += 			'<a download target="_blank" href="' + file_server + v + '">';
// 				// html += 				'<img src="/images/basicAssets/view.svg" alt=""/>';
// 				//html += 			'</a>';
// 				html += '</p>';
// 			} else {
// 				html += '<p class="img_action view_ico" on-click="' + (is_img ? 'viewImgHov(this,\'message\')' : 'downloadFilePopup(this,\'frmMsg\')') + '" data-href="' + file_server + v + '" file-name="' + originalname + '" data-balloon="Preview" data-balloon-pos="up">';
// 				// html +=			'<img src="/images/basicAssets/view.svg" alt=""/>';
// 				//html += 			'<a download target="_blank" class="download_link" href="' + file_server + v + '" style="display:none">';
// 				//html += 			'</a>';
// 				html += '</p>';
// 			}
// 			if (ext == 'pdf' || ext == 'mp3' || ext == 'zip') {
// 				html += '<p class="img_action download_ico" file-name="' + originalname + '" data-balloon="Download" data-balloon-pos="up">';
// 				html += '	<a target="_blank" onclick="show_noti(event)" href="/alpha2/download/' + id + '" >';
// 				html += '		<img src="/images/basicAssets/Download.svg" alt=""/>';
// 				html += '	</a>';
// 				html += '</p>';
// 			} else {
// 				html += '<p class="img_action download_ico" data-balloon="Download" data-balloon-pos="up">';
// 				//html += 		'	<a download="'+originalname +'" target="_blank" href="' + file_server + v + '" style="">';
// 				//html += 		'		<img src="/images/basicAssets/Download.svg" alt=""/>';
// 				//html += 		'	</a>';
// 				html += '</p>';
// 			}
// 			// html += 		'<p class="img_action tag_ico" data-balloon="Tag" data-balloon-pos="up"  onclick="viewTagForFiles(this)"><img style="width:16px;" src="/images/basicAssets/custom_not_tag.svg" alt=""/></p>';
// 			html += '<p class="img_action shareimg share_ico" data-balloon="Share" data-balloon-pos="up" onclick="viewShreImgPop(event,this)" data-value="' + file_server + v + '"></p>';
// 			html += '</div>';

// 			html += '</div>';
// 			html += '<div class="shareIcon share_ico"  data-balloon="Share" data-balloon-pos="up" onclick="viewShreImgPop(event,this)" data-value="' + file_server + v + '"></div>';
// 		}
// 		var modeval = hidethis == "" ? 4 : 5;
// 		// if(msg_attach_file.length > 4){
// 		// 	html += '<div class="msg_per_img_div viewAllFiles showmore_'+n+' '+hidethis+'" onclick="loadnext8(this, '+n+');" style="cursor:pointer">';
// 		// 	html +=		'<br>Show All ('+ (msg_attach_file.length) +')';
// 		// 	html += '</div>';
// 		// }
// 		n++;
// 		// html += '</a>';
// 		countFiles('add', 'file');
// 		var url2 = file_server + v;
// 		var data = {
// 			url: url2,
// 			cls: classN2
// 		}
// 		// fileSizeStore.push(data);
// 	});
// 	return html;
// };
function triggerFile(ele) {
    var url = $(ele).parents('.fil_attach').find('.per_img_hover_opt .img_action[data-href]').attr('data-href');
    var pdf = $(ele).parents('.fil_attach').find('.per_img_hover_opt .img_action[file-type="pdf"]');
    if (pdf.length == 1) {
        console.log(1);
        url = $(ele).parents('.fil_attach').find('.per_img_hover_opt .img_action.share_ico').attr('data-value')
        window.open(url);
    } else {
        console.log(2)
        $(ele).parents('.fil_attach').find('.per_img_hover_opt .img_action[data-balloon="Preview"]').trigger('click');
    }
}
var per_msg_file_attachment = (msg_attach_file, sender_name, totalattachLength) => {
    if (totalattachLength == undefined) {
        totalattachLength = 0;
    }
    var html = "";
    var n = totalattachLength + 1;
    $.each(msg_attach_file, function(k, v) {
        // var hidethis = n>4?"hidden":"";
        var hidethis = "";
        var file_type = v.split('.').pop().toLowerCase();
        var is_img = false;
        switch (file_type) {
            case 'ai':
            case 'apk':
            case 'mp3':
            case 'avi':
            case 'mp4':
            case 'wmv':
            case 'mkv':
            case 'm4v':
            case 'mpg':
            case 'doc':
            case 'docx':
            case 'exe':
            case 'indd':
            case 'js':
            case 'sql':
            case 'pdf':
            case 'ppt':
            case 'pptx':
            case 'psd':
            case 'xls':
            case 'xlsx':
            case 'zip':
            case 'rar':
                ext = file_type;
                break;
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'png':
            case 'svg':
                ext = file_type;
                is_img = true;
                break;
            default:
                ext = 'other';
        }
        var namespl = v.split('/');
        var fileName = namespl[namespl.length - 1];
        var extspl = fileName.split('.');
        var f_ext = extspl[extspl.length - 1];
        var org_namespl = fileName.split('@');
        var originalname = org_namespl[0] + '.' + f_ext;
        // var thisfilename = v.substring(0, v.lastIndexOf('@'));
        // thisfilename = thisfilename.substring(thisfilename.lastIndexOf('/')+1);
        var classN = originalname + Date.now();
        classN2 = classN.replace(/[\s&\/\\@#,+()$~%.'":*?<>{}]/g, '');
        // html += '<a href="' + file_server + v + '" target="_blank">';

        var is_hide = false;
        var id = "";
        var divkeyclass = "";
        var filesize = 0;
        var file_tbl_id = '';
        for (var i = 0; i < per_conv_all_files.length; i++) {
            if (v == per_conv_all_files[i].bucket + '/' + per_conv_all_files[i].key) {
                if (per_conv_all_files[i].voriginalName != undefined) {
                    originalname = per_conv_all_files[i].voriginalName;
                } else {

                    originalname = per_conv_all_files[i].originalname;
                }
                originalname = per_conv_all_files[i].originalname;
                id = per_conv_all_files[i].key;
                file_tbl_id = per_conv_all_files[i].id;
                is_hide = per_conv_all_files[i].is_delete == 1 ? true : false;
                divkeyclass = per_conv_all_files[i].key.replace(/[^\w\s]/gi, '');
                filesize = per_conv_all_files[i].file_size == undefined ? per_conv_all_files[i].size : per_conv_all_files[i].file_size;
            }
        }
        let imgSizeMsg = bytesToSize2(filesize);
        if (is_hide) {
            html += '<div class="msg_per_img_div lightbox ' + hidethis + '" data-status="deleted">';
            // html += '<p style="font-size:16px; color:#F00; padding:30px;word-break: break-word;">'+ originalname +' has been deleted by Account Admin ('+ sender_name +')</p>';
            // html += '<p style="font-size:16px; color:#F00; padding:30px;word-break: break-word;">';
            html += '<img class="img_attach" style="max-width:100%; max-height:200px" src="' + file_server + 'common/file-removed-message.png">';
            // html += '</p>';
            html += '</div>';
        } else {
            html += '<div class="fil_attach attach-file lightbox ' + divkeyclass + ' perfiles_' + n + ' ' + hidethis + '" data-sender_name="' + sender_name + '" data-filetype="' + ext + '" data-src="' + file_server + v + '" data-file_name="' + v + '">';
            if (is_img)
                html += '<img onclick="showImageSlider(event, this, \'' + imgSizeMsg + '\')" src="' + file_server + v + '" data-src="' + file_server + v + '" alt="' + originalname + '" data-filesize="' + imgSizeMsg + '">';
            else
                html += '<img onclick="triggerFile(this)" src="/images/basicAssets/' + ext + '.svg" alt="' + v + '">';
            html += '<div class="file-name" onclick="' + (is_img ? 'showImageSlider(event, this, \'' + imgSizeMsg + '\')' : 'triggerViewCall(this)') + '" data-src="' + file_server + v + '" data-filesize="' + imgSizeMsg + '" data-originalname="' + originalname + '">><div class="name_span file_title_' + file_tbl_id + '" data-original="' + originalname + '">' + originalname + '</div><div class="fileSize">' + imgSizeMsg + '</div></div>';
            html += '	<div class="file-time">' + moment().format('h:mm a') + '</div>';
            html += '	<div class="per_img_hover_opt" style="display: flex;">';
            if (ext == 'pdf') {
                html += '<p class="img_action view_ico" file-type="pdf" data-balloon="Preview" data-balloon-pos="up">';
                html += '<a download href="' + file_server + v + '">';
                // html += 				'<img src="/images/basicAssets/view.svg" alt=""/>';
                html += '</a>';
                html += '</p>';
            } else {
                html += '<p class="img_action view_ico" onclick="' + (is_img ? 'viewImgHov(this,\'message\')' : 'downloadFilePopup(this,\'frmMsg\')') + '" data-href="' + file_server + v + '" file-name="' + originalname + '" data-balloon="Preview" data-balloon-pos="up">';
                // html +=			'<img src="/images/basicAssets/view.svg" alt=""/>';
                html += '<a download class="download_link" href="' + file_server + v + '" style="display:none">';
                html += '</a>';
                html += '</p>';
            }
            if (ext == 'pdf' || ext == 'mp3' || ext == 'zip') {
                html += '<p class="img_action download_ico" file-name="' + originalname + '" data-balloon="Download" data-balloon-pos="up">';
                html += '	<a target="_blank" onclick="show_noti(event)" href="/alpha2/download/' + id + '" >';
                html += '		<img src="/images/basicAssets/Download.svg" alt=""/>';
                html += '	</a>';
                html += '</p>';
            } else {
                html += '<p class="img_action download_ico" data-balloon="Download" data-balloon-pos="up">';
                html += '	<a download="' + originalname + '" href="' + file_server + v + '" style="">';
                html += '		<img src="/images/basicAssets/Download.svg" alt=""/>';
                html += '	</a>';
                html += '</p>';
            }
            // html += 		'<p class="img_action tag_ico" data-balloon="Tag" data-balloon-pos="up"  onclick="viewTagForFiles(this)"><img style="width:16px;" src="/images/basicAssets/custom_not_tag.svg" alt=""/></p>';
            html += '<p class="img_action forward_ico" data-balloon="forward" data-balloon-pos="up"  onclick="forwardOneFileFun(event,this)" data-id="' + file_tbl_id + '"><img style="width:16px;" src="/images/basicAssets/shareHayven_white.svg" alt=""/></p>';
            html += '<p class="img_action shareimg share_ico" data-balloon="Share" data-balloon-pos="up" onclick="viewShreImgPop(event,this)" data-value="' + file_server + v + '"></p>';
            if (sender_name == user_fullname)
                html += '<p class="img_action deleteitem delete_ico" data-balloon="Delete" data-balloon-pos="up" onclick="deleteItem(event, \'other\')" data-value="' + file_server + v + '"></p>';
            html += '</div>';

            html += '</div>';
            html += '<div class="shareIcon share_ico"  data-balloon="Share" data-balloon-pos="up" onclick="viewShreImgPop(event,this)" data-value="' + file_server + v + '"></div>';
        }
        var modeval = hidethis == "" ? 4 : 5;
        // if(msg_attach_file.length > 4){
        // 	html += '<div class="msg_per_img_div viewAllFiles showmore_'+n+' '+hidethis+'" onclick="loadnext8(this, '+n+');" style="cursor:pointer">';
        // 	html +=		'<br>Show All ('+ (msg_attach_file.length) +')';
        // 	html += '</div>';
        // }
        n++;
        // html += '</a>';
        countFiles('add', 'file');
        var url2 = file_server + v;
        var data = {
                url: url2,
                cls: classN2
            }
            // fileSizeStore.push(data);
    });
    // if(totalattachLength == undefined){
    // 	totalattachLength = 0;
    // }
    // var html = "";
    // var n = totalattachLength +1;
    // $.each(msg_attach_file, function (k, v) {
    // 	var hidethis = n>4?"hidden":"";
    // 	var file_type = v.split('.').pop().toLowerCase();
    // 	switch (file_type) {
    // 		case 'ai':
    // 		case 'apk':
    // 		case 'mp3':
    // 		case 'doc':
    // 		case 'docx':
    // 		case 'exe':
    // 		case 'indd':
    // 		case 'js':
    // 		case 'sql':
    // 		case 'pdf':
    // 		case 'ppt':
    // 		case 'pptx':
    // 		case 'psd':
    // 		case 'svg':
    // 		case 'xls':
    // 		case 'xlsx':
    // 		case 'zip':
    // 		case 'rar':
    // 			ext = file_type;
    // 			break;
    // 		default:
    // 			ext = 'other';
    // 	}
    // 	var namespl = v.split('/');
    // 	var fileName = namespl[namespl.length - 1];
    // 	var extspl = fileName.split('.');
    // 	var f_ext = extspl[extspl.length - 1];
    // 	var org_namespl = fileName.split('@');
    // 	var originalname = org_namespl[0] + '.' + f_ext;
    // 	// var thisfilename = v.substring(0, v.lastIndexOf('@'));
    // 	// thisfilename = thisfilename.substring(thisfilename.lastIndexOf('/')+1);
    // 	var classN = originalname + Date.now();
    // 	classN2 = classN.replace(/[\s&\/\\@#,+()$~%.'":*?<>{}]/g, '');
    // 	// html += '<a href="' + file_server + v + '" target="_blank">';

    // 	var is_hide = true;
    // 	var id = "";
    // 	var divkeyclass = "";
    // 	var filesize = 0;
    // 	var file_tbl_id = '';
    // 	for(var i=0; i<per_conv_all_files.length; i++){
    // 		if(v == per_conv_all_files[i].bucket+'/'+per_conv_all_files[i].key){
    // 			if(per_conv_all_files[i].voriginalName != undefined){
    // 				originalname = per_conv_all_files[i].voriginalName;
    // 			}else{

    // 				originalname = per_conv_all_files[i].originalname;
    // 			}
    // 			originalname = per_conv_all_files[i].originalname;
    // 			id = per_conv_all_files[i].key;
    // 			file_tbl_id = per_conv_all_files[i].id;
    // 			is_hide = per_conv_all_files[i].is_delete == 1 ? true : false;
    // 			divkeyclass = per_conv_all_files[i].key.replace(/[^\w\s]/gi, '');
    // 			filesize = per_conv_all_files[i].file_size == undefined ? per_conv_all_files[i].size : per_conv_all_files[i].file_size;
    // 		}
    // 	}

    // 	if(is_hide){
    // 		html += '<div class="msg_per_img_div fil_attach attach-file lightbox '+hidethis+'">';
    // 		// html += '<p style="font-size:16px; color:#F00; padding:30px;word-break: break-word;">'+ originalname +' has been deleted by Account Admin ('+ sender_name +')</p>';
    // 		html += '<p style="font-size:16px; color:#F00; padding:30px;word-break: break-word;"></p>';
    // 		html += '</div>';
    // 	}else{
    // 		html += '<div class="fil_attach attach-file lightbox '+ divkeyclass +' perfiles_'+n+' '+hidethis+'" data-sender_name="'+sender_name+'" data-filetype="' + ext + '" data-src="' + file_server + v + '" data-file_name="' + v + '">';
    // 		html += '<img onclick="triggerFile(this)" src="/images/basicAssets/' + ext + '.svg" alt="' + v + '">';
    // 		html += '<div class="file-name"><span class="name_span file_title_'+file_tbl_id+'">' + originalname + '</span><span class="fileSize">'+ bytesToSize2(filesize) +'</span></div>';
    // 		html += '<div class="file-time">' + moment().format('h:mm a') + '</div>';
    // 		html  += '<div class="per_img_hover_opt" style="display: flex;">';
    // 		if (ext == 'pdf') {
    // 		html += 		'<p class="img_action view_ico" file-type="pdf" data-balloon="Preview" data-balloon-pos="up">';
    // 		html += 			'<a download target="_blank" href="' + file_server + v + '">';
    // 		// html += 				'<img src="/images/basicAssets/view.svg" alt=""/>';
    // 		html += 			'</a>';
    // 		html += 		'</p>';
    // 		}else{
    // 		html += 		'<p class="img_action view_ico" onclick="downloadFilePopup(this,\'frmMsg\')" data-href="' + file_server + v + '" file-name="'+originalname +'" data-balloon="Preview" data-balloon-pos="up">';
    // 		// html +=			'<img src="/images/basicAssets/view.svg" alt=""/>';
    // 		html += 			'<a download target="_blank" class="download_link" href="' + file_server + v + '" style="display:none">';
    // 		html += 			'</a>';
    // 		html += 		'</p>';
    // 		}
    // 		if( ext == 'pdf' || ext == 'mp3' || ext == 'zip'){
    // 		html += 		'<p class="img_action download_ico" file-name="'+originalname +'" data-balloon="Download" data-balloon-pos="up">';
    // 		html += 		'	<a target="_blank" onclick="show_noti(event)" href="/alpha2/download/' +id +'" >';
    // 		html += 		'		<img src="/images/basicAssets/Download.svg" alt=""/>';
    // 		html += 		'	</a>';
    // 		html += 		'</p>';
    // 		}else{
    // 		html += 		'<p class="img_action download_ico" data-balloon="Download" data-balloon-pos="up">';
    // 		html += 		'	<a download="'+originalname +'" target="_blank" href="' + file_server + v + '" style="">';
    // 		html += 		'		<img src="/images/basicAssets/Download.svg" alt=""/>';
    // 		html += 		'	</a>';
    // 		html += 		'</p>';
    // 		}
    // 		html += 		'<p class="img_action tag_ico" data-balloon="Tag" data-balloon-pos="up"  onclick="viewTagForFiles(this)"><img style="width:16px;" src="/images/basicAssets/custom_not_tag.svg" alt=""/></p>';
    // 		html += 		'<p class="img_action shareimg share_ico" data-balloon="Share" data-balloon-pos="up" onclick="viewShreImgPop(event,this)" data-value="' + file_server + v + '"></p>';
    // 		html += 	'</div>';

    // 		html += '</div>';
    // 		html += '<div class="shareIcon share_ico"  data-balloon="Share" data-balloon-pos="up" onclick="viewShreImgPop(event,this)" data-value="'+ file_server + v + '"></div>';
    // 	}
    // 	var modeval = hidethis==""?4:5;
    // 	// if(msg_attach_file.length > 4){
    // 	// 	html += '<div class="msg_per_img_div viewAllFiles showmore_'+n+' '+hidethis+'" onclick="loadnext8(this, '+n+');" style="cursor:pointer">';
    // 	// 	html +=		'<br>Show All ('+ (msg_attach_file.length) +')';
    // 	// 	html += '</div>';
    // 	// }
    // 	n++;
    // 	// html += '</a>';
    // 	countFiles('add','file');
    // 	var url2 = file_server + v;
    // 	var data ={
    // 		url: url2,
    // 		cls: classN2
    // 	}
    // 	// fileSizeStore.push(data);
    // });
    return html;
};
var per_msg_rep_btn = (count, rep_time, rep_name, msg_type) => {
    var html = "";
    html += '<div class="msgReply" >';
    html += '<div class="groupImg">';
    for (var i = 0; i < count; i++)
        html += '<img src="/images/users/img.png">';
    html += '</div>';
    html += '<div class="countReply">';

    if (msg_type == "call") {
        html += '<img src="/images/basicAssets/custom_thread_for_reply.svg" onclick="threadReply(event)">';
        html += '<p onclick="threadReply(event)">In-call chat history (<span class="no-of-replies" >' + count + '</span>)</p>';
    } else {
        html += '<img src="/images/basicAssets/custom_thread_for_reply.svg" onclick="threadReply(event)">';
        html += '<p onclick="threadReply(event)">View threaded chat (<span class="no-of-replies" >' + count + '</span>)</p>';
    }

    html += '<img class="replyarrow" src="/images/basicAssets/custom_rightChevron_for_reply.svg" onclick="threadReply(event)">';
    html += '<span class="last_rep_text"> Last reply ' + moment(rep_time).fromNow() + ' from ' + rep_name + '</span>';
    html += '</div>';
    html += '</div>';
    return html;
}
var make_it_youtube_object = (event) => {
    var url = $(event.target).closest('.msgs-form-users').find('a').attr('href');
    url = url.replace("watch?v=", "embed/");
    var html = '<iframe width="560" height="315" src="' + url + '?autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    $(event.target).closest('.msgs-form-users').find('.youtube_container').html(html);
};
var isURL = (str) => {
    var url_pattern = new RegExp("(www.|http://|https://|ftp://)\w*");
    if (!url_pattern.test(str)) {
        return false;
    } else
        return true;
};

function messageEllipsis(msg_id, type) {
    if (type == 'reply') {
        var msg_thread = $('.rep_msg_' + msg_id).find('.updatedTextOriginal');
        $.each(msg_thread, function(k, v) {
            var text = $(v).find('.msg_historyBody').html();
            if (text != undefined) {
                // console.log(3082,text)
                text = text.replace(/<script([\S\s]*?)>([\S\s]*?)<\/script>/ig, "");
                $(v).find('.msg_historyBody').html(text);
            }
        });
        var msg_thread = $('.rep_msg_' + msg_id).find('.updatedTextOriginal');

        $.each(msg_thread, function(k, v) {
            if ($(v).height() > 66) {
                if (!$(v).hasClass('ellipsis_active')) {
                    $(v).addClass('ellipsis_active');
                    $(v).find('.lastUpdateTime').before('<div class="showMoreEditedmsg" onclick="showEditFullMsg(\'' + msg_id + '\',this)"> + Show full message</div>')
                }

            }
        })
    } else {
        var msg_thread = $('#msgThread_' + msg_id).find('.updatedTextOriginal');
        $.each(msg_thread, function(k, v) {
            var text = $(v).find('.msg_historyBody').html();
            if (text != undefined) {
                // console.log(3082,text)
                text = text.replace(/<script([\S\s]*?)>([\S\s]*?)<\/script>/ig, "");
                $(v).find('.msg_historyBody').html(text);
            }
        });
        var msg_thread = $('#msgThread_' + msg_id).find('.updatedTextOriginal');

        $.each(msg_thread, function(k, v) {
            if ($(v).height() > 66) {
                if (!$(v).hasClass('ellipsis_active')) {
                    $(v).addClass('ellipsis_active');
                    $(v).find('.lastUpdateTime').before('<div class="showMoreEditedmsg" onclick="showEditFullMsg(\'' + msg_id + '\',this)"> + Show full message</div>')
                }

            }
        })
    }


}

function bytesToSize2(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    var size = Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    return size;
}

function findObjForUser(value) {
    for (var i = 0; i < user_list.length; i++) {
        if (user_list[i]['id'] === value) {
            if (user_list[i].login_total == null) {
                user_list[i].login_total = 0;
            }
            var userData = {
                    email: user_list[i].email,
                    fullname: user_list[i].fullname,
                    id: user_list[i].id,
                    img: user_list[i].img,
                    designation: user_list[i].designation,
                    createdat: user_list[i].createdat,
                    conference_id: user_list[i].conference_id,
                    login_total: user_list[i].login_total

                }
                // if(user_list[i].id == user_id){
                // 	userData.fullname = 'You';
                // }
            return userData;
        }
    }
    return false;
}
var draw_rep_msg = (row, recentdraw = false) => {
    // //debugger;
    console.log('draw_rep__msg', row);
    /* Start Date Group By */
    var msg_date = moment(row.created_at).calendar(null, {
        sameDay: '[Today]',
        lastDay: '[Yesterday]',
        lastWeek: function(now) { return '[' + this.format("MMM Do, YYYY") + ']'; },
        sameElse: function(now) { return '[' + this.format("MMM Do, YYYY") + ']'; }
    });
    var temp_date = msg_date;
    if ($('#threadReplyPopUp').is(':visible')) {
        if ($('#threadReplyPopUp').attr('thread_root') == undefined || $('#threadReplyPopUp').attr('thread_root') == '') {
            $('#threadReplyPopUp').attr('thread_root', row.conversation_id)
        }
    }
    // if (append) {
    $.each($('.replies-container .msg-separetor'), function(k, v) {
        if ($(v).text() == msg_date) {
            msg_date = null;
            return 0;
        }
    });
    // && $('.replies-container .msg-separetor-unread').length == 0
    if (msg_date !== null) {
        var date_html = '<div class="msg-separetor" data-date="' + msg_date + '"><p>' + msg_date + '</p></div>';
        $("#threadReplyPopUp .replies-container").append(date_html);
    }
    // }

    var msg_append = true;
    var msg_deleted = false;

    if (row.has_delete != null) {
        if (row.has_delete.indexOf('delete_for_all') == -1) {
            if (row.has_delete.indexOf(user_id) > -1) {
                msg_deleted = true;
            }
        } else {
            msg_deleted = true;
        }
    }
    if (row.has_hide != null) {
        if (row.has_hide.indexOf(user_id) > -1) {
            msg_append = false;
        }
    }
    var has_title = findObjForUser(row.sender).fullname;
    if (row.sender == user_id) {
        has_title = "You";
    }
    if (msg_deleted) {
        row.msg_body = '<i><img src="/images/delete_msg.png" class="deleteicon"> ' + has_title + ' deleted this message.</i><span onclick="permanent_delete_silently(\'' + row.msg_id + '\')" class="silent_delete"> (Remove this line)</span>';
        // row.msg_body = '<i><img src="/images/delete_msg.png" class="deleteicon"> '+has_title+' deleted this message.</i>';
    }
    // var isiturl = isURL(row.msg_body);
    if (row.attch_imgfile == null) {
        row.attch_imgfile = [];
    }
    if (row.attch_videofile == null) {
        row.attch_videofile = [];
    }
    if (row.attch_otherfile == null) {
        row.attch_otherfile = [];
    }
    var isiturl = false;
    var html = '<div class="main-thread-msgs rep_msg_' + row.msg_id + '" >';
    html += '<div class="thread-user-photo">';
    html += '<img class="user_img' + row.sender + '" src="' + file_server + 'profile-pic/Photos/' + row.sender_img + '" alt="">';
    html += '</div>';
    html += '<div class="thread-user-msg">';
    html += '<h4 class="user_name' + row.sender + '">' + row.sender_name + '&nbsp;<span class="thread-msg-time">' + moment(row.created_at).format('h:mm a') + '</span></h4>';
    if (msg_deleted) {
        html += '<p>' + row.msg_body + '</p>'
    } else {
        // if (row.msg_body == 'No Comments')
        // 	html += '<div class="reaplied_text" id="data_msg_body_rep'+row.msg_id+'"> </div>';
        // else
        if (row.attch_imgfile.length > 0 || row.attch_videofile.length > 0 || row.attch_otherfile.length > 0) {
            if (row.edit_history != null) {
                html += returnedithistoryDesignrep(row.edit_history, row, 'reaplied_text');
            } else {

                if (isiturl) {
                    html += '<div class="reaplied_text" id="data_msg_body_rep' + row.msg_id + '"><a style="text-decoration: none;" href="' + row.msg_body + '" target="_blank">' + row.msg_body + '</a></div>';
                } else {
                    html += '<div class="reaplied_text" id="data_msg_body_rep' + row.msg_id + '">' + row.msg_body + '</div>';
                }
            }
        } else {
            if (row.edit_history != null) {
                html += returnedithistoryDesignrep(row.edit_history, row, 'reaplied_text');
            } else {

                if (row.msg_body.indexOf('thread_chk_item') == -1) {
                    if (isiturl) {
                        html += '<div class="reaplied_text" id="data_msg_body_rep' + row.msg_id + '"><a style="text-decoration: none;" href="' + row.msg_body + '" target="_blank">' + row.msg_body + '</a></div>';
                    } else {
                        html += '<div class="reaplied_text" id="data_msg_body_rep' + row.msg_id + '">' + row.msg_body + '</div>';
                    }
                } else {
                    var thread_chk_item = row.msg_body.match(/<p class="thread_chk_item">([^\<]*?)<\/p>/g);
                    var msg_body = row.msg_body.split(thread_chk_item)[row.msg_body.split(thread_chk_item).length - 1];

                    html += '' + thread_chk_item + '';
                    if (isiturl) {
                        html += '<div class="reaplied_text" id="data_msg_body_rep' + row.msg_id + '"><a style="text-decoration: none;" href="' + msg_body + '" target="_blank">' + row.msg_body + '</a></div>';
                    } else {
                        html += '<div class="reaplied_text" id="data_msg_body_rep' + row.msg_id + '">' + msg_body + '</div>';
                    }
                }
            }
        }

        var multi_type_file = 0;
        if (row.attch_imgfile === null || row.attch_imgfile.length == 0)
            row.attch_imgfile = [];
        else multi_type_file = row.attch_imgfile.length;
        if (row.attch_videofile === null || row.attch_videofile.length == 0)
            row.attch_videofile = [];
        else multi_type_file += row.attch_videofile.length;
        if (row.attch_audiofile === null || row.attch_audiofile.length == 0)
            row.attch_audiofile = [];
        else multi_type_file++;
        if (row.attch_otherfile === null || row.attch_otherfile.length == 0)
            row.attch_otherfile = [];
        else multi_type_file++;

        var totalattachLength = 0;

        if (row.attch_videofile !== null) {
            if (multi_type_file == 1)
                html += per_msg_video_attachment(row.attch_videofile);
            else {
                html += per_msg_file_attachment(row.attch_videofile, user_id_to_fullname[row.sender], totalattachLength);
                totalattachLength += row.attch_videofile.length;
            }
        }
        if (row.attch_imgfile != null) {
            if (recentdraw) {
                if (multi_type_file == row.attch_imgfile.length)
                    html += per_msg_img_attachment_without_inview(row.attch_imgfile, row.sender_name, row.sender_img);
                else {
                    html += per_msg_file_attachment(row.attch_imgfile, user_id_to_fullname[row.sender], totalattachLength);
                    totalattachLength += row.attch_imgfile.length;
                }
            } else {
                if (multi_type_file == row.attch_imgfile.length) {
                    html += per_msg_img_attachment(row.attch_imgfile, user_id_to_fullname[row.sender], user_id_to_img[row.sender], row.msg_body, totalattachLength);
                    totalattachLength += row.attch_imgfile.length;
                } else {
                    html += per_msg_file_attachment(row.attch_imgfile, user_id_to_fullname[row.sender], totalattachLength);
                    totalattachLength += row.attch_imgfile.length;
                }
            }
        }
        if (row.attch_audiofile !== null) {
            // html += per_msg_audio_attachment(row.attch_audiofile);
            html += per_msg_file_attachment(row.attch_audiofile, user_id_to_fullname[row.sender], totalattachLength);
            totalattachLength += row.attch_audiofile.length;
        }
        if (row.attch_otherfile !== null) {
            html += per_msg_file_attachment(row.attch_otherfile, user_id_to_fullname[row.sender], totalattachLength);
            totalattachLength += row.attch_otherfile.length;
        }
    }
    html += '</div>';
    if (!msg_deleted) {
        html += '<div class="msgs-form-users-options">';
        if (row.sender == user_id) {
            html += '<div class="hovOption editmsg" onclick="editReplyMsg(this)" data-id="' + row.msg_id + '" data-balloon="Edit Reply" data-balloon-pos="up"></div>';
        }

        // html +=		'<div style="display:none" class="tagOP" data-balloon="Add a Tag" data-balloon-pos="left" onclick="viewMessageTag(this)" msg-id="'+row.msg_id+'"></div>';
        html += '<div class="hovOption deletemsg" created-by="' + row.sender + '" msg-id="' + row.msg_id + '" onclick="deleteThreadMsg(this)" data-balloon="Delete Reply" data-balloon-pos="up"></div>';
        html += '</div>';
    }
    html += '</div>';
    if (msg_append) {

        $('#threadReplyPopUp .replies-container').append(html);
    }
    var containerHeight = $(".replies-container").height();
    // $('.forScrollBar .os-viewport').animate({ scrollTop: containerHeight }, 1);
    // scrollToBottom('#repChatContainer');
    // $('#repChatContainer').scrollTop($('#repChatContainer')[0].scrollHeight);
    messageEllipsis(row.msg_id, 'reply');
}

function createTextLinks_(text) {

    return (text || "").replace(
        /([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi,
        function(match, space, url) {
            var hyperlink = url;
            if (!hyperlink.match('^https?:\/\/')) {
                hyperlink = 'http://' + hyperlink;
            }
            hyperlink = hyperlink.replace(/&nbsp;/gi, '');
            return space + '<a href="' + hyperlink + '" target="_blank" data-preview="true">' + url + '</a>';
        }
    );

};

function create_file_link(text) {
    // return text.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:.{3,4})/gi);
    return text.match(/(?:www|https?)[^\s]+/gi);
}

function toggleRaiseHand() {
    if ($('.mute_hand_server[uid="' + user_id + '"]').is(':visible') == false) {
        var is_hand = true;
    } else {
        var is_hand = false;
    }
    socket.emit('socket_tog_raise_hand', {
        conversation_id: conversation_id,
        is_hand: is_hand,
        uid: user_id
    }, function() {});

}
var rep_msg_send_fn_call = () => {
    // //debugger;
    var str = $('#msg_rep').html();
    str = str.replace(/<script([\S\s]*?)>([\S\s]*?)<\/script>/ig, '$1');
    // str = str.replace(/(<\/?(?:img|br)[^>]*>)|<[^>]+>/ig, '$1'); // replace all html tag
    str = createTextLinks_(str);
    // }
    var dt = $('#define_thread_text').text();

    if (str != "") {
        if (dt != '') {
            str = '<p class="thread_chk_item">' + dt + '</p>' + str;
        }
        $('#define_thread_text').text('');
        var is_room = (conversation_type == 'group') ? true : false;
        // if (ishand == false) {
        $(".Chat_File_Upload").closest('form').trigger("reset");
        $("#FileComment").html("");
        $("#attach_chat_file_list").html("");
        // }

        // if($('.msg_id_'+thread_root_id).length > 0)
        var convid = conversation_id;
        // else
        // var convid = $('#threadReplyPopUp .main-thread-msgs').find('.thread-user-msg').attr('data-rep_con_id');
        if (!thread_id) { alert('Not allowed'); return; }
        socket.emit('send_rep_message_call', {
            conversation_id: thread_id,
            sender_img: user_img,
            sender_name: user_fullname,
            to: to,
            is_room: is_room,
            text: str,
            attach_files: filedata[0],
            thread_root_id: convid,
            root_msg_id: thread_root_id,
            secret_user: threadReplySecrectuser,
            msg_status: threadReplyMsgStatus,
            user_id: user_id
        }, function(cbdata) {
            console.log('send_rep_message__call', cbdata);
        });

        // if (ishand == false) {
        if (allfiles.length > 0) {
            $.each(allfiles, function(k, v) {
                v['conversation_id'] = convid;
                per_conv_all_files.push(v);
            });
            // console.log(1096,per_conv_all_files);
            // socket.emit('update_files_data', { conversation_id: thread_id, update_conv: convid }, function (res) {
            // 	socket.emit('conv_files_added', per_conv_all_files);
            // 	allfiles = [];
            // 	// console.log(1100, res);
            // });
        }
        // }
        // var img = filedata[0].imgfile.length;
        // var audio = filedata[0].audiofile.length;
        // var other = filedata[0].otherfile.length ;
        // var video = filedata[0].videofile.length ;
        // if(img > 0 || audio > 0 || other > 0 || video > 0){
        //     var dataLgn = Number(img+audio+other+video);

        //     socket.emit('update_repAttch_count', { msg_id: thread_root_id, conversation_id: convid, has_rep_attachment: dataLgn }, function(data) {
        //         if (data.has_rep_attachment > 1) {
        //             $('.msg_id_'+thread_root_id+'').find('.count_rep_attch_').text(+data.has_rep_attachment+' attachment(s)');
        //         }else{
        //             $('.msg_id_'+thread_root_id+'').find('.count_rep_attch_').text(+data.has_rep_attachment+' attachment');
        //         }
        //     });

        // }

        socket.emit('update_thread_count', { msg_id: thread_root_id, conversation_id: convid, last_reply_name: user_fullname });
        local_conv_update_thread_count(convid, thread_root_id, 'You');
        draw_rep_count(thread_root_id, 'You');
        // if(allfiles.length>0){
        //     $.each(allfiles, function(k, v){
        //         v['conversation_id'] = convid;
        //         per_conv_all_files.push(v);
        //     });
        //     socket.emit('update_files_data', {conversation_id: thread_id, update_conv: convid}, function(res){
        //         socket.emit('conv_files_added', per_conv_all_files);
        //         allfiles = [];
        //         console.log(929, res);
        //     });
        // }
        // if (ishand == false) {
        filedata.length = 0;
        filedata = [];
        audiofile.length = 0;
        audiofile = [];
        imgfile.length = 0;
        imgfile = [];
        otherfile.length = 0;
        otherfile = [];
        videofile.length = 0;
        videofile = [];
        formDataTemp.length = 0;
        formDataTemp = [];

        $("#msg_rep").html("");

        // } else {
        // 	if ($('#chat_container').is(":visible") == false) {
        // 		openChatShare();
        // 	}
        // }
        $("#msg_rep").focus();
    }
};
var typing = false;
var draw_rep_typing_indicator = (add_remove, img, name) => {
    if (add_remove) {
        if ($('.rep-typing-indicator').html() == "") {
            $('.rep-typing-indicator').html(name + '&nbsp;<span>is typing....</span>');
        }
    } else {
        $('.rep-typing-indicator').html("");
    }
};

function showvideourl(element) {
    var uid = $(element).closest('.menuVideoContext').attr('data-uid');

    socket.emit('voip_get_rtpUrl', {
        user_id: uid,
        conversation_id: conversation_id
    }, function(data) {
        // alert(data);
        if (data) {
            $('#videourl' + uid).show();
            $('#videourl' + uid + ' input').val('rtmp://' + location.hostname + data).focus();

            $('.menuVideoContext').hide();
        } else {
            alert('URL not ready yet.');
        }
    });
}

function getAVConstraints() {
    if (getVideoStatus() == 'on') { // video is on
        var video_const = { deviceId: getCookieCall('deviceid_video'), width: 320, height: 240 }
    } else { // video is off
        var video_const = false;
    }

    var audio_const = { deviceId: getCookieCall('deviceid_audio') };

    return { video: video_const, audio: audio_const }
}

function videoUrlClose(element) {
    $(element).closest('.video-url-container').hide();
}

function triggerFileCall(ele) {
    var child = window.open($(ele).parents('.calling_file_src').attr('data-file-src'), '_blank');

}

function triggerViewCall(ele) {
    var child = window.open($(ele).parents('.calling_file_src').attr('data-file-src'), '_blank');

}
var showImageSliderCall = (event) => {
    // var child = window.open($(event.target).parents('.calling_file_src').attr('data-file-src'), '_blank');
    $('#fileup_img_preview').attr('src', $(event.target).parents('.calling_file_src').attr('data-file-src'));
    $('#fileup_img_preview_div').show();

};

function close_delete_attach() {
    $("#delete_attach").hide();
    $('.delete_msg_div').removeAttr('style').removeClass('ui-draggable').removeClass('ui-draggable-handle');
}

function deleteItem(event, type) {
    $("#delete_attach").css('display', 'flex');
    var location = $(event.target).attr("data-value").replace(file_server, "");
    // var msgid = $(event.target).closest(".msgs-form-users").attr("data-msgid");
    // if(typeof msgid === 'undefined'){
    // 	var msgid = $(event.target).attr("msg-id");
    // }
    console.log(1628, msgid, type, location);
    $("#delete_attach").attr("data-msgid", msgid);
    $("#delete_attach").attr("data-location", location);
    $("#delete_attach").attr("data-type", type);
}

function delete_attach() {
    console.log('delete_attach')
    var msgid = $("#delete_attach").attr("data-msgid");
    var location = [$("#delete_attach").attr("data-location")];
    var type = $("#delete_attach").attr("data-type");
    switch (type) {
        case "img":
            var files = { "imgfile": location };
            break;
        case "video":
            var files = { "videofile": location };
            break;
        case "audio":
            var files = { "audiofile": location };
            break;
        case "other":
            var files = { "otherfile": location };
            break;
    }
    socket.emit("delete_attach", { msgid, attach_files: files, need_id: true, type: type }, (res) => {
        // console.log(1615, res);
        if (res.status) {
            // drawDeleteText(msgid)
            
            close_delete_attach();
            var filename_for_unlink = location[0];
            var bucket_name = filename_for_unlink.substring(0, filename_for_unlink.indexOf("/"));
            var attch_list = JSON.stringify([filename_for_unlink.substring(filename_for_unlink.indexOf("/") + 1)]);
            $.ajax({
                url: "/s3Local/deleteObjects",
                type: "POST",
                data: { bucket_name, attch_list },
                dataType: 'json',
                beforeSend: function() {
                    console.log(1683, bucket_name, attch_list);
                },
                success: function(res) {
                    console.log(location[0], $('tr[data-location="' + location[0] + '"]'))
                    $('tr[data-location="' + location[0] + '"]').remove();
                    console.log("Unlink successfully", res);
                },
                error: function(e) {
                    console.log("Error in unlink: ", e);
                }
            });
            // if(type == 'img'){
            // 	$.each($(".msg_id_"+msgid).find(".msg_per_img_div .img_attach"), function(k, v){
            // 		// console.log(1641, v);
            // 		// console.log(1642, file_server + location[0]);
            // 		if($(v).attr('src') == file_server + location[0]){
            // 			$(this).closest(".msg_per_img_div").attr("data-status", "deleted").html('<img class="img_attach" style="width:100%; max-height:200px" src="'+ file_server +'common/file-removed-message.png">');
            // 		}
            // 	});
            // 	if($("#mediaFilePreview").css("display") == 'block'){
            // 		$.each($(".all-images"), function(k,v){
            // 			if($(v).attr("data-src") == file_server + location[0]){
            // 				if($(this).closest('.date-by-images').children().length == 2){
            // 					$(this).closest('.date-by-images').remove();
            // 				}else{
            // 					$(this).remove();
            // 				}
            // 			}
            // 		});
            // 		reduce_counter("mediaImgsTab", "Images");
            // 	}
            // }
            // else if(type == 'video'){
            // 	$.each($(".msg_id_"+msgid).find(".video_container .lightbox "), function(k, v){
            // 		if($(v).attr('data-src') == file_server + location[0]){
            // 			$(this).closest(".video_container").addClass("msg_per_img_div").removeClass("video_container").attr("data-status", "deleted").html('<img class="img_attach" style="width:100%; max-height:200px" src="'+ file_server +'common/file-removed-message.png">');
            // 		}
            // 	});
            // 	if($("#mediaFilePreview").css("display") == 'block'){
            // 		$.each($(".all-videos"), function(k,v){
            // 			if($(v).find(".hyvenCheckbox").attr("data") == file_server + location[0]){
            // 				if($(this).closest('.date-by-videos').children().length == 2){
            // 					$(this).closest('.date-by-videos').remove();
            // 				}else{
            // 					$(this).remove();
            // 				}
            // 			}
            // 		});
            // 		reduce_counter("mediaViedeosTab", "Videos");
            // 	}
            // }
            // else if(type == 'other' || type == 'audio'){
            // 	$.each($(".msg_id_"+msgid).find(".fil_attach"), function(k, v){
            // 		if($(v).attr('data-src') == file_server + location[0]){
            // 			$(this).closest(".fil_attach").addClass("msg_per_img_div").removeClass("fil_attach").attr("data-status", "deleted").html('<img class="img_attach" style="width:100%; max-height:200px" src="'+ file_server +'common/file-removed-message.png">');
            // 		}
            // 	});
            // 	if($("#mediaFilePreview").css("display") == 'block'){
            // 		if(type == 'audio'){
            // 			$.each($(".all-audios"), function(k,v){
            // 				if($(v).find(".hyvenCheckbox").attr("data") == file_server + location[0]){
            // 					if($(this).closest('.date-by-audios').children().length == 2){
            // 						$(this).closest('.date-by-audios').remove();
            // 					}else{
            // 						$(this).remove();
            // 					}
            // 				}
            // 			});
            // 			reduce_counter("mediaAudiosTab", "Audios");
            // 		}else{
            // 			$.each($(".all-files"), function(k,v){
            // 				if($(v).attr("data-src") == file_server + location[0]){
            // 					if($(this).closest('.date-by-files').children().length == 2){
            // 						$(this).closest('.date-by-files').remove();
            // 					}else{
            // 						$(this).remove();
            // 					}
            // 				}
            // 			});
            // 			reduce_counter("mediaFilesTab", "Files");
            // 		}
            // 	}
            // }
            // else{
            // 	window.location.reload();
            // }
        }
    });
}

function showEditFullMsg(msg_id, elm) {
    if (!$(elm).hasClass('active')) {
        $(elm).parent('.updatedTextOriginal').removeClass('ellipsis_active');
        $(elm).text('- Hide full message');
        $(elm).addClass('active');
    } else {
        $(elm).parent('.updatedTextOriginal').addClass('ellipsis_active');
        $(elm).text('+ Show full message');
        $(elm).removeClass('active');
    }
}

function editReplyMsg(elm) {
    var msg_id = $(elm).attr('data-id');
    var msg_body = $('#data_msg_body_rep' + msg_id).html();
    $('#data_msg_body_rep' + msg_id).hide();
    // $('#data_msg_body_rep'+msg_id).after('<div  class="editRepMsgContainer"><div id="editRep'+msg_id+'" class="editablemsg_body" contenteditable="true"  data-id="'+msg_id+'"></div><div class="updateAction"><div class="save_btn"  data-id="'+msg_id+'">Save</div><div class="cancel_btn" data-id="'+msg_id+'" onclick="cancelRepMsg(this)" >Cancel</div></div></div>');
    $('#data_msg_body_rep' + msg_id).after('<div  class="editRepMsgContainer"><div id="editRep' + msg_id + '" class="editablemsg_body" contenteditable="true" onblur="//repMsgOnBlur(event)" onkeyup="repMsgKeyupFun(event)" data-id="' + msg_id + '"></div><div class="updateAction"><div class="save_btn" onclick="saveRepMsg(this)" data-id="' + msg_id + '">Save</div><div class="cancel_btn" data-id="' + msg_id + '" onclick="cancelRepMsg(this)" >Cancel</div></div></div>');
    $('#editRep' + msg_id).prepend(msg_body);
    $('.rep_msg_' + msg_id).addClass('edit_action_on');
    placeCaretAtEnd(document.getElementById('editRep' + msg_id));
}

function repMsgKeyupFun(e) {
    if (e.keyCode == 13) {
        // $(event.target).blur();
        $(event.target).parents('.editRepMsgContainer').find('.updateAction .save_btn').trigger('click');
    }
}

function saveRepMsg(elm) {
    var msg_id = $(elm).attr('data-id');
    var msg_body = $('#editRep' + msg_id).html();
    var old_body = $('#data_msg_body_rep' + msg_id).html()
    if ($('#editRep' + msg_id).text() == $('#data_msg_body_rep' + msg_id).text()) {
        cancelRepMsg(elm);
    } else {
        if ($('#editRep' + msg_id).text().length > 0) {
            saveEditMsg(msg_id, msg_body, old_body);
        }
    }
}

function cancelRepMsg(elm) {
    var msg_id = $(elm).attr('data-id');
    cancelEditRep(msg_id);
    $('.rep_msg_' + msg_id).removeClass('edit_action_on');
}
var saveEditMsg = (msg_id, msg_body, old_body) => {

    console.log(msg_body)
    var data = {
        conversation_id: repid,
        msg_id: msg_id,
        update_at: new Date().getTime().toString(),
        msg_body: msg_body,
        old_body: old_body
    };
    var attch_audiofile = [];
    var attch_imgfile = [];
    var attch_otherfile = [];
    var attch_videofile = [];
    $.each($('.rep_msg_' + msg_id + ' .fil_attach.attach-file '), function(k, v) {
        attch_otherfile.push($(v).attr('data-file_name'));
    });
    $.each($('.rep_msg_' + msg_id + ' .img_attach'), function(k, v) {
        attch_imgfile.push($(v).attr('alt'));
    });
    $.each($('.rep_msg_' + msg_id + ' .ado_attach'), function(k, v) {
        attch_audiofile.push($(v).attr('data-file_name'));
    });
    $.each($('.rep_msg_' + msg_id + ' .vdo_attach'), function(k, v) {
        attch_videofile.push($(v).attr('data-file_name'));
    });
    var data = {
        conv_id: repid,
        thread_root_id: conversation_id,
        msg_id: msg_id,
        msg_body: msg_body,
        update_at: new Date().getTime().toString(),
        sender: user_id,
        sender_img: user_img,
        sender_name: user_fullname,
        attch_audiofile: attch_audiofile,
        attch_imgfile: attch_imgfile,
        attch_otherfile: attch_otherfile,
        attch_videofile: attch_videofile,
        type: 'reply'
    };
    socket.emit('msg_update', data, (res) => {

        $('.rep_msg_' + msg_id).remove();
    });

}
var cancelEditRep = (msg_id) => {
    $('.rep_msg_' + msg_id).find('.editRepMsgContainer').remove();
    $('#data_msg_body_rep' + msg_id).show();
}

function returnedithistoryDesignrep(edit_history, data, typeclass) {
    var design = '';
    var allmsg_edit = edit_history.split('@_$cUsJs');
    allmsg_edit.reverse();
    var hiddenCls = '';
    $.each(allmsg_edit, function(k, v) {
        var newData = JSON.parse(v);
        if (k == 0) {
            if (data.msg_body.indexOf('thread_chk_item') > -1) {
                var thread_chk_item = data.msg_body.match(/<p class="thread_chk_item">([^\<]*?)<\/p>/g);
                design += '' + thread_chk_item + '';
            }
            design += '<div class="' + typeclass + '" id="data_msg_body_rep' + data.msg_id + '" data-index="' + k + '">' + newData.msg_body + '</div>';
            // design += '<div class="updatedTextOriginal" id="editedMsg_id'+data.msg_id+'"><div class="'+typeclass+'" id="data_msg_body'+data.msg_id+'">' + newData.msg_body + '</div><div class="lastUpdateTime">Updated at '+moment(Number(newData.update_at)).format('MMM Do YYYY - h:mm a')+'</div></div>';
            //design += '<div class="updatedTextOriginal" id="editedMsg_id'+data.msg_id+'"><div class="'+typeclass+'" id="data_msg_body'+data.msg_id+'">' + newData.msg_body + '</div><div class="lastUpdateTime">Updated at '+moment(Number(newData.update_at)).format('MMM Do YYYY - h:mm a')+'</div></div>';
            //design += '<div class="updatedTextOriginal" data-index="'+k+'"><p>'+newData.msg_body+'</p><div class="lastUpdateTime">Updated at '+moment(Number(newData.update_at)).format('MMM Do YYYY - h:mm a')+'</div></div>';
        } else {
            design += '<div class="updatedTextOriginal ' + hiddenCls + '" data-index="' + k + '"><p class="msg_historyBody">' + newData.msg_body + '</p><div class="lastUpdateTime">' + moment(Number(newData.update_at)).format('MMM Do YYYY') + ' at ' + moment(data.created_at).format('h:mm a') + '</div></div>';
            if (k == 2 && allmsg_edit.length > 3) {
                if (hiddenCls == '') {
                    hiddenCls = 'hiddenCl';
                    design += '<div class="showMoreEditedmsg" onclick="showfulleditedMsg(\'' + data.msg_id + '\',this)"> + Show All</div>'
                }
            }
        }
    });
    if (data.msg_body.indexOf('thread_chk_item') == -1) {
        design += '<div class="updatedTextOriginal ' + hiddenCls + '" data-index="' + allmsg_edit.length + '"><p class="msg_historyBody">' + data.msg_body + '</p><div class="lastUpdateTime">' + moment(data.created_at).format('MMM Do YYYY - h:mm a') + '</div></div>';
    } else {
        var thread_chk_item = data.msg_body.match(/<p class="thread_chk_item">([^\<]*?)<\/p>/g);
        var msg_body = data.msg_body.split(thread_chk_item)[data.msg_body.split(thread_chk_item).length - 1];

        design += '<div class="updatedTextOriginal ' + hiddenCls + '" data-index="' + allmsg_edit.length + '"><p class="msg_historyBody">' + msg_body + '</p><div class="lastUpdateTime">' + moment(data.created_at).format('MMM Do YYYY - h:mm a') + '</div></div>';
    }

    return design;
}

function showfulleditedMsg(msg_id, elm) {
    $(elm).remove();
    $('#msgThread_' + msg_id).find('.updatedTextOriginal ').removeClass('hiddenCl');
    $('.rep_msg_' + msg_id).find('.updatedTextOriginal ').removeClass('hiddenCl');
}

function deleteThreadMsg(elm) {
    var msgid = $(elm).attr('msg-id');
    var created_by = $(elm).attr('created-by');
    $('#delete_msg_div').show();
    $('#delete_msg_div').attr('msg-id', msgid);
    if (created_by == user_id) {
        $('#deleteForAll').show();
        $('#deleteForMe').text('Delete for me');
        $('#deleteForMe').show();
    } else {
        $('#deleteForAll').hide();
        $('#deleteForMe').text('Delete for me');
        $('#deleteForMe').show();
    }
    // if(all_active){
    // 	$('#deleteForAll').show();
    // }else{
    // 	$('#deleteForMe').text('Delete for me');
    // 	$('#deleteForAll').hide();
    // }
    // if(msg_type == 'checklist'){
    // 	$('#deleteForMe').hide();
    // }else{
    // 	$('#deleteForMe').show();
    // }
    // if(conversation_id == user_id){
    // 	$('#deleteForMe').show();
    // 	$('#deleteForAll').hide();
    // 	$('#deleteForMe').text('Delete for me');
    // 	all_active = false;
    // }else{
    // 	$('#deleteForMe').text('Delete for me');
    // }
}

function deleteMessage(elm, type) {
    var msgid = $('#delete_msg_div').attr('msg-id');
    var msg_type = 'text';
    if ($('#data_msg_body' + msgid).find('.msgCheckListContainer').length > 0) {
        msg_type = 'checklist';

    }

    if (type == 'for_all') {
        if ($('#threadReplyPopUp').is(':visible')) {
            var msg_id = $('#delete_msg_div').attr('msg-id');
            // var main_conv_id = $('#threadReplyPopUp').attr('data-conv');
            var main_conv_id = call_data.conversation_id;
            socket.emit('delete_message_last_time', { msg_id: msg_id, participants: arr_participants, conversation_id: thread_id, user_id: user_id, type: type, main_conv_id: main_conv_id }, function(res) {
                if (res.status) {
                    var h4 = $('.rep_msg_' + msg_id).find('h4')[0].outerHTML;
                    $('.rep_msg_' + msg_id).find('.thread-user-msg').html('');
                    $('.rep_msg_' + msg_id).find('.thread-user-msg').html(h4);
                    $('.rep_msg_' + msg_id).find('.msgs-form-users-options').remove();
                    // $('.rep_msg_'+msg_id).append('<i><img src="/images/delete_msg.png" class="deleteicon"> You deleted this message.</i><span onclick="permanent_delete_silently(\'' + msg_id + '\')" class="silent_delete"> (Remove this line)</span>');
                    $('.rep_msg_' + msg_id).append('<i><img src="/images/delete_msg.png" class="deleteicon"> You deleted this message.</i>');
                    closeAllPopUp();
                    //'<i><img src="/images/delete_msg.png" class="deleteicon"> '+has_title+' deleted this message.</i><span onclick="permanent_delete_silently(\'' + row.msg_id + '\')" class="silent_delete"> (Remove this line)</span>';

                }
            })
        } else {
            var msg_html = $('#msgThread_' + msgid).find('.msg-time').parent('h4')[0].outerHTML;
            var title = $('#data_msg_body' + msgid).find('.checkListPlainText').text();
            socket.emit('delete_message_last_time', { msg_id: msgid, participants: arr_participants, conversation_id: $('#roomIdDiv').attr('data-roomid'), user_id: user_id, type: type, main_conv_id: "" }, function(res) {
                if (res.status) {
                    $('#msgThread_' + msgid).find('.user-msg').html('');
                    $('#msgThread_' + msgid).find('.user-msg').append(msg_html);
                    $('#msgThread_' + msgid).find('.user-msg').append('<p id="data_msg_body' + msgid + '"></p>');
                    $('#data_msg_body' + msgid)
                    if (msg_type == 'checklist') {
                        viewchecklisttype = 'count';
                        // countAndGetchecklist();
                        $('#data_msg_body' + msgid).html('<i><img src="/images/delete_msg.png" class="deleteicon"> "' + title + '" Checklist has been deleted by ' + user_fullname + '</i><span onclick="permanent_delete_silently(\'' + msgid + '\')" class="silent_delete"> (Remove this line)</span>');
                    } else {

                        $('#data_msg_body' + msgid).html('<i><img src="/images/delete_msg.png" class="deleteicon"> You deleted this message.</i><span onclick="permanent_delete_silently(\'' + msgid + '\')" class="silent_delete"> (Remove this line)</span>');
                    }
                    $('#delete_msg_div').hide();
                    $('#msgThread_' + msgid).find('.msgs-form-users-options').hide();
                    $('#msgThread_' + msgid).addClass('deleted');
                    deletedMessages.push(msgid);
                    counterUnreadallmsg(msgid);

                }
            })
        }
    } else {
        if ($('#threadReplyPopUp').is(':visible')) {
            console.log(13015, $('#threadReplyPopUp').is(':visible'))
            var msg_id = $('#delete_msg_div').attr('msg-id');
            var main_conv_id = call_data.conversation_id;;
            socket.emit('delete_message_last_time', { msg_id: msg_id, participants: arr_participants, conversation_id: thread_id, user_id: user_id, type: type, main_conv_id: main_conv_id }, function(res) {
                if (res.status) {
                    var h4 = $('.rep_msg_' + msg_id).find('h4')[0].outerHTML;
                    $('.rep_msg_' + msg_id).find('.thread-user-msg').html('');
                    $('.rep_msg_' + msg_id).find('.thread-user-msg').html(h4);
                    $('.rep_msg_' + msg_id).find('.msgs-form-users-options').remove();
                    // $('.rep_msg_'+msg_id).append('<i><img src="/images/delete_msg.png" class="deleteicon"> You deleted this message.</i><span onclick="permanent_delete_silently(\'' + msg_id + '\')" class="silent_delete"> (Remove this line)</span>');
                    $('.rep_msg_' + msg_id).append('<i><img src="/images/delete_msg.png" class="deleteicon"> You deleted this message.</i>');
                    closeAllPopUp();

                }
            })
        } else {
            var msg_html = $('#msgThread_' + msgid).find('.msg-time').parent('h4')[0].outerHTML;
            var title = $('#data_msg_body' + msgid).find('.checkListPlainText').text()
            socket.emit('delete_message_last_time', { msg_id: msgid, participants: arr_participants, conversation_id: $('#roomIdDiv').attr('data-roomid'), user_id: user_id, type: type, main_conv_id: "" }, function(res) {
                if (res.status) {
                    $('#msgThread_' + msgid).find('.user-msg').html('');
                    $('#msgThread_' + msgid).find('.user-msg').append(msg_html);
                    $('#msgThread_' + msgid).find('.user-msg').append('<p id="data_msg_body' + msgid + '"></p>');
                    viewchecklisttype = 'count';
                    // countAndGetchecklist();
                    $('#delete_msg_div').hide();
                    if (msg_type == 'checklist') {
                        $('#data_msg_body' + msgid).html('<i><img src="/images/delete_msg.png" class="deleteicon">"' + title + '" Checklist has been deleted by ' + user_fullname + '</i><span onclick="permanent_delete_silently(\'' + msgid + '\')" class="silent_delete"> (Remove this line)</span>');
                    } else {

                        $('#data_msg_body' + msgid).html('<i><img src="/images/delete_msg.png" class="deleteicon"> You deleted this message.</i><span onclick="permanent_delete_silently(\'' + msgid + '\')" class="silent_delete"> (Remove this line)</span>');
                    }
                    deletedMessages.push(msgid);
                    counterUnreadallmsg(msgid);
                    $('#msgThread_' + msgid).addClass('deleted');
                    $('#msgThread_' + msgid).find('.msgs-form-users-options').hide();

                }
            })
        }
    }
}

function counterUnreadallmsg(msgid) {
    console.log(4996, unread_replay_data)
    $.each(unread_replay_data, function(k, v) {
        console.log(125226, v.root_msg_id == msgid)
        if (v.root_msg_id == msgid) {
            console.log(v.msg_id);
            var nor = Number($('#conv' + v.root_conv_id).attr('data-nor'));
            $('#conv' + v.root_conv_id).attr('data-nor', (nor - 1 > 0) ? nor - 1 : "");
            $('#conv' + v.root_conv_id).find('.unreadMsgCount').text((nor - 1 > 0) ? nor - 1 : "");
            $('.msg_id_' + msgid).css('background', 'transparent');
            v.root_msg_id = 0;
            v.root_conv_id = 0;
            read_rep_counter++;
        }
    });

    if ((unread_replay_data.length - read_rep_counter) == 0) {
        $(".thread_active").hide();
        $(".thread_message").hide();
        read_rep_counter = 0;
    }
    reply_msg_counter();
    var removeDeletedmsg = [];
    $.each(unread_replay_data, function(k, v) {
        console.log(v.root_msg_id);
        if (deletedMessages.indexOf(v.root_msg_id) > -1) {
            removeDeletedmsg.push(k);
        }
    });
    $.each(removeDeletedmsg, function(k, v) {
        unread_replay_data.splice(v, 1);
    })
}

function reply_msg_counter() {
    var rmstA = 0;
    $.each($(".side_bar_list_item li"), function(k, per_li) {
        if ($(per_li).attr('data-nor') !== undefined) {
            if ($(per_li).attr('data-nor') !== NaN) {
                if ($(per_li).attr('data-nor') !== '') {
                    var counter = parseInt($(per_li).attr('data-nor'));
                    rmstA = rmstA + counter;
                    if (rmstA > 1) {
                        $(".thread_message").find('h5').html('<span>' + rmstA + '</span> Threaded message(s)');
                    } else {
                        $(".thread_message").find('h5').html('<span>' + rmstA + '</span> Threaded message');
                    }
                    if ($('.threadasideContainer').is(':visible')) {
                        $(per_li).find('.unreadMsgCount').text(counter);
                    }
                    if (rmstA == 0) {
                        $(".thread_message").hide();
                    } else {
                        console.log(5046, 'show')
                        $(".thread_message").show();
                    }
                }
            }
        }
    });
}
var draw_typing_indicator = (add_remove, img, name) => {
    if (add_remove) {
        if ($('.typing-indicator').html() == "") {
            $('.typing-indicator').html(name + '&nbsp;<span>is typing....</span>');

        }
    } else {
        $('.typing-indicator').html("");
    }
};
// var draw_rep_typing_indicator = (add_remove, img, name) => {
// 	if (add_remove) {
// 		if ($('.rep-typing-indicator').html() == "") {
// 			$('.rep-typing-indicator').html(name + '&nbsp;<span>is typing....</span>');
// 		}
// 	} else {
// 		$('.rep-typing-indicator').html("");
// 	}
// };
// event listeners -----------------------------------------------------
if (isMobile == true || devicetype == 'android' || $(window).width() <= 640) {
    $(document).on("mousedown", '#room', function() { // room container tap
        // setIconsToggleMenu();
        if ($('#icons').css('display') == 'block') { // icons : show => hide
            $('#icons').animate({ height: '0%' }, function() {
                $('#icons').hide();
            });
            $('#room').animate({ height: '95%' }, function() {
                redrawConf();
            });
        } else { // icons : hide => show
            $('#room').animate({ height: '85%' });
            $('#icons').show().animate({ height: '10%' }, function() {
                redrawConf();
            });
        }
    });
}
// $("#guest_fullname").keydown(function (event) {
// 	if (event.which === 13) {
// 		event.preventDefault();
// 		check_guest_call();
// 		return false;
// 	}
// });
document.onfullscreenchange = function(event) {
    if (document.fullscreenElement) {
        is_fullscreen = true;
        log("FULL yes")
    } else {
        is_fullscreen = false;
        // redrawConf();
        console.log("FULL NO")
    }
};

window.onresize = function() {
    var ww = window.outerWidth;
    var hh = window.outerHeight;
    // var xx = window.screenLeft;
    // var yy = window.screenTop;

    // console.log(ww, hh, xx, yy);
    if (ww < 700) { window.resizeTo(700, hh) }
    if (hh < 500) { window.resizeTo(ww, 500) }

    if (is_fullscreen == false) {
        if (isMobile == true || devicetype == 'android' || $(window).width() <= 640) { // mobile
            $('.main-icons .call_btn_label').hide();
            $('.main-icons .call-btn').css({ 'height': "100%" });

        } else { // web
            if ($('.toggle_action_label[data-status="show"]').length > 0) {
                $('.main-icons .call_btn_label').show();
                // $('.main-icons .call-btn').css({ 'height': "50%" });
            } else {
                $('.main-icons .call_btn_label').hide();
                // $('.main-icons .call-btn').css({ 'height': "80%" });
            }
        }
        redrawDyn();
    }
}

$(window).on(unload_event_list, function(e) {
    console.log(guest_status);
    // //debugger;
    if (typeof callCleanupLogic == 'function' && window.name === 'calling') {
        if (guest_status != 'rejected') {
            // if (Object.keys(participants).indexOf(user_id) > -1) {
            callCleanupLogic('-2', 'refresh', '', true);
            // callRejectBtn(0);
            setCookieCall('reloadstatus', 'refresh', 1);
            $('#participants').hide();
            // }
        }

    }

});
$(document).on('click focus', '.video-url-text', function() { this.select(); });
$(window).on('click', function() {
    if (menuDisplayed == true) {
        menuBox.style.display = "none";
    }
});
if ((msgid) != '0') {
    socket.emit('find_reply', { msg_id: msgid, conversation_id: conversation_id }, (reply_list) => {
        console.log('reply_list', reply_list);
        if (reply_list.status) {
            var reply_list_data = _.sortBy(reply_list.data, ["created_at", ]);

            var need_update_reply_message_seen_list = [];
            // var rep_conv_id = reply_list_data[0].conversation_id;
            $.each(reply_list_data, function(key, row) {

                draw_rep_msg(row);
            });


        } else {
            console.log('replay search query error', reply_list); // error meessage here
        }
    });
}
// socket listener --------------------------------------------------------------------
socket.emit('conf_getSocketid', function(sid) {


});
socket.on('conf_switch_server', function(data) {
    console.log('conf_switch__server', data);
    sendAckInfo(data);
    if (data.conversation_id == conversation_id) {
        //callCleanupLogic('-2', 'switch_server', '');
    }

});
// socket.on('conf_switch_server_join', function (data) { // not in use
// 	console.log('conf_switch_server_join', data);
// 	// if (window.name == 'calling')
// 	if (typeof callCleanupLogic == 'function' && window.name === 'calling') {


// 	}

// });
socket.on('send_mute_user_conf', function(data) { // audio toggle server
    console.log('recv_mute_user__conf', data);
    sendAckInfo(data);
    if (data.conversation_id == conversation_id) {
        if (data.mute_status == 'yes') {
            $('.per_audio_tog_div[uid="' + data.name + '"]').attr('data-enable', 'no');
            $('.mute_audio_server[uid="' + data.name + '"]').show();
            if (data.name != name) {
                $("#video-" + data.name).prop('muted', true);
                // $("#video-" + data.name)[0] = true;
                // participants[data.name].rtcPeer.peerConnection.getReceivers().find(function(s){
                // 	if(s.track.kind=='audio') s.track.enabled = false;
                // });
            }
        } else {
            $('.per_audio_tog_div[uid="' + data.name + '"]').attr('data-enable', 'yes');
            $('.mute_audio_server[uid="' + data.name + '"]').hide();
            if (data.name != name) {
                if ($('.mute_audio_client[uid="' + data.name + '"]').css('display') == 'none') {
                    $("#video-" + data.name).prop('muted', false);
                    // $("#video-" + data.name)[0].muted = false;
                    // participants[data.name].rtcPeer.peerConnection.getReceivers().find(function(s){
                    // 	if(s.track.kind=='audio') s.track.enabled = true;
                    // });

                }
            }
        }
    }
});
socket.on('send_switch_user_conf', function(data) { // video toggle server
    console.log('recv_switch_user__conf', data);
    sendAckInfo(data);
    if (data.conversation_id == conversation_id) {
        if (data.video_status == 'video') {
            $('#' + data.name).attr('data-calltype', 'video');
            $('.per_video_tog_div[uid="' + data.name + '"]').attr('data-enable', 'yes');
            $('.per_screen_tog_div[uid="' + data.name + '"]').attr('data-enable', 'no');
            $('.container2div[uid="' + data.name + '"]').attr('data-calltype', 'video');
            $('.container2text[uid="' + data.name + '"]').attr('data-calltype', 'video');
            if (data.name != user_id) {
                if ($('.mute_video_client[uid="' + data.name + '"]').css('display') == 'none') {
                    $('.img_audio_poster[uid="' + data.name + '"]').hide();
                    // $('.audio_canvas[uid="' + data.name + '"]').hide();
                    $('#video-' + data.name).show();
                }
            }
        } else if (data.video_status == 'audio') {
            $('#' + data.name).attr('data-calltype', 'audio');
            $('.per_video_tog_div[uid="' + data.name + '"]').attr('data-enable', 'no');
            $('.per_screen_tog_div[uid="' + data.name + '"]').attr('data-enable', 'no');
            $('.container2div[uid="' + data.name + '"]').attr('data-calltype', 'audio');
            $('.container2text[uid="' + data.name + '"]').attr('data-calltype', 'audio');
            if (data.name != user_id) {
                $('.img_audio_poster[uid="' + data.name + '"]').show();
                // $('.audio_canvas[uid="' + data.name + '"]').show();
                $('#video-' + data.name).hide();
            }
        }

        if (data.name != name) {
            if (data.mute_status == 'yes') {
                $("#video-" + data.name).prop('muted', true);
                // $("#video-" + data.name)[0].muted = true;

                // participants[data.name].rtcPeer.peerConnection.getReceivers().find(function(s){
                // 	if(s.track.kind=='audio') s.track.enabled = false;
                // });
            } else {
                if ($('.mute_audio_client[uid="' + data.name + '"]').css('display') == 'none') {
                    $("#video-" + data.name).prop('muted', false);
                    //$("#video-" + data.name)[0].muted = false;
                    // participants[data.name].rtcPeer.peerConnection.getReceivers().find(function(s){
                    // 	if(s.track.kind=='audio') s.track.enabled = true;
                    // });

                }
            }
        }
    }
});
socket.on('change_screenshare_status', function(data) { // screenshare toggle server
    sendAckInfo(data);
    // //debugger;
    if (data.conversation_id == conversation_id) {
        if (data.screenstatus_new == 'yes') {
            $('#' + data.name).attr('data-calltype', 'screen');
            $('.per_screen_tog_div[uid="' + data.name + '"]').attr('data-enable', 'yes');
            $('.per_video_tog_div[uid="' + data.name + '"]').attr('data-enable', 'no');
            $('.container2div[uid="' + data.name + '"]').attr('data-calltype', 'video');
            $('.container2text[uid="' + data.name + '"]').attr('data-calltype', 'video');

            if ($('.mute_screen_client[uid="' + data.name + '"]').css('display') == 'none') {
                $('.img_audio_poster[uid="' + data.name + '"]').hide();
                $('#video-' + data.name).show();
            }

            if (!isMobile && devicetype != 'android') {
                if ($('.per_maxmin_tog_icon[data-status="on"]').length == 0) $('.per_maxmin_tog_icon[uid="' + data.name + '"]').click();
                call_window_w = window.outerWidth;
                call_window_h = window.outerHeight;
                call_window_x = window.screenLeft;
                call_window_y = window.screenTop;
                console.log('scrrrrrrrr:yes:' + user_id);
                setTimeout(() => {
                    window.resizeTo(screen.availWidth, screen.availHeight);
                }, 0);
                setTimeout(() => {
                    window.moveTo(0, 0);
                }, 0);

            }

        } else if (data.screenstatus_new == 'no') {
            $('.per_screen_tog_div[uid="' + data.name + '"]').attr('data-enable', 'no');
            if (data.profilepic_status) {
                $('#' + data.name).attr('data-calltype', 'audio');
                $('.per_video_tog_div[uid="' + data.name + '"]').attr('data-enable', 'no');
                $('.container2div[uid="' + data.name + '"]').attr('data-calltype', 'audio');
                $('.container2text[uid="' + data.name + '"]').attr('data-calltype', 'audio');
                $('.img_audio_poster[uid="' + data.name + '"]').show();
                $('#video-' + data.name).hide();
            } else {
                $('#' + data.name).attr('data-calltype', 'video');
                $('.per_video_tog_div[uid="' + data.name + '"]').attr('data-enable', 'yes');
                $('.container2div[uid="' + data.name + '"]').attr('data-calltype', 'audio');
                $('.container2text[uid="' + data.name + '"]').attr('data-calltype', 'audio');

                if ($('.mute_screen_client[uid="' + data.name + '"]').css('display') == 'none') {
                    $('.img_audio_poster[uid="' + data.name + '"]').hide();
                    $('#video-' + data.name).show();
                }
            }
            // alert("w:"+call_window_w+" :h: "+call_window_h+" :x: "+call_window_x+" :y: "+call_window_y);
            console.log('scrrrrrrrr:no:' + user_id);
            setTimeout(() => {
                window.resizeTo(call_window_w, call_window_h);
            }, 0);
            setTimeout(() => {
                window.moveTo(call_window_x, call_window_y);
            }, 0);

        }
        if (data.name != name) {
            if (data.mute_status == 'yes') {
                $("#video-" + data.name).prop('muted', true);
            } else {
                if ($('.mute_audio_client[uid="' + data.name + '"]').css('display') == 'none') {
                    $("#video-" + data.name).prop('muted', false);
                }
            }
        }
    }
});

socket.on('conf_hold_undo', function(data) {
    location.reload();
});
socket.on('conf_hold_hide', function(data) {
    callwaiting = "no";
    $('.onhold_message').hide();
});
socket.on('guest_call_join', function(data) {
    console.log('guest__call__join', data);
    sendAckInfo(data);
    if (data.init_id == user_id) {
        $('.txt_main_connecting .txt_status').text('Calling...');
    } else {
        $('.txt_main_connecting .txt_status').text('Connecting...');
    }
    // init_ctype = data.init_ctype;
    thread_root_id = msgid = data.msgid;
    thread_id = repid = data.repid;

    if (typeof callCleanupLogic === 'function' && window.name === 'calling') {
        stopPreview_all();
        registerVoip();
        $('#guest_container_form').hide();
        $('#call_container_form').show();
        // $('#hangup').show();
    }
    // socket.emit('find_reply', { msg_id: msgid, conversation_id: conversation_id }, (reply_list) => {
    // 	if (reply_list.status) {
    // 		var reply_list_data = _.sortBy(reply_list.data, ["created_at",]);

    // 		var need_update_reply_message_seen_list = [];
    // 		// var rep_conv_id = reply_list_data[0].conversation_id;
    // 		$.each(reply_list_data, function (key, row) {

    // 			draw_rep_msg(row);
    // 		});


    // 	} else {
    // 		console.log('replay search query error', reply_list); // error meessage here
    // 	}
    // });
});

socket.on('newMessageId', function(data) {
    console.log('new_MessageId', data); //alert(data.repid);
    sendAckInfo(data);
    if (data.conversation_id == conversation_id) {
        msgid = thread_root_id = data.msgid;
        repid = thread_id = data.repid;
    }

});
socket.on('call_role_change', function(message) {
    // alert('call_role_change');
    if (message.conference_id == conference_id) {
        console.log('call_role__change', message);
        $('.span-name[uid="' + message.user_id + '"] .span-user-role').text(message.new_role);
        // alert(message.user_id + ':'+message.new_role);
        participants[message.user_id].user_role = message.new_role;
        if (message.user_id == user_id) {
            user_role = message.new_role;
            if (user_role != 'moderator') {
                $('.admin_endusercall_div').remove();
                $('#warning_op2').hide();
                $('.call_addmember_icon').remove();
                $('.set_clipboard_admin,.batch_mute_btn').hide();
                $('.toggle_guest_auto,.toggle_participant_auto').hide();
            }
        }
    }
});
socket.on('call_guest_reject', function(message) {
    console.log('call_guest_reject', message);
    if (message.conference_id == conference_id) {


    }

});
socket.on('socket_tog_raise_hand', function(data) {
    sendAckInfo(data);
    if (data.conversation_id = conversation_id) {
        if (data.is_hand == true) {
            $('.mute_hand_server[uid="' + data.uid + '"]').show();
        } else {
            $('.mute_hand_server[uid="' + data.uid + '"][data-state="on"]').click();
            $('.mute_hand_server[uid="' + data.uid + '"]').hide();
        }
    }
});
var timeout_newmsg = false;
socket.on('newRepMessage', function(message) {
    console.log('new_RepMessage', message);
    // //debugger;
    if (message.root_conv_id == conversation_id) {
        // let $elp = $('.img_audio_poster[uid="'+message.user_id+'"]');
        let $elm = $('.txt_user_msg[uid="' + message.user_id + '"]');
        // let img_bottom = $elp.position().top + $elp.outerHeight(true)+20;
        // $elm.css({
        // 	"top": img_bottom+'px'
        // }).fadeIn();
        redrawConf();
        $elm.fadeIn();
        if (timeout_newmsg) clearTimeout(timeout_newmsg);
        timeout_newmsg = setTimeout(() => {
            $elm.fadeOut();
        }, 5000);

        if (!$('#chat_container').is(":visible")) {
            if (message.msg.sender != name) { // increase count & show icons without me
                var newcount = parseInt($('.unreadMsgCount').text()) + 1;
                $('.unreadMsgCount').text(newcount).show();

                $('#room').animate({ height: '85%' });
                $('#icons').show().animate({ height: '10%' }, "normal", function() {
                    redrawConf();
                });
            }
        }
        $('.msgNotFound').remove();
    }
    if (checkguestMsg(message.msg)) {
        if (message.msg.secret_user != null) {
            if (message.msg.secret_user.length > 0) {
                if (message.msg.sender != user_id) {
                    if (message.msg.secret_user.indexOf(user_id) == -1) {
                        return false;
                    }
                }

            }
        }

        console.log(1077, message);
        console.log(945, thread_id, message.msg.conversation_id, conversation_id)
        var checkScroll = ($('.main-thread-msgs').last()[0].offsetTop - $('.main-thread-msgs').last()[0].scrollHeight) - $('#repChatContainer').innerHeight();

        // if ($('#live-chat').is(':visible')) {
        // 	if (message.res.status) {
        // 		if ($('.thread-user-msg').attr('data-rep_con_id') == message.data.thread_root_id) {
        // 			console.log(1240, message.res.msg)
        // 			draw_rep_task_msg(message.res.msg);
        // 			$('.msg-separetor-unread').hide();
        // 			if (!isTabActive) {
        // 				unreadinactiveCounter = (unreadinactiveCounter + 1);
        // 				unreadinactiveCounterTime();
        // 			}
        // 		}
        // 	}
        // } else {
        console.log(1126, message);
        // if (message.status && msgid == message.root_msg_id) {
        if (message.status) {
            // if (to == message.msg.sender || thread_id == message.msg.conversation_id) {
            if (thread_id == message.msg.conversation_id) {
                if (message.msg.sender != user_id) {
                    if ($('#chat_container').is(':visible')) {
                        if (message.msg.conversation_id == conversation_id) {
                            socket.emit('seen_emit', { msgid: message.msg.msg_id, senderid: message.msg.sender, receiverid: user_id, conversation_id: message.msg.conversation_id });
                        }
                    }
                }

                draw_rep_msg(message.msg, true);
                if (user_id != message.msg.sender) {
                    if (checkScroll >= $('#repChatContainer').scrollTop()) {
                        var oldcounter = parseInt($('#unreadthreadMsgCounter').attr('data-counter'));
                        $('#unreadthreadMsgCounter').attr('data-counter', oldcounter + 1);
                        if (parseInt($('#unreadthreadMsgCounter').attr('data-counter')) > 1) {
                            $('#unreadthreadMsgCounter').html(' New Replies');
                        } else {
                            $('#unreadthreadMsgCounter').html(' New Reply');
                        }
                    } else {
                        scrollToBottom('#repChatContainer', 0);
                    }
                } else {
                    scrollToBottom('#repChatContainer', 0);
                }
                if (!isTabActive) {
                    unreadinactiveCounter = (unreadinactiveCounter + 1);
                    unreadinactiveCounterTime();
                }

            }
            if (thread_id != message.msg.conversation_id) {
                if (user_id != message.msg.sender && deletedMessages.indexOf(message.root_msg_id) == -1) {
                    var screct_h = true;
                    if (message.msg.secret_user != null && message.msg.secret_user != undefined) {
                        if (message.msg.secret_user.length > 0) {
                            if (message.msg.secret_user.indexOf(user_id) == -1) {
                                screct_h = false;
                            }
                        }
                    }
                    console.log(5551, message.secret_user, user_id, screct_h);
                    if (screct_h) {
                        unread_replay_data.push({
                            rep_conv: message.msg.conversation_id,
                            msg_id: message.msg.msg_id,
                            root_conv_id: message.root_conv_id,
                            root_msg_id: message.root_msg_id,
                            is_seen: false
                        });
                        urrm_pn = JSON.parse(JSON.stringify(unread_replay_data));
                        var nor = Number($('#conv' + message.root_conv_id).attr('data-nor'));

                        $('#conv' + message.root_conv_id).attr('data-nor', Number(nor + 1));
                        $('#conv' + message.root_conv_id).addClass("has_unread_replay");
                        $(".thread_active").show();
                        console.log(5568, 'show')
                        $(".thread_message").show();
                        // reply_msg_counter();
                        console.log('push notification', message.msg)
                            // if(message.msg.sender !== user_id){
                            //     if(thread_id != message.msg.conversation_id){
                            //         Push.Permission.request();
                            //         Push.create(message.msg.sender_name, {
                            //             body: message.msg.msg_body,
                            //             icon: file_server+ "profile-pic/Photos/"+message.msg.sender_img,
                            //             timeout: 10000,
                            //             onClick: function() {
                            //                 // document.getElementById("conv"+message.msg.conversation_id).click();
                            //             }
                            //         });
                            //     }
                            // }
                        if (!isTabActive) {
                            unreadinactiveCounter = (unreadinactiveCounter + 1);
                            unreadinactiveCounterTime();
                        }
                        // checkunreadthread(message.root_msg_id);
                    }
                }
            }
        }
        // }
    }
});
socket.on('server_typing_emit', function(data) {
    // //debugger;
    if (data.sender_id != user_id && conversation_id == data.conversation_id) {
        if ($('#threadReplyPopUp').is(':visible') && $('.thread-user-msg').attr('data-rep_msg_id') == data.msg_id && data.reply === true) {
            draw_rep_typing_indicator(data.display, data.img, data.name);
        } else if (conversation_id == data.conversation_id && data.reply === false) {
            draw_typing_indicator(data.display, data.img, data.name);
        }
    }
});
socket.on('newChatmsgConf', data => {
    sendAckInfo(data);
    if (data.conversation_id == conversation_id) {
        if (!$('#chat_container').is(":visible")) {
            if (data.name != name) { // increase count & show icons without me
                var newcount = parseInt($('.unreadMsgCount').text()) + 1;
                $('.unreadMsgCount').text(newcount).show();

                $('#room').animate({ height: '85%' });
                $('#icons').show().animate({ height: '10%' }, "normal", function() {
                    redrawConf();
                });
            }
        }
        $('.msgNotFound').remove();
        draw_rep_msg(data, true);
        scrollToBottom('.todo-chat-body .os-viewport');
    }

});
socket.on('refresh_voip', data => {
    sendAckInfo(data);
});
socket.on('conf_connect', function(data) {
    // console.log('conf__connect', data);
    sendAckInfo(data);
    if (data.mediaType == 'VIDEO' && data.sender_calltype == 'video') {
        if (data.state == "NOT_FLOWING") {
            $('.txt_user_connecting[uid="' + data.senderid + '"]').show();
        } else {
            $('.txt_user_connecting[uid="' + data.senderid + '"]').hide();
        }

    } else if (data.mediaType == 'AUDIO' && data.sender_calltype == 'audio') {
        if (data.state == "NOT_FLOWING") {
            $('.txt_user_connecting[uid="' + data.senderid + '"]').show();
        } else {
            $('.txt_user_connecting[uid="' + data.senderid + '"]').hide();
        }

    }
});
socket.on('voip_server_reload_user', function(data) {
    // alert('voip_server_reload__user:'+conversation_id);
    sendAckInfo(data);
    if (data.conversation_id == conversation_id) {
        location.reload();
    }
});
socket.on('conf_stream_count', function(data) {
    sendAckInfo(data);
    // console.log('conf_stream__count', data); //alert('duration');

    if (data.total_audio > 1 || data.total_video > 1) {
        if (timerstarted_main == false) {
            totalSeconds_main = Math.round((data.call_now_time - data.call_start_time) / 1000);
            if (totalSeconds_main < 0) totalSeconds_main = 0;
            timerstarted_main = true;
        }

        $('#participants').css('visibility', 'visible');
        $('.init-loader,.txt_main_connecting,.txt_main_connecting_user').hide();
        data.total_users.forEach(function(user_info) {
            if (participants[user_info.name]) participants[user_info.name].countTimer();
        });
    }
});

socket.on('message_voip', (data, callback) => {
    // console.log('voip:message__voip:(new):' + data.id);
    // callback(data.id);
    lastMsg = data;
    sendAckInfo(data);

    switch (data.id) {
        case 'existingParticipants':
            onExistingParticipants(data);
            break;

        case 'newParticipantArrived':
            onNewParticipant(data);
            break;

        case 'participantLeft':
            onParticipantLeft(data);
            break;

        case 'receiveVideoAnswer': // sdp processOffer => answer
            receiveVideoAnswer(data);
            break;

        case 'ffmpeg':
            break;
        case "rtmp":
            // alert('rtmp://' + location.hostname + data.message);
            // playrtmp('rtmp://' + location.hostname + data.message);
            break;
        case 'iceCandidate':
            // alert(data.candidate);
            participants[data.name].rtcPeer.addIceCandidate(data.candidate, function(error) {
                if (error) {
                    console.error("Error adding candidate: " + error);
                    return;
                } else {
                    // console.log("kurento:done:iceCandidate:",data.candidate);
                }
            });
            break;
        default:
            console.error('Unrecognized message', data);
    }
});

socket.on('reconnect_attempt', () => {
    $('#consoleDiv').append('<p>socket:reconnecting...</p>');
    // socket.emit('has_restart', function (res) {
    // 	if (!res) {
    // 		window.close();
    // 	}
    // });
});
// socket.on('ping', () => {
// 	$('#consoleDiv').append('<p>socket:ping...</p>');
// });
// socket.on('pong', () => {
// 	$('#consoleDiv').append('<p>socket:pong...</p>');
// });

socket.on('reconnect', (attemptNumber) => {
    $('#consoleDiv').append('<p>socket:reconnected</p>');
    $('.txt_user_connecting').hide();
});
socket.on('disconnect', function() {
    console.log('xyz:socket:disconnect');
    $('.txt_user_connecting').show();
    $('#consoleDiv').append('<p>socket:disconnect</p>');


});
socket.on('msg_remove_IO_io', function(res) {
    var h4data = $('.msg_id_' + res.msg_id).find('.user-msg>h4').html();
    var delhtml = '<p> <i><img src="/images/delete_msg.png" class="deleteicon"> You deleted this message.</i><span onclick="permanent_delete_silently(\'' + res.msg_id + '\')" class="silent_delete"> (Remove this line)</span></p>';
    $('.msg_id_' + res.msg_id).find('.user-msg').html('<h4>' + h4data + '</h4>' + delhtml);
    $('.msg_id_' + res.msg_id).find('.createNTFC').remove();
    alldeletemsgid.push(res.msg_id);
    // countAndGetchecklist();
});
socket.on('msg_remove_for_All_broadcast', function(data) {
    console.log(12989, data);
    var msg_type = 'text';
    if ($('#data_msg_body' + data.msg_id).find('.msgCheckListContainer').length > 0) {
        msg_type = 'checklist';

    }
    $('#msgThread_' + data.msg_id).find('.msgs-form-users-options').hide();
    $('#msgThread_' + data.msg_id).addClass('deleted');
    $('#msgThread_' + data.msg_id).find('.msgReply').remove();
    $('#msgThread_' + data.msg_id).find('.attach_tag').remove();
    $('#msgThread_' + data.msg_id).find('.replies').remove();
    if (data.user_id !== user_id) {
        deletedMessages.push(data.msg_id);
        counterUnreadallmsg(data.msg_id);
        viewchecklisttype = 'count';
        // countAndGetchecklist();
        if (msg_type == 'checklist') {
            $('#data_msg_body' + data.msg_id).html('<i><img src="/images/delete_msg.png" class="deleteicon"> "' + $('#data_msg_body' + data.msg_id).find('.checkListPlainText').text() + '" Checklist has been deleted by ' + (findObjForUser(data.user_id).fullname ? findObjForUser(data.user_id).fullname : 'guest user') + '</i><span onclick="permanent_delete_silently(\'' + data.msg_id + '\')" class="silent_delete"> (Remove this line)</span>');
        } else {
            $('#data_msg_body' + data.msg_id).html('<i><img src="/images/delete_msg.png" class="deleteicon"> ' + (findObjForUser(data.user_id).fullname ? findObjForUser(data.user_id).fullname : 'guest user') + ' deleted this message.</i><span onclick="permanent_delete_silently(\'' + data.msg_id + '\')" class="silent_delete"> (Remove this line)</span>');
        }

        var h4 = $('.rep_msg_' + data.msg_id).find('h4')[0].outerHTML;
        $('.rep_msg_' + data.msg_id).find('.thread-user-msg').html('');
        $('.rep_msg_' + data.msg_id).find('.thread-user-msg').html(h4);
        $('.rep_msg_' + data.msg_id).find('.msgs-form-users-options').remove();
        // $('.rep_msg_'+data.msg_id).append('<i><img src="/images/delete_msg.png" class="deleteicon"> '+findObjForUser(data.user_id).fullname+' deleted this message.</i><span onclick="permanent_delete_silently(\'' + data.msg_id + '\')" class="silent_delete"> (Remove this line)</span>');
        $('.rep_msg_' + data.msg_id).append('<i><img src="/images/delete_msg.png" class="deleteicon"> ' + (findObjForUser(data.user_id).fullname ? findObjForUser(data.user_id).fullname : 'guest user') + ' deleted this message.</i>');
    } else {
        if (msg_type == 'checklist') {
            $('#data_msg_body' + data.msg_id).html('<i><img src="/images/delete_msg.png" class="deleteicon"> &nbsp; Checklist ' + $('#data_msg_body' + data.msg_id).find('.checkListPlainText').text() + ' has been deleted by ' + user_fullname + '</i><span onclick="permanent_delete_silently(\'' + data.msg_id + '\')" class="silent_delete"> (Remove this line)</span>');
        } else {
            $('#data_msg_body' + data.msg_id).html('<i><img src="/images/delete_msg.png" class="deleteicon"> You deleted this message.</i><span onclick="permanent_delete_silently(\'' + data.msg_id + '\')" class="silent_delete"> (Remove this line)</span>');
        }
    }
});
// ================ ADMIN STATUS START =========================================
socket.on('admin_screenshare_status', function(data) {
    log('admin_screen_share_status', data);
    sendAckInfo(data);
    if (data.conversation_id == conversation_id && user_role != 'moderator') {
        if (data.status == 'mute') {
            if ($('#screen_share_img').attr('data-status') == 'yes') {
                toggleScreenShare();
            }
            $('#screen_share_img').attr('data-enabled', 'no').attr('src', '/images/call/screen-share-cross_48px.svg');
        } else {
            $('#screen_share_img').attr('data-enabled', 'yes').attr('src', '/images/call/screen-share-on_48px.svg');
        }
    }
});
socket.on('admin_mute_status', function(data) {
    sendAckInfo(data);
    if (data.conversation_id == conversation_id && user_role != 'moderator') {
        if (data.status == 'mute') {
            $('#tog_audio_img').attr('prev-status', getAudioStatus());
            if (getAudioStatus() == 'on') {
                toggleMuteConf();
            }
            $('#tog_audio_img').attr('data-enabled', 'no').attr('src', '/images/call/mute-on_48px_red.svg');
        } else {
            $('#tog_audio_img').attr('data-enabled', 'yes');
            if ($('#tog_audio_img').attr('prev-status') == 'on') {
                toggleMuteConf();
            } else {
                setAudioStatus('off');
            }
        }
    }
});
socket.on('admin_video_status', function(data) {
    log('admin_video__status', data);
    sendAckInfo(data);
    if (data.conversation_id == conversation_id && user_role != 'moderator') {
        if (data.status == 'mute') {
            $('#tog_video_img').attr('prev-status', getVideoStatus());
            if (getVideoStatus() == 'on') {
                toggleVideoConf();
            }
            $('#tog_video_img').attr('data-enabled', 'no').attr('src', '/images/call/video-off_48px_disable.svg');
        } else {
            $('#tog_video_img').attr('data-enabled', 'yes');
            if ($('#tog_video_img').attr('prev-status') == 'on') {
                toggleVideoConf();
            } else {
                setVideoStatus('off');
            }
        }
    }
});

socket.on('admin_hand_status', function(data) {
    sendAckInfo(data);
    if (data.conversation_id == conversation_id) {
        var hand_icon = $('.mute_hand_server[uid="' + data.uid + '"]');
        var hand_msg = $('.mute_hand_msg[uid="' + data.uid + '"]');
        if (data.hand_status == 'on') {
            hand_msg.show();
            hand_icon
                .attr('data-state', 'on')
                .attr('data-state-old', $('.per_audio_tog_icon[uid="' + data.uid + '"]').attr('data-status'))
                .show();

            $('.per_audio_tog_div[uid="' + data.uid + '"]').hide();
            $('.per_audio_tog_icon[uid="' + data.uid + '"][data-status="off"]').click();

        } else if (data.hand_status == 'off') {
            hand_icon.attr('data-state', 'off');
            $('.per_audio_tog_div[uid="' + data.uid + '"]').show();
            if (hand_icon.attr('data-state-old') == 'on') {
                $('.per_audio_tog_icon[uid="' + data.uid + '"][data-status="off"]').click();
            } else if (hand_icon.attr('data-state-old') == 'off') {
                $('.per_audio_tog_icon[uid="' + data.uid + '"][data-status="on"]').click();
            }
            hand_icon.hide();
            hand_msg.hide();
        }
    }

});
// ===================== ADMIN STATUS END ============================================
$(document).ready(function() {
    $(document).on('click', '#batch_options_icon,#batch_options_close,.more_options_client', function(e) {
        e.preventDefault(); // stops link from making page jump to the top
        e.stopPropagation(); // when you click the button, it stops the page from seeing it as clicking the body too
        if (e.currentTarget.id == 'batch_options_icon' || e.currentTarget.id == 'batch_options_close') {
            $('#batch_options_div').toggle();
        } else {
            console.log('ex', e.currentTarget);
            // $(e.currentTarget).click();
        }
    });
    $(document).on('click', '.options_container', function(e) {
        console.log('on', e);
        e.stopPropagation();
        // return false; // when you click within the content area, it stops the page from seeing it as clicking the body too
    });
    $(document).on('click', 'body', function(e) {
        $('#batch_options_div').hide();
        $('#keyboard_options_div').hide();
        $('.more_call_option_div').hide();
    });

    $('#keyboard_options_close').on({
        'click': function() {
            $('#keyboard_options_div').fadeOut('fast');
        }
    });
});


function openKeyboardShortcuts() {
    $('#batch_options_div').hide();
    $('#keyboard_options_div').fadeIn('fast');
}

function moreActionCall(e, elm) {
    e.preventDefault();
    e.stopImmediatePropagation();
    if ($('#' + elm).is(':visible')) {
        $('#' + elm).hide();
    } else {
        $('#' + elm).show();

    }
}

document.onkeydown = function keydown(evt) {
    if (!evt) evt = event;
    // //debugger;
    if ($(document.activeElement).is('input')) return;
    if ($(document.activeElement).attr("contentEditable")) return;
    // if (document.activeElement.id === 'msg_rep') ;
    // if (document.activeElement.id === 'search_member_add') return;
    if (is_register === false) return;

    if (evt.keyCode == 86) { // video
        toggleVideoConf();
    } else if (evt.keyCode == 77) { // mute
        toggleMuteConf();
    } else if (evt.keyCode == 84) { // chat
        openChatShare();
    } else if (evt.keyCode == 82) { // hand
        toggleRaiseHand();
    } else if (evt.keyCode == 83) { // screen
        toggleScreenShare()
    }
};
document.onkeyup = function keydown(evt) {
    if (!evt) evt = event;

    if (evt.keyCode == 27) {
        $('#batch_options_div').hide();
        $('#keyboard_options_div').hide();
    }

};

function mic2earphone() {
    // alert('last:ear');
    $('#audioSourceSel option').prop("selected", false);
    $("#audioSourceSel option:last").prop("selected", true).trigger('change');

    $('#switch_audio_img')
        .addClass('mobile')
        .attr('src', '/images/call/speaker-off_48px.svg')
        .attr('data-status', 'off');
}

function mic2speaker() {
    $('#audioSourceSel option').prop("selected", false);
    $("#audioSourceSel option:eq(1)")
        .prop("selected", true)
        .trigger('change');

    $('#switch_audio_img')
        .addClass('mobile')
        .attr('src', '/images/call/speaker-on_48px.svg')
        .attr('data-status', 'on');
}

function micSwitchDialog() {
    // //debugger;
    if ($('#switch_audio_img').attr('data-status') == 'on') { // speaker on => off
        mic2earphone();
    } else {
        mic2speaker();
    }

}

function viewSwitchDialog() { // vvvv
    if (isMobile || devicetype == 'android') {
        if ($('#tog_video_img').attr('data-status') == 'no') {
            alert('Turn on camera first.');
            return;
        } else {
            if ($('#videoSourceSel option:selected').next().length > 0) {
                $('#videoSourceSel option:selected')
                    .prop("selected", false)
                    .next()
                    .prop("selected", true)
                    .trigger('change');
            } else {
                $('#videoSourceSel option:selected')
                    .prop("selected", false);
                $('#videoSourceSel option').first()
                    .prop("selected", true)
                    .trigger('change');
            }

        }
    } else { // web

        if ($('#registerDialogDiv').is(":visible")) {
            $('#registerDialogDiv').hide();
        } else {
            if ($('#screen_share_img').attr('data-status') == 'no') {
                if (is_register) {
                    if (getVideoStatus() == 'on') { // video is on
                        setVideoPreviewStatus('on');
                    } else { // video is off
                        setVideoPreviewStatus('off');
                    }
                    if (getAudioStatus() == 'off') { // audio is off
                        setAudioPreviewStatus('off');
                    } else { // audio is on
                        setAudioPreviewStatus('on');
                    }
                    $('#mute_audio_preview').show();
                }
                showPreviewStream();
                $('#callRingBtn').hide();
                $('#callSettingBtn').show();
                $('#registerDialogDiv').show().attr('data-reg', 'switch');
            } else {
                // alert('Turn off screen sharing first.');
                $('#warningsPopup').css('display', 'flex');
                $('#warningsPopup .warningMsg').text('Turn off screen sharing first.');
                $('#screen_share_loader').hide();
            }
        }

    }
}

function showPreviewStream() {
    stopPreview_all();
    var const_preview = {};
    if ($('#videoSourceSel option').length > 0) {
        setCookieCall('deviceid_video', $('#videoSourceSel').val());
        const_preview.video = { deviceId: $('#videoSourceSel').val(), width: 320, height: 240 };
    } else {
        const_preview.video = false;
    }
    if ($('#audioSourceSel option').length > 0) {
        setCookieCall('deviceid_audio', $('#audioSourceSel').val());
        const_preview.audio = { deviceId: $('#audioSourceSel').val() };
    } else {
        const_preview.audio = false;
    }

    if (const_preview.video == false && const_preview.audio == false) {
        alert('no preview');
    } else {
        navigator.mediaDevices.getUserMedia(const_preview).then(function(stream) {
            if (stream.getVideoTracks().length == 0) {
                let videoStreamPv = new MediaStream([blackVideoTrack()[0]]);
                stream_video_pv = videoStreamPv.getVideoTracks();
                document.querySelector('#regVideoPreview').srcObject = videoStreamPv;
                document.querySelector('#regVideoPreview').play();
            } else {
                stream_video_pv = stream.getVideoTracks();
                document.querySelector('#regVideoPreview').srcObject = stream;
                document.querySelector('#regVideoPreview').play();

            }
        });
    }
}

function changeStreamTrack(type) {
    // alert('audio');
    // //debugger;
    if (is_register) {
        participants[user_id].rtcPeer.switchStreamTrack(type);
    } else {
        showPreviewStream();
    }
}

function checkmedia() {
    navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
    $('#mediasourceCall').css('display', 'none');
}
navigator.mediaDevices.ondevicechange = function(event) {
    $('#warningsPopup').css('display', 'flex');
    $('#warningsPopup .warningMsg').text('Device change detected. Please choose the new device.');
    if (is_register){
        $('#callSettingBtn').show();
        $('#callRingBtn').hide();

    }else{
        $('#callSettingBtn').hide();
        $('#callRingBtn').show();

    }
    
    $('#registerDialogDiv').show().attr('data-reg', 'normal');
    navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
    
  }



// var timerGuestConf = null;
// function call_clear_guest() {
// 	if (timerGuestConf != null) {
// 		clearTimeout(timerGuestConf);
// 		timerGuestConf = null;
// 		console.log('voip:timer:clear:guest');
// 	}
// }

socket.on('new_user_notification', function(notification) {
    // console.log('new_user_notification', notification);

});
socket.on("logout", function(data) {
    console.log("xyz:logout", data);

});
// socket.on('voip_reconnect_media', (data, callback) => {
// 	if (typeof callCleanupLogic == 'function' && window.name == 'calling') {
// 		registerVoip();
// 		callback(true);
// 	}
// });

function toggle_audio(el) {
    var uid = $(el).closest('.more_call_option_div').attr('data-uid');
    $('.per_audio_tog_icon[uid="' + uid + '"]').click();
}

function toggle_video(el) {
    var uid = $(el).closest('.more_call_option_div').attr('data-uid');
    $('.per_video_tog_icon[uid="' + uid + '"]').click();
}

function toggle_screen(el) {
    var uid = $(el).closest('.more_call_option_div').attr('data-uid');
    $('.per_screen_tog_icon[uid="' + uid + '"]').click();
}

function toggle_zoom(el) {
    var uid = $(el).closest('.more_call_option_div').attr('data-uid');
    $('.per_maxmin_tog_icon[uid="' + uid + '"]').click();
}

function toggle_fullscreen(el) {
    var uid = $(el).closest('.more_call_option_div').attr('data-uid');
    $('.per_fullscreen_tog_icon[uid="' + uid + '"]').click();
}

function toggle_hangup(el) {
    var uid = $(el).closest('.more_call_option_div').attr('data-uid');
    $('.admin_endusercall_icon[data-uid="' + uid + '"]').click();
}
//for close modal
function closeModal(id) {
    $('#' + id).hide();
    $('#' + id).attr('data-esc', false);
    if (id == 'notificationPopup') {
        $('.radioItem.selected').removeClass('selected');
        $("input[type='radio'][name='muteNotification'][value='30M']").closest('label').trigger('click');
        $('#notificationPopup').attr('data-mute-id', "");
        $('#muteDeleteButton').hide();
    } else if (id == 'groupAdminArea') {
        $("#roomIdDiv").attr('data-rfu', "");
    } else if (id == 'msgUrlPreview') {
        $('#msgUrlPreview .url_title').html('');
        $('#msgUrlPreview .ulr_img').html('');
        $('#msgUrlPreview .url_desc').html('');
    } else if (id == 'informationPopup') {
        $('.input_field[data-set="true"]').removeAttr('data-set');
        $('.task_ewh_field input[data-set="true"]').removeAttr('data-set');
    } else if (id == 'roleChangerPopup') {
        $("#adminSettingBackWrap").hide();
    } else if (id == 'downloadPreviewPopup') {
        if ($('#downloadPreviewPopup').attr('thread-view') == 'true') {
            $('#threadReplyPopUp').show();
        }

    } else if (id == 'shareLinkPop') {
        if ($('#shareLinkPop').attr('thread-view') == 'true') {
            $('#threadReplyPopUp').show();
        }
    } else if (id == 'updateMessageTag') {
        if ($('#updateMessageTag').attr('thread-view') == 'true') {
            $('#threadReplyPopUp').show();
        }
    }
}

function searchTagListAttach(event, elm) {
    $("#tagsForUploadedFile li").each(function() {
        if ($(this).text().toLowerCase().search($(elm).val().toLowerCase()) > -1) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });

    $("#tagsForUploadedFile li").unhighlight();
    $("#tagsForUploadedFile li").highlight($(elm).val());
    if (event.keyCode == 8) {
        if ($(elm).val().length == 0) {
            $('#AttachmentTagHolder .item:last').find('.valremove').trigger('click');
        }
    }
}
var popupMouseEnter = () => {
    $('.suggested-list li').mouseenter(function() {
        $('.suggested-list .showEl').removeClass('selected');
        $('.suggested-list li').removeClass('default');
        $(this).addClass('selected');

    });
    $('.memberList .list').mouseenter(function() {
        $('.memberList .showEl').removeClass('selected');
        $('.memberList .list').removeClass('default');
        $(this).addClass('selected');

    });
    $('.notification_mute_time label').mouseenter(function() {
        $('.notification_mute_time  .showEl').removeClass('selected');
        $('.notification_mute_time  label').removeClass('default');
        $(this).addClass('selected');
    });
}

function closeAllPopUp() {
    if ($('#delete_msg_div').is(':visible') && $('#threadReplyPopUp').is(':visible')) {
        $('#delete_msg_div').hide();
        return false;
    } else if ($('.intercom-composer-emoji-popover').hasClass('active') && $('#threadReplyPopUp').is(':visible')) {
        $('.intercom-composer-emoji-popover').removeClass('active');
        return false;
    }

    if ($('#repChatFileUpload').is(":visible") == true) {
        repcloseUploadPopup()
    } else {
        if ($('#threadReplyPopUp').is(":visible") == true && $('.emoji_div').is(":visible") == false) {
            // if(window.name !='calling') 
            if (typeof callCleanupLogic !== 'function' && window.name !== 'calling') {
                $('#threadReplyPopUp').hide();
                if ($('#workFreeliToaster').attr('data-id') == 'viewFileThreadId') {
                    showFreeliToaster(false);
                }
                placeCaretAtEnd(document.getElementById('msg'));
            }
        } else {
            if ($('.emoji_div').is(":visible") == true) {
                $('.emoji_div').hide();
            }
        };
    }

    if ($('#delete_msg_div').is(':visible') == true || $('#delete_task_msg_div').is(':visible') == true) {
        $('#updateAction').val(tempUpdateAction);
        $('#actCre').val(tempActivityCreatedAt);
        $('#activityCreatedAt').val(tempActivityCreatedBy);
        $('#delete_msg_div').hide();
        $('#delete_task_msg_div').hide();
    }

    if ($('#member_add_on_fly').is(':visible') == true) {
        $('#member_add_on_fly').hide();
    }

    if ($('#exceed_value').is(':visible') == true) {
        $('#exceed_value').hide();
    }

    if ($('#restricted_mode').is(':visible') == true) {
        $('#restricted_mode').hide();
    }

    if ($('#stak_table').is(':visible') == true) {

        $('.workspaceform').show();
        $('#stak_table').hide();
        $(".workspaceform .taskLoader2").after($('#stak_table .body .subtaskContainer').clone());
        $('#stak_table .body').html("");
    }

    if ($('#createDirMsgContainer').is(":visible")) {
        $('#createDirMsgContainer').hide();
        $('.add-direct-member').val("");
    }

    if ($('#completed_activity_div').is(':visible') == true) {
        $("#amazonWishlist").prop('checked', false);
        $('#completed_activity_div').hide();
    }
    if ($('#reopen_activity_div').is(':visible') == true) {
        $("#amazonWishlist").prop('checked', true);
        $('#reopen_activity_div').hide();
    }

    if ($('#delete_to_do_div').is(':visible') == true) {
        $('#updateAction').val(tempUpdateAction);
        $('#actCre').val(tempActivityCreatedAt);
        $('#activityCreatedAt').val(tempActivityCreatedBy);
        $('.del_msg_title').text('Delete message');
        $('.forcreateTodo').remove();
        $('#delete_to_do_div').hide();
        $('.btn-cancel').show();
    }

    if (!$('#memberListBackWrap').is(':visible')) {
        if ($('#createToDoPopup').is(":visible")) {
            if ($("#toggle_area").is(":visible")) {
                if ($('#dueDatePickerDiv').is(":visible")) {
                    $('#dueDatePickerDiv').hide();
                    $('#dueDatePicker').css('pointer-events', 'auto');
                } else {
                    viewtodoAdOp();
                }
            } else {
                $('#createToDoPopup').hide();
            }
        }
    } else {
        $('#memberListBackWrap').hide();
    }

    if ($('#delete_to_do_div').is(':visible')) {
        $('#delete_to_do_div').hide();
    }

    $("#team-name").val("");
    $("#ml-admintype").hide();
    $("#ml-membertype").hide();
    $("#defaultRoom").remove();
    $("#ml-listHA").html('');
    $("#ml-listHl").html('');
    $("#grpPrivacy").prop("checked", false);
    $('.no_of_user_left_to_add span').text('10');
    set_default();
    thread_id = '';
}

// if ( 'AmbientLightSensor' in window ) {
//   const sensor = new AmbientLightSensor();
//   sensor.onreading = () => {
//     console.log('Current light level:', sensor.illuminance);
//   };
//   sensor.onerror = (event) => {
//     console.log(event.error.name, event.error.message);
//   };
//   sensor.start();
// }
// window.addEventListener('userproximity', function(event) {
//   if (event.near) {
// 		// let's power off the screen
// 		$('#consoleDiv').append('<p>off</p>');
// 		navigator.mozPower.screenEnabled = false;

//   } else {
//     // Otherwise, let's power on the screen
// 		$('#consoleDiv').append('<p>on</p>');
// 		navigator.mozPower.screenEnabled = true;

//   }
// });

// $(document).on('click','.reaplied_text a')

// setTimeout(() => {
// 	console.log('voip___________closed');
// 	socket.close();
// 	setTimeout(() => {
// 		socket.open();
// 		console.log('voip___________open');
// 	}, 10000);
// }, 30000);
// window.onload = function(){

// }
// alert(user_id);

// Drag popup script
$(function() {
    $('#warningPopup .hayven_Modal_Container').draggable({ containment: '#warningPopup', scroll: false });
})