export const priceLabel = (spot: {
  price_rate: string;
  price_unit: "hour" | "day";
}) =>
  Number(spot.price_rate) === 0
    ? "Free"
    : `$${spot.price_rate}/${spot.price_unit === "day" ? "day" : "hr"}`;
