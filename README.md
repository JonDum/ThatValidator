# ThatValidator
Powerful and extensible javascript form validation that doesn't suck. 

## About
Form validation isn't hard to hack together, but for complicated forms it can quickly become a mess. There's a definite benefit to keeping your event listeners organized and managing all the focus, blur, keypress, and keyup events.

Visit http://jondum.github.io/ThatValidator for a pretty thing to look at it.


##  Installation

Include ThatValidator on your page however you like.

```javascript
<script src='js/ThatValidator.min.js'></script>
```

```javascript
require('/ThatValidator.js', function(ThatValidator){
   //do stuff
));
```



## Usage


### Basics

##### Creating a validator instance

The end goal is for your form code to be contained in a single configuration object per form. However, since the config is just an object, you can reuse the config across forms or have inheritance by extending a base config.

`var myValidator = new ThatValidator('#myForm', config);`

Note: the first parameter does not have to be a `<form>` element. It can be any container element.


##### Configuring

If `config` was inlined, it might look like

```javascript 
var myValidator = new ThatValidator('#myForm', {
   completed: function() { ... }, /* called if form filled and valid */
   fields: { ... }
})	
```


##### Fields


`fields` is where the real magic happens. Each key represents a selector and the value is an object to configure anything that matches that selector (custom validations, DOM event hooks, etc).

```javascript 
var myValidator = new ThatValidator('#myForm', {
   ...
   fields: { 
     'input[type="text"]': { /* config for all text inputs*/ },
     '#email': { /* config for element with id #email */  }
   }
})	
```

For each key in fields, the value can either be an object with additional keys for configuration or a function as a shorthand for defining validations only.

```javascript 
var myValidator = new ThatValidator('#myForm', {
   ...
   fields: { 
     'input[type="text"]': { 
        validations: function(field) { ...  },
        onFocus: function(field, event) { ... },
        onBlur: function(field, event) { ... },
     },
     '#email': function(field) { 
         ...
      }
   }
})	
```

##### Validations Functions

The actual validations happen inside `validations` functions. These functions require you to always return an array of errors (or `undefined` if it is an async validation). Returning an empty array tells ThatValidator that there are no errors and that the field is valid. Otherwise, each string entry in the array is considered an error.


```javascript 
var myValidator = new ThatValidator('#myForm', {
   ...
   fields: { 
     'input[type="text"]': { 
        
        validations: function(field) {  
             var errors = [];
             
             if(field.value.length < 1)
               errors.push(field.name+" is required");
               
             return errors;
        }
     },
     
     '#email': function(field) { 
         //short hand for '#email: {validations: function(field) {}}
         var errors = [];
         if(field.value.indexOf('@') == -1)
             errors.push('Invalid email');
         return errors;
      }
   }
})	
```

This is very powerful because `validations` functions overlap and stack. For example, you could apply a validation on all fields with a `.required` class that just checks for a minimum field length, then do additional validations specific to each field. Errors will stack and you can display the errors to the user in whatever way you like.

###### Asynchronous Validations

ThatValidator also supports asynchronous validations, e.g., you need to check if a username is taken. Do your Async stuff, then call `callback` and pass `callback` an array of errors like normal

```javascript 
var myValidator = new ThatValidator('#myForm', {
   ...
   fields: { 
      ...
     '#username': function(field, callback) { 
         //ajax function
         checkUsernameIsTaken(field.value).then(function(taken)
            var errors = [];
            if(taken)
               errors.push('Username is already taken!');
            callback(errors);
         );
      }
   }
})	
```

**Important:** ThatValidator assumes a field has an async callback when it returns nothing. This is why it is important to always return an array for non-asynchronous fields.

##### Handlers

You can supply additional functions to each fields key to run on various events. Supported events are `onError`, `onValid`, `onFocus`, `onBlur`, `onKeyUp`, `onKeyPress`. Like validation functions, these events overlap with other entries in `fields`. Meaning you can define a global handler for all inputs so you do not need to repeat code and then have an additonal, more specific handler where needed. 

```javascript 
var myValidator = new ThatValidator('#myForm', {
   ...
   fields: { 
     'input[type="text"]': { 
        
        validations: function(field) {  
             ...
        },
        
        // will be called for *any* text input when it
        // does not pass validations!
        onError: function(field, errors) { .. },
        
        // same, except for when it is valid
        onValid: function(field) { … },
     },
     
     '#phone': {
        onKeyPress: function(field, event)
        {
             preventDefaultOnNonDigit(event);
        }
     }
})	
```


### API


**`.validate(callback, runHandlers /* optional */, field /* optional */)`**

Go through the form and validate each field. Calls callback when it is finished. 

```javascript
validator.validate(function(isValid) {
  if(isValid)
      console.log('yay form is valid!');
  else
      console.log('oh noes!');
});
```

`runHandlers` (default `false`) will also run event hooks while going through validations (if you wanted your form to be visually updated).

`field` (default `undefined`) if you only want `.validate()` to work on a single field instead of the whole form. Array of fields not supported at this time.


**`.isValid(field /* optional */)`**

Returns a Boolean of the *immediate* state of the form or a single field without running any validations. If you want to revalidate the form and then check if it is valid, it is better to use `.validate()`




## Contributing

Contributors are very welcome. There are many things you can help with,
including finding and fixing bugs, creating examples for the examples folder,
contributing to improved design or adding features. Some guidelines below:

* **Questions**: Please post to Stack Overflow and tag with `ThatValidator` : http://stackoverflow.com/questions/tagged/ThatValidator.

* **New Features**: If you'd like to work on a feature, start by creating a 'Feature Design: Title' issue. This will let people bat it around a bit before you send a full blown pull request. Also, you can create an issue to discuss a design even if you won't be working on it. Any collaboration is good! But please be patient. :)

* **Bugs**: If you find a bug and it's non-obvious what's causing it (almost
  always) please provide a reproduction CodePen and give some context
  around the bug. Pasting in a snippet of JavaScript probably won't be enough.

* **Answer Questions!**: If you can help another user please do!



## License

MIT. See [LICENSE](https://github.com/JonDum/ThatValidator/blob/master/LICENSE).
