import React from 'react';

class Utility {

    public arrayToLine(a: Array<any>) : string {
        return a.join(", ");
    }
    public arrayToMultiline(a: Array<any>) : string {
        return a.join("{\n}");
    }

    public getListRep(a: Array<any>) {
        if (a) {
            return (
                <>
                    {
                        a.map((s) => (
                            <p key={s}>{s}<br/></p>
                        ))
                    }
                </>
            );
        }
    }

}

export default new Utility();