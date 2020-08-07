class Configuration {

    public getEnv(name: string) {
        let val = process.env[name];

        if ( val ) {
            return val;
        }

        return null;
    }


    public getBackend() {

        let backend = this.getEnv("BACKEND");
        if ( null == backend ) {
            console.log("Warning: using default backend url as none specified in the env.");
            backend = "http://localhost:4000";
        }

        return backend
    }
}

const config = new Configuration();
export default config;