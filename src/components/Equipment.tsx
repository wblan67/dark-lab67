// Конфиг оборудования с редкостями

export interface Equipment {
  id: string
  name: string
  icon: string
  basePrice: number
  repairCost: number
  maxWear: number
  maxCount: number  // максимальное количество экземпляров
}

export const EQUIPMENT_CONFIG: Equipment[] = [
  // ОБЫЧНОЕ (серое) - можно купить до 20 штук
  { id: 'filter', name: 'Фильтр', icon: '🔍', basePrice: 50, repairCost: 10, maxWear: 100, maxCount: 20 },
  { id: 'pot', name: 'Котелок', icon: '🍲', basePrice: 100, repairCost: 15, maxWear: 100, maxCount: 20 },
  { id: 'junk_stove', name: 'Бомж-печка', icon: '♨️', basePrice: 150, repairCost: 20, maxWear: 100, maxCount: 20 },
  { id: 'mixing_barrel', name: 'Смесительная бочка', icon: '🛢️', basePrice: 80, repairCost: 12, maxWear: 100, maxCount: 20 },
  { id: 'lamps', name: 'Лампы', icon: '💡', basePrice: 500, repairCost: 30, maxWear: 100, maxCount: 20 },
  
  // РЕДКОЕ (синее) - до 15 штук
  { id: 'glass_flask', name: 'Стеклянная колба', icon: '🧪', basePrice: 400, repairCost: 50, maxWear: 100, maxCount: 15 },
  { id: 'electric_stove', name: 'Электроплитка', icon: '🔥', basePrice: 200, repairCost: 40, maxWear: 100, maxCount: 15 },
  { id: 'growbox', name: 'Гроубокс', icon: '🌱', basePrice: 600, repairCost: 60, maxWear: 100, maxCount: 15 },
  { id: 'press', name: 'Пресс', icon: '🔧', basePrice: 500, repairCost: 55, maxWear: 100, maxCount: 15 },
  { id: 'round_flask', name: 'Круглодонная колба', icon: '⚗️', basePrice: 1000, repairCost: 80, maxWear: 100, maxCount: 15 },
  
  // ЭПИЧЕСКОЕ (фиолетовое) - до 10 штук
  { id: 'condenser', name: 'Конденсатор', icon: '💨', basePrice: 1500, repairCost: 150, maxWear: 100, maxCount: 10 },
  { id: 'heating_mantle', name: 'Нагревательная мантия', icon: '🌡️', basePrice: 2000, repairCost: 200, maxWear: 100, maxCount: 10 },
  { id: 'magnetic_stirrer', name: 'Магнитная мешалка', icon: '🧲', basePrice: 1200, repairCost: 120, maxWear: 100, maxCount: 10 },
  { id: 'gas_generator', name: 'Газогенератор', icon: '⛽', basePrice: 1800, repairCost: 180, maxWear: 100, maxCount: 10 },
  
  // ЛЕГЕНДАРНОЕ (оранжевое) - до 5 штук
  { id: 'vacuum_pump', name: 'Вакуумный насос', icon: '🔄', basePrice: 3000, repairCost: 300, maxWear: 100, maxCount: 5 },
  { id: 'pill_press', name: 'Таблеточный пресс', icon: '💊', basePrice: 2500, repairCost: 280, maxWear: 100, maxCount: 5 },
  
  // МИФИЧЕСКОЕ (красное) - до 3 штук
  { id: 'chromatograph', name: 'Хроматограф', icon: '📊', basePrice: 4000, repairCost: 500, maxWear: 100, maxCount: 3 }
]

export const RARITIES: Record<string, { name: string; color: string; multiplier: number; upgradeChance: number; icon: string }> = {
  common: { name: 'Обычный', color: 'gray', multiplier: 1.0, upgradeChance: 0.3, icon: '⚪' },
  rare: { name: 'Редкий', color: 'blue', multiplier: 1.5, upgradeChance: 0.2, icon: '🔵' },
  epic: { name: 'Эпический', color: 'purple', multiplier: 2.0, upgradeChance: 0.1, icon: '🟣' },
  legendary: { name: 'Легендарный', color: 'orange', multiplier: 3.0, upgradeChance: 0.05, icon: '🟠' },
  mythic: { name: 'Мифический', color: 'red', multiplier: 5.0, upgradeChance: 0, icon: '🔴' }
}

export function getRarityFromPrice(price: number): string {
  if (price <= 200) return 'common'
  if (price <= 700) return 'rare'
  if (price <= 2000) return 'epic'
  if (price <= 3500) return 'legendary'
  return 'mythic'
}

export function getEquipmentById(id: string): Equipment | undefined {
  return EQUIPMENT_CONFIG.find(e => e.id === id)
}

function getNextRarity(current: string): string | null {
  const order = ['common', 'rare', 'epic', 'legendary', 'mythic']
  const index = order.indexOf(current)
  if (index === -1 || index === order.length - 1) return null
  return order[index + 1]
}