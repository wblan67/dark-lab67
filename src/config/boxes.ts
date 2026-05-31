// КОНФИГ БОКСОВ

export interface Box {
  id: string
  name: string
  icon: string
  price: number
  colors: {
    common: number
    rare: number
    epic: number
    legendary: number
    mythic: number
  }
}

export const BOXES: Box[] = [
  {
    id: 'common',
    name: 'Обычный бокс',
    icon: '🟢',
    price: 25,
    colors: {
      common: 0.85,
      rare: 0.12,
      epic: 0.03,
      legendary: 0,
      mythic: 0
    }
  },
  {
    id: 'rare',
    name: 'Редкий бокс',
    icon: '🔵',
    price: 125,
    colors: {
      common: 0.55,
      rare: 0.35,
      epic: 0.09,
      legendary: 0.01,
      mythic: 0
    }
  },
  {
    id: 'epic',
    name: 'Эпический бокс',
    icon: '🟣',
    price: 500,
    colors: {
      common: 0.40,
      rare: 0.35,
      epic: 0.18,
      legendary: 0.06,
      mythic: 0.01
    }
  },
  {
    id: 'legendary',
    name: 'Легендарный бокс',
    icon: '🟠',
    price: 1250,
    colors: {
      common: 0.20,
      rare: 0.30,
      epic: 0.30,
      legendary: 0.18,
      mythic: 0.02
    }
  },
  {
    id: 'mythic',
    name: 'Мифический бокс',
    icon: '🔴',
    price: 2500,
    colors: {
      common: 0,
      rare: 0,
      epic: 0.25,
      legendary: 0.60,
      mythic: 0.15
    }
  }
]

// Функция для получения редкости по шансам
export function getRarityFromBox(box: Box): string {
  const rand = Math.random()
  let accum = 0
  
  if (rand < (accum += box.colors.common)) return 'common'
  if (rand < (accum += box.colors.rare)) return 'rare'
  if (rand < (accum += box.colors.epic)) return 'epic'
  if (rand < (accum += box.colors.legendary)) return 'legendary'
  return 'mythic'
}

// Получить бокс по ID
export function getBoxById(id: string): Box | undefined {
  return BOXES.find(b => b.id === id)
}