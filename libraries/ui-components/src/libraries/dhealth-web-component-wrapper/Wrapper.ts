/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Components
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import _Vue, { Component, AsyncComponent } from "vue";
// internal dependencies
import {
  toVNodes,
  camelize,
  hyphenate,
  callHooks,
  injectHook,
  getInitialProps,
  createCustomEvent,
  convertAttributeValue,
} from "./Utils";

export default function webComponentWrap(
  Vue: typeof _Vue,
  Component: Component | AsyncComponent,
  styleElement: HTMLStyleElement
): HTMLElement {
  const isAsync = typeof Component === "function" && !(Component as any).cid;
  let isInitialized = false;
  let hyphenatedPropsList: string[];
  let camelizedPropsList: string[];
  let camelizedPropsMap: Record<string, any>;

  function initialize(Component: any) {
    if (isInitialized) return;

    const options =
      typeof Component === "function" ? Component.options : Component;

    // extract props info
    const propsList = Array.isArray(options.props)
      ? options.props
      : Object.keys(options.props || {});
    hyphenatedPropsList = propsList.map(hyphenate);
    camelizedPropsList = propsList.map(camelize);
    const originalPropsAsObject = Array.isArray(options.props)
      ? {}
      : options.props || {};
    camelizedPropsMap = camelizedPropsList.reduce(
      (map: Record<string, any>, key: string, i: number) => {
        map[key] = originalPropsAsObject[propsList[i]];
        return map;
      },
      {}
    );

    // proxy $emit to native DOM events
    injectHook(
      options,
      "beforeCreate",
      function (this: typeof Component | AsyncComponent) {
        const emit = this.$emit;
        this.$emit = (name: string, ...args: object[]) => {
          this.$root.$options.customElement.dispatchEvent(
            createCustomEvent(name, args)
          );
          return emit.call(this, name, ...args);
        };
      }
    );

    injectHook(
      options,
      "created",
      function (this: typeof Component | AsyncComponent) {
        // sync default props values to wrapper on created
        camelizedPropsList.forEach((key: string) => {
          this.$root.props[key] = this[key];
        });
      }
    );

    // proxy props as Element properties
    camelizedPropsList.forEach((key: string) => {
      Object.defineProperty(CustomElement.prototype, key, {
        get() {
          return this._wrapper.props[key];
        },
        set(newVal) {
          this._wrapper.props[key] = newVal;
        },
        enumerable: false,
        configurable: true,
      });
    });

    isInitialized = true;
  }

  function syncAttribute(el: CustomElement, key: string) {
    const camelized = camelize(key);
    const value = el.hasAttribute(key) ? el.getAttribute(key) : undefined;
    if (!value) return;
    el._wrapper.props[camelized] = convertAttributeValue(
      value,
      key,
      camelizedPropsMap[camelized]
    );
  }

  class CustomElement extends HTMLElement {
    public _wrapper: Record<string, any>;
    constructor() {
      super();
      // const self: CustomElement = this;
      this.attachShadow({ mode: "open" });

      const wrapper = (this._wrapper = new (Vue as any)({
        name: "shadow-root",
        customElement: this,
        shadowRoot: this.shadowRoot,
        data() {
          return {
            props: {},
            slotChildren: [],
          };
        },
        render(h: any) {
          return h(
            Component,
            {
              ref: "inner",
              props: this.props,
            },
            this.slotChildren
          );
        },
      }));

      // Use MutationObserver to react to future attribute & slot content change
      const observer = new MutationObserver((mutations: MutationRecord[]) => {
        let hasChildrenChange = false;
        for (let i = 0; i < mutations.length; i++) {
          const m = mutations[i];
          if (
            isInitialized &&
            m.type === "attributes" &&
            m.target === this &&
            m.attributeName
          ) {
            syncAttribute(this, m.attributeName);
          } else {
            hasChildrenChange = true;
          }
        }
        if (hasChildrenChange) {
          wrapper.slotChildren = Object.freeze(
            toVNodes(wrapper.$createElement, this.childNodes)
          );
        }
      });
      observer.observe(this, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
      });
    }

    get vueComponent() {
      return this._wrapper.$refs.inner;
    }

    connectedCallback() {
      const wrapper = this._wrapper;
      if (!wrapper._isMounted) {
        // initialize attributes
        const syncInitialAttributes = () => {
          wrapper.props = getInitialProps(camelizedPropsList);
          hyphenatedPropsList.forEach((key) => {
            syncAttribute(this, key);
          });
        };

        if (isInitialized) {
          syncInitialAttributes();
        } else {
          // async & unresolved
          (Component as CallableFunction)().then(
            (resolved: Record<string | symbol, any>) => {
              if (
                resolved.__esModule ||
                resolved[Symbol.toStringTag] === "Module"
              ) {
                resolved = resolved.default;
              }
              initialize(resolved);
              syncInitialAttributes();
            }
          );
        }
        // initialize children
        wrapper.slotChildren = Object.freeze(
          toVNodes(wrapper.$createElement, this.childNodes)
        );
        wrapper.$mount();
        this.shadowRoot?.appendChild(wrapper.$el);
        this.shadowRoot?.appendChild(styleElement);
      } else {
        callHooks(this.vueComponent, "activated");
      }
    }

    disconnectedCallback() {
      callHooks(this.vueComponent, "deactivated");
    }
  }

  if (!isAsync) {
    initialize(Component);
  }

  return CustomElement as unknown as HTMLElement;
}
