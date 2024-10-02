import NodeCache from "node-cache";
const Cache = new NodeCache({
    stdTTL: 60 * 60 * 24,
    checkperiod: 60 * 60 * 2,
    useClones: false,
});
export { Cache };