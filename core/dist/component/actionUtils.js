"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActionsInAction = getActionsInAction;
const util_1 = require("../utils/util");
function* getActionsInAction(action, path = []) {
    if (!(0, util_1.isDefined)(action)) {
        return;
    }
    yield [path, action];
    switch (action.type) {
        case 'SetVariable':
        case 'SetURLParameter':
        case 'TriggerEvent':
        case 'TriggerWorkflow':
            break;
        case 'Fetch':
            for (const [key, a] of Object.entries(action.onSuccess?.actions ?? {})) {
                yield* getActionsInAction(a, [...path, 'onSuccess', 'actions', key]);
            }
            for (const [key, a] of Object.entries(action.onError?.actions ?? {})) {
                yield* getActionsInAction(a, [...path, 'onError', 'actions', key]);
            }
            break;
        case 'Custom':
        case undefined:
            for (const [eventKey, event] of Object.entries(action.events ?? {})) {
                for (const [key, a] of Object.entries(event?.actions ?? {})) {
                    yield* getActionsInAction(a, [
                        ...path,
                        'events',
                        eventKey,
                        'actions',
                        key,
                    ]);
                }
            }
            break;
        case 'Switch':
            for (const [key, c] of action.cases.entries()) {
                for (const [actionKey, a] of Object.entries(c?.actions ?? {})) {
                    yield* getActionsInAction(a, [
                        ...path,
                        'cases',
                        key,
                        'actions',
                        actionKey,
                    ]);
                }
            }
            for (const [actionKey, a] of Object.entries(action.default.actions)) {
                yield* getActionsInAction(a, [...path, 'default', 'actions', actionKey]);
            }
            break;
    }
}
//# sourceMappingURL=actionUtils.js.map