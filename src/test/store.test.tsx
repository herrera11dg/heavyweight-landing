import { describe, expect, it } from "vitest";
import { addItem, cartTotal, setQty } from "@/lib/cart";
import { detectLang, formatPrice } from "@/lib/i18n";

describe("store rules", () => {
  it("caps quantity at size stock (Toji XL = 1)", () => {
    let items = addItem([], "toji-fushiguro", "XL");
    items = addItem(items, "toji-fushiguro", "XL");
    expect(items[0]!.qty).toBe(1);
    expect(setQty(items, items[0]!.key, 5)[0]!.qty).toBe(1);
  });
  it("every shirt costs 35 EUR", () => {
    const items = addItem(addItem([], "again", "M"), "focus", "S", "wine");
    expect(cartTotal(items)).toBe(70);
  });
  it("language detection: URL beats storage, falls back to PT", () => {
    expect(detectLang("?lang=es", "en", "en-US")).toBe("es");
    expect(detectLang("", null, "fr-FR")).toBe("pt");
  });
  it("formats EUR per locale", () => {
    expect(formatPrice(35, "pt")).toMatch(/35,00/);
    expect(formatPrice(35, "en")).toBe("€35.00");
  });
});
