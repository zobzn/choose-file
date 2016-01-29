'use strict';

var assign = require('object-assign');
var is_function = require('lodash/isFunction');

var is_presto = !!window.opera;
var is_trident = document.all && !is_presto;
var defaults = {
    style: 'position: absolute; clip: rect(0, 0, 0, 0);',
    multiple: false,
    accept: '*/*',
    success: function (input) {
    }
};

var on = function (event, element, callback) {
    if (element.addEventListener) {
        element.addEventListener(event, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + event, callback);
    }
};

var input_remove = function (input) {
    is_trident || input.parentNode && input.parentNode.removeChild(input);
    input.removeAttribute('accept');
    input.removeAttribute('style');
};

module.exports = function (params) {
    var input;
    var options;

    options = assign({}, defaults, is_function(params) ? {
        success: params
    } : (params || {}));
    options.success = is_function(options.success) ? options.success : defaults.success;

    input = document.createElement('input');
    input.setAttribute('accept', options.accept);
    input.setAttribute('style', options.style);
    input.setAttribute('type', 'file');
    input.multiple = !!options.multiple;

    on(is_trident ? 'input' : 'change', input, function (e) {
        if (is_presto) {
            input_remove(input);
        }
        if (input.value) {
            options.success(input);
        }
    });

    (document.body || document.documentElement).appendChild(input);

    if (is_presto) {
        setTimeout(function () {
            input.click();
        }, 0);
    } else {
        input.click();
        input_remove(input);
    }
};
