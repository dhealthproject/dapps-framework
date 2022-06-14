/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { Component } from "vue-property-decorator";
import { Prop, Vue } from "vue-property-decorator";

// internal dependencies
import {
  Card,
  CardComponentData,
  CardDisplayMode,
  Layout,
  Layouts,
  LayoutType,
  Page,
  State,
} from "@/kernel";
import { MetaView } from "@/views/MetaView";

// child components
import { AppComponents, LibComponents } from "@/components";

/**
 * @class Assembler
 * @description This component displays a dynamically built
 * template from our meta-programming configuration that is
 * available in `config/modules/`. This assembler class takes
 * a {@link Page} property that consists of a set of cards and
 * layout options combined to state discovery dependencies and
 * possibly formatters.
 * <br /><br />
 * This component uses the {@link Layout} class and extending
 * alternatives to render the template. TailWind classes are
 * used to modify the positioning and flow of elements.
 * <br /><br />
 * Warning: This component serves as a base to display any page
 * in the software. It does not currently implement a security
 * or verification feature for module configuration files. Next
 * iterations on this class may add these features or use them
 * given they may be implemented in the kernel directly.
 * <br /><br />
 * @example Using the Assembler component
 * ```html
 *   <template>
 *     <Assembler
 *       :page="{...}"
 *     />
 *   </template>
 * ```
 *
 * <br /><br />
 * #### Parameters
 *
 * @param  {Page}     page           The page configuration object, i.e. should contain cards, layouts and state configuration.
 *
 * @since v0.1.0
 */
@Component({})
export default class Assembler extends MetaView {
  /**
   * The page configuration object, i.e. should contain cards,
   * layouts and state configuration. This property refers to
   * the currently displayed (dynamic) module page.
   *
   * @access protected
   * @var {Page}
   */
  @Prop({ default: {}, required: true }) protected page?: Page;

  /**
   * The type of layout used to display the current page. Our
   * kernel provides with multiple base layouts and templates
   * that you can find in {@link Layout}.
   *
   * @access protected
   * @var {LayoutType}
   */
  protected layoutType: LayoutType = "default" as LayoutType;

  /**
   * The layout instance being used. This property is used to
   * determine the *template* that will be rendered and makes
   * use of the {@link Layout} class instances as provided by
   * the kernel.
   *
   * @access protected
   * @var {LayoutType}
   */
  protected layout: Layout = Layouts["default"];

  /**
   * Getter for the **required** page configuration object. This
   * method uses the {@link Page} property and requires it to be
   * set or fails.
   * <br /><br />
   * It is recommended to use this getter method for code related
   * to the {@link Page} class property as it requires the prop to
   * have a value.
   *
   * @access protected
   * @returns {Page}
   */
  protected get currentPage(): Page {
    return undefined === this.page ? ({} as Page) : this.page;
  }

  /**
   * Hook called upon component creation. This method is called
   * first, before the {@link render} method and requires the `page`
   * property to be set. It will use the `page` property to set
   * the correct {@link LayoutType} and {@link Layout} instances.
   * <br /><br />
   * This step of the *rendering process* for this component is
   * important to determine the shape and layout used for display
   * of individual cards on the page.
   *
   * @access public
   * @returns {void}
   */
  public created() {
    this.layoutType = this.currentPage.layout;

    // read the actual layout by type
    this.layout = !(this.layoutType in Layouts)
      ? (Layouts["default"] as Layout)
      : (Layouts[this.layoutType] as Layout);

    console.log("[Assembler] displaying page: ", this.currentPage);
    console.log("[Assembler] using layoutType: ", this.layoutType);

    if (this.currentPage) {
      console.log("initialize", this.currentPage.dependencies);
    }
  }

  /**
   * Hook called when rendering happens. This is the second
   * step in the lifecycle of this component. This method
   * should always return a *pre-built* template and uses
   * the {@link Layout} class' `render()` method to get the
   * correct template markup.
   * <br /><br />
   * The component properties are passed into this template's
   * scope, i.e. you can access the `page` object directly in
   * the template.
   *
   * @access public
   * @returns {VNode}
   */
  public render() {
    return new Vue({
      parent: this,
      components: {
        ...AppComponents,
        ...LibComponents,
      },
      template: this.layout.render(),
      props: ["page"],
      computed: {
        currentPage(): Page {
          return undefined === this.page ? ({} as Page) : this.page;
        },
      },
      methods: {
        getDisplayMode: this.getDisplayMode,
        shouldDisplayCard: this.shouldDisplayCard,
        getData: this.getData,
      },
      propsData: {
        page: this.page,
      },
    }).$mount();
  }

  /**
   * Hook called upon mounting the component on a Vue instance.
   * This method is called after the {@link render} method and
   * after the {@link created} method. It will use the `page`
   * property to initialize state dependencies and formatters.
   * <br /><br />
   * This is the last step of a component's *setup process* and
   * completion marks the end of the **rendering process** for
   * this component. The process of mounting a component is where
   * the virtual DOM is translated into the real DOM.
   *
   * @access public
   * @return {void}
   */
  public mounted() {
    console.log("mounted");
    console.log(this.currentPage);
  }

  /**
   * Forwards a getter call to the vuex store. This
   * method is used internally to retrieve data for
   * individual card components using their dynamic
   * state discovery configuration.
   * <br /><br />
   * Retrieves a card component's data using the vuex
   * store getter that is configured with `state.getter`
   * configuration field.
   *
   * @access protected
   * @param     {Card}    card    The card component that is being assessed.
   * @returns   {CardComponentData}
   */
  protected getData(card: Card): CardComponentData {
    // this method is used only if the card uses vuex
    // store getters/mutations/actions.
    if (undefined === card.state) {
      return {};
    }

    // retrieves the data getter
    const { getter } = card.state as State;

    // avoids vuex store errors about unknown getter
    if (undefined === getter || !getter.length) {
      return {};
    }

    // forwards the getter call to vuex store
    return this.$store.getters[getter] as CardComponentData;
  }

  /**
   * Returns the display mode for the current page. Notably,
   * the display mode is responsible for size configuration
   * and lets developers add custom classes, or TailWind CSS
   * classes to specific components.
   * <br /><br />
   * The boolean field values for `onEmpty` and `onError` as
   * defined in {@link CardDisplayMode} lets developers configure
   * the display/hiding of the component in case of empty
   * datasets or errors.
   *
   * @param   {Card}  card    The card being displayed.
   * @returns {CardDisplayMode}
   */
  protected getDisplayMode(card: Card): CardDisplayMode {
    // returns default display mode
    if (!("display" in card) || undefined === card.display) {
      return {
        size: "flex",
        onEmpty: true,
        onError: false,
        classes: [],
      } as CardDisplayMode;
    }

    return card.display;
  }

  /**
   * This method determines whether a card component should
   * be displayed or not with the current state. In case the
   * data is already available, this method always returns
   * `true`, whereas if the data is not yet available, it will
   * only display the component when the card configuration
   * field `display.onEmpty` is set to a truthy value.
   * <br /><br />
   * This is used internally to hide/display card components
   * depending on the emptiness of their datasets and allows
   * to display a message about the data being empty.
   *
   * @param card
   */
  protected shouldDisplayCard(card: Card): boolean {
    // retrieves data using dynamic store getter
    const data: any = this.getData(card);

    // in cases where the card data is already
    // loaded, we *always* display cards.
    if (undefined !== data) {
      return true;
    }

    // otherwise, when data is not yet loaded or
    // when an error occured, we should only display
    // the card according to the display configuration
    if (undefined === card.display) {
      // maps default card display if none is set
      card.display = {
        size: "adapt-to-content",
        onEmpty: true,
        onError: false,
      } as CardDisplayMode;
    }

    // displays only according to card configuration
    // this will only display the card if the card's
    // display configuration has `onEmpty` set to a
    // *truthy* value including `true` and `1`.
    return !!card.display.onEmpty;
  }
}
