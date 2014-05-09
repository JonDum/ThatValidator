


// @include polyfills.js
// @include vendor/Prism.js

(function(window, document) {

    if(document.readyState == 'complete' || document.readyState == 'interactive')
        init();
    else
        document.addEventListener("DOMContentLoaded", init);

    // @include utils.js

    function init()
    {
        FastClick.attach(document.body);

        if(window.addEventListener)
            window.addEventListener('hashchange', onHashChange);
        else
            window.onhashchange = onHashChange;

        onHashChange();
        Prism.highlightAll()

        // Example Usage Section
        var exampleUsage = q('#example-usage');
        var exampleUsageFader = q('#example-usage-fader');

        var open = false;
        exampleUsageFader.addEventListener('click', function(e) {
            toggleClass(exampleUsage, 'open');
        });

        exampleUsageFader.addEventListener('mouseenter', function(e) {
            addClass(exampleUsage, 'hover');
        });

        exampleUsageFader.addEventListener('mouseleave', function(e) {
            removeClass(exampleUsage, 'hover');
        });

        addClass(document.body, 'animate');

    }

    var hashTargetScrollPosition;

    function onHashChange(e)
    {
        if(!location.hash.length)
            return;

        var id = location.hash.slice(0, location.hash.length - 1)
        var hrefTarget = q(id);

        if(hrefTarget)
        {
            hashTargetScrollPosition = offset(hrefTarget).top - 50;

            TweenLite.to(siteWrap, 0.4, {scrollTo: hashTargetScrollPosition, onComplete: function() {
                addEventListener('scroll', onScroll)
            } })
        }
    }

    function onScroll(e)
    {
        var delta = hashTargetScrollPosition - scrollY;
        if(Math.abs(delta) > 50)
        {
            if('pushState' in history)
                history.pushState("", document.title, location.pathname + location.search); //Clear the hash
            else
                location.hash.replace(/#.+?/, '');

            removeEventListener('scroll', onScroll);
        }

    }


    function injectScript(src)
    {
        var s = document.createElement('script');
        s.src = src;
        s.async = true;
        document.body.appendChild(s);
    }

})(window, document);
