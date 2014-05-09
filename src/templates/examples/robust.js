var validator = new ThatValidator(form, {

    completed: function()
    {
        alert('Form filled and it is valid');
    },

    // field specific validations
    fields: {

        'input[type="text"],input[type="password"],[contentEditable="true"]': {

            validations: function(field) {

                var errors = [];

                if(field.type && field.type == 'text' || field.type == 'password')
                {
                    if(field.value.length == 0)
                        errors.push('Field is required.');
                }

                return errors;

            },

            onError: function(field, errors) {

                addClass(field, 'error');
                removeClass(field.parentNode, 'valid');

                addErrorLabel(field, errors);
            },

            onValid: function(field) {

                removeClass(field, 'error');
                addClass(field.parentNode, 'valid');

                removeErrorLabel(field);

            },


        },

        '#full-name': function(field) {

            var errors = [];

            if(!/[a-zA-Z]+?[\s]+?[a-zA-Z]/.test(field.value))
                errors.push('Please enter your full name');

            return errors;
        },

        '#phone': {

            onKeyPress: function(field, e)
            {
                if(e.isChar === false)
                    return;

                if(/[a-zA-Z]/.test(String.fromCharCode(e.which || e.charCode)))
                    e.preventDefault();

            }

        },

        '#company': {

            blurred: false,

            onKeyPress: function(field, event)
            {
                if(!this.blurred)
                    q('#account-name').textContent = field.value.toLowerCase().replace(/[\W]/g, '');
            },

            onBlur: function()
            {
                this.blurred = true;
            }

        },

        '#email': function(field) {

            var errors = [];

            if(!/[^@]?@[^@]+?\.[^@]?/.test(field.value))
                errors.push('Please enter a valid email.');

            return errors;
        },

        'input[type="password"]': {

            passwordHelper: q('#password-helper'),

            onFocus: function(field)
            {
                if(!validator.errors.Password && ! validator.errors['password-confirm'])
                removeClass(this.passwordHelper , 'collapsed');
            },

            onBlur:function(field)
            {
                addClass(this.passwordHelper , 'collapsed');
            },

            onError: function()
            {
                addClass(this.passwordHelper , 'collapsed');
            },

            onValid: function()
            {

            }

        },

        '#password': {

            validations: function(field)
            {
                var errors = [];

                if(field.value.length < 6)
                    errors.push("Password must be at least 6 characters.");

                if(!/[^a-zA-Z]/.test(field.value))
                    errors.push("Password must contain a symbol or number.");

                if(errors.length == 2)
                    errors = ["Password must be at least 6 characters and contain a symbol or number."];

                return errors;
            }

        },

        '#password-confirm': {

            validations: function(field)
            {
                var errors = [];

                if(field.value !== form.password.value)
                    errors.push("Passwords do not match.");

                return errors;
            }

        },

        '#account-name': {

            validations: function(field, callback)
            {
                var errors = [];

                if(field.textContent.length < 3)
                    errors.push("Not long enough")

                return errors;
            }

        },

    }


  })

