/**
 * @schema.name product
 * @schema.description An e-commerce product
 */
var product = {

    /**
     * @schema.title Name
     * @schema.description The SEO friendly name of the product
     * @schema.type string
     * @schema.minLength 3
     * @schema.maxLength 255
     * @schema.required true
     */
    name: '',

    /**
     * @schema.title Url
     * @schema.description Unique, SEO friendly product Url
     * @schema.type string
     * @schema.minLength 1
     * @schema.maxLength 255
     * @schema.required true
     */
    url: '',

    /**
     * @schema.title Price
     * @schema.description Price of the product
     * @schema.type number
     * @schema.minimum 0
     * @schema.required true
     */
    price: ''
};
