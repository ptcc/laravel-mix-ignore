const Assert = require('assert');
const webpack = require('webpack');
const IgnorePlugin = require('webpack/lib/IgnorePlugin');
const mix = require('laravel-mix');

/**
 * Laravel Mix Ignore
 *
 * Provide straight-forward way of ignoring module(s) from being bundled.
 */
class LaravelMixIgnore {

    /**
     * Plugin constructor.
     */
    constructor() {

        /** @type {IgnorePlugin[]} */
        this.ignore = [];

    }

    /**
     * Build the ignore instance for what was given.
     *
     * @param {String|RegExp|Function} ignore
     * @param {String|RegExp|Function} when_directory
     * @return {this}
     */
    buildIgnoreInstance(ignore, when_directory) {

        const [checkResource, checkContext] = Array.from(arguments).map(param => {

            if (typeof param === 'function') {
                return param;
            }

            if (typeof param === 'string') {
                param = new RegExp(param);
            }

            return param

        });

        this.ignore.push(new webpack.IgnorePlugin({resourceRegExp:checkResource, contextRegExp:checkContext}));

        return this;

    };

    /**
     * Ignore a module.
     *
     * @param {String|RegExp|Function} ignore
     * @param {String|RegExp|Function} when_directory
     */
    register(ignore, when_directory = '*') {

        const check = (value, name) => Assert(
            typeof value === 'string' || typeof value === 'function' || value instanceof RegExp,
            `Expecting valid ${name} of type string, function, or RegEx instance.`
        );

        check(ignore, 'ignore');
        check(when_directory, 'when_directory');

        if (when_directory === '*') {
            when_directory = /.*/;
        }

        this.buildIgnoreInstance(ignore, when_directory);

    }

    /**
     * Load the plugin instances into webpack.
     *
     * @return {IgnorePlugin[]}
     */
    webpackPlugins() {
        return this.ignore;
    }

}

mix.extend('ignore', new LaravelMixIgnore());
