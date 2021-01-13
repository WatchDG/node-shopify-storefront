"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_result_1 = require("node-result");
const http_instance_1 = require("http-instance");
class ShopifyStorefront {
    constructor(options) {
        this.instance = new http_instance_1.HttpInstance({
            baseUrl: options.endpoint,
            headers: {
                'X-Shopify-Storefront-Access-Token': options.accessToken,
                'Content-Type': 'application/graphql'
            }
        });
    }
    async getShop() {
        const query = `{\n\tshop {\n\t\tname\n\t}\n}`;
        const { data } = (await this.instance.post('', query)).unwrap();
        return node_result_1.ResultOk(data.data.shop);
    }
    async getProduct(productId) {
        const gid = `gid://shopify/Product/${productId}`;
        const id = Buffer.from(gid).toString('base64');
        const query = `{\n\tproduct: node(id: "${id}"){\n\t\t... on Product {\n\t\t\ttitle\n\t\t}\n\t}\n}`;
        console.log(query);
        const { status, data } = (await this.instance.post('', query));
        console.log(data.data);
        return node_result_1.ResultOk(null);
    }
    async getProductVariant(productVariantId) {
        const gid = `gid://shopify/ProductVariant/${productVariantId}`;
        const id = Buffer.from(gid).toString('base64');
        const query = `{\n\tproduct_variant: node(id: "${id}"){\n\t\t... on ProductVariant {\n\t\t\ttitle\n\t\t}\n\t}\n}`;
        console.log(query);
        const { status, data } = (await this.instance.post('', query));
        console.log(data.data);
        return node_result_1.ResultOk(null);
    }
    async createCheckout(createCheckout) {
        const query = `mutation checkoutCreate($input: CheckoutCreateInput!){\n\tcheckout: checkoutCreate(input: $input){\n\t\tcheckout{\n\t\t\tid\n\t\t\twebUrl\n\t\t}\n\t\tcheckoutUserErrors{\n\t\t\tcode\n\t\t\tfield\n\t\t\tmessage\n\t\t}\n\t}\n}`;
        const variables = {
            input: createCheckout
        };
        const payload = JSON.stringify({ query, variables });
        const options = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        console.log(payload);
        const { status, data } = (await this.instance.post('', payload, options)).unwrap();
        return node_result_1.ResultOk(data.data.checkout.checkout);
    }
}
__decorate([
    node_result_1.tryCatchWrapperAsync
], ShopifyStorefront.prototype, "getShop", null);
__decorate([
    node_result_1.tryCatchWrapperAsync
], ShopifyStorefront.prototype, "getProduct", null);
__decorate([
    node_result_1.tryCatchWrapperAsync
], ShopifyStorefront.prototype, "getProductVariant", null);
__decorate([
    node_result_1.tryCatchWrapperAsync
], ShopifyStorefront.prototype, "createCheckout", null);
(async () => {
    const shopifyStorefront = new ShopifyStorefront({
        endpoint: 'https://viadelivery-demo.myshopify.com/api/2021-01/graphql.json',
        accessToken: '986c8923497458df99c6facf7a09cb2c'
    });
    // const shop = (await shopifyStorefront.getShop()).unwrap();
    // console.log(shop);
    const checkout = (await shopifyStorefront.createCheckout({
        email: 'user@example.com'
    })).unwrap();
    console.log(checkout);
})();
//# sourceMappingURL=index.js.map