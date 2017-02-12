/**
 * @typedef {Object} Area
 * @property {string} id
 * @property {string} name
 * @property {string} osmId
 * @property {Object} polygon
 * @property {string} polygon.$reql_type$
 * @property {Array} polygon.coordinates
 * @property {string} polygon.type
 * @property {string} simc
 * @property {string} terc
 * @schema.name Area
 */
var Area = {

    /**
     * @schema.title Name
     * @schema.description Please enter your full name
     * @schema.type string
     * @schema.maxLength 30
     * @schema.minLength 1
     */
    id: '',

    /**
     * @schema.type string
     * @schema.required true
     */
    name: '',

    /**
     * @schema.type string
     * @schema.required true
     */
    osmId: '',

    /**
     * @schema.type object
     * @schema.required true
     */
    polygon: {

        /**
         * @schema.type string
         * @schema.required true
         */
        $reql_type$: "GEOMETRY",

        /**
         * @schema.type array
         * @schema.required true
         */
        coordinates: [],

        /**
         * @schema.type string
         * @schema.required true
         */
        type: "Polygon"
    },

    /**
     * @schema.type string
     * @schema.required true
     */
    simc: '',

    /**
     * @schema.type string
     * @schema.required true
     */
    terc: ''
}