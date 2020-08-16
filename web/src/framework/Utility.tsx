import React from 'react';

class Utility {

    public arrayToLine(a: Array<any>) : string {
        return a.join(", ");
    }
    public arrayToMultiline(a: Array<any>) : string {
        return a.join("{\n}");
    }

    public getListRep(a: Array<any>) {
        if (a && Array.isArray(a)) {
            return (
                <>
                    {
                        a.map((s) => (
                            <p key={s}>{s}<br/></p>
                        ))
                    }
                </>
            );
        } else {
            return a;
        }
    }

    public hoursFromMinutes( minutes: number | undefined ) {
        
        if (!minutes) { return 0 }
        return Math.round((minutes / 60 + Number.EPSILON) * 100) / 100;

    }

    public getPercentage(value: number | undefined, of: number | undefined) {

        if (of && of > 0)
            return Math.round((value ?? 0) * 100 / of );
        
        return 0;
    }

}

export default new Utility();