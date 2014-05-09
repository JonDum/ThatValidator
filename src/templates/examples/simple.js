/*---------------------------

       Example Usage

  --------------------------*/

var myValidator = new ThatValidator('#myForm', {

    /* Called when the form is filled and there are no errors */
    completed: function()
    {
        alert('Form filled and it is valid');
    },

    /* Configure your validators through the fields object. */
    fields: {

        '#email': {

            /* Create your validation tests for the #email field here */
            /* `validations` functions return an array of errors */
            /* An empty array or returning `true` means no errors */
            validations: function(field) {

                var errors = [];

                /* ThatValidator doesn't come with any validation tests */
                /* Write your own tests, or use a validation library such as */
                /* https://github.com/chriso/validator.js */
                if(!ChrisoValidator.isEmail(field.value))
                    errors.push('Please enter a valid email.');

                return errors;
            } 
        },

         /* A function as a value is an alias for `key: {validations: function() { }}` */
        '#password': function(field) {
                var errors = [];

                /* Have as many validations/tests as you would like! */
                if(field.value.length < 6)
                    errors.push("Password must be at least 6 characters.");

                if(!/[^a-zA-Z]/.test(field.value))
                    errors.push("Password must contain a symbol or number.");

                if(errors.length == 2)
                    errors = ["Password must be at least 6 characters and contain a symbol or number."];

                return errors;
            }

        },

        '#username': {

            /* handler functions are run in the scope of this object, so you can cache */
            /* other objects for reuse here! */
            loadingIndicator: document.getElementById('username-loading-indicator'),

            /* An ASYNC example*/
            validations: function(field, callback) {

                show(this.loadingIndicator);

                checkNameIsAvailable(field.value).then(function(result) {

                    var errors = [];

                    if(!result.ok)
                        errors.push('Name is taken');

                    callback(errors);

                    hide(this.loadingIndicator);
                });

                /* async validation functions MUST return undefined */
            }

        },

        /* the key can be any valid document.querySelectorAll() selector! */
        /* In this example, this will apply to ALL inputs inside the form */
        /* Allowing you to handle errors in a common way */
        /* Use any selector (e.g., `.required`) if you don't want every field required */
        'input': {

            validations: function(field)
            {
                var errors = [];

                if(field.value.length == 0)
                    errors.push('Field is required.');

                return errors;
            },

            /* Called when the field is defocused or the user  */
            /* stops typing and the field does not pass validations*/
            onError: function(field, errors)
            {
                addClass(field, 'error'); /* do whatever floats your boat,  $(field).addClass('error') */
                removeClass(field, 'valid');

                /* You provide this function, do what you want with the errors */
                showErrorLabel(field, errors);
            },

            /* Same as onError except the field validated succesfully */
            onValid: function(field)
            {
                removeClass(field, 'error');
                addClass(field, 'valid');

                removeErrorLabel(field);
            },

            /*  There are also optional onFocus, onBlur, onKeyPress and onKeyUp handlers. */
            onKeyPress: function(field, event)
            {
                console.log('You typed inside of ', field);
            }

        },

    }

  })


