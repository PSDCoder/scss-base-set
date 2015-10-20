var NAVIGATION_MENU_CLASS = 'demo-navigation';
var NAVIGATION_ITEM_CLASS = 'demo-navigation__item';
var NAVIGATION_LINK_CLASS = 'demo-navigation__link';
var NAVIGATION_SUBMENU_CLASS = 'demo-sub-navigation';
var NAVIGATION_SUBITEM_CLASS = 'demo-sub-navigation__item';
var NAVIGATION_SUBLINK_CLASS = 'demo-sub-navigation__link';
var GUIDELINES_TOGGLER_CLASS = 'demo-vertical-rhythm-toggler';
var GUIDELINES_CLASS = 'rhythm-guidelines';
var SIDEBAR_CLASS = 'demo-sidebar';
var SIDEBAR_TOGGLER_CLASS = 'demo-sidebar-toggler';
var SIDEBAR_OVERLAY_CLASS = 'demo-sidebar-overlay';
var GUIDELINES_LS_KEY = 'guidelines';

var ENABLED_SUFFIX = '_enabled';
var DISABLED_SUFFIX = '_disabled';
var OPENED_SUFFIX = '_opened';
var CLOSED_SUFFIX = '_closed';
var ACTIVE_SUFFIX = '_active';

var sidebar = document.querySelector('.' + SIDEBAR_CLASS); //cache optimization
var guidelinesToggler = document.querySelector('.' + GUIDELINES_TOGGLER_CLASS);
var guidelines = document.querySelector('.' + GUIDELINES_CLASS);

window.addEventListener('DOMContentLoaded', function () {
    checkGuidelinesStorage(guidelinesToggler, guidelines);
    calcSidebarVisibility(sidebar);
    highlightCurrentPage();
    generateMaxHeightClasses();
});
window.addEventListener('resize', throttle(function () {
    calcSidebarVisibility(sidebar)
}, 200));
window.addEventListener('hashchange', function () {
    console.log('hash changed', arguments[0]);
    highlightCurrentPage();
});


// ==========================================================================
// ============================ SIDEBAR TOGGLER =============================
// ==========================================================================
var sidebarToggler = document.querySelector('.' + SIDEBAR_TOGGLER_CLASS);
var sidebarOverlay = document.querySelector('.' + SIDEBAR_OVERLAY_CLASS);

sidebarToggler.addEventListener('click', function () {
    sidebar.classList.add(SIDEBAR_CLASS + OPENED_SUFFIX);
    sidebar.classList.remove(SIDEBAR_CLASS + CLOSED_SUFFIX);
});

sidebarOverlay.addEventListener('click', function () {
    sidebar.classList.add(SIDEBAR_CLASS + CLOSED_SUFFIX);
    sidebar.classList.remove(SIDEBAR_CLASS + OPENED_SUFFIX);
});


// ==========================================================================
// =============================== GUIDLINES ================================
// ==========================================================================
guidelinesToggler.addEventListener('click', function () {
    window.localStorage.setItem(
        GUIDELINES_LS_KEY,
        guidelinesToggler.classList.contains(GUIDELINES_TOGGLER_CLASS + DISABLED_SUFFIX)
    );

    guidelinesToggler.classList.toggle(GUIDELINES_TOGGLER_CLASS + ENABLED_SUFFIX);
    guidelinesToggler.classList.toggle(GUIDELINES_TOGGLER_CLASS + DISABLED_SUFFIX);
    guidelines.classList.toggle(GUIDELINES_CLASS + ENABLED_SUFFIX);
    guidelines.classList.toggle(GUIDELINES_CLASS + DISABLED_SUFFIX);
});

function checkGuidelinesStorage(guidelinesToggler, guidelines) {
    if (window.localStorage.getItem(GUIDELINES_LS_KEY) === 'true') {
        guidelinesToggler.classList.add(GUIDELINES_TOGGLER_CLASS + ENABLED_SUFFIX);
        guidelinesToggler.classList.remove(GUIDELINES_TOGGLER_CLASS + DISABLED_SUFFIX);
        guidelines.classList.add(GUIDELINES_CLASS + ENABLED_SUFFIX);
        guidelines.classList.remove(GUIDELINES_CLASS + DISABLED_SUFFIX);
    }
}


// ==========================================================================
// ========================== NESTED MENU TOGGLING ==========================
// ==========================================================================
var menu = document.querySelector('.' + NAVIGATION_MENU_CLASS);

menu.addEventListener('click', function (event) {
    var anchor = closestNode(event.target, '.' + NAVIGATION_LINK_CLASS);
    var item = anchor && closestNode(anchor, '.' + NAVIGATION_ITEM_CLASS);
    var subMenu = item && item.querySelector('.' + NAVIGATION_SUBMENU_CLASS);


    if (anchor && item && subMenu) {
        event.preventDefault();

        item.classList.toggle(NAVIGATION_ITEM_CLASS + CLOSED_SUFFIX);
        item.classList.toggle(NAVIGATION_ITEM_CLASS + OPENED_SUFFIX);
        subMenu.classList.toggle(NAVIGATION_SUBMENU_CLASS + CLOSED_SUFFIX);
        subMenu.classList.toggle(NAVIGATION_SUBMENU_CLASS + OPENED_SUFFIX);
    }
});




// ==========================================================================
// ==========================      FUNCTIONS      ===========================
// ==========================================================================

function calcSidebarVisibility(sidebar) {
    if (window.outerWidth > 870) {
        sidebar.classList.add(SIDEBAR_CLASS + OPENED_SUFFIX);
        sidebar.classList.remove(SIDEBAR_CLASS + CLOSED_SUFFIX);
    } else if (sidebar.classList.contains(SIDEBAR_CLASS + OPENED_SUFFIX)) {
        sidebar.classList.add(SIDEBAR_CLASS + CLOSED_SUFFIX);
        sidebar.classList.remove(SIDEBAR_CLASS + OPENED_SUFFIX);
    }
}

function highlightCurrentPage() {
    var nodes = document.querySelectorAll('.' + NAVIGATION_LINK_CLASS);

    for (var i = 0, ii = nodes.length; i < ii; i++) {
        var link = nodes[i];
        var item = closestNode(link, '.' + NAVIGATION_ITEM_CLASS);
        var submenu;
        var submenuItems;

        if (window.location.pathname.indexOf(nodes[i].getAttribute('href')) !== -1) {
            submenu = item && item.querySelector('.' + NAVIGATION_SUBMENU_CLASS);
            submenuItems = submenu && submenu.querySelectorAll('.' + NAVIGATION_SUBITEM_CLASS);

            item.classList.add(NAVIGATION_ITEM_CLASS + ACTIVE_SUFFIX);

            if (link) {
                link.classList.add(NAVIGATION_LINK_CLASS + OPENED_SUFFIX);
                link.classList.remove(NAVIGATION_LINK_CLASS + CLOSED_SUFFIX);
            }

            if (submenu) {
                submenu.classList.add(NAVIGATION_SUBMENU_CLASS + OPENED_SUFFIX);
                submenu.classList.remove(NAVIGATION_SUBMENU_CLASS + CLOSED_SUFFIX);
            }

            if (submenuItems) {
                for (var j = 0, jj = submenuItems.length; j < jj; j++) {
                    var subItem = submenuItems[j];
                    var subLink = subItem.querySelector('.' + NAVIGATION_SUBLINK_CLASS);

                    if (subLink &&  subLink.getAttribute('href').indexOf(window.location.hash) !== -1) {
                        subItem.classList.add(NAVIGATION_SUBITEM_CLASS + ACTIVE_SUFFIX);
                    } else {
                        subItem.classList.remove(NAVIGATION_SUBITEM_CLASS + ACTIVE_SUFFIX);
                    }
                }
            }
        } else {
            item.classList.remove(NAVIGATION_ITEM_CLASS + ACTIVE_SUFFIX);
        }
    }
}

function generateMaxHeightClasses() {
    var nodes = document.querySelectorAll('.' + NAVIGATION_SUBMENU_CLASS);
    var style = document.createElement('style');
    var classes = '';

    for (var i = 0, ii = nodes.length; i < ii; i++) {
        var generatedClass = 'dynamically-generated-class-name-' + i;

        classes += ('.' + NAVIGATION_SUBMENU_CLASS  + OPENED_SUFFIX + '.' + generatedClass + '{ max-height: ' +
            calcBlockElementHeight(nodes[i]) + '}\n');
        nodes[i].classList.add(generatedClass);
    }

    style.type = 'text/css';
    style.innerHTML = classes;
    document.querySelector('head').appendChild(style);
}

function calcBlockElementHeight(node) {
    var cloned = node.cloneNode(true);
    var height;

    cloned.style.display = 'block';
    cloned.style.opacity = '1';
    cloned.style.maxHeight = 'none';
    cloned.style.height = 'auto';
    cloned.style.visibility = 'hidden';

    document.body.appendChild(cloned);
    height = cloned.clientHeight;
    document.body.removeChild(cloned);

    return height + 'px';
}

function closestNode(node, selector) {
    var parent = node;

    while (parent) {
        if (parent.classList && parent.matches(selector)) {
            return parent;
        }

        parent = parent.parentNode;
    }

    return null;
}

//from underscore
function throttle(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    return function() {
        var now = Date.now();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
}