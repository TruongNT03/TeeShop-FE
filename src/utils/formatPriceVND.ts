export function formatPriceVND(price: number) {
  if (isNaN(price)) return "0 ₫";
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}
