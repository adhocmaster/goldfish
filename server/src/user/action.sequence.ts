export class ActionSequence {

    map: Map<string, string | undefined>;
    #first: string;
    constructor(first: string, map?: Map<string, string | undefined>) {

        this.map = new Map();

        if (map) {
            for (let [key, value] of map) {
                this.map.set(key, value);
            }
        } else {
            this.map = new Map();
        }
        this.#first = first;

        console.log(map);

        console.log(this.map);

    }

    next(action: string | undefined) { 

        if(!action) {
            return this.first();
        }

        if (this.map.has(action)) {
            return this.map.get(action);
        }
        return undefined;
    }

    first() {
        return this.#first;
    }
}

let accountActionMap = new Map([
    [ "how-it-works", "default-goals" ],
    [ "default-goals", "default-week-template" ],
    [ "default-week-template", "default-week-schedule" ],
    [ "default-week-schedule", undefined ]
])

const accountActionSequence = new ActionSequence("how-it-works", accountActionMap);

export { accountActionSequence };