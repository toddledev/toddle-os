import type { ActionModel, Component } from '../src/component/component.types';
import { Formula } from '../src/formula/formula';
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
    get formulas(): any;
    get name(): any;
    get route(): any;
    get attributes(): any;
    get variables(): any;
    get workflows(): any;
    get apis(): {
        [k: string]: any;
    };
    get nodes(): any;
    get events(): any;
    get onLoad(): any;
    get onAttributeChange(): any;
    get isPage(): any;
}
