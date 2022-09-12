// Client ID and API key from the Developer Console
var CLIENT_ID = '779769082000-3qgmt422e7cf1eughl78ml8i9tuq76fo.apps.googleusercontent.com';//for bd freeli
var API_KEY = 'AIzaSyD59P81xdewjv1Y6s3IwCtMLnwndm8DHgM';
// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}
function handleClientLoadNotSync() {
  gapi.load('client:auth2', initClientNOtSync);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function(error) {
    appendPre({msg: JSON.stringify(error, null, 2), item: ""});
  });
}
function initClientNOtSync() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatusNS);

    // Handle the initial sign-in state.
    updateSigninStatusNS(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function(error) {
    appendPre({msg: JSON.stringify(error, null, 2), item: ""});
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
 function updateSigninStatus(isSignedIn) {
   if (isSignedIn) {
     authorizeButton.style.display = 'none';
     document.getElementById('authorize_button_div').style.display = 'none';
     signoutButton.style.display = 'block';
     document.getElementById('signout_button_div').style.display = 'block';
     listUpcomingEvents();
   } else {
     authorizeButton.style.display = 'block';
     document.getElementById('authorize_button_div').style.display = 'block';
     signoutButton.style.display = 'none';
     document.getElementById('signout_button_div').style.display = 'none';
   }
 }
 function updateSigninStatusNS(isSignedIn) {
   if (isSignedIn) {
     authorizeButton.style.display = 'none';
     document.getElementById('authorize_button_div').style.display = 'none';
     signoutButton.style.display = 'block';
     document.getElementById('signout_button_div').style.display = 'block';
   } else {
     authorizeButton.style.display = 'block';
     document.getElementById('authorize_button_div').style.display = 'block';
     signoutButton.style.display = 'none';
     document.getElementById('signout_button_div').style.display = 'none';
   }
 }

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn().then((res)=>{
      setCookie('gcli', 1, 1);
      window.open("/basic_calendar/Google", "_blank");
  });
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
  delete_cookie('gcli');
  window.location.href = "/basic_calendar/Freeli";
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(data) {
  if(data.item != ''){
    console.log(123,data.item);
    console.log(123,moment(data.item.start.date).format('LLLL'));
    console.log(123,moment(data.item.start.dateTime).format('LLLL'));
      var html = '';
      html += '<div class="tiles" style="margin-right:10px">';
      html += '<p class="calendar_icon"><img src="/images/basicAssets/google-calendar-icon.png" alt=""></p>'
      html +=   '<div class="tile-content">';
      html +=       '<h3 onclick="viewEventTile(event)" class="tile-title">'+ data.item.summary +'</h3>';
      html +=       '<p class="event-start-date">'+ moment(data.item.start.dateTime).format('MMMM DD, YYYY @ hh:mm a') +'</p>';
      html +=       '<p class="evnt-address"><span class="event-locate-icon"><img src="/images/basicAssets/map-icon.svg" alt="">';
      html +=           '</span> <span class="addr">Ascent Group, Dhaka </span> </p>';
      html +=       '<div class="sharingMember">';
      html +=           '<img src="/images/users/joni.jpg" data-uuid="">';
      html +=           '<img src="/images/users/Kallol Ray.jpg" data-uuid="">';
      html +=           '<img src="/images/users/nayeem.jpg" data-uuid="">';
      html +=           '<span style="margin-left:4px;cursor:pointer;">+4</span>';
      html +=       '<div class="customToolTip">Anwar Ali<br>Call Test<br>Dalim<br>Amer Ahmed<br>Anabel Leva<br>Anwar Ali<br>Call Test<br>Anabel Leva<br>Anwar Ali<br>Call Test</div>';
      html +=   '</div>';
      html +=   '<div class="tile-icons">';
      html +=       '<li onclick="start_cal_chat(event)"> <span class="count-notification">1</span> <img src="/images/basicAssets/chat_icon.svg" alt=""></li>';
      html +=       '<li onclick="showEventFiles()"><img src="/images/basicAssets/attachmentCal.svg" alt=""></li>';
      html +=       '<li><img src="/images/basicAssets/custom_voice_call_cal.svg" alt=""></li>';
      html +=       '<li><img src="/images/basicAssets/custom_video_call_cal.svg" alt=""></li>';
      html +=   '</div>';
      html += '</div>';
      $('.events-tile-div').append(html);

      var event = {
          title: data.item.summary,
          start: (! data.item.start.date)?data.item.start.dateTime:data.item.start.date,
          end: (! data.item.end.date)?data.item.end.dateTime:data.item.end.date,
          id: data.item.id,
          url: data.item.htmlLink
      };
      $('#calendar').fullCalendar( 'renderEvent', event, true);
  }

}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
 function listUpcomingEvents() {
   var date = new Date();
   var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
   var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
   gapi.client.calendar.events.list({
     'calendarId': 'primary',
     'showDeleted': false,
     'singleEvents': true,
     'timeMin': firstDay.toISOString(),
     'timeMax': lastDay.toISOString(),
     // 'maxResults': 100,
    'orderBy': 'startTime'
  }).then(function(response) {
    var events = response.result.items;
    $('.google-loading-gif').hide();
    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }
        appendPre({msg: "Upcoming event", item:event});
      }
      // call_masonry();
      // $('.side_bar_list_item li').removeClass('active-calendar');
      // $('#google_calendar_li').addClass('active-calendar');
    } else {
      $('.events-tile-div').html('<h2 class="eventNotFound"><span>No Event Found</span></h2>');
      appendPre({msg: 'No upcoming events found.', item: ""});
    }
  });
}

function addEvent(resource){
    console.log(resource);
    var request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': resource
    });
    request.execute(function(resp) {
        $('.closeEvntCreate').trigger('click');
        console.log(resp);
        appendPre({msg: "Upcoming event", item:resp});
    });
}
