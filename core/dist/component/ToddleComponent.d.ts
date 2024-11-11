import { ToddleApiV2 } from '@toddle/core/src/api/ToddleApiV2';
import type { ActionModel, Component, NodeModel } from '@toddle/core/src/component/component.types';
import { Formula } from '@toddle/core/src/formula/formula';
import { LegacyToddleApi } from '../api/LegacyToddleApi';
export declare class ToddleComponent {
    private component;
    private getComponent;
    packageName?: string;
    constructor({ component, getComponent, packageName, }: {
        component: Component;
        getComponent: (name: string, packageName?: string) => Component | undefined;
        packageName: string | undefined;
    });
    get uniqueSubComponents(): ToddleComponent[];
    get formulaReferences(): Set<string>;
    get actionReferences(): Set<string>;
    /**
     * Traverse all formulas in the component.
     * @returns An iterable that yields the path and formula.
     */
    formulasInComponent(): Generator<[(string | number)[], Formula]>;
    /**
     * Traverse all actions in the component.
     * @returns An iterable that yields the path and action.
     */
    actionModelsInComponent(): Generator<[(string | number)[], ActionModel]>;
    get formulas(): Record<string, {
        name: string;
        arguments: Array<{
            name: string;
            testValue: any;
        }>;
        memoize?: boolean;
        exposeInContext?: boolean;
        formula: Formula;
    }> | undefined;
    get name(): string;
    get route(): import("@toddle/core/src/component/component.types").PageRoute | null | undefined;
    get attributes(): Record<string, {
        name: string;
        testValue: unknown;
    }>;
    get variables(): Record<string, {
        initialValue: Formula;
    }>;
    get workflows(): Record<string, {
        name: string;
        parameters: Array<{
            name: string;
            testValue: any;
        }>;
        actions: ActionModel[];
        exposeInContext?: boolean;
    }> | undefined;
    get apis(): {
        [k: string]: LegacyToddleApi | ToddleApiV2;
    };
    get nodes(): Record<string, NodeModel>;
    get events(): {
        name: string;
        dummyEvent: any;
    }[] | undefined;
    get onLoad(): import("@toddle/core/src/component/component.types").EventModel | undefined;
    get onAttributeChange(): import("@toddle/core/src/component/component.types").EventModel | undefined;
    get isPage(): boolean;
}
