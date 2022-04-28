/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 * @type TemplateGeneratorFunction
 * @description This type defines a contract for template
 * generator functions to make sure that they always return
 * `string`-typed templates.
 *
 * @since v0.1.0
 */
export type TemplateGeneratorFunction = () => string;

/**
 * @interface Template
 * @description This interface defines base attributes
 * of template parts that can be created to layout some
 * components using Vue's syntax of augmented HTML.
 * <br /><br />
 * Use the `generator` property to set a custom arrow
 * function as the template generator. This generator
 * will be called when Vue's `<Suspense>` is ready to
 * display the corresponding template part.
 *
 * @since v0.1.0
 */
export interface Template {
  /**
   * The template body HTML. This should be formatted
   * using Vue's syntax for augmented HTML.
   * <br /><br />
   * In case this is left empty, a {@link generator} entry
   * will be expected to generate the template body.
   *
   * @var {string}
   */
  body?: string;

  /**
   * The template generator function. This is optional
   * and should be used only if template generation is
   * more complex than using a `string`-typed template.
   *
   * @var {TemplateGeneratorFunction}
   */
  generator?: TemplateGeneratorFunction;
}

/**
 * @class Layout
 * @description This class handles layout templates and
 * the creation thereof. Typically, a layout instance is
 * created with a set of {@link Template} parts that
 * are assembled from an indexed list of templates.
 * <br /><br />
 * Each template part can be passed either as a predefined
 * template or as an arrow function that returns a `string`
 * typed template. Those are called template generators.
 * Please make sure to always use Vue's syntax when you
 * use this feature because this class does *not* handle
 * validation of the underlying templates.
 * <br /><br />
 * The currently supported layout as of this version of
 * the software are the following:
 * <br /><br />
 *   - {@link Component}: Uses a single component page, e.g. a log-in widget.
 *   - {@link Flex}: Uses flexible components, i.e. position of card depends on size of previous cards.
 *   - {@link Grid}: Uses a components grid, i.e. uses a 12-columns grid of cards.
 * <br /><br />
 * @example Using the Layout class
 * ```typescript
 *   // create a new layout
 *   const layout = new Layout([{
 *     body: "<template>...</template>"
 *   }]);
 *
 *   // or using a generator
 *   const layout = new Layout([{ generator: () => {
 *     // doing some magic tricks here
 *     // and here also
 *
 *     // then return as string
 *     return "<template></template>";
 *   }}])
 * ```
 *
 * <br /><br />
 * #### Properties
 *
 * @param   {Template[]}     templates         The template parts that are assembled to build the layout.
 *
 * @since v0.1.0
 */
export class Layout {
  /**
   * The template parts that are assembled to build
   * the layout. Template parts are concatenated in
   * a sequential process where the indexes define
   * the order of assembly.
   *
   * @var {Template[]}
   */
  protected templates: Template[];

  /**
   * Constructs a layout instance around its {@link Template}
   * template parts.
   *
   * @access public
   * @param   {Template[]}      parts      The template parts that are assembled to build the layout.
   * @returns {Layout}
   */
  public constructor(
    parts: Template[] = [],
  ) {
    this.templates = parts;
  }
}

/**
 * @class GridLayout
 * @description This class extends the {@link Layout} class to
 * build a **grid layout**. Grids consist in a predefined number
 * of rows and columns such that the screen is split into multiple
 * boxes that are all of the same size. The default grid system
 * offered by Tailwind allows up to 12-columns.
 * <br /><br />
 * The grid layout is useful to build dashboard screens, detail
 * screens and custom app screens.
 * <br /><br />
 * @example Using the GridLayout class
 * ```typescript
 *   // create a new grid layout
 *   const layout = new GridLayout();
 * ```
 *
 * @since v0.1.0
 */
export class GridLayout extends Layout {
  public constructor() {
    super([{ body: `
<div class="grid grid-cols-12">
  <template v-for="(item, index) in schema">
    <div :class="{
      "card": true,
      "col-auto": !item.columnSpan || item.columnSpan <= 0,
      "col-span-1": item.columnSpan === 2,
      "col-span-2": item.columnSpan === 2,
      "col-span-3": item.columnSpan === 3,
      "col-span-4": item.columnSpan === 4,
      "col-span-5": item.columnSpan === 5,
      "col-span-6": item.columnSpan === 6,
      "col-span-full": item.columnSpan >= 7,
    }>
      <div class="card-header"></div>
      <div class="card-body">
        <component
          :is="item.component"
          :style="item.customStyles"
          v-bind="item"
          :key="'col' + item.title + index"
        />
      </div>
      <div class="card-footer"></div>
  </template>
</div>
`}]);
  }
}

/**
 * @class FlexLayout
 * @description This class extends the {@link Layout} class to
 * build a **flex layout**. Flexible cards consist in template
 * parts that are *adaptive* depending potentially on: 1. their
 * content ; 2. the page size and ; 3. their siblings' size.
 * <br /><br />
 * The flex layout is useful to build dashboard screens, vertical
 * screens (or "timelines") and custom app screens.
 * <br /><br />
 * @example Using the FlexLayout class
 * ```typescript
 *   // create a new flex layout
 *   const layout = new FlexLayout();
 * ```
 *
 * @since v0.1.0
 */
export class FlexLayout extends Layout {
  public constructor() {
    super([
      {
        body: `
<div class="flex">
  <template v-for="(item, index) in schema">
    <div :class="{
      "card": true,
      "w-full": item.fullWidth === true,
      "flex-auto": !item.fullWidth && !item.disableFlex,
      "flex-none": item.disableFlex,
    }>
      <div class="card-header"></div>
      <div class="card-body">
        <component
          :is="item.component"
          class="card-f"
          :class="{
            'card-f': true,
            'card-full-width': item.displaySize === 'full-width',
            'card-adaptive': item.displaySize === 'adaptive'
          }"
          :style="item.customStyles"
          v-bind="item"
          :key="'col' + item.title + index"
        />
      </div>
      <div class="card-footer"></div>
    </div>
  </template>
</div>
`}]);
  }
}

/**
 * @class SingularLayout
 * @description This class extends the {@link Layout} class to
 * build a **single component page**. Typically, such single
 * component pages display only *one* component that is centered
 * both vertically and horizontally.
 * <br /><br />
 * The single component layout is useful to build log-in and sign-up
 * screens or focussed feature screens.
 * <br /><br />
 * @example Using the SingularLayout class
 * ```typescript
 *   // create a new single component layout
 *   const layout = new SingularLayout();
 * ```
 *
 * @since v0.1.0
 */
export class SingularLayout extends Layout {
  public constructor() {
    super([
      {
        body: `
<div class="place-content-center">
  <template v-for="(item, index) in schema">
    <div :class="{
      "card": true,
    }>
      <div class="card-header"></div>
      <div class="card-body">
        <component
          :is="item.component"
          class="card-f"
          :class="{
            'card-f': true,
            'card-full-width': item.displaySize === 'full-width',
            'card-adaptive': item.displaySize === 'adaptive'
          }"
          :style="item.customStyles"
          v-bind="item"
          :key="'col' + item.title + index"
        />
      </div>
      <div class="card-footer"></div>
    </div>
  </template>
</div>
`}]);
  }
}

/**
 * @class DefaultLayout
 * @description This class extends the {@link FlexLayout} class
 * and creates a **flex layout**. Read the documentation of the
 * parent class for more information.
 * <br /><br />
 * @example Using the DefaultLayout class
 * ```typescript
 *   // create a new default layout (flex)
 *   const layout = new DefaultLayout();
 * ```
 *
 * @since v0.1.0
 */
export class DefaultLayout extends FlexLayout {};

/**
 * @class CustomLayout
 * @description This class extends the {@link Layout} class
 * and creates a **custom layout**. Note that this layout
 * will be empty. If you want to make use of this class,
 * you may need to extend it to populate the template parts.
 * <br /><br />
 * @example Using the CustomLayout class
 * ```typescript
 *   // create a new custom layout
 *   const layout = new CustomLayout();
 * ```
 *
 * @since v0.1.0
 */
export class CustomLayout extends Layout {};

/**
 * @type LayoutType
 * @description This type defines the layout identifiers
 * that are available and pre-configured with this software.
 * <br /><br />
 * This type serves internally to limit the {@link Layouts} keys.
 *
 * @since v0.1.0
 */
export type LayoutType = 'default' | 'custom' | 'grid' | 'flex' | 'singular';

/**
 * @var Layouts
 * @description This variable contains all available layouts
 * and an instance of the corresponding layout class.
 *
 * @since v0.1.0
 */
export const Layouts = new Map<LayoutType, Layout>([
  ['custom', new CustomLayout()],
  ['default', new DefaultLayout()],
  ['grid', new GridLayout()],
  ['flex', new FlexLayout()],
  ['singular', new SingularLayout()],
]);
