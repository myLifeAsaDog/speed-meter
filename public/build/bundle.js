
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.37.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\components\SpeedMeter.svelte generated by Svelte v3.37.0 */

    const { Object: Object_1 } = globals;
    const file$1 = "src\\components\\SpeedMeter.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	child_ctx[21] = i;
    	return child_ctx;
    }

    // (142:10) {#if i % gaugeInterval === 0}
    function create_if_block(ctx) {
    	let span;
    	let t_value = /*i*/ ctx[21] * /*scaleCoefficient*/ ctx[4] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "svelte-1eoxkun");
    			add_location(span, file$1, 141, 39, 4103);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*scaleCoefficient*/ 16 && t_value !== (t_value = /*i*/ ctx[21] * /*scaleCoefficient*/ ctx[4] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(142:10) {#if i % gaugeInterval === 0}",
    		ctx
    	});

    	return block;
    }

    // (137:8) {#each Array(gaugeScales + 1) as _,i }
    function create_each_block(ctx) {
    	let li;
    	let t;
    	let li_style_value;
    	let if_block = /*i*/ ctx[21] % /*gaugeInterval*/ ctx[2] === 0 && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (if_block) if_block.c();
    			t = space();

    			attr_dev(li, "style", li_style_value = "\r\n          " + (/*i*/ ctx[21] % /*gaugeInterval*/ ctx[2]
    			? "--scale-width:3%;"
    			: "--scale-width:5%;") + "\r\n          " + (/*i*/ ctx[21] >= /*redzone*/ ctx[5]
    			? "--scale-bg:#ff3333;"
    			: `--scale-bg:${/*gaugeColor*/ ctx[6]};`) + "\r\n          --gauge-tick:" + /*i*/ ctx[21] + ";");

    			attr_dev(li, "class", "svelte-1eoxkun");
    			add_location(li, file$1, 137, 8, 3873);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			if (if_block) if_block.m(li, null);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (/*i*/ ctx[21] % /*gaugeInterval*/ ctx[2] === 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(li, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*gaugeInterval, redzone, gaugeColor*/ 100 && li_style_value !== (li_style_value = "\r\n          " + (/*i*/ ctx[21] % /*gaugeInterval*/ ctx[2]
    			? "--scale-width:3%;"
    			: "--scale-width:5%;") + "\r\n          " + (/*i*/ ctx[21] >= /*redzone*/ ctx[5]
    			? "--scale-bg:#ff3333;"
    			: `--scale-bg:${/*gaugeColor*/ ctx[6]};`) + "\r\n          --gauge-tick:" + /*i*/ ctx[21] + ";")) {
    				attr_dev(li, "style", li_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(137:8) {#each Array(gaugeScales + 1) as _,i }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let ol;
    	let t0;
    	let aside;
    	let t1;
    	let p;
    	let t2_value = Math.floor(/*currentValue*/ ctx[3] * /*GAUGE_COEFFICIENT*/ ctx[8]) + "";
    	let t2;
    	let t3;
    	let span;
    	let t4;
    	let each_value = Array(/*gaugeScales*/ ctx[0] + 1);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			ol = element("ol");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			aside = element("aside");
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			span = element("span");
    			t4 = text(/*gaugeUnits*/ ctx[1]);
    			attr_dev(ol, "class", "svelte-1eoxkun");
    			add_location(ol, file$1, 135, 6, 3803);
    			attr_dev(aside, "class", "needle svelte-1eoxkun");
    			add_location(aside, file$1, 145, 6, 4196);
    			attr_dev(span, "class", "svelte-1eoxkun");
    			add_location(span, file$1, 148, 8, 4317);
    			attr_dev(p, "class", "value svelte-1eoxkun");
    			add_location(p, file$1, 146, 6, 4234);
    			attr_dev(div0, "class", "outline svelte-1eoxkun");
    			add_location(div0, file$1, 134, 4, 3774);
    			attr_dev(div1, "class", "speedMeter svelte-1eoxkun");
    			add_location(div1, file$1, 133, 2, 3744);
    			attr_dev(div2, "class", "speedMeterWrapper svelte-1eoxkun");
    			attr_dev(div2, "style", /*cssVarStyles*/ ctx[7]);
    			add_location(div2, file$1, 132, 0, 3686);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, ol);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ol, null);
    			}

    			append_dev(div0, t0);
    			append_dev(div0, aside);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, span);
    			append_dev(span, t4);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*gaugeInterval, redzone, gaugeColor, scaleCoefficient, gaugeScales*/ 117) {
    				each_value = Array(/*gaugeScales*/ ctx[0] + 1);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ol, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*currentValue*/ 8 && t2_value !== (t2_value = Math.floor(/*currentValue*/ ctx[3] * /*GAUGE_COEFFICIENT*/ ctx[8]) + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*gaugeUnits*/ 2) set_data_dev(t4, /*gaugeUnits*/ ctx[1]);

    			if (dirty & /*cssVarStyles*/ 128) {
    				attr_dev(div2, "style", /*cssVarStyles*/ ctx[7]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const OUTLINE_BORDER = 4;
    const SCALE_HEIGHT = 2;

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SpeedMeter", slots, []);
    	
    	let { gaugeHeight = 200 } = $$props;
    	let { gaugeWidth = 200 } = $$props;
    	let { gaugeStart = 0 } = $$props;
    	let { gaugeEnd = 100 } = $$props;
    	let { gaugeScales = 10 } = $$props;
    	let { gaugeUnits = "mph" } = $$props;
    	let { gaugeInterval = 10 } = $$props;
    	let { currentValue = 0 } = $$props;
    	let { scaleCoefficient = 10 } = $$props;
    	let { gaugeLimit = 100 } = $$props;
    	let { redzone = 100 } = $$props;
    	let { gaugeOutlineColor = "#444444" } = $$props;
    	let { gaugeColor = "#ffffff" } = $$props;
    	let { gaugeBackgroundColor = "linear-gradient(180deg, #444444 0%, #000000 100%)" } = $$props;
    	const GAUGE_RANGE = gaugeEnd - gaugeStart;
    	const GAUGE_COEFFICIENT = gaugeLimit / 100;
    	const SCALE_ORIGIN = `${gaugeHeight / 2 - OUTLINE_BORDER / 2}px 0px`;

    	/** CSS Variables */
    	const styles = {
    		"gauge-height": `${gaugeHeight}px`,
    		"gauge-width": `${gaugeWidth}px`,
    		"scale-deg": `${GAUGE_RANGE / gaugeScales}deg`,
    		"offset-deg": `${gaugeStart}deg`,
    		"outline-border": `${OUTLINE_BORDER}px`,
    		"scale-height": `${SCALE_HEIGHT}px`,
    		"scale-origin": SCALE_ORIGIN,
    		"meter-deg": "90deg",
    		"gauge-outline-color": gaugeOutlineColor,
    		"gauge-color": gaugeColor,
    		"gauge-background-color": gaugeBackgroundColor
    	};

    	/** Reactive variables */
    	let cssVarStyles;

    	const writable_props = [
    		"gaugeHeight",
    		"gaugeWidth",
    		"gaugeStart",
    		"gaugeEnd",
    		"gaugeScales",
    		"gaugeUnits",
    		"gaugeInterval",
    		"currentValue",
    		"scaleCoefficient",
    		"gaugeLimit",
    		"redzone",
    		"gaugeOutlineColor",
    		"gaugeColor",
    		"gaugeBackgroundColor"
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SpeedMeter> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("gaugeHeight" in $$props) $$invalidate(9, gaugeHeight = $$props.gaugeHeight);
    		if ("gaugeWidth" in $$props) $$invalidate(10, gaugeWidth = $$props.gaugeWidth);
    		if ("gaugeStart" in $$props) $$invalidate(11, gaugeStart = $$props.gaugeStart);
    		if ("gaugeEnd" in $$props) $$invalidate(12, gaugeEnd = $$props.gaugeEnd);
    		if ("gaugeScales" in $$props) $$invalidate(0, gaugeScales = $$props.gaugeScales);
    		if ("gaugeUnits" in $$props) $$invalidate(1, gaugeUnits = $$props.gaugeUnits);
    		if ("gaugeInterval" in $$props) $$invalidate(2, gaugeInterval = $$props.gaugeInterval);
    		if ("currentValue" in $$props) $$invalidate(3, currentValue = $$props.currentValue);
    		if ("scaleCoefficient" in $$props) $$invalidate(4, scaleCoefficient = $$props.scaleCoefficient);
    		if ("gaugeLimit" in $$props) $$invalidate(13, gaugeLimit = $$props.gaugeLimit);
    		if ("redzone" in $$props) $$invalidate(5, redzone = $$props.redzone);
    		if ("gaugeOutlineColor" in $$props) $$invalidate(14, gaugeOutlineColor = $$props.gaugeOutlineColor);
    		if ("gaugeColor" in $$props) $$invalidate(6, gaugeColor = $$props.gaugeColor);
    		if ("gaugeBackgroundColor" in $$props) $$invalidate(15, gaugeBackgroundColor = $$props.gaugeBackgroundColor);
    	};

    	$$self.$capture_state = () => ({
    		gaugeHeight,
    		gaugeWidth,
    		gaugeStart,
    		gaugeEnd,
    		gaugeScales,
    		gaugeUnits,
    		gaugeInterval,
    		currentValue,
    		scaleCoefficient,
    		gaugeLimit,
    		redzone,
    		gaugeOutlineColor,
    		gaugeColor,
    		gaugeBackgroundColor,
    		OUTLINE_BORDER,
    		SCALE_HEIGHT,
    		GAUGE_RANGE,
    		GAUGE_COEFFICIENT,
    		SCALE_ORIGIN,
    		styles,
    		cssVarStyles
    	});

    	$$self.$inject_state = $$props => {
    		if ("gaugeHeight" in $$props) $$invalidate(9, gaugeHeight = $$props.gaugeHeight);
    		if ("gaugeWidth" in $$props) $$invalidate(10, gaugeWidth = $$props.gaugeWidth);
    		if ("gaugeStart" in $$props) $$invalidate(11, gaugeStart = $$props.gaugeStart);
    		if ("gaugeEnd" in $$props) $$invalidate(12, gaugeEnd = $$props.gaugeEnd);
    		if ("gaugeScales" in $$props) $$invalidate(0, gaugeScales = $$props.gaugeScales);
    		if ("gaugeUnits" in $$props) $$invalidate(1, gaugeUnits = $$props.gaugeUnits);
    		if ("gaugeInterval" in $$props) $$invalidate(2, gaugeInterval = $$props.gaugeInterval);
    		if ("currentValue" in $$props) $$invalidate(3, currentValue = $$props.currentValue);
    		if ("scaleCoefficient" in $$props) $$invalidate(4, scaleCoefficient = $$props.scaleCoefficient);
    		if ("gaugeLimit" in $$props) $$invalidate(13, gaugeLimit = $$props.gaugeLimit);
    		if ("redzone" in $$props) $$invalidate(5, redzone = $$props.redzone);
    		if ("gaugeOutlineColor" in $$props) $$invalidate(14, gaugeOutlineColor = $$props.gaugeOutlineColor);
    		if ("gaugeColor" in $$props) $$invalidate(6, gaugeColor = $$props.gaugeColor);
    		if ("gaugeBackgroundColor" in $$props) $$invalidate(15, gaugeBackgroundColor = $$props.gaugeBackgroundColor);
    		if ("cssVarStyles" in $$props) $$invalidate(7, cssVarStyles = $$props.cssVarStyles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*currentValue, gaugeStart, styles*/ 67592) {
    			{
    				$$invalidate(16, styles["meter-deg"] = `${GAUGE_RANGE / 100 * currentValue + gaugeStart}deg`, styles);
    				$$invalidate(7, cssVarStyles = Object.entries(styles).map(([key, value]) => `--${key}:${value}`).join(";"));
    			}
    		}
    	};

    	return [
    		gaugeScales,
    		gaugeUnits,
    		gaugeInterval,
    		currentValue,
    		scaleCoefficient,
    		redzone,
    		gaugeColor,
    		cssVarStyles,
    		GAUGE_COEFFICIENT,
    		gaugeHeight,
    		gaugeWidth,
    		gaugeStart,
    		gaugeEnd,
    		gaugeLimit,
    		gaugeOutlineColor,
    		gaugeBackgroundColor,
    		styles
    	];
    }

    class SpeedMeter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			gaugeHeight: 9,
    			gaugeWidth: 10,
    			gaugeStart: 11,
    			gaugeEnd: 12,
    			gaugeScales: 0,
    			gaugeUnits: 1,
    			gaugeInterval: 2,
    			currentValue: 3,
    			scaleCoefficient: 4,
    			gaugeLimit: 13,
    			redzone: 5,
    			gaugeOutlineColor: 14,
    			gaugeColor: 6,
    			gaugeBackgroundColor: 15
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SpeedMeter",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get gaugeHeight() {
    		throw new Error("<SpeedMeter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gaugeHeight(value) {
    		throw new Error("<SpeedMeter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gaugeWidth() {
    		throw new Error("<SpeedMeter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gaugeWidth(value) {
    		throw new Error("<SpeedMeter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gaugeStart() {
    		throw new Error("<SpeedMeter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gaugeStart(value) {
    		throw new Error("<SpeedMeter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gaugeEnd() {
    		throw new Error("<SpeedMeter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gaugeEnd(value) {
    		throw new Error("<SpeedMeter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gaugeScales() {
    		throw new Error("<SpeedMeter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gaugeScales(value) {
    		throw new Error("<SpeedMeter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gaugeUnits() {
    		throw new Error("<SpeedMeter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gaugeUnits(value) {
    		throw new Error("<SpeedMeter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gaugeInterval() {
    		throw new Error("<SpeedMeter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gaugeInterval(value) {
    		throw new Error("<SpeedMeter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentValue() {
    		throw new Error("<SpeedMeter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentValue(value) {
    		throw new Error("<SpeedMeter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scaleCoefficient() {
    		throw new Error("<SpeedMeter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scaleCoefficient(value) {
    		throw new Error("<SpeedMeter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gaugeLimit() {
    		throw new Error("<SpeedMeter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gaugeLimit(value) {
    		throw new Error("<SpeedMeter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get redzone() {
    		throw new Error("<SpeedMeter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set redzone(value) {
    		throw new Error("<SpeedMeter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gaugeOutlineColor() {
    		throw new Error("<SpeedMeter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gaugeOutlineColor(value) {
    		throw new Error("<SpeedMeter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gaugeColor() {
    		throw new Error("<SpeedMeter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gaugeColor(value) {
    		throw new Error("<SpeedMeter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gaugeBackgroundColor() {
    		throw new Error("<SpeedMeter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gaugeBackgroundColor(value) {
    		throw new Error("<SpeedMeter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.37.0 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let section0;
    	let speedmeter0;
    	let t0;
    	let label0;
    	let t2;
    	let input0;
    	let t3;
    	let section1;
    	let speedmeter1;
    	let t4;
    	let label1;
    	let t6;
    	let input1;
    	let current;
    	let mounted;
    	let dispose;
    	const speedmeter0_spread_levels = [/*meterProps*/ ctx[2]];
    	let speedmeter0_props = {};

    	for (let i = 0; i < speedmeter0_spread_levels.length; i += 1) {
    		speedmeter0_props = assign(speedmeter0_props, speedmeter0_spread_levels[i]);
    	}

    	speedmeter0 = new SpeedMeter({ props: speedmeter0_props, $$inline: true });
    	const speedmeter1_spread_levels = [/*meterProps02*/ ctx[3]];
    	let speedmeter1_props = {};

    	for (let i = 0; i < speedmeter1_spread_levels.length; i += 1) {
    		speedmeter1_props = assign(speedmeter1_props, speedmeter1_spread_levels[i]);
    	}

    	speedmeter1 = new SpeedMeter({ props: speedmeter1_props, $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			section0 = element("section");
    			create_component(speedmeter0.$$.fragment);
    			t0 = space();
    			label0 = element("label");
    			label0.textContent = "現在値(0-100固定)";
    			t2 = space();
    			input0 = element("input");
    			t3 = space();
    			section1 = element("section");
    			create_component(speedmeter1.$$.fragment);
    			t4 = space();
    			label1 = element("label");
    			label1.textContent = "現在値(0-100固定)";
    			t6 = space();
    			input1 = element("input");
    			attr_dev(label0, "for", "01");
    			add_location(label0, file, 58, 4, 1353);
    			attr_dev(input0, "id", "01");
    			attr_dev(input0, "type", "range");
    			attr_dev(input0, "min", "0");
    			attr_dev(input0, "max", "100");
    			add_location(input0, file, 59, 4, 1394);
    			add_location(section0, file, 56, 2, 1304);
    			attr_dev(label1, "for", "02");
    			add_location(label1, file, 63, 4, 1533);
    			attr_dev(input1, "id", "02");
    			attr_dev(input1, "type", "range");
    			attr_dev(input1, "min", "0");
    			attr_dev(input1, "max", "100");
    			add_location(input1, file, 64, 4, 1574);
    			add_location(section1, file, 61, 2, 1482);
    			add_location(main, file, 55, 0, 1295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, section0);
    			mount_component(speedmeter0, section0, null);
    			append_dev(section0, t0);
    			append_dev(section0, label0);
    			append_dev(section0, t2);
    			append_dev(section0, input0);
    			set_input_value(input0, /*meterValue*/ ctx[0]);
    			append_dev(main, t3);
    			append_dev(main, section1);
    			mount_component(speedmeter1, section1, null);
    			append_dev(section1, t4);
    			append_dev(section1, label1);
    			append_dev(section1, t6);
    			append_dev(section1, input1);
    			set_input_value(input1, /*meterValue02*/ ctx[1]);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*input0_change_input_handler*/ ctx[4]),
    					listen_dev(input0, "input", /*input0_change_input_handler*/ ctx[4]),
    					listen_dev(input1, "change", /*input1_change_input_handler*/ ctx[5]),
    					listen_dev(input1, "input", /*input1_change_input_handler*/ ctx[5])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const speedmeter0_changes = (dirty & /*meterProps*/ 4)
    			? get_spread_update(speedmeter0_spread_levels, [get_spread_object(/*meterProps*/ ctx[2])])
    			: {};

    			speedmeter0.$set(speedmeter0_changes);

    			if (dirty & /*meterValue*/ 1) {
    				set_input_value(input0, /*meterValue*/ ctx[0]);
    			}

    			const speedmeter1_changes = (dirty & /*meterProps02*/ 8)
    			? get_spread_update(speedmeter1_spread_levels, [get_spread_object(/*meterProps02*/ ctx[3])])
    			: {};

    			speedmeter1.$set(speedmeter1_changes);

    			if (dirty & /*meterValue02*/ 2) {
    				set_input_value(input1, /*meterValue02*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(speedmeter0.$$.fragment, local);
    			transition_in(speedmeter1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(speedmeter0.$$.fragment, local);
    			transition_out(speedmeter1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(speedmeter0);
    			destroy_component(speedmeter1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	

    	const meterProps = {
    		gaugeHeight: 300,
    		gaugeWidth: 300,
    		gaugeStart: -30,
    		gaugeEnd: 210,
    		gaugeScales: 27,
    		gaugeUnits: "km/h",
    		gaugeInterval: 3,
    		currentValue: 0,
    		scaleCoefficient: 10,
    		gaugeLimit: 270,
    		redzone: 21,
    		gaugeOutlineColor: "#444444",
    		gaugeColor: "#ffffff",
    		gaugeBackgroundColor: "linear-gradient(180deg, #444444 0%, #000000 100%)"
    	};

    	const meterProps02 = {
    		gaugeHeight: 300,
    		gaugeWidth: 300,
    		gaugeStart: 30,
    		gaugeEnd: 210,
    		gaugeScales: 90,
    		gaugeUnits: "x1000 rpm",
    		gaugeInterval: 10,
    		currentValue: 0,
    		scaleCoefficient: 0.1,
    		gaugeLimit: 9000,
    		redzone: 60,
    		gaugeOutlineColor: "#cccccc",
    		gaugeColor: "#555555",
    		gaugeBackgroundColor: "linear-gradient(180deg, #eeeeee 0%, #f1f1f1 100%)"
    	};

    	let { meterValue = 0 } = $$props;
    	let { meterValue02 = 0 } = $$props;
    	const writable_props = ["meterValue", "meterValue02"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input0_change_input_handler() {
    		meterValue = to_number(this.value);
    		$$invalidate(0, meterValue);
    	}

    	function input1_change_input_handler() {
    		meterValue02 = to_number(this.value);
    		$$invalidate(1, meterValue02);
    	}

    	$$self.$$set = $$props => {
    		if ("meterValue" in $$props) $$invalidate(0, meterValue = $$props.meterValue);
    		if ("meterValue02" in $$props) $$invalidate(1, meterValue02 = $$props.meterValue02);
    	};

    	$$self.$capture_state = () => ({
    		SpeedMeter,
    		meterProps,
    		meterProps02,
    		meterValue,
    		meterValue02
    	});

    	$$self.$inject_state = $$props => {
    		if ("meterValue" in $$props) $$invalidate(0, meterValue = $$props.meterValue);
    		if ("meterValue02" in $$props) $$invalidate(1, meterValue02 = $$props.meterValue02);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*meterValue, meterValue02*/ 3) {
    			{
    				$$invalidate(2, meterProps["currentValue"] = meterValue, meterProps);
    				$$invalidate(3, meterProps02["currentValue"] = meterValue02, meterProps02);
    			}
    		}
    	};

    	return [
    		meterValue,
    		meterValue02,
    		meterProps,
    		meterProps02,
    		input0_change_input_handler,
    		input1_change_input_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { meterValue: 0, meterValue02: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get meterValue() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meterValue(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get meterValue02() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meterValue02(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
        target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
