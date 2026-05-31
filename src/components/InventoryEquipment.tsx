// @ts-nocheck
import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { EQUIPMENT_CONFIG, RARITIES } from '../config/equipment'

export default function InventoryEquipment() {
  const [выбранныйТип, setВыбранныйТип] = useState<string | null>(null)
  
  const оборудованиеИнстансы = useGameStore((state) => state.оборудованиеИнстансы || {})
  const оборудованиеИнстансыДанные = useGameStore((state) => state.оборудованиеИнстансыДанные || {})
  const починитьОборудование = useGameStore((state) => state.починитьОборудование)
  
  // Группируем инстансы по типу оборудования
  const groupedInstances: Record<string, { instanceId: string; rarity: string; wear: number; usageCount: number; totalCrafted: number }[]> = {}
  
  for (const [itemId, instanceIds] of Object.entries(оборудованиеИнстансы)) {
    groupedInstances[itemId] = []
    for (const instanceId of instanceIds) {
      const data = оборудованиеИнстансыДанные[instanceId]
      if (data) {
        groupedInstances[itemId].push({
          instanceId,
          rarity: data.rarity,
          wear: data.wear || 0,
          usageCount: data.usageCount || 0,
          totalCrafted: data.totalCrafted || 0
        })
      }
    }
  }
  
  const getRarityIcon = (rarity: string) => {
    const icons: Record<string, string> = {
      common: '⚪',
      rare: '🔵',
      epic: '🟣',
      legendary: '🟠',
      mythic: '🔴'
    }
    return icons[rarity] || '⚪'
  }
  
  const getRarityName = (rarity: string) => {
    const names: Record<string, string> = {
      common: 'Обычный',
      rare: 'Редкий',
      epic: 'Эпический',
      legendary: 'Легендарный',
      mythic: 'Мифический'
    }
    return names[rarity] || 'Обычный'
  }
  
  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'common': return 'border-gray-500 bg-gray-900/50'
      case 'rare': return 'border-blue-500 bg-blue-900/30'
      case 'epic': return 'border-purple-500 bg-purple-900/30'
      case 'legendary': return 'border-orange-500 bg-orange-900/30'
      case 'mythic': return 'border-red-500 bg-red-900/30'
      default: return 'border-gray-500'
    }
  }
  
  const getRepairCost = (itemId: string, rarity: string, wear: number) => {
    const config = EQUIPMENT_CONFIG.find(e => e.id === itemId)
    if (!config || wear === 0) return 0
    
    const baseRepairPrice = Math.floor(config.basePrice / 5)
    const multiplier: Record<string, number> = {
      common: 1.0,
      rare: 1.5,
      epic: 2.0,
      legendary: 3.0,
      mythic: 5.0
    }
    return Math.ceil((wear / 100) * baseRepairPrice * (multiplier[rarity] || 1.0))
  }
  
  // Если выбран конкретный тип оборудования — показываем его экземпляры
  if (выбранныйТип && groupedInstances[выбранныйТип]) {
    const config = EQUIPMENT_CONFIG.find(e => e.id === выбранныйТип)
    const instances = groupedInstances[выбранныйТип]
    
    return (
      <div>
        {/* Кнопка назад */}
        <button
          onClick={() => setВыбранныйТип(null)}
          className="mb-4 flex items-center gap-2 text-blue-400 hover:text-blue-300"
        >
          ← Назад к списку
        </button>
        
        <div className="bg-gray-800 p-3 rounded-lg mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{config?.icon}</span>
            <div>
              <h3 className="text-lg font-bold">{config?.name}</h3>
              <div className="text-sm text-gray-400">
                Всего экземпляров: {instances.length} / {config?.maxCount}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {instances.map((inst, index) => {
            const repairCost = getRepairCost(выбранныйТип, inst.rarity, inst.wear)
            const эффективность = Math.max(0, 100 - inst.wear * 0.5)
            
            return (
              <div key={inst.instanceId} className={`bg-gray-800 p-3 rounded-lg border-l-4 ${getRarityColor(inst.rarity)}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      Экземпляр #{index + 1}
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-700">
                        {getRarityIcon(inst.rarity)} {getRarityName(inst.rarity)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      📊 Использований: {inst.usageCount} | 🧪 Сварено: {inst.totalCrafted}г
                    </div>
                  </div>
                </div>
                
                {inst.wear > 0 ? (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-red-400">🔧 Износ: {Math.floor(inst.wear)}%</span>
                      <span className="text-gray-400">⚡ Эффективность: {Math.floor(эффективность)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${inst.wear}%` }}
                      />
                    </div>
                    <button
                      onClick={() => починитьОборудование(inst.instanceId)}
                      className="mt-2 w-full py-1 rounded bg-yellow-600 hover:bg-yellow-700 text-sm"
                    >
                      🔧 Починить (${repairCost.toLocaleString()})
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 text-xs text-green-400">
                    ✅ В идеальном состоянии
                  </div>
                )}
                
                {inst.wear > 70 && (
                  <div className="mt-2 text-xs text-red-400">
                    ⚠️ Оборудование сильно изношено! Срочно почините!
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  
  // Список всех типов оборудования
  const hasAnyEquipment = Object.keys(groupedInstances).length > 0
  
  if (!hasAnyEquipment) {
    return (
      <div className="text-center text-gray-500 py-8">
        🔧 У вас нет оборудования. Купите его в магазине!
      </div>
    )
  }
  
  return (
    <div className="space-y-2">
      {EQUIPMENT_CONFIG.filter(item => groupedInstances[item.id]?.length > 0).map((item) => {
        const instances = groupedInstances[item.id] || []
        const totalCount = instances.length
        const maxCount = item.maxCount
        
        // Считаем количество каждой редкости
        const rarityCount: Record<string, number> = {}
        instances.forEach(inst => {
          rarityCount[inst.rarity] = (rarityCount[inst.rarity] || 0) + 1
        })
        
        return (
          <button
            key={item.id}
            onClick={() => setВыбранныйТип(item.id)}
            className="w-full bg-gray-800 p-3 rounded-lg text-left hover:bg-gray-700 transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-400">
                    {totalCount} / {maxCount} экземпляров
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex flex-wrap gap-1 justify-end">
                  {rarityCount.common > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-700">
                      ⚪ x{rarityCount.common}
                    </span>
                  )}
                  {rarityCount.rare > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-blue-900/50 text-blue-300">
                      🔵 x{rarityCount.rare}
                    </span>
                  )}
                  {rarityCount.epic > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-purple-900/50 text-purple-300">
                      🟣 x{rarityCount.epic}
                    </span>
                  )}
                  {rarityCount.legendary > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-orange-900/50 text-orange-300">
                      🟠 x{rarityCount.legendary}
                    </span>
                  )}
                  {rarityCount.mythic > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-red-900/50 text-red-300">
                      🔴 x{rarityCount.mythic}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  → Нажми для деталей
                </div>
              </div>
            </div>
            
            {/* Прогресс-бар количества */}
            <div className="mt-2">
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-green-500 h-1.5 rounded-full"
                  style={{ width: `${(totalCount / maxCount) * 100}%` }}
                />
              </div>
            </div>
          </button>
        )
      })}
      
      <div className="mt-4 p-3 bg-gray-800 rounded-lg text-xs text-gray-400">
        <h3 className="font-semibold mb-1 text-gray-300">🔧 Информация:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>⚪ Обычный — дёшево чинить, быстро изнашивается</li>
          <li>🔵 Редкий — дороже чинить, медленнее износ</li>
          <li>🟣 Эпический — ещё дороже, ещё медленнее</li>
          <li>🟠 Легендарный — очень дорого, почти не изнашивается</li>
          <li>🔴 Мифический — космическая цена, но вечный</li>
          <li>💡 Нажми на оборудование, чтобы увидеть все экземпляры</li>
        </ul>
      </div>
    </div>
  )
}
