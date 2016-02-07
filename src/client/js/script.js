//initialize global variables here
var ctr = 0;
//initialize global functions here
function addZero(number) {
  switch (number) {
    case 0:
      return "00";
    case 1:
      return "01";
    case 2:
      return "02";
    case 3:
      return "03";
    case 4:
      return "04";
    case 5:
      return "05";
    case 6:
      return "06";
    case 7:
      return "07";
    case 8:
      return "08";
    case 9:
      return "09";
    default:
      return number;
  }
}

function numToMonth(number) {
  switch (number) {
    case 0:
      return "Jan";
    case 1:
      return "Feb";
    case 2:
      return "Mar";
    case 3:
      return "Apr";
    case 4:
      return "May";
    case 5:
      return "June";
    case 6:
      return "July";
    case 7:
      return "Aug";
    case 8:
      return "Sep";
    case 9:
      return "Oct";
    case 10:
      return "Nov";
    case 11:
      return "Dec";
  }
}

function cardclose() {
  $("#masthead").show();
  $("#Hero_Image").show();
  $(".disclaimer").show();
  $("#download-section").show();
  $("#events").show();
  $("#About").show();
  $("#community").show();
  $("#contact_form").show();
  $(".pillars").show();
  $(".testing").hide();
}
$(".back").click(function() {
  $('header').show();
  cardclose();
  history.pushState("", document.title, window.location.pathname + window.location.search); //add everywhere
});
function fetchalldata(venue, imageLink, regFormLink, eventStartDate, eventEndDate, eventTitle, eventDescription,
  eventId, eventUrl){
  var eventvenue = venue;
  var eventimage = imageLink;
  var eventregistration = regFormLink;
  var eventstart = new Date(eventStartDate);
  var currentTime = new Date();
  var stateofevent = false;
  var startminutes = eventstart.getMinutes();
  var starthours = eventstart.getHours();
  var startdate = eventstart.getDate();
  var startmonth = eventstart.getMonth();
  startminutes = addZero(startminutes);
  starthours = addZero(starthours);
  startmonth = numToMonth(startmonth);
  var startyear = eventstart.getFullYear();
  var eventend = new Date(eventEndDate);
  var endminutes = eventend.getMinutes();
  var endhours = eventend.getHours();
  var enddate = eventend.getDate();
  var endmonth = eventend.getMonth();
  endmonth = numToMonth(endmonth);
  var endyear = eventend.getFullYear();
  if (currentTime > eventend) {
    stateofevent = true;
  }
  var eventtitle = eventTitle;
  var eventdescription = eventDescription;
  var eventid = eventId;
  var eventurl = eventUrl;
  return {
    eventvenue: eventvenue,
    eventimage: eventimage,
    eventregistration: eventregistration,
    eventstart: eventstart,
    startminutes: startminutes,
    starthours: starthours,
    startdate: startdate,
    startmonth: startmonth,
    startyear: startyear,
    eventend: eventend,
    endminutes: endminutes,
    endhours: endhours,
    enddate: enddate,
    endmonth: endmonth,
    endyear: endyear,
    eventtitle: eventtitle,
    eventdescription: eventdescription,
    eventid: eventid,
    eventurl: eventurl,
    stateofevent: stateofevent
  }
}
function renderCard(i, noFetched, template, eventtitle, eventimage, eventvenue, eventregistration,
  startdate, startmonth, startyear, starthours, startminutes, eventdescription, eventid, eventurl, stateofevent){
  var newname = template.replace('alt=""', 'alt="' + eventtitle + '"');
  var newurl = newname.replace('src=""', 'src="' + eventimage + '"');
  var newvenue = newurl.replace('<span></span>', '<span>' + eventvenue + '</span>');
  var newtitle = newvenue.replace('<h3></h3>', '<h3>' + eventtitle + '</h3>');
  var newdate = newtitle.replace('<h4 class="pull-right"></h4>', '<h4 class="pull-right">' + startdate + ' ' + startmonth + ' ' + startyear + ' | ' + starthours + ':' + startminutes + '</h4>');
  var newdescription = newdate.replace('<p></p>', '<p>' + eventdescription + '</p>');
  var neweventid = newdescription.replace('a id=""', 'a id="event' + eventid + '"');
  if (stateofevent) {
    var newregistration = neweventid.replace('class="register" href=""', 'class="register hidden" href=""');
    var neweventurl = newregistration.replace('class="more click"', 'class="more click center-block more-center"');
  }
  else{
    var newregistration = neweventid.replace('class="register" href=""', 'class="register" href="' + eventregistration + '"');
    var neweventurl = newregistration.replace('class="more click" href=""', 'class="more click" href="' + eventurl + '"');
  }
  if (i == 2) {
    var responsivethirdcard = neweventurl.replace('class="col-xs-12 col-sm-6 col-md-4 col-lg-4"', 'class="col-xs-12 col-sm-offset-3 col-md-offset-0 col-lg-offset-0 col-sm-6 col-md-4 col-lg-4"');
    return responsivethirdcard;
  } else if (noFetched == 1) {
    var singlecard = neweventurl.replace('class="col-xs-12 col-sm-6 col-md-4 col-lg-4"', 'class="col-xs-12 col-sm-offset-3 col-md-offset-4 col-lg-offset-4 col-sm-6 col-md-4 col-lg-4"');
    return singlecard;
  } else if (noFetched == 2 && i == 0) {
    var twocard = neweventurl.replace('class="col-xs-12 col-sm-6 col-md-4 col-lg-4"', 'class="col-xs-12 col-md-offset-2 col-lg-offset-2 col-sm-6 col-md-4 col-lg-4"');
    return twocard;
  } else {
    return neweventurl;
  }
}
function renderView( template, eventtitle, eventimage, eventvenue, eventregistration,
  startdate, startmonth, startyear, starthours, startminutes, enddate, endmonth, endyear,
   endhours, endminutes, eventdescription, eventid, eventurl, stateofevent){
    var newname = template.replace('<h1 class="text-center"></h1>', '<h1 class="text-center">' + eventtitle + '</h1>');
    //     var newurl= newname.replace('src=""','src="'+eventimage+'"');
    var newvenue = newname.replace('<h3 class="pull-left"><br></h3>', '<h3 class="pull-left"><br>' + eventvenue + '</h3>');
    //     var newtitle= newregistration.replace('<h3></h3>','<h3>'+eventtitle+'</h3>'); use for image alt
    var newstartdate = newvenue.replace('<h3 class="pull-right"><br>', '<h3 class="pull-right"><br>' + startdate + ' ' + startmonth + ' ' + startyear + ' | ' + starthours + ':' + startminutes);
    var newenddate = newstartdate.replace('<br>-', '<br>-' + enddate + ' ' + endmonth + ' ' + endyear + ' | ' + endhours + ':' + endminutes);
    var newdescription = newenddate.replace('<p></p>', '<p>' + eventdescription + '</p>');
    //     var neweventid= newdescription.replace('a id=""','a id="event'+eventid+'"');
    if (stateofevent) {
      var removefloat = newdescription.replace('class="btn btn-info btn-lg pull-right">Meetup Page', 'class="btn btn-info btn-lg center-block">Meetup Page');
      var newregistration = removefloat.replace('<a class="reg" href="">', '<a class="reg hidden" href="' + eventregistration + '">');
    } else {
      var newregistration = newdescription.replace('<a class="reg" href="">', '<a class="reg" href="' + eventregistration + '">');
    }
    var neweventurl = newregistration.replace('<a class="meetup" href="">', '<a class="meetup" href="' + eventurl + '">');
    return neweventurl;
  }
function request(state, initiate) {
  if(initiate){
    var request = $.ajax({
      url: "http://stormy-gorge-8134.herokuapp.com/api/events/?time="+state,
      method: "GET",
      dataType: "json"
    });
  }else{
    var request = $.ajax({
      url: "http://stormy-gorge-8134.herokuapp.com/api/events/?time="+state+"&limit=10",
      method: "GET",
      dataType: "json"
    });
  }

  request.done(function(msg) {
    if (msg.length == 0) {
      if(initiate){
        $('#'+state+'-more').parent().hide();
        $('<h2 class="text-center">Houston, we have nothing here.<b>Stay tuned.</b></h2>').appendTo('.'+state);
      }else{
        $('<h2 class="text-center">Houston, we have nothing here.<b>Stay tuned.</b></h2>').appendTo('.event-view');
      }
    } else {
      noFetched = msg.length;
      var template = $("#card-template").html();
      $.each(msg, function(i, e) {
        var result = fetchalldata(msg[i].venue, msg[i].event_image_link, msg[i].registration_form_link,
          msg[i].event_start_date, msg[i].event_end_date, msg[i].title, msg[i].description,
          msg[i].eid, msg[i].link);
        var renderthis =  renderCard(i, noFetched, template, result.eventtitle, result.eventimage, result.eventvenue,
            result.eventregistration, result.startdate, result.startmonth, result.startyear,
            result.starthours, result.startminutes, result.eventdescription, result.eventid, result.eventurl,result.stateofevent);
        if(initiate){
          $(renderthis).appendTo("."+state);
        }else{
          $(renderthis).appendTo(".event-view");
        }
      });
    }
  });

  request.fail(function(jqXHR, textStatus) {
    $('<h2 class="text-center">Houston, our server has faced some unexpected error.<b>Stay tuned.</b></h2>').appendTo('.event-view');
    console.log("Request failed: " + textStatus);
  });
}
function requestS(apiId) {
  var requestsingle = $.ajax({
    url: "http://stormy-gorge-8134.herokuapp.com/api/events/" + apiId,
    method: "GET",
    dataType: "json"
  });
  requestsingle.done(function(msg) {
    if (msg.length == 0) {
      alert('Nothing here');
      $('<h2 class="text-center">Houston, we have nothing here.<b>Stay tuned.</b></h2>').appendTo('.single-event');
    } else {
      var template = $("#single-template").html();
      var result = fetchalldata(msg.venue, msg.event_image_link, msg.registration_form_link,
        msg.event_start_date, msg.event_end_date, msg.title, msg.description,
        msg.eid, msg.link);
      var renderthis =  renderView( template, result.eventtitle, result.eventimage, result.eventvenue,
          result.eventregistration, result.startdate, result.startmonth, result.startyear,
          result.starthours, result.startminutes, result.enddate, result.endmonth, result.endyear,
          result.endhours, result.endminutes, result.eventdescription, result.eventid, result.eventurl,
          result.stateofevent);
      $(renderthis).appendTo(".single-event");
    }
  });

  requestsingle.fail(function(jqXHR, textStatus) {
    $('<h2 class="text-center">Houston, our server has faced some unexpected error.<b>Stay tuned.</b></h2>').appendTo('.single-event');
    console.log("Request failed: " + textStatus);
  });
}

function validate_form() {
  var reEmail = /^\S+@\S+\.\S+$/;
  var reName = /^[a-zA-Z ]+$/;
  if ($('#name').val().length < 1) {
    $('#error_name').text('Please enter your name');
    $('#name').css('border-color', '#FF0000');
    ctr++;
  }
  if ($('#email').val().length < 1) {
    $('#error_email').text('Please enter your email');
    $('#email').css('border-color', '#FF0000');
    ctr++;
  }
  if ($('#message').val().length < 1) {
    $('#error_message').text('Please enter your message');
    $('#message').css('border-color', '#FF0000');
    ctr++;
  }
  if (ctr > 0) {
    $("#send").removeClass("disabled");
    return;
  }
  if (!reName.test($('#name').val())) {
    $('#error_name').text('Please use only alphabets');
    $("#send").removeClass("disabled");
    return;
  }
  if (!reEmail.test($('#email').val())) {
    $('#error_email').text('Please enter correct email address');
    $("#send").removeClass("disabled");
    return;
  }
  $("#send").addClass("loadingGifOnSubmitButton");
  var m = {
    "name": $('#name').val(),
    "email": $('#email').val(),
    "message": $('#message').val()
  };
  // console.log(JSON.stringify(m));
  // console.log(m);
  $.ajax({
    type: "POST",
    dataType: 'json',
    url: "http://stormy-gorge-8134.herokuapp.com/api/send-contact-us-form/",
    data: JSON.stringify(m),
    contentType: "application/json; charset=utf-8",
    success: function(data) {
      console.log(data.error);
      $("#send").removeClass("disabled");
      $("#send").removeClass("loadingGifOnSubmitButton");
      $('#name,#message,#email').val('');
      $('#success').text('We have received your message. We will contact you as soon as possible.');
    },
    error: function(err) {
      $("#send").removeClass("disabled");
      $("#send").removeClass("loadingGifOnSubmitButton");
      $('#success').text('We are facing some issues in our backend. Please try later.');
      console.log(err);
    }
  });
}
/*Document Ready start*/
$(document).ready(function() {
  //Initilize variables here
  var hash = window.location.hash.substring(1);
  //Initialize functions here
  // For smooth scrolling -- Added by Sanyam (CuriousLearner)
  $(".testing").hide(); //Hides dynamic view
  $(function() {
    $('a[href*=#]:not([href=#])').click(function() {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          $('html,body').animate({
            scrollTop: target.offset().top
          }, 1000);
          return false;
        }
      }
    });
  });
  // Smooth scrolling end
  //Routing
  if (hash.length > 0) {
    if (hash == "past-more" || hash == "future-more" || hash.match(/^event([0-9]+)$/)) {
      cardopen(hash);
    }
  }
  //Routing end
  //Opens dynamic view
  function cardopen(idused) {
    $(".event-view").empty();
    $(".single-event").empty();
    if (hash.length == 0) {
      window.location.hash = idused;
    } else {
      history.pushState("", document.title, window.location.pathname + window.location.search); //add everywhere
      window.location.hash = idused;
    }
    $("#masthead").hide();
    $("#Hero_Image").hide();
    $(".disclaimer").hide();
    $("#download-section").hide();
    $("#events").hide();
    $("#About").hide();
    $("#community").hide();
    $("#contact_form").hide();
    $(".pillars").hide();
    $(".testing").show();
    if (idused == "future-more") {
      request('future',false);
    } else if (idused == "past-more") {
      request('past',false);
    } else if (idused.indexOf("event") > -1) {
      idused = idused.replace(/[^0-9\.]+/g, "");
      requestS(idused);
    }
  }
  //Cardopen end
  //Nav start
  if ($('#nav-main').length === 0) {
    return;
  }

  var main_menuitems = $('#nav-main [tabindex="0"]');
  var prev_li, new_li, focused_item;

  $('#nav-main > .has-submenus > li').bind('mouseover focusin', function(event) {
    new_li = $(this);
    if (!prev_li || prev_li.attr('id') !== new_li.attr('id')) {
      // Open the menu
      new_li.addClass('hover').find('[aria-expanded="false"]').attr('aria-expanded', 'true');
      if (prev_li) {
        // Close the last selected menu
        prev_li.dequeue();
      }
    } else {
      prev_li.clearQueue();
    }
  }).each(function(menu_idx) {
    var menuitems = $(this).find('a');

    menuitems.mouseover(function(event) {
      this.focus(); // Sometimes $(this).focus() doesn"t work
    }).focus(function() {
      focused_item = $(this);
    }).each(function(item_idx) {
      // Enable keyboard navigation
      $(this).keydown(function(event) {
        var target;
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
          return true;
        }
        switch (event.keyCode) {
          case 33: // Page Up
          case 36: // Home
            target = menuitems.first();
            break;
          case 34: // Page Down
          case 35: // End
            target = menuitems.last();
            break;
          case 38: // Up
            target = (item_idx > 0) ? menuitems.eq(item_idx - 1) : menuitems.last();
          case 37: // Left
            break;
          case 40: // Down
            target = (item_idx < menuitems.length - 1) ? menuitems.eq(item_idx + 1) : menuitems.first();
            break;
            target = (menu_idx > 0) ? main_menuitems.eq(menu_idx - 1) : main_menuitems.last();
            break;
          case 39: // Right
            target = (menu_idx < main_menuitems.length - 1) ? main_menuitems.eq(menu_idx + 1) : main_menuitems.first();
            break;
        }
        if (target) {
          target.get(0).focus(); // Sometimes target.focus() doesn't work
          return false;
        }
        return true;
      });
    });
  });
  //Nav End
  //Events Section start
  $(".ellipsis").dotdotdot({
    watch: "window"
  });
  $(document.body).on('click', '.click',
    function() {
      var idused = $(this).attr("id");
      cardopen(idused);
    });
  $(document.body).on('click', '.more',
    function() {
      $('header').hide();
      $('#Hero_Image').hide();
      $('#download-section').hide();
      $('#About').hide();
      $('#community').hide();
      $('#contact_form').hide();
    });
  $(document.body).on('mouseenter', '.cardfigure',
    function() {
      var height = $(this).css("height");
      $(this).find("figcaption").css("height", height);
    });
  $(document.body).on('mouseleave', '.cardfigure',
    function() {
      $(this).find("figcaption").css("height", "120px");
    });
    request('future',true);
    request('past',true);
  //Event Section end
  //Contact Section start
  $('#send').click(function() {
    if ($("#send").hasClass("disabled")) {
      return;
    }
    $("#send").addClass("disabled");
    $('#error_name,#error_message,#error_email').text('');
    $('#name,#message,#email').css('border-color', '#484848');
    ctr = 0;
    validate_form();
  });
  //Contact Section end
});
/* Document Ready end*/
/*
nav-main-resp.js start
*/
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {

  // If there's no nav-main element, don't initialize the menu.
  if ($('#nav-main').length === 0) {
    return;
  }

  var NavMain = {};

  /**
   * Whether or not MS Internet Explorer version 4, 5, 6, 7 or 8 is used
   *
   * If true, the small mode is never triggered.
   *
   * @var Boolean
   */
  NavMain.isMSIEpre9 = (function() {
    return (/MSIE\ (4|5|6|7|8)/.test(navigator.userAgent));
  })();

  /**
   * Whether or not the main nav is in small mode
   *
   * @var Boolean
   */
  NavMain.smallMode = false;

  /**
   * Whether or not the main menu is opened in small mode
   *
   * @var Boolean
   */
  NavMain.smallMenuOpen = false;

  /**
   * Jquery object representing the currently opened sub-menu
   * in small-mode
   *
   * @var jQuery
   */
  NavMain.currentSmallSubmenu = null;

  /**
   * Jquery object representing the previously focused main menu item
   *
   * @var jQuery
   */
  NavMain.previousMenuItem = null;

  /**
   * Jquery object representing the currently focused sub-menu item
   *
   * @var jQuery
   */
  NavMain.currentSubmenuItem = null;

  /**
   * Main menu items in the menubar
   *
   * @var jQuery
   */
  NavMain.mainMenuItems = null;

  /**
   * Main menu items in the menubar
   *
   * @var jQuery
   */
  NavMain.mainMenuLinks = null;

  NavMain.init = function() {
    NavMain.mainMenuItems = $('#nav-main .has-submenus > li');
    NavMain.mainMenuLinks = $('#nav-main ul > li > [tabindex="0"]');

    NavMain.mainMenuItems
      .bind('mouseover focusin', NavMain.handleFocusIn)
      .bind('mouseout focusout', NavMain.handleFocusOut)
      .each(NavMain.initSubmenu);
    if (!NavMain.isMSIEpre9) {
      $(window).resize(NavMain.handleResize);
      NavMain.handleResize();
    }

    // set up small-mode menu toggle button
    $('#nav-main .toggle')
      .click(function(e) {
        e.preventDefault();
        NavMain.toggleSmallMenu();
      })
      .keydown(function(e) {
        if (e.keyCode == 13 || e.keyCode == 32) {
          e.preventDefault();
          NavMain.toggleSmallMenu();
        }
      });

    // On touch-enabled devices, hijack the click event and just make it focus
    // the item. This prevents flashing menus on iOS and prevents clicking on
    // a top-level item causing navigation on Android.
    if ('ontouchstart' in window) {
      NavMain.mainMenuLinks.click(function(e) {
        e.preventDefault();
        this.focus();
      });
    }
  };

  NavMain.handleFocusIn = function(e) {
    var item = $(this);

    if (NavMain.previousMenuItem) {
      if (NavMain.previousMenuItem.attr('id') !== item.attr('id')) {
        // Close the last selected menu
        NavMain.previousMenuItem.dequeue();
      } else {
        NavMain.previousMenuItem.clearQueue();
      }
    }
    // Open the menu
    item
      .addClass('hover')
      .find('[aria-expanded="false"]')
      .attr('aria-expanded', 'true');
  };

  NavMain.handleFocusOut = function(e) {
    NavMain.previousMenuItem = $(this);
    NavMain.previousMenuItem
      .delay(100)
      .queue(function() {
        if (NavMain.previousMenuItem) {
          // Close the menu
          NavMain.previousMenuItem
            .clearQueue()
            .removeClass('hover')
            .find('[aria-expanded="true"]')
            .attr('aria-expanded', 'false');

          NavMain.previousMenuItem = null;

          // If there was a focused sub-menu item, blur it
          if (NavMain.currentSubmenuItem) {
            NavMain.currentSubmenuItem.get(0).blur();
          }
        }
      });
  };

  NavMain.initSubmenu = function(menu_idx) {
    var menuItems = $(this).find('a');

    menuItems.mouseover(function(e) {
      this.focus(); // Sometimes $(this).focus() doesn't work
    }).focus(function() {
      NavMain.currentSubmenuItem = $(this);
    }).each(function(item_idx) {
      $(this).keydown(function(e) {
        var target;
        switch (e.keyCode) {
          case 33: // Page Up
          case 36: // Home
            target = menuItems.first();
            break;

          case 34: // Page Down
          case 35: // End
            target = menuItems.last();
            break;

          case 38: // Up
            target = (item_idx > 0) ? menuItems.eq(item_idx - 1) : menuItems.last();

            break;

          case 40: // Down
            target = (item_idx < menuItems.length - 1) ? menuItems.eq(item_idx + 1) : menuItems.first();

            break;

          case 37: // Left
            target = (menu_idx > 0) ? NavMain.mainMenuLinks.eq(menu_idx - 1) : NavMain.mainMenuLinks.last();

            break;

          case 39: // Right
            target = (menu_idx < NavMain.mainMenuLinks.length - 1) ? NavMain.mainMenuLinks.eq(menu_idx + 1) : NavMain.mainMenuLinks.first();

            break;
        }
        if (target) {
          target.get(0).focus(); // Sometimes target.focus() doesn't work
          return false;
        }
        return true;
      });
    });
  };

  NavMain.handleResize = function() {
    var width = $(window).width();

    if (width <= 760 && !NavMain.smallMode) {
      NavMain.enterSmallMode();
    }

    if (width > 760 && NavMain.smallMode) {
      NavMain.leaveSmallMode();
    }
  };

  NavMain.enterSmallMode = function() {
    NavMain.unlinkMainMenuItems();

    $('#nav-main-menu')
      .css('display', 'none')
      .attr('aria-hidden');

    $(document).click(NavMain.handleDocumentClick);
    $('a, input, textarea, button, :focus')
      .focus(NavMain.handleDocumentFocus);

    $('#nav-main-menu, #nav-main-menu .submenu')
      .attr('aria-hidden', 'true');

    // remove submenu click handler and CSS class
    NavMain.mainMenuLinks
      .addClass('submenu-item')
      .unbind('click', NavMain.handleSubmenuClick);

    // add click handler to menu links to hide menu
    NavMain.linkMenuHideOnClick();

    NavMain.smallMode = true;
  };

  NavMain.leaveSmallMode = function() {
    NavMain.relinkMainMenuLinks();

    $('#nav-main-menu')
      .css('display', '')
      .removeAttr('aria-hidden');

    $(document).unbind('click', NavMain.handleDocumentClick);
    $('a, input, textarea, button, :focus')
      .unbind('focus', NavMain.handleDocumentFocus);

    $('#nav-main .toggle').removeClass('open');

    // reset submenus
    $('#nav-main-menu > li > .submenu')
      .stop(true)
      .css({
        'left': '',
        'top': '',
        'display': '',
        'opacity': '',
        'height': '',
        'marginTop': '',
        'marginBottom': ''
      })
      .attr('aria-expanded', 'false');

    // remove click handler from menu links that hide menu
    NavMain.unlinkMenuHideOnClick();

    NavMain.currentSmallSubmenu = null;
    NavMain.smallMode = false;
    NavMain.smallMenuOpen = false;
  };

  /**
   * Causes smallMode menu to close when clicking on a menu/submenu link
   *
   * Allows closing of smallMode menu when navigating in-page
   */
  NavMain.linkMenuHideOnClick = function() {
    if (NavMain.mainMenuItems.length === 0) {
      $('#nav-main-menu > li > a').on('click.smallmode', function(e) {
        NavMain.closeSmallMenu();
      });
    } else {
      $('.submenu > li > a').on('click.smallmode', function(e) {
        NavMain.closeSmallMenu();
      });
    }
  };

  /**
   * Remove smallMode menu closing when clicking menu/submenu link
   */
  NavMain.unlinkMenuHideOnClick = function() {
    if (NavMain.mainMenuItems.length === 0) {
      $('#nav-main-menu > li > a').off('click.smallmode');
    } else {
      $('.submenu > li > a').of('click.smallmode');
    }
  };

  /**
   * Removes the href attribute from menu items with submenus
   *
   * This prevents load bar from appearing on iOS when you press
   * an item.
   */
  NavMain.unlinkMainMenuItems = function() {
    NavMain.mainMenuLinks.each(function(i, n) {
      var node = $(n);
      if (node.siblings('.submenu')) {
        node.attr('data-old-href', node.attr('href'));
        node.removeAttr('href');
      }
    });
  };

  /**
   * Returns the href attribute back to main menu links
   */
  NavMain.relinkMainMenuLinks = function() {
    NavMain.mainMenuLinks.each(function(i, n) {
      var node = $(n);
      if (node.attr('data-old-href')) {
        node.attr('href', node.attr('data-old-href'));
        node.removeAttr('data-old-href');
      }
    });
  };

  NavMain.handleDocumentClick = function(e) {
    if (NavMain.smallMode) {
      var $clicked = $(e.target);
      if (!$clicked.parents().is('#nav-main')) {
        NavMain.closeSmallMenu();
      }
    }
  };

  NavMain.handleDocumentFocus = function(e) {
    var $focused = $(e.target);
    if (!$focused.parents().is('#nav-main')) {
      NavMain.closeSmallMenu();
    }
  };

  NavMain.handleToggleKeypress = function(e) {
    if (e.keyCode == 13) {
      NavMain.toggleSmallMenu();
    }
  };

  NavMain.toggleSmallMenu = function() {
    if (NavMain.smallMenuOpen) {
      NavMain.closeSmallMenu();
    } else {
      NavMain.openSmallMenu();
    }
  };

  NavMain.openSmallMenu = function() {
    if (NavMain.smallMenuOpen) {
      return;
    }

    $('#nav-main-menu')
      .slideDown(150)
      .removeAttr('aria-hidden');

    $('#nav-main .toggle').addClass('open');

    // add click handler and set submenu class on submenus
    NavMain.mainMenuLinks
      .addClass('submenu-item')
      .click(NavMain.handleSubmenuClick);
    NavMain.smallMenuOpen = true;
  };

  NavMain.closeSmallMenu = function() {
    if (!NavMain.smallMenuOpen) {
      return;
    }

    $('#nav-main-menu, #nav-main-menu .submenu')
      .slideUp(100)
      .attr('aria-hidden', 'true');

    $('#nav-main .toggle').removeClass('open');

    // remove submenu click handler and CSS class
    NavMain.mainMenuLinks
      .addClass('submenu-item')
      .unbind('click', NavMain.handleSubmenuClick);

    if (NavMain.currentSmallSubmenu) {
      NavMain.closeSmallSubmenu(NavMain.currentSmallSubmenu);
    }
    NavMain.currentSmallSubmenu = null;

    NavMain.smallMenuOpen = false;
  };

  NavMain.handleSubmenuClick = function(e) {
    e.preventDefault();
    var menu = $(this).siblings('.submenu');
    NavMain.openSmallSubmenu(menu);
  };

  NavMain.openSmallSubmenu = function(menu) {
    // close previous menu
    if (NavMain.currentSmallSubmenu && NavMain.currentSmallSubmenu.get(0).id !== menu.get(0).id) {
      NavMain.closeSmallSubmenu(NavMain.currentSmallSubmenu);
    }

    // skip current menu
    if (NavMain.currentSmallSubmenu && NavMain.currentSmallSubmenu.get(0).id === menu.get(0).id) {
      // still focus first item
      menu.find('a').get(0).focus();
      return;
    }

    menu
      .stop(true)
      .css({
        'left': '80px',
        'top': 'auto',
        'display': 'none',
        'opacity': '1',
        'height': 'auto',
        'marginTop': '-8px',
        'marginBottom': '0'
      })
      .slideDown(150)
      .attr('aria-expanded', 'true');

    // focus first item
    menu.find('a').get(0).focus();

    NavMain.currentSmallSubmenu = menu;
  };

  NavMain.closeSmallSubmenu = function(menu) {
    menu
      .stop(true)
      .fadeOut(100, function() {
        menu
          .css({
            'left': '',
            'top': '',
            'display': '',
            'opacity': '',
            'height': '',
            'marginTop': '',
            'marginBottom': ''
          })
          .attr('aria-expanded', 'false');
      });
  };

  $(document).ready(NavMain.init);

})();
/*
nav-main-resp.js End
*/
/* Accordion Slider start*/
(function(f) {
  var c = f(window);
  var d = f("body");
  var e = false;
  var j = (typeof matchMedia !== "undefined");
  if (j) {
    k();
    c.on("resize", function() {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(k, 200)
    })
  } else {
    e = true;
    d.addClass("wide")
  }

  function k() {
    if (window.matchMedia("screen and (min-width: 761px)").matches) {
      e = true;
      d.addClass("wide")
    } else {
      e = false;
      d.removeClass("wide")
    }
    f(".panel, .panel-content, .panel-title").removeAttr("style");
    f(".panel-content a").blur()
  }
  var g = {
    expandHorz: function(l) {
      f(".panel-title").stop(true, true).fadeOut(200);
      l.stop().removeClass("compressed").addClass("expanded").animate({
        width: "63.9%"
      }, 700);
      f(".panel-content", l).stop(true, true).delay(400).fadeIn(400);
      l.siblings(".panel").stop().removeClass("expanded").addClass("compressed").animate({
        width: "8.8%"
      }, 700);
      l.siblings(".panel").find(".panel-content").stop(true, true).fadeOut(400, function() {
        f(this).delay(500).removeAttr("style")
      });
    },
    contractHorz: function() {
      f(".panel").stop().animate({
        width: "19.7%"
      }, 700, function() {
        f(".panel-title").fadeIn(250)
      }).removeClass("expanded compressed");
      f(".panel-content").stop(true, true).delay(200).fadeOut(500)
    },
    expandVert: function(l) {
      f(".panel-title").stop(true, true).fadeOut(200);
      l.stop().removeClass("compressed").addClass("expanded").animate({
        height: "22em"
      }, 700);
      l.siblings(".panel").stop().removeClass("expanded").addClass("compressed").animate({
        height: "2em"
      }, 700);
      f(".panel-content", l).stop(true, true).delay(400).fadeIn(400);
      l.siblings(".panel").find(".panel-content").stop(true, true).fadeOut(400, function() {
        f(this).delay(500).removeAttr("style")
      });
      l("open", (f(".panel").index(l) + 1), l.attr("id"))
    },
    contractVert: function() {
      f(".panel").stop().animate({
        height: "4.5em"
      }, 700, function() {
        f(".panel-title").fadeIn(250)
      }).removeClass("expanded compressed");
      f(".panel-content").stop(true, true).fadeOut(500)
    },
  };
  var h = 200;
  var a;
  f(".accordion").on("mouseleave", function() {
    clearTimeout(a);
    h = 200
  });
  f(".panel").hover(function() {
    var l = f(this);
    clearTimeout(a);
    a = setTimeout(function() {
      if (e) {
        g.expandHorz(l)
      } else {
        g.expandVert(l)
      }
      h = 0
    }, h)
  }, function() {
    if (e) {
      g.contractHorz(f(this))
    } else {
      g.contractVert()
    }
  });
  f(".panel").on("click focus", function(l) {
    if (!f(this).hasClass("expanded")) {
      if (e) {
        g.expandHorz(f(this))
      } else {
        g.expandVert(f(this))
      }
    }
  });
  f(".panel > a").on("blur", function() {
    if (e) {
      g.contractHorz()
    } else {
      g.contractVert()
    }
  });
})(window.jQuery);
/* Accordion Slider end*/
