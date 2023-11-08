/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vuex Store
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { ActionContext } from "vuex";
import moment from "moment";

// internal dependencies
import { RootState } from "./Store";
import { AwaitLock } from "../AwaitLock";
import { ActivityEntryDTO } from "../../models/ActivityDTO";
import { ActivitiesService } from "../../services/ActivityService";

// creates an "async"-lock for state of pending initialization
// this will be kept *locally* to this store module implementation
const Lock = AwaitLock.create();

/**
 * @interface ActivitiesModuleState
 * @description This interface defines the *state* for the activities module.
 * <br /><br />
 * Following *inputs* apply to the {@link ActivitiesModuleState} interface:
 * | Input | Type | Required? | Description |
 * | --- | --- | --- | --- |
 * | `initialized` | `boolean` | **Required** | Indicates whether module state has been initialized. |
 * | `activitiesItems` | `ActivityEntryDTO[]` | **Required** | The list of activity entry items as defined in {@link LeaderboardEntryDTO}. |
 *
 * <br /><br />
 * @example Using the `ActivitiesModuleState` interface
 * ```ts
 * // creating authentication contract inputs
 * const inputs = {
 *   initialized: true,
 *   activitiesItems: [
 *     {
 *       address: "NBZTCWH3FCWBEPX2MR2GLDHHIVBKWGQWDEP6C7Q",
 *       slug: "20221021-5-7996869084-96231663",
 *       provider: "strava";
 *       elapsedTime: 3600,
 *       distance: 9000,
 *       elevationGain: 0,
 *       sport: "Run",
 *       avgPace: 2,
 *       assets: [];
 *     } as ActivityEntryDTO
 *   ]
 * } as ActivitiesModuleState;
 * ```
 * <br /><br />
 *
 * @since v0.6.3
 */
export interface ActivitiesModuleState {
  initialized: boolean;
  activitiesItems: ActivityEntryDTO[];
}

/**
 * @type ActivitiesContext
 * @description This type represents the context of the activities module.
 * <br /><br />
 * This type is to manage activities module's states.
 *
 * @since v0.6.3
 */
export type ActivitiesContext = ActionContext<ActivitiesModuleState, RootState>;

/**
 * @constant ActivitiesModule
 * @description The activities vuex module.
 * <br /><br />
 * This constant contains all necessary details for
 * the activities module, including state, getters,
 * mutations and actions.
 *
 * @since v0.6.3
 */
export const ActivitiesModule = {
  /**
   * This store module is namespaced, meaning the
   * module name must be included when calling a
   * mutation, getter or action, i.e. "app/getName".
   *
   * @access public
   * @var {boolean}
   */
  namespaced: true,

  /**
   * Function to create a new state for this module.
   *
   * @access public
   * @returns {ActivitiesModuleState}
   */
  state: (): ActivitiesModuleState => ({
    initialized: false,
    activitiesItems: [],
  }),

  /**
   * The getter functions of this module.
   *
   * @access public
   * @var {object}
   */
  getters: {
    /**
     * Return the list of activity entry items as defined in {@link LeaderboardEntryDTO}.
     *
     * @access public
     * @param {ActivitiesModuleState} state
     * @returns {ActivityEntryDTO[]}
     */
    getActivityItems: (state: ActivitiesModuleState): ActivityEntryDTO[] =>
      state.activitiesItems,
  },

  /**
   * The mutation functions of this module.
   *
   * @access public
   * @var {object}
   */
  mutations: {
    /**
     * Mutation function to set the initialization status
     * to current module state.
     *
     * @access public
     * @param {ActivitiesModuleState} state
     * @param {boolean} payload
     * @returns {boolean}
     */
    setInitialized: (state: ActivitiesModuleState, payload: boolean): boolean =>
      (state.initialized = payload),

    /**
     * Mutation function to set the activities list
     * to current app state.
     *
     * @access public
     * @param {ActivitiesModuleState} state
     * @param {ActivityEntryDTO[]} payload
     * @returns {ActivityEntryDTO[]}
     */
    setActivities: (
      state: ActivitiesModuleState,
      payload: ActivityEntryDTO[]
    ): ActivityEntryDTO[] => (state.activitiesItems = payload),
  },

  /**
   * The action methods of this module.
   *
   * @access public
   * @var {object}
   */
  actions: {
    /**
     * Action method to initialize the module.
     *
     * @access public
     * @async
     * @param {ActivitiesContext} context
     * @returns {Promise<boolean>}
     */
    async initialize(context: ActivitiesContext): Promise<boolean> {
      const callback = () => {
        // initialization is done after fetch
        context.commit("setInitialized", true);
      };

      // acquire async lock until initialized
      await Lock.initialize(callback, context);
      return true;
    },

    /**
     * Action method to fetch the activities list and
     * update the module's current state.
     *
     * @access public
     * @async
     * @param {ActivitiesContext} context
     * @param {string} address
     * @returns {Promise<void>}
     */
    async fetchActivities(
      context: ActivitiesContext,
      address: string
    ): Promise<void> {
      try {
        const service = new ActivitiesService();
        const items = await service.getActivities(address);

        const mappedItems = items.map((item) => ({
          ...item,
          elapsedTime: moment(item.elapsedTime).format("HH:mm:ss"),
          avgPace: (item.elapsedTime / item.distance).toFixed(2),
        }));

        context.commit("setActivities", mappedItems);
      } catch (err) {
        console.log("fetchActivities", err);
      }
    },
  },
};
