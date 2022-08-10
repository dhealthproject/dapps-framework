/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Components
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
};

export const hyphenate = (str: string) => {
  return str.replace(/\B([A-Z])/g, "-$1").toLowerCase();
};

export function getInitialProps(propsList: string[]) {
  const res: Record<string, undefined> = {};
  propsList.forEach((key: string) => {
    res[key] = undefined;
  });
  return res;
}

export function injectHook(options: any, key: string, hook: any) {
  options[key] = [].concat(options[key] || []);
  options[key].unshift(hook);
}

export function callHooks(vm: any, hook: any) {
  if (vm) {
    const hooks = vm.$options[hook] || [];
    hooks.forEach((hook: any) => {
      hook.call(vm);
    });
  }
}

export function createCustomEvent(name: string, args: object[]) {
  return new CustomEvent(name, {
    bubbles: false,
    cancelable: false,
    detail: args,
  });
}

const isBoolean = (val: string) => /function Boolean/.test(String(val));
const isNumber = (val: string) => /function Number/.test(String(val));

export function convertAttributeValue(
  value: string,
  name: string,
  { type }: any = {}
) {
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

export function toVNodes(h: any, children: any) {
  const res = [];
  for (let i = 0, l = children.length; i < l; i++) {
    res.push(toVNode(h, children[i]));
  }
  return res;
}

function toVNode(h: any, node: any) {
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

function getAttributes(node: any) {
  const res: any = {};
  for (let i = 0, l = node.attributes.length; i < l; i++) {
    const attr = node.attributes[i];
    res[attr.nodeName] = attr.nodeValue;
  }
  return res;
}
