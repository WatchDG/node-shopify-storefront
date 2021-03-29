export type CheckoutId = string;
type CheckoutWebUrl = string;

export type CheckoutShippingRateHandle = string;
type CheckoutShippingRateTitle = string;
type CheckoutShippingRate = {
    title: CheckoutShippingRateTitle;
    handle: CheckoutShippingRateHandle;
};

type CheckoutAvailableShippingRates = {
    ready?: boolean;
    shippingRates?: CheckoutShippingRate[];
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