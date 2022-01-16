/**
 * Configuration for the service - we can initialize this any way we want to and add logic in the future.
 * For now, we just have defaults which are overridable by environment variables.
 */

// Determines whether the server should be verbose
export const Verbose: boolean = (process.env.DEPLOYMENTS_SERVICE_API_VERBOSE || "false").toLowerCase() === "true";

// The hostname to listen on. Of course, use 127.0.0.1 for loopback
export const Host: string = process.env.DEPLOYMENTS_SERVICE_API_HOST || "localhost";

// Port to listen on
export const Port: number = Number.parseInt(process.env.DEPLOYMENTS_SERVICE_API_PORT || "3000");

// Determines whether to expose the documentation endpoint.
// It is a detail, but the underlying mechanism is swagger.
export const ExposeDocs: boolean = (process.env.DEPLOYMENTS_SERVICE_API_EXPOSE_DOCS || "false").toLowerCase() === "true";

// Detemines the enabled api versions served by the server.
// Variable format is either "*" which indicates all or a comma (',') separated versions - e.g: v1, v2, v5.
// This is probably an overkill, but this way we can easily deploy/scale different versions of the apis
// or to deprecate and obsolete as needed.
export const EnabledApiVersions = (process.env.DEPLOYMENTS_SERVICE_API_VERSIONS || "*")
    .replace(/\s/g,'')
    .split(',');