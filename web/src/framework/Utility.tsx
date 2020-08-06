import React from 'react';

class Utility {

    public arrayToLine(a: Array<any>) : string {
        return a.join(", ");
    }
    public arrayToMultiline(a: Array<any>) : string {
        return a.join("{\n}");
    }

    public getListRep(a: Array<any>) {
        console.log(a);
        return (
            <>
                {
                    a.map((s) => (
                        <p>{s}<br/></p>
                    ))
                }
            </>
        );
    }

}

export default new Utility();