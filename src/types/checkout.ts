export type CheckoutId = string;
type CheckoutWebUrl = string;
type CheckoutAvailableShippingRates = {
    ready?: boolean;
    shippingRates?: Record<string, any>[];
};

export type Checkout = {
    id?: CheckoutId;
    webUrl?: CheckoutWebUrl;
    availableShippingRates?: CheckoutAvailableShippingRates;
}

export type FieldCheckout = 'id' | 'webUrl';

// type CreateCheckoutLineItem = {};
// type CreateCheckout = {
//     line_items?: CreateCheckoutLineItem;
// };