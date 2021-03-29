import {ResultOK, ResultFAIL, ResultOk, tryCatchWrapperAsync, ResultFail, ReturningResultAsync} from "node-result";
import {HttpInstance} from "http-instance";

import {Checkout, CheckoutId, CheckoutShippingRateHandle, FieldCheckout} from "./types/checkout";

type Options = {
    baseUrl: string;
    accessToken: string;
};

export class ShopifyStorefront {
    private readonly instance;

    constructor(options: Options) {
        const {baseUrl, accessToken} = options;
        this.instance = new HttpInstance({
            baseUrl,
            headers: {
                'X-Shopify-Storefront-Access-Token': accessToken
            }
        })
    }

    private static prepareQuery(rawQuery: any[], indent = '') {
        const result = [];
        rawQuery.forEach((item) => {
            if (typeof item === 'string') {
                result.push(`${indent}${item}`);
            } else {
                result.push(ShopifyStorefront.prepareQuery(item, `${indent}\t`));
            }
        });
        return result.join(`\n`);
    }

    private static checkResponse(data) {
        if (data.errors) {
            return ResultFail(data.errors[0].message);
        }
        return ResultOk(data.data);
    }

    @tryCatchWrapperAsync
    async createCheckout(createCheckout: { [Key: string]: unknown }, fields: FieldCheckout[]): Promise<ResultOK<Checkout> | ResultFAIL<Error>> {

        const rawQuery = [
            'mutation checkoutCreate($input: CheckoutCreateInput!){',
            [
                'checkoutCreate(input: $input){',
                [
                    'checkout{',
                    [
                        ...fields,
                        'availableShippingRates{',
                        [
                            'ready'
                        ],
                        '}'
                    ],
                    '}',
                    'checkoutUserErrors{',
                    [
                        'code',
                        'field',
                        'message'
                    ],
                    '}'
                ],
                '}'
            ],
            '}'
        ];

        const query = ShopifyStorefront.prepareQuery(rawQuery);

        const variables = {
            input: createCheckout
        };

        const payload = {query, variables};

        const {data} = (await this.instance.post('/api/2021-01/graphql.json', payload)).unwrap();

        const response = (await ShopifyStorefront.checkResponse(data)).unwrap();

        return ResultOk(response.checkoutCreate.checkout);
    }

    @tryCatchWrapperAsync
    async getCheckout(checkoutId: CheckoutId): ReturningResultAsync<Checkout, Error> {

        const rawQuery = [
            '{',
            [
                `node(id: "${checkoutId}"){`,
                [
                    '... on Checkout {',
                    [
                        'availableShippingRates{',
                        [
                            'ready',
                            'shippingRates{',
                            [
                                '... on ShippingRate{',
                                [
                                    'handle',
                                    'title'
                                ],
                                '}'
                            ],
                            '}'
                        ],
                        '}'
                    ],
                    '}'
                ],
                '}'
            ],
            '}'
        ];

        const query = ShopifyStorefront.prepareQuery(rawQuery);

        const payload = {query};

        const {data} = (await this.instance.post('/api/2021-01/graphql.json', payload)).unwrap();

        const response = (await ShopifyStorefront.checkResponse(data)).unwrap();

        return ResultOk(response.node);
    }

    @tryCatchWrapperAsync
    async setDeliveryForCheckout(checkoutId: CheckoutId, shippingRateHandle: CheckoutShippingRateHandle, fields: FieldCheckout[]): ReturningResultAsync<Checkout, Error> {

        const rawQuery = [
            'mutation checkoutShippingLineUpdate($checkoutId: ID!, $shippingRateHandle: String!) {',
            [
                'checkoutShippingLineUpdate(checkoutId: $checkoutId, shippingRateHandle: $shippingRateHandle) {',
                [
                    'checkout {',
                    [
                        ...fields
                    ],
                    '}',
                    'checkoutUserErrors {',
                    [
                        'code',
                        'field',
                        'message'
                    ],
                    '}'
                ],
                '}'
            ],
            '}'
        ];

        const query = ShopifyStorefront.prepareQuery(rawQuery);

        const variables = {
            "checkoutId": checkoutId,
            "shippingRateHandle": shippingRateHandle
        };

        const payload = {query, variables};

        const {data} = (await this.instance.post('/api/2021-01/graphql.json', payload)).unwrap();

        const response = (await ShopifyStorefront.checkResponse(data)).unwrap();

        return ResultOk(response.checkoutShippingLineUpdate.checkout);
    }
}