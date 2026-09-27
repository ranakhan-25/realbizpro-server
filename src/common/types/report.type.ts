export type PriceDeclarationAgg = {
  goodsType: any;
  productCode: string | null;
  pdSerial: string | null;
  categroryPrefix: string | null;
  categorywiseItems: number | null;
  barCodeSerial: number | null;
  openingStock: number;
  closingStock: number;
  size: unknown;
};

export type ProductAgg = {
  id: string;
  uuid: string | null;
  name: string | null;
  codeModel: string | null;
  featureImage: unknown;
  costPrice: string | null;
  basePrice: string | null;
  vatPercent: string | null;
  vatAmount: string | null;
  salesPrice: string | null;
  openingStock: number;
  closingStock: number;
  priceDeclaration: PriceDeclarationAgg[];
  _priceDeclarationMap: Map<
    string,
    PriceDeclarationAgg
  >;
};

export type CategoryAgg = {
  id: string;
  categoryName: string;
  shortCode: string;
  openingStock: number;
  closingStock: number;
  product: ProductAgg[];
  _productMap: Map<string, ProductAgg>;
};

export type PriceDeclarationResult = Omit<
  PriceDeclarationAgg,
  'openingStock' | 'closingStock'
> & {
  openingStock: string;
  closingStock: string;
};

export type ProductResult = Omit<
  ProductAgg,
  | 'openingStock'
  | 'closingStock'
  | 'priceDeclaration'
  | '_priceDeclarationMap'
> & {
  openingStock: string;
  closingStock: string;
  priceDeclaration: PriceDeclarationResult[];
};

export type CategoryResult = Omit<
  CategoryAgg,
  | 'openingStock'
  | 'closingStock'
  | 'product'
  | '_productMap'
> & {
  openingStock: string;
  closingStock: string;
  product: ProductResult[];
};
