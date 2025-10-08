import { useState } from "react"
import { Printer, ArrowLeft, Download } from "lucide-react"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import type { IOrder, IOrderDetail, IOrderReceiver } from "../../types/receiver/orderType"
import { formatDateTime } from "../../utils/functions"
import { sendQRDatas } from "../../store/receiver/ordersSlice"

const OrderDetail = () => {

  const dispatch = useAppDispatch();

  const [showPrintModal, setShowPrintModal] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<IOrderDetail & { product_title: string } | null>(null)
  const [isSending, setIsSending] = useState(false)

  const { order } = useAppSelector(state => state.receiver_orders) as { order: IOrder }

  // Создание структурированных данных для QR-кода
  const createQRData = (position: IOrderDetail & { product_title: string }) => {
    const internalCode = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const qrData = {
      internal_code: internalCode,
      product: position.product_title,
      color: position.color,
      size: position.size
    }
    
    // Преобразуем в JSON строку для QR-кода
    return {
      internalCode,
      qrString: JSON.stringify(qrData),
      qrData
    }
  }

  const generateQRCodeURL = (qrString: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrString)}&charset-source=UTF-8&charset-target=UTF-8&size=300x300`
  }

  // Создание QR-кода как файла (Blob) с полными данными
  const createQRCodeFile = async (qrString: string, internalCode: string): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      const size = 300
      canvas.width = size
      canvas.height = size
      
      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, size, size)
        
        const qrImg = new Image()
        qrImg.crossOrigin = 'anonymous'
        qrImg.src = generateQRCodeURL(qrString)
        
        qrImg.onload = () => {
          ctx.drawImage(qrImg, 0, 0, size, size)
          
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], `qr-${internalCode}.png`, { type: 'image/png' })
              resolve(file)
            } else {
              reject(new Error('Не удалось создать blob'))
            }
          }, 'image/png')
        }
        
        qrImg.onerror = () => reject(new Error('Ошибка загрузки QR кода'))
      } else {
        reject(new Error('Не удалось создать canvas'))
      }
    })
  }

  // Отправка данных на сервер
  const sendToServer = async (data: IOrderReceiver) => {
    try {
      console.log('Отправка данных:', data)
      const response = await dispatch(sendQRDatas(data))
      console.log('Ответ сервера:', response)
    } catch (error) {
      console.error('Ошибка отправки:', error)
      throw error
    }
  }

  // Печать одной этикетки через браузер (альбомная ориентация)
  const printSingleLabel = async (position: IOrderDetail & { product_title: string }) => {
    setIsSending(true)
    
    try {
      console.log('1. Начало печати')
      const { internalCode, qrString, qrData } = createQRData(position)
      console.log('2. Сгенерированы данные для QR:', qrData)
      
      const qrUrl = generateQRCodeURL(qrString)
      console.log('3. URL QR-кода:', qrUrl)
      
      const printWindow = window.open('', '', 'width=800,height=600')
      
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Этикетка - ${internalCode}</title>
              <meta charset="utf-8">
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                @page { size: landscape; margin: 0; }
                body {
                  font-family: Arial, sans-serif;
                  width: 50mm;
                  height: 30mm;
                  padding: 2mm;
                  display: flex;
                  background: white;
                }
                .label-container {
                  width: 100%;
                  height: 100%;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  gap: 2mm;
                }
                .qr-code { 
                  width: 26mm; 
                  height: 26mm; 
                  flex-shrink: 0;
                }
                .qr-code img { 
                  width: 100%; 
                  height: 100%; 
                  display: block; 
                }
                .info-section {
                  flex: 1;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  gap: 1mm;
                }
                .info { 
                  font-size: 7pt; 
                  line-height: 1.2; 
                  font-weight: bold; 
                  color: #000; 
                }
                .qr-text { 
                  font-size: 8pt; 
                  line-height: 1.2; 
                  font-weight: bold; 
                  color: #000;
                }
                @media print {
                  body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                }
              </style>
            </head>
            <body>
              <div class="label-container">
                <div class="qr-code">
                  <img id="qrImage" src="${qrUrl}" alt="QR Code" />
                </div>
                <div class="info-section">
                  <div class="qr-text">${position.product_title}</div>
                  <div class="info">Цвет: ${position.color}</div>
                  <div class="info">Размер: ${position.size}</div>
                </div>
              </div>
              <script>
                var img = document.getElementById('qrImage');
                var printed = false;
                
                img.onload = function() {
                  console.log('Изображение загружено, запуск печати...');
                  setTimeout(function() {
                    window.print();
                  }, 500);
                };
                
                img.onerror = function() {
                  console.error('Ошибка загрузки изображения');
                  alert('Не удалось загрузить QR-код');
                };
                
                window.onafterprint = function() {
                  if (!printed) {
                    printed = true;
                    console.log('Печать завершена');
                    if (window.opener) {
                      window.opener.postMessage({ 
                        type: 'print-completed',
                        qrData: ${JSON.stringify(qrData)},
                        qrString: ${JSON.stringify(qrString)}
                      }, '*');
                    }
                    setTimeout(function() { window.close(); }, 500);
                  }
                };
              </script>
            </body>
          </html>
        `)
        printWindow.document.close()
        
        console.log('4. Окно печати открыто, ожидание завершения печати...')
        
        const handlePrintCompleted = async (event: MessageEvent) => {
          if (event.data.type === 'print-completed' && 
              event.data.qrData.internal_code === internalCode) {
            window.removeEventListener('message', handlePrintCompleted)
            
            console.log('5. Печать завершена, создание файла для отправки...')
            
            try {
              const qrFile = await createQRCodeFile(qrString, internalCode)
              console.log('6. QR-файл создан, отправка на сервер...')
              
              await sendToServer({
                order_id: order.id,
                title: position.product_title,
                color: position.color,
                size: position.size,
                internal_code: internalCode,
                file: qrFile
              })
              console.log('7. Данные успешно отправлены на сервер')
            } catch (serverError) {
              console.error('Ошибка отправки на сервер:', serverError)
              alert('Этикетка распечатана, но не удалось отправить данные на сервер.')
            }
          }
        }
        
        window.addEventListener('message', handlePrintCompleted)
      }
      
    } catch (error) {
      console.error('Ошибка печати:', error)
      alert(`Произошла ошибка при печати: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
    } finally {
      setIsSending(false)
    }
  }

  // Скачивание одной этикетки (альбомная ориентация)
  const downloadSingleLabel = async (position: IOrderDetail & { product_title: string }) => {
    setIsSending(true)
    
    try {
      console.log('1. Начало скачивания')
      const { internalCode, qrString, qrData } = createQRData(position)
      console.log('2. Сгенерированы данные для QR:', qrData)
      
      console.log('3. Создание этикетки для скачивания...')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Альбомная ориентация: 50mm x 30mm (при 150 DPI)
      const width = 590  // 50mm * 11.81 (pixels per mm at 300 DPI)
      const height = 354 // 30mm * 11.81
      canvas.width = width
      canvas.height = height
      
      if (ctx) {
        // Белый фон
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, width, height)
        
        const qrImg = new Image()
        qrImg.crossOrigin = 'anonymous'
        qrImg.src = generateQRCodeURL(qrString)
        
        qrImg.onload = async () => {
          // QR-код слева (26mm = ~307 pixels)
          const qrSize = 307
          const qrX = 24
          const qrY = (height - qrSize) / 2
          ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)
          
          // Текстовая информация справа
          const textX = qrX + qrSize + 30
          const textStartY = height / 2 - 40
          
          // Цвет
          ctx.fillStyle = 'black'
          ctx.font = 'bold 36px Arial'
          ctx.textAlign = 'left'
          ctx.fillText(position.color, textX, textStartY)
          
          // Размер
          ctx.fillText(position.size, textX, textStartY + 50)
          
          // Уникальный код
          ctx.font = '20px Arial'
          ctx.fillStyle = '#666'
          ctx.fillText(internalCode.substring(0, 20), textX, textStartY + 90)
          if (internalCode.length > 20) {
            ctx.fillText(internalCode.substring(20), textX, textStartY + 115)
          }
          
          canvas.toBlob(async (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `label-${internalCode}.png`
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              URL.revokeObjectURL(url)
              console.log('4. Этикетка скачана')
              
              console.log('5. Создание QR-файла для отправки...')
              try {
                const qrFile = await createQRCodeFile(qrString, internalCode)
                console.log('6. Отправка на сервер...')
                
                await sendToServer({
                  order_id: order.id,
                  title: position.product_title,
                  color: position.color,
                  size: position.size,
                  internal_code: internalCode,
                  file: qrFile
                })
                console.log('7. Данные успешно отправлены на сервер')
              } catch (serverError) {
                console.error('Ошибка отправки на сервер:', serverError)
                alert('Этикетка скачана, но не удалось отправить данные на сервер.')
              }
            }
          }, 'image/png')
        }
        
        qrImg.onerror = (err) => {
          console.error('Ошибка загрузки изображения QR:', err)
          throw new Error('Не удалось загрузить QR-код')
        }
      }
      
    } catch (error) {
      console.error('Ошибка скачивания:', error)
      alert(`Произошла ошибка при скачивании: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
    } finally {
      setIsSending(false)
    }
  }

  const handlePrintClick = (position: IOrderDetail, productTitle: string) => {
    setSelectedPosition({ ...position, product_title: productTitle })
    setShowPrintModal(true)
  }

  const totalCount = order.order_products.reduce(
    (sum, product) => sum + product.details.reduce((s, d) => s + d.amount, 0),
    0
  )

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="px-4 py-3 flex items-center gap-3">
          <button 
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{order.client_info.fullname}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">#{order.id}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* Информация о заказе */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400 block mb-1">Номер заказа</span>
                <p className="font-medium text-gray-900 dark:text-white">{order.id}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block mb-1">Дата создания</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDateTime(order.created_at)}
                </p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block mb-1">Всего позиций</span>
                <p className="font-medium text-gray-900 dark:text-white">{totalCount} шт.</p>
              </div>
            </div>
          </div>

          {/* Инструкция по печати */}
          {/* <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
              <Bluetooth size={18} />
              Печать этикеток с полными данными
            </h3>
            <div className="text-xs text-blue-800 dark:text-blue-300 space-y-2">
              <p className="font-medium">📦 QR-код содержит:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>ID заказа</li>
                <li>Название товара</li>
                <li>Цвет и размер</li>
                <li>Количество</li>
                <li>Уникальный код этикетки</li>
                <li>Временная метка создания</li>
              </ul>
              <p className="font-medium mt-3">Способ 1: Через Bluetooth (Рекомендуется)</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Скачайте приложение принтера из Google Play/App Store</li>
                <li>Включите Bluetooth на телефоне</li>
                <li>Подключите принтер Chiteng в приложении</li>
                <li>Нажимайте "Скачать этикетку" для каждого товара</li>
                <li>Открывайте файлы в приложении принтера и печатайте</li>
              </ol>
              <p className="font-medium mt-3">Способ 2: Через браузер (Android Chrome)</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Подключите принтер через Bluetooth в настройках Android</li>
                <li>Нажимайте "Печать через браузер" для каждого товара</li>
                <li>Подтверждайте печать в диалоге браузера</li>
              </ol>
              <p className="text-yellow-700 dark:text-yellow-400 font-medium mt-3">
                ⚠️ Каждая этикетка печатается отдельно с уникальным QR-кодом
              </p>
            </div>
          </div> */}

          {/* Таблица позиций */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Товар
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Цвет
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Размер
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Кол-во
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Печать
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {order.order_products.map((product, productIdx) => 
                    product.details.map((detail, detailIdx) => (
                      <tr 
                        key={`${productIdx}-${detailIdx}`}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                          {product.product_title}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700">
                            {detail.color}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                          {detail.size}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            {detail.amount} шт.
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handlePrintClick(detail, product.product_title)}
                            disabled={isSending}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                          >
                            <Printer size={16} />
                            Печать
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Итого */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-gray-900 dark:text-white">
                Итого позиций:
              </span>
              <span className="text-xl font-bold text-blue-700 dark:text-blue-300">
                {order.order_products.length} ({totalCount} шт.)
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Модальное окно выбора способа печати */}
      {showPrintModal && selectedPosition && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Печать этикетки
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-sm">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Товар:</strong> {selectedPosition.product_title}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Цвет:</strong> {selectedPosition.color} | <strong>Размер:</strong> {selectedPosition.size}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Количество:</strong> {selectedPosition.amount} шт.
                  </p>
                </div>
              </div>
              
              {/* <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>📦 QR-код будет содержать:</strong><br/>
                  • Все данные товара<br/>
                  • ID заказа: {order.id}<br/>
                  • Уникальный код этикетки
                </p>
              </div> */}
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    downloadSingleLabel(selectedPosition)
                    setShowPrintModal(false)
                  }}
                  disabled={isSending}
                  className="w-full p-4 border-2 border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Download size={24} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white mb-1">
                        Скачать этикетку
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Для печати через приложение принтера (Bluetooth)
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    printSingleLabel(selectedPosition)
                    setShowPrintModal(false)
                  }}
                  disabled={isSending}
                  className="w-full p-4 border-2 border-green-200 dark:border-green-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Printer size={24} className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white mb-1">
                        Печать через браузер
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Если принтер подключен через Bluetooth
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <button
                onClick={() => setShowPrintModal(false)}
                disabled={isSending}
                className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-900 dark:text-white"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetail