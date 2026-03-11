interface Product {
  id: number;
  name: string;
  price: number;
  image_url?: string;
  vendor?: string;
  category_name?: string;
  available: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <a href={`/catalog/${product.id}`} className="block bg-gray-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-blue-500 transition">
      <div className="h-48 bg-gray-700 flex items-center justify-center overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-2" />
        ) : (
          <span className="text-5xl">🛢️</span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-blue-400 mb-1">{product.vendor || product.category_name}</p>
        <h3 className="text-sm font-medium text-white line-clamp-2 mb-3 h-10">{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-white">{product.price} ₴</span>
          {!product.available && <span className="text-xs text-red-400">Нет в наличии</span>}
        </div>
      </div>
    </a>
  );
}
