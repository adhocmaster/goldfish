export class ActionSequence {

    map: Map<string, string | undefined>;
    #first: string;
    constructor(first: string, map?: Map<string, string | undefined>) {

        if (map) {
            for (let key in map) {
                this.map.set(key, map.get(key));
            }
        } else {
            this.map = new Map();
        }
        this.#first = first;

    }

    next(action: string) {
        if (action in this.map) {
            return this.map.get(action);
        }
        return undefined;
    }

    first() {
        return this.#first;
    }
}

let accountActionMap = new Map([
    [ "how-it-works", "default-week-template" ],
    [ "default-week-template", "default-week-schedule" ],
    [ "default-week-schedule", undefined ]
])

const accountActionSequence = new ActionSequence("how-it-works", accountActionMap);

export { accountActionSequence };