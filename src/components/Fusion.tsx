import { useState } from 'react'
import { useGameStore } from '../store/gameStore'

export default function Fusion() {
  const [выбранный1, setВыбранный1] = useState<string>('')
  const [выбранный2, setВыбранный2] = useState<string>('')
  const [эффект, setЭффект] = useState<{ show: boolean; type: 'success' | 'fail' }>({ show: false, type: 'success' })
  
  const оборудованиеИнстансы = useGameStore((state) => state.оборудованиеИнстансы || {})
  const оборудованиеИнстансыДанные = useGameStore((state) => state.оборудованиеИнстансыДанные || {})
  const скреститьОборудование = useGameStore((state) => state.скреститьОборудование)
  
  const equipmentNames: Record<string, { name: string; icon: string }> = {
    filter: { name: 'Фильтр', icon: '🔍' },
    pot: { name: 'Котелок', icon: '🍲' },
    junk_stove: { name: 'Бомж-печка', icon: '♨️' },
    mixing_barrel: { name: 'Смесительная бочка', icon: '🛢️' },
    lamps: { name: 'Лампы', icon: '💡' },
    glass_flask: { name: 'Стеклянная колба', icon: '🧪' },
    electric_stove: { name: 'Электроплитка', icon: '🔥' },
    growbox: { name: 'Гроубокс', icon: '🌱' },
    press: { name: 'Пресс', icon: '🔧' },
    round_flask: { name: 'Круглодонная колба', icon: '⚗️' },
    condenser: { name: 'Конденсатор', icon: '💨' },
    heating_mantle: { name: 'Нагревательная мантия', icon: '🌡️' },
    magnetic_stirrer: { name: 'Магнитная мешалка', icon: '🧲' },
    gas_generator: { name: 'Газогенератор', icon: '⛽' },
    vacuum_pump: { name: 'Вакуумный насос', icon: '🔄' },
    pill_press: { name: 'Таблеточный пресс', icon: '💊' },
    chromatograph: { name: 'Хроматограф', icon: '📊' }
  }
  
  const getAllInstances = () => {
    const instances: { id: string; itemId: string; name: string; icon: string; rarity: string; displayName: string }[] = []
    
    const rarityNames: Record<string, { name: string; icon: string }> = {
      common: { name: 'Обычный', icon: '⚪' },
      rare: { name: 'Редкий', icon: '🔵' },
      epic: { name: 'Эпический', icon: '🟣' },
      legendary: { name: 'Легендарный', icon: '🟠' },
      mythic: { name: 'Мифический', icon: '🔴' }
    }
    
    for (const [itemId, instanceIds] of Object.entries(оборудованиеИнстансы)) {
      const config = equipmentNames[itemId]
      if (config) {
        for (const instanceId of instanceIds) {
          const data = оборудованиеИнстансыДанные[instanceId]
          if (data) {
            const rarity = data.rarity || 'common'
            const rarityInfo = rarityNames[rarity] || rarityNames.common
            instances.push({
              id: instanceId,
              itemId: itemId,
              name: config.name,
              icon: config.icon,
              rarity: rarity,
              displayName: `${config.icon} ${config.name} (${rarityInfo.icon} ${rarityInfo.name})`
            })
          }
        }
      }
    }
    return instances
  }
  
  const instances = getAllInstances()
  
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
  
  const getRarityName = (rarity: string) => {
    const names: Record<string, string> = {
      common: 'Обычный', rare: 'Редкий', epic: 'Эпический', legendary: 'Легендарный', mythic: 'Мифический'
    }
    return names[rarity] || 'Обычный'
  }
  
  const getRarityIcon = (rarity: string) => {
    const icons: Record<string, string> = {
      common: '⚪', rare: '🔵', epic: '🟣', legendary: '🟠', mythic: '🔴'
    }
    return icons[rarity] || '⚪'
  }
  
  const getUpgradeChance = (rarity: string) => {
    const chances: Record<string, number> = {
      common: 30, rare: 20, epic: 10, legendary: 5, mythic: 0
    }
    return chances[rarity] || 0
  }
  
  const handleFusion = async () => {
    if (!выбранный1 || !выбранный2) {
      alert('❌ Выберите два предмета для скрещивания!')
      return
    }
    
    if (выбранный1 === выбранный2) {
      alert('❌ Нельзя скрещивать один и тот же предмет!')
      return
    }
    
    const item1 = instances.find(i => i.id === выбранный1)
    const item2 = instances.find(i => i.id === выбранный2)
    
    if (!item1 || !item2) {
      alert('❌ Предмет не найден!')
      return
    }
    
    if (item1.itemId !== item2.itemId) {
      alert('❌ Можно скрещивать только два ОДИНАКОВЫХ предмета!')
      return
    }
    
    if (item1.rarity !== item2.rarity) {
      alert('❌ Можно скрещивать только два предмета ОДИНАКОВОЙ редкости!')
      return
    }
    
    if (item1.rarity === 'mythic') {
      alert('❌ Мифические предметы нельзя улучшить!')
      return
    }
    
    setЭффект({ show: true, type: 'success' })
    setTimeout(() => setЭффект({ show: false, type: 'success' }), 1000)
    
    await скреститьОборудование(выбранный1, выбранный2)
    setВыбранный1('')
    setВыбранный2('')
  }
  
  const handleClear = () => {
    setВыбранный1('')
    setВыбранный2('')
  }
  
  const selectedData1 = instances.find(i => i.id === выбранный1)
  const selectedData2 = instances.find(i => i.id === выбранный2)
  
  const canFusion = выбранный1 && выбранный2 && 
    выбранный1 !== выбранный2 &&
    selectedData1?.itemId === selectedData2?.itemId && 
    selectedData1?.rarity === selectedData2?.rarity &&
    selectedData1?.rarity !== 'mythic'
  
  const fusionChance = canFusion && selectedData1 ? getUpgradeChance(selectedData1.rarity) : 0
  
  if (instances.length < 2) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold text-white mb-3">🔮 Скрещивание оборудования</h2>
        <div className="bg-gray-800 p-6 rounded-lg text-center text-gray-400">
          ❌ Нужно минимум 2 экземпляра оборудования для скрещивания.<br/>
          Купите оборудование в магазине!
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-4">
      <style>{`
        @keyframes lightning {
          0% { background: radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(255,255,0,0) 100%); }
          50% { background: radial-gradient(circle, rgba(255,255,0,0.8) 0%, rgba(255,255,0,0) 100%); }
          100% { background: radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(255,255,0,0) 100%); }
        }
        .lightning {
          position: fixed;
          inset: 0;
          pointer-events: none;
          animation: lightning 0.5s ease-out;
          z-index: 60;
        }
      `}</style>
      
      {эффект.show && <div className="lightning" />}
      
      <h2 className="text-lg font-semibold text-white mb-3">🔮 Скрещивание оборудования</h2>
      
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-400">Выберите два РАЗНЫХ предмета для скрещивания:</span>
          <button onClick={handleClear} className="text-red-400 text-sm hover:text-red-300">
            Очистить
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">📦 Предмет 1:</label>
            <select 
              value={выбранный1} 
              onChange={(e) => setВыбранный1(e.target.value)}
              className="w-full bg-gray-700 p-2 rounded text-white"
            >
              <option value="">-- Выберите предмет --</option>
              {instances.map(instance => (
                <option key={instance.id} value={instance.id}>
                  {instance.displayName}
                </option>
              ))}
            </select>
            {selectedData1 && (
              <div className={`mt-2 p-2 rounded border-l-4 ${getRarityColor(selectedData1.rarity)}`}>
                <div className="text-xs text-gray-300">
                  Редкость: {getRarityIcon(selectedData1.rarity)} {getRarityName(selectedData1.rarity)}
                </div>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">📦 Предмет 2:</label>
            <select 
              value={выбранный2} 
              onChange={(e) => setВыбранный2(e.target.value)}
              className="w-full bg-gray-700 p-2 rounded text-white"
            >
              <option value="">-- Выберите предмет --</option>
              {instances.map(instance => (
                <option key={instance.id} value={instance.id}>
                  {instance.displayName}
                </option>
              ))}
            </select>
            {selectedData2 && (
              <div className={`mt-2 p-2 rounded border-l-4 ${getRarityColor(selectedData2.rarity)}`}>
                <div className="text-xs text-gray-300">
                  Редкость: {getRarityIcon(selectedData2.rarity)} {getRarityName(selectedData2.rarity)}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {выбранный1 && выбранный2 && (
          <div className="mt-4 text-center">
            {выбранный1 === выбранный2 ? (
              <div className="text-red-400 text-sm">
                ❌ Нельзя выбрать один и тот же предмет! Выберите два РАЗНЫХ экземпляра.
              </div>
            ) : canFusion ? (
              <>
                <div className="text-yellow-400 text-sm mb-2">
                  🎲 Шанс улучшения: {fusionChance}%
                </div>
                <button
                  onClick={handleFusion}
                  className="w-full py-2 rounded font-semibold bg-purple-600 hover:bg-purple-700 text-white transition transform hover:scale-105"
                >
                  🔮 Скрестить!
                </button>
                <div className="text-xs text-gray-500 mt-2">
                  ⚠️ При успехе: 1 улучшенный предмет (2-й исчезает)<br/>
                  💥 При провале: оба предмета сгорают<br/>
                  🛡️ Амулет защиты спасает оба предмета
                </div>
              </>
            ) : (
              <div className="text-red-400 text-sm">
                {selectedData1?.itemId !== selectedData2?.itemId 
                  ? '❌ Можно скрещивать только два ОДИНАКОВЫХ предмета!'
                  : selectedData1?.rarity !== selectedData2?.rarity
                    ? '❌ Можно скрещивать только два предмета ОДИНАКОВОЙ редкости!'
                    : '❌ Нельзя скрещивать эти предметы!'}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-4 p-3 bg-gray-800 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-400 mb-2">📦 Всё ваше оборудование:</h3>
        <div className="space-y-1 max-h-60 overflow-y-auto">
          {instances.map((instance) => (
            <div key={instance.id} className={`p-2 rounded text-sm text-gray-300 ${getRarityColor(instance.rarity)}`}>
              {instance.displayName}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-800 rounded-lg text-xs text-gray-400">
        <h3 className="font-semibold mb-1 text-gray-300">🔮 Как работает скрещивание:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Выбери 2 разных экземпляра одинаковых предмета (по названию и редкости)</li>
          <li>Шанс улучшить редкость: Обычный→Редкий 30%, Редкий→Эпический 20%, Эпический→Легендарный 10%, Легендарный→Мифический 5%</li>
          <li>✅ При успехе: 1 предмет улучшается, 2-й исчезает</li>
          <li>💥 При провале: оба предмета сгорают</li>
          <li>🛡️ Амулет защиты спасает оба предмета</li>
        </ul>
      </div>
    </div>
  )
}