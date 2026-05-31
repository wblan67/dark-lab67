import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { SHARD_SHOP_ITEMS } from '../config/shopShards'

export default function ShardShop() {
  const осколки = useGameStore((state) => state.осколки || 0)
  const защитаОтСгорания = useGameStore((state) => state.защитаОтСгорания || 0)
  const купитьЗащиту = useGameStore((state) => state.купитьЗащиту)
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">💎 Магазин за осколки</h2>
        <div className="bg-gray-800 px-4 py-2 rounded-lg">
          <span className="text-yellow-400">💎 Осколков:</span>
          <span className="text-white font-bold ml-2">{осколки.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {SHARD_SHOP_ITEMS.map((item) => (
          <div key={item.id} className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-3xl">{item.icon}</div>
              <div className="flex-1">
                <div className="font-bold text-lg">{item.name}</div>
                <div className="text-sm text-gray-400">{item.description}</div>
                {item.id === 'protection_amulet' && (
                  <div className="text-xs text-green-400 mt-1">
                    🛡️ У вас: {защитаОтСгорания} шт.
                  </div>
                )}
              </div>
              <button
                onClick={купитьЗащиту}
                disabled={осколки < item.price}
                className={`px-4 py-2 rounded font-semibold ${
                  осколки >= item.price 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                {item.price} 💎
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-gray-800 rounded-lg text-xs text-gray-400">
        <h3 className="font-semibold mb-1">💡 Как работает защита:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>🛡️ Амулет защиты автоматически тратится при провале скрещивания</li>
          <li>✨ Сохраняет ОБА предмета от сгорания</li>
          <li>⚠️ Защита срабатывает только если у вас есть амулет</li>
          <li>💎 Осколки выпадают с шансом 5% при варке</li>
        </ul>
      </div>
    </div>
  )
}