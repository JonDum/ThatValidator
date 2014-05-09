
// Proxo = Axosoft Progress indicator

;(function() {

    var element, isRunning, progress, tickTimeout, startTimeout, endTimeout, hideTimeout;

    function Proxo() {};

    Proxo.go = Proxo.start = function() {

        if(isRunning)
            return;

        if(!element)
            createElement();

        if(endTimeout) {
            clearTimeout(endTimeout)
            endTimeout = null;
        }

        if(hideTimeout)
        {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }

        // Wait at least 150ms before showing anything
        startTimeout  = setTimeout(function() { 

            startTimeout  = null;

            console.log('1');
            element.className = 'proxo active';
            progress = 0;
            isRunning = true;

            Proxo.tick();

        }, 250);
    }

    Proxo.end = Proxo.done = function()
    {
        if(!element)
            return;


        if(startTimeout)
        {
            clearTimeout(startTimeout);
            console.log('clearing');
            startTimeout = null;
        }
        else
        {
            element.style.width = '100%';
            isRunning = false;
            endTimeout = setTimeout(function() {

                console.log('3');

                element.className = 'proxo hidden noani';

                hideTimeout = setTimeout(function() {

                    element.style.width = '0%';
                    setTimeout(function() { 
                        element.className = 'proxo';
                    }, 400)

                }, 400);


            }, 600);
        }

    }

    Proxo.tick = function(amount) {

        if(!element || !isRunning)
            return;

        if(typeof amount == 'undefined')
            amount = 10*Math.random();

        if(progress > 50)
            amount /= ((progress-50)/200)*progress;

        amount = Math.min(amount, (90-progress)/2);

        console.log('progress: '+progress+', amount: '+amount+', factor:'+((progress-50)/200)*progress);

        progress += amount;

        element.style.width = progress+'%';

        tickTimeout = setTimeout(Proxo.tick, ~~(550*Math.random()));

    };


    function createElement()
    {
        element = document.createElement('div');
        element.innerHTML = '<i></i>';
        element.className = 'proxo';
        element.style.width = '0%';

        document.body.appendChild(element);
    }

    if(typeof define === 'function' && define.amd) {
        define(function() {
            return Proxo;
        });
    } else if (typeof exports === 'object') {
        module.exports = Proxo;
    } else {
        this.Proxo = Proxo;
    }

    this.Proxo = Proxo;

}).call(this);

