// Магазин за осколки

export interface ShardShopItem {
  id: string
  name: string
  description: string
  icon: string
  price: number  // в осколках
  type: 'protection' | 'booster' | 'other'
  effect: any
}

export const SHARD_SHOP_ITEMS: ShardShopItem[] = [
  {
    id: 'protection_amulet',
    name: '🛡️ Амулет защиты',
    description: 'Защищает оборудование от сгорания при провале скрещивания (1 раз)',
    icon: '🛡️',
    price: 100,
    type: 'protection',
    effect: { protection: true }
  }
]

export function getShardShopItemById(id: string): ShardShopItem | undefined {
  return SHARD_SHOP_ITEMS.find(item => item.id === id)
}