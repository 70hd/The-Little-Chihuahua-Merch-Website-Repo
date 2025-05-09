export function formatPrice(product: {
  priceOptions: { price: number }[];
}): string {
  const prices = product?.priceOptions;
  if (prices?.[1]?.price !== undefined) {
    return `$${prices[0].price.toFixed(2)} - $${prices[1].price.toFixed(2)}`;
  }
  if (prices?.[0]?.price !== undefined) {
    return `$${prices[0].price.toFixed(2)}`;
  }
  return "Price unavailable";
}
