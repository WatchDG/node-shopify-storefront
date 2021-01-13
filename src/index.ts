import {ResultOK, ResultFAIL, ResultOk, tryCatchWrapperAsync} from "node-result";
import {HttpInstance} from "http-instance";

type Options = {
    endpoint: string;
    accessToken: string;
};

type ShopName = string;
type Shop = {
    name?: ShopName;
};

type ProductId = number;
type ProductVariantId = number;

type CreateCheckoutLineItem = {};
type CreateCheckout = {
    line_items?: CreateCheckoutLineItem;
};

export class ShopifyStorefront {
    private readonly instance;

    constructor(options: Options) {
        this.instance = new HttpInstance({
            baseUrl: options.endpoint,
            headers: {
                'X-Shopify-Storefront-Access-Token': options.accessToken,
                'Content-Type': 'application/graphql'
            }
        })
    }

    @tryCatchWrapperAsync
    async getShop(): Promise<ResultOK<any> | ResultFAIL<Error>>{
        const query = `{\n\tshop {\n\t\tname\n\t}\n}`;
        const {data} = (await this.instance.post('', query)).unwrap();
        return ResultOk(data.data.shop);
    }

    @tryCatchWrapperAsync
    async getProduct(productId: ProductId): Promise<ResultOK<any> | ResultFAIL<Error>> {
        const gid = `gid://shopify/Product/${productId}`;
        const id = Buffer.from(gid).toString('base64');
        const query = `{\n\tproduct: node(id: "${id}"){\n\t\t... on Product {\n\t\t\ttitle\n\t\t}\n\t}\n}`;
        console.log(query)
        const {data} = (await this.instance.post('', query))
        console.log(data.data);
        return ResultOk(null);
    }

    @tryCatchWrapperAsync
    async getProductVariant(productVariantId: ProductVariantId): Promise<ResultOK<any> | ResultFAIL<Error>> {
        const gid = `gid://shopify/ProductVariant/${productVariantId}`;
        const id = Buffer.from(gid).toString('base64');
        const query = `{\n\tproduct_variant: node(id: "${id}"){\n\t\t... on ProductVariant {\n\t\t\ttitle\n\t\t}\n\t}\n}`;
        console.log(query)
        const {status, data} = (await this.instance.post('', query))
        console.log(data.data);
        return ResultOk(null);
    }

    @tryCatchWrapperAsync
    async createCheckout(createCheckout: {[Key: string]: string}): Promise<ResultOK<any> | ResultFAIL<Error>>{
        const query = `mutation checkoutCreate($input: CheckoutCreateInput!){\n\tcheckout: checkoutCreate(input: $input){\n\t\tcheckout{\n\t\t\tid\n\t\t\twebUrl\n\t\t}\n\t\tcheckoutUserErrors{\n\t\t\tcode\n\t\t\tfield\n\t\t\tmessage\n\t\t}\n\t}\n}`;
        const variables = {
            input: createCheckout
        };
        const payload = JSON.stringify({query, variables});
        const options = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        console.log(payload);
        const {data} = (await this.instance.post('', payload,options)).unwrap();
        return ResultOk(data.data.checkout.checkout);
    }
}