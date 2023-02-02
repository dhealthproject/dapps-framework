/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Components
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 * Function to convert a snake case string to camel case.
 *
 * @access public
 * @param {string} str Input string, in snake case format e.g. `"var_name"`.
 * @returns {string} Output string, in camel case format e.g. `"varName"`.
 */
export const camelize = (str: string): string => {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
};

/**
 * Function to convert a camel case string to snake case.
 *
 * @access public
 * @param {string} str Input string, in camel case format e.g. `"varName"`
 * @returns {string} Output string, in camel case format e.g. `"var_name"`.
 */
export const hyphenate = (str: string): string => {
  return str.replace(/\B([A-Z])/g, "-$1").toLowerCase();
};

/**
 * Function to create an object and initialize it with a list of properties
 * with undefined value.
 *
 * @access public
 * @param {string[]} propsList An array list of property names
 * @returns {Record<string, undefined>}
 */
export function getInitialProps(propsList: string[]): Record<string, undefined> {
  const res: Record<string, undefined> = {};
  propsList.forEach((key: string) => {
    res[key] = undefined;
  });
  return res;
}

/**
 * Function to inject a hook into an options object.
 *
 * @access public
 * @param {any} options
 * @param {string} key
 * @param {any} hook
 * @returns {void}
 */
export function injectHook(options: any, key: string, hook: any): void {
  options[key] = [].concat(options[key] || []);
  options[key].unshift(hook);
}

/**
 * Function to call hooks from vm.
 *
 * @access public
 * @param {any} vm
 * @param {any} hook
 * @returns {void}
 */
export function callHooks(vm: any, hook: any): void {
  if (vm) {
    const hooks = vm.$options[hook] || [];
    hooks.forEach((hook: any) => {
      hook.call(vm);
    });
  }
}

/**
 * Function to create a new {@link CustomEvent} instance.
 *
 * @access public
 * @param {string} name
 * @param {object[]} args
 * @returns {CustomEvent}
 */
export function createCustomEvent(name: string, args: object[]): CustomEvent {
  return new CustomEvent(name, {
    bubbles: false,
    cancelable: false,
    detail: args,
  });
}

/**
 * Function to test if a string value represents a boolean value.
 *
 * @access public
 * @param {string} val
 * @returns {boolean}
 */
const isBoolean = (val: string): boolean => /function Boolean/.test(String(val));

/**
 * Function to test if a string value represents a number value.
 *
 * @access public
 * @param {string} val
 * @returns {boolean}
 */
const isNumber = (val: string): boolean => /function Number/.test(String(val));

/**
 * Function to convert an attribute value to boolean, number
 * or original (string) value.
 *
 * @access public
 * @param {string} value
 * @param {string} name
 * @param { { type } } param2
 * @returns {boolean | number | string}
 */
export function convertAttributeValue(
  value: string,
  name: string,
  { type }: any = {}
): boolean | number | string {
  if (isBoolean(type)) {
    if (value === "true" || value === "false") {
      return value === "true";
    }
    if (value === "" || value === name || value != null) {
      return true;
    }
    return value;
  } else if (isNumber(type)) {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? value : parsed;
  } else {
    return value;
  }
}

/**
 * Function to convert a list of children nodes to vnodes.
 *
 * @access public
 * @param {any} h
 * @param {any} children
 * @returns {(object | null)[]}
 */
export function toVNodes(h: any, children: any): (object | null)[] {
  const res = [];
  for (let i = 0, l = children.length; i < l; i++) {
    res.push(toVNode(h, children[i]));
  }
  return res;
}

/**
 * Function to convert a child node to vnode.
 *
 * @access public
 * @param {any} h
 * @param {any} node
 * @returns {object | null}
 */
function toVNode(h: any, node: any): object | null {
  if (node.nodeType === 3) {
    return node.data.trim() ? node.data : null;
  } else if (node.nodeType === 1) {
    const data: any = {
      attrs: getAttributes(node),
      domProps: {
        innerHTML: node.innerHTML,
      },
    };
    if (data.attrs.slot) {
      data.slot = data.attrs.slot;
      delete data.attrs.slot;
    }
    return h(node.tagName, data);
  } else {
    return null;
  }
}

/**
 * Function to convert a node to an object with all attributes.
 *
 * @access public
 * @param {any} node
 * @returns {object}
 */
function getAttributes(node: any): object {
  const res: any = {};
  for (let i = 0, l = node.attributes.length; i < l; i++) {
    const attr = node.attributes[i];
    res[attr.nodeName] = attr.nodeValue;
  }
  return res;
}
