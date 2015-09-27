var ctr = 0;
function validate_form() {
  var reEmail = /^\S+@\S+\.\S+$/ ;
  var reName = /^[a-zA-Z ]+$/ ;
  if ( $('#name').val().length < 1 ) {
    $('#error_name').text('Please enter your name');
    $('#name').css('border-color','#FF0000');
    ctr++;
  }
  if ( $('#email').val().length < 1 ) {
    $('#error_email').text('Please enter your email');
    $('#email').css('border-color','#FF0000');
    ctr++;
  }
  if ( $('#message').val().length < 1 ) {
    $('#error_message').text('Please enter your message');
    $('#message').css('border-color','#FF0000');
    ctr++;
  }
  if ( ctr > 0){
    $("#send").removeClass("disabled");
    return;
  }
  if(!reName.test($('#name').val())) {
    $('#error_name').text('Please use only alphabets');
    $("#send").removeClass("disabled");
    return;
  }
  if(!reEmail.test($('#email').val())) {
    $('#error_email').text('Please enter correct email address');
    $("#send").removeClass("disabled");
    return;
  }
  var m = {'name':$('#name').val(),'email':$('#email').val(),'message':$('#message').val()};
  console.log(m);
  $.ajax({
    type: "POST",
    dataType :'json',
    url: "<'Enter URL here to post'>",
    data: m,
    success: function(data) {
      console.log(data.error);
      $("#send").removeClass("disabled");
      $('#name,#message,#email').val('');
      $('#success').text('We have received your message. We will contact you as soon as possible.');
    },
    error: function(err) {
      $("#send").removeClass("disabled");
      $('#success').text('We are facing some issues in our backend. Please try later.');
      console.log(err);
    }
  });
}

$(document).ready(function() {
  $('#send').click(function() {
    if($("#send").hasClass("disabled")){
      return;
    }
    $("#send").addClass("disabled");
    $('#error_name,#error_message,#error_email').text('');
    $('#name,#message,#email').css('border-color','#484848');
    ctr = 0;
    validate_form();
  });
});
/*
nav-main-resp.js
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

NavMain.init = function()
{
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

NavMain.handleFocusIn = function(e)
{
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

NavMain.handleFocusOut = function(e)
{
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

NavMain.initSubmenu = function(menu_idx)
{
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
            target = (item_idx > 0)
              ? menuItems.eq(item_idx - 1)
              : menuItems.last();

            break;

          case 40: // Down
            target = (item_idx < menuItems.length - 1)
              ? menuItems.eq(item_idx + 1)
              : menuItems.first();

            break;

          case 37: // Left
            target = (menu_idx > 0)
              ? NavMain.mainMenuLinks.eq(menu_idx - 1)
              : NavMain.mainMenuLinks.last();

            break;

          case 39: // Right
            target = (menu_idx < NavMain.mainMenuLinks.length - 1)
              ? NavMain.mainMenuLinks.eq(menu_idx + 1)
              : NavMain.mainMenuLinks.first();

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

NavMain.handleResize = function()
{
  var width = $(window).width();

  if (width <= 760 && !NavMain.smallMode) {
    NavMain.enterSmallMode();
  }

  if (width > 760 && NavMain.smallMode) {
    NavMain.leaveSmallMode();
  }
};

NavMain.enterSmallMode = function()
{
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

NavMain.leaveSmallMode = function()
{
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
.css(
  {
'left'         : '',
'top'          : '',
'display'      : '',
'opacity'      : '',
'height'       : '',
'marginTop'    : '',
'marginBottom' : ''
  }
)
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
NavMain.unlinkMainMenuItems = function()
{
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
NavMain.relinkMainMenuLinks = function()
{
  NavMain.mainMenuLinks.each(function(i, n) {
    var node = $(n);
    if (node.attr('data-old-href')) {
      node.attr('href', node.attr('data-old-href'));
      node.removeAttr('data-old-href');
    }
  });
};

NavMain.handleDocumentClick = function(e)
{
  if (NavMain.smallMode) {
    var $clicked = $(e.target);
    if (!$clicked.parents().is('#nav-main')) {
      NavMain.closeSmallMenu();
    }
  }
};

NavMain.handleDocumentFocus = function(e)
{
  var $focused = $(e.target);
  if (!$focused.parents().is('#nav-main')) {
    NavMain.closeSmallMenu();
  }
};

NavMain.handleToggleKeypress = function(e)
{
  if (e.keyCode == 13) {
    NavMain.toggleSmallMenu();
  }
};

NavMain.toggleSmallMenu = function()
{
  if (NavMain.smallMenuOpen) {
    NavMain.closeSmallMenu();
  } else {
    NavMain.openSmallMenu();
  }
};

NavMain.openSmallMenu = function()
{
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

NavMain.closeSmallMenu = function()
{
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

NavMain.handleSubmenuClick = function(e)
{
  e.preventDefault();
  var menu = $(this).siblings('.submenu');
  NavMain.openSmallSubmenu(menu);
};

NavMain.openSmallSubmenu = function(menu)
{
  // close previous menu
  if ( NavMain.currentSmallSubmenu
    && NavMain.currentSmallSubmenu.get(0).id !== menu.get(0).id) {
    NavMain.closeSmallSubmenu(NavMain.currentSmallSubmenu);
  }

  // skip current menu
  if ( NavMain.currentSmallSubmenu
    && NavMain.currentSmallSubmenu.get(0).id === menu.get(0).id) {
    // still focus first item
    menu.find('a').get(0).focus();
    return;
  }

  menu
    .stop(true)
    .css(
      {
          'left'         : '80px',
          'top'          : 'auto',
          'display'      : 'none',
          'opacity'      : '1',
          'height'       : 'auto',
          'marginTop'    : '-8px',
          'marginBottom' : '0'
      }
    )
    .slideDown(150)
    .attr('aria-expanded', 'true');

  // focus first item
  menu.find('a').get(0).focus();

  NavMain.currentSmallSubmenu = menu;
};

NavMain.closeSmallSubmenu = function(menu)
{
  menu
    .stop(true)
    .fadeOut(100, function() {
    menu
    .css(
	{
    'left'         : '',
    'top'          : '',
    'display'      : '',
    'opacity'      : '',
    'height'       : '',
    'marginTop'    : '',
    'marginBottom' : ''
	}
    )
    .attr('aria-expanded', 'false');
  });
};

$(document).ready(NavMain.init);

})();

/*
nav-main.js
*/
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

$(document).ready(function() {
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
        if(event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
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
            target = (item_idx > 0) ? menuitems.eq(item_idx - 1)
                                    : menuitems.last();
          case 37: // Left
            break;
          case 40: // Down
            target = (item_idx < menuitems.length - 1) ? menuitems.eq(item_idx + 1)
                                                       : menuitems.first();
            break;
            target = (menu_idx > 0) ? main_menuitems.eq(menu_idx - 1)
                                    : main_menuitems.last();
            break;
          case 39: // Right
            target = (menu_idx < main_menuitems.length - 1) ? main_menuitems.eq(menu_idx + 1)
                                                            : main_menuitems.first();
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

});

/* Accordion Slider */

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
            //console.log("expand horz");
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
            //console.log("contract horz");
            f(".panel").stop().animate({
                width: "19.7%"
            }, 700, function() {
                f(".panel-title").fadeIn(250)
            }).removeClass("expanded compressed");
            f(".panel-content").stop(true, true).delay(200).fadeOut(500)
        },
        expandVert: function(l) {
            //console.log("expand vert");
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
            //console.log("contract vert");
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
