
/**
 *  Returns true if it's an array. Mind blowing, I know.
 * @param value
 */

function isArray(obj) {
    return (Object.prototype.toString.call(obj) === '[object Array]')
}


function hasClass(el, name) {
    if(!el)
        return;
    return new RegExp('(\\s|^)'+name+'(\\s|$)').test(el.className);
}


function anyParentHasClass(el, name)
{
    var searchDepth = 5;

    while(!hasClass(el, name) && --searchDepth >= 0)
        el = el.parentNode;

    return searchDepth > 0 ? el : null;
}


function addClass(el, name)
{
    if(!hasClass(el, name)) { el.className += (el.className ? ' ' : '') +name; }
}


function removeClass(el, name)
{
    if(hasClass(el, name)) {
        el.className=el.className.replace(new RegExp('(\\s|^)'+name+'(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
    }
}

function toggleClass(el, name)
{
    if(hasClass(el, name))
        removeClass(el, name)
    else
        addClass(el, name);
}


function q(sel) {

    if(sel[0] == '#' && sel.indexOf(' ') == -1)
        return document.getElementById(sel.slice(1));
    else
        return document.querySelector(sel);

}

function elementIndexOf(el) {

    var a = childElementsOf(el.parentNode);

    return a.indexOf(el);

}


function childElementsOf(el)
{
    var a = Array.prototype.slice.call(el.childNodes)

    for(var i = 0; i < a.length; i++)
    if(a.nodeType !== 1)
        a.splice(i, 1);

    return a;
}


function previousSiblingElement(el)
{
    var siblings = childElementsOf(el.parentNode);

    return siblings[siblings.indexOf(el) - 1];
}


function nextSiblingElement(el)
{
    var siblings = childElementsOf(el.parentNode);

    return siblings[siblings.indexOf(el) + 1];
}


function querySelectorForEach(queries, callback) {

    if(!isArray(queries)) queries = [queries];

    var elements = [];

    queries.forEach(function(query) {
        if(typeof query === 'string')
            elements = elements.concat(Array.prototype.slice.call(document.querySelectorAll(query)));
    });

    elements.forEach(callback);

}


function nodeListForEach(nodeList, callback)
{
    nodeList = Array.prototype.slice.call(nodeList);

    nodeList.forEach(callback);
}


//calculate 'length' of an associative array
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


function debounce(func, wait) {
    // we need to save these in the closure
    var timeout, args, context, timestamp;

    return function() {

        // save details of latest call
        context = this;
        args = [].slice.call(arguments, 0);
        timestamp = new Date();

        // this is where the magic happens
        var later = function() {

            // how long ago was the last call
            var last = (new Date()) - timestamp;

            // if the latest call was less that the wait period ago
            // then we reset the timeout to wait for the difference
            if (last < wait) {
                timeout = setTimeout(later, wait - last);

                // or if not we can null out the timer and run the latest
            } else {
                timeout = null;
                func.apply(context, args);
            }
        };

        // we only need to set the timer now if one isn't already running
        if (!timeout) {
            timeout = setTimeout(later, wait);
        }
    }
}


function clearStyles(elements, styles)
{
    if(!isArray(elements))
        elements = [elements];

    if(!isArray(styles))
        styles = [styles];

    elements.forEach(function(el) {

        if(!el)
            return;

        for(var i = 0; i < styles.length; i++)
            el.style[styles[i]] = '';

     });

}


function formEncodeObject(obj, alsoEncodeURI)
{
    var encoded  = '';

    for(var key in obj)
        encoded  += '&' + key + '=' + obj[key];

    encoded = encoded.slice(1);
    return alsoEncodeURI ? encodeURIComponent(encoded) : encoded;
}


function offset(element)
{
    var curleft = curtop = 0;

    if (element.offsetParent) {

        do {

            curleft += element.offsetLeft;
            curtop += element.offsetTop;

        } while (element = element.offsetParent);

        return {top: curtop, left: curleft};
    }

}

function removeElementFromDom(element)
{
    element.parentNode.removeChild(element);
}

