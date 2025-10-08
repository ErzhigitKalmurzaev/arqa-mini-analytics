import { useState, useRef, useEffect } from "react"
import { Camera, Package, CheckCircle, AlertCircle, X, Scan } from "lucide-react"
import { useAppDispatch } from "../../store/hooks"
import { sendSkanDatas } from "../../store/packer/packSlice"
import { toast } from "react-toastify"

interface PackageData {
  qrCode: string
  productName: string
  color: string
  size: string
}

const PackerSkan = () => {

  const dispatch = useAppDispatch()
  const [isScanning, setIsScanning] = useState(false)
  const [packageData, setPackageData] = useState<PackageData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isCheckingPermission, setIsCheckingPermission] = useState(false)
  const [lastScannedCode, setLastScannedCode] = useState<string>('')
  const [scannerReady, setScannerReady] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const html5QrCodeRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isInitializingRef = useRef(false)

  useEffect(() => {
    // Загружаем библиотеку html5-qrcode
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js'
    script.async = true
    script.onload = () => {
      console.log('html5-qrcode загружена')
      setScannerReady(true)
    }
    script.onerror = () => {
      console.error('Ошибка загрузки html5-qrcode')
      setCameraError('Не удалось загрузить сканер QR-кодов')
    }
    document.body.appendChild(script)

    return () => {
      stopScanner()
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const handleQRCodeDetected = (decodedText: string) => {
    const decodedQR = JSON.parse(decodedText)
    
    // Избегаем повторного сканирования
    if (decodedText === lastScannedCode) {
      return
    }
    
    setLastScannedCode(decodedText)
    
    // Вибрация при успешном сканировании
    if (navigator.vibrate) {
      navigator.vibrate(200)
    }
    
    if (decodedQR) {
      setPackageData({
        qrCode: decodedQR.internal_code,
        productName: decodedQR.product,
        color: decodedQR.color,
        size: decodedQR.size
      })
    } else {
      // Если данных нет в моках, создаем базовую запись
      setPackageData({
        qrCode: decodedText,
        productName: 'Товар не определен',
        color: 'Не указан',
        size: 'Не указан'
      })
    }
    
    stopScanner()
  }

  const startScanner = async () => {
    if (!scannerReady || !(window as any).Html5Qrcode) {
      setCameraError('Сканер еще не загружен, попробуйте снова')
      return
    }

    if (isInitializingRef.current) {
      console.log('Сканер уже инициализируется')
      return
    }

    try {
      isInitializingRef.current = true
      setIsCheckingPermission(true)
      setCameraError(null)
      setLastScannedCode('')
      setIsScanning(true)
      setSuccessMessage(null)

      const element = document.getElementById('qr-reader')
      if (!element) {
        throw new Error('Элемент qr-reader не найден')
      }

      console.log('Элемент найден, инициализация сканера...')
      await new Promise(resolve => setTimeout(resolve, 200))

      const Html5Qrcode = (window as any).Html5Qrcode
      html5QrCodeRef.current = new Html5Qrcode("qr-reader")

      const config = {
        fps: 10,
        qrbox: { width: 200, height: 200 },
        aspectRatio: 1.0
      }

      console.log('Запуск камеры...')
      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        config,
        handleQRCodeDetected,
        (errorMessage: string) => {
          // Игнорируем ошибки когда QR не найден
        }
      )

      console.log('Сканер успешно запущен')

    } catch (error: any) {
      console.error("Ошибка запуска сканера:", error)
      setIsScanning(false)
      
      if (error.name === "NotAllowedError") {
        setCameraError("Доступ к камере запрещен. Разрешите доступ в настройках браузера.")
      } else if (error.name === "NotFoundError") {
        setCameraError("Камера не найдена.")
      } else if (error.name === "NotReadableError") {
        setCameraError("Камера занята другим приложением.")
      } else {
        setCameraError("Не удалось запустить камеру: " + (error.message || error))
      }
    } finally {
      setIsCheckingPermission(false)
      isInitializingRef.current = false
    }
  }

  const stopScanner = async () => {
    console.log('Остановка сканера')
    
    if (html5QrCodeRef.current) {
      try {
        const state = await html5QrCodeRef.current.getState()
        console.log('Текущее состояние сканера:', state)
        if (state === 2) {
          await html5QrCodeRef.current.stop()
          console.log('Сканер остановлен')
        }
        html5QrCodeRef.current = null
      } catch (error) {
        console.error('Ошибка остановки сканера:', error)
        html5QrCodeRef.current = null
      }
    }
    
    setIsScanning(false)
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    if (!scannerReady || !(window as any).Html5Qrcode) {
      alert('Сканер еще не загружен, попробуйте снова')
      return
    }

    const file = files[0]
    
    try {
      const Html5Qrcode = (window as any).Html5Qrcode
      const html5QrCode = new Html5Qrcode("qr-file-reader")
      
      const decodedText = await html5QrCode.scanFile(file, false)
      console.log('QR код найден в файле:', decodedText)
      handleQRCodeDetected(decodedText)
      
    } catch (error) {
      console.error('Ошибка сканирования файла:', error)
      alert('QR код не найден на изображении')
    }
  }

  const handleConfirmPacking = async () => {
    if (!packageData) return

    setIsSubmitting(true)
    try {
      dispatch(sendSkanDatas(packageData.qrCode)).then((res) => {
        if(res.meta.requestStatus === 'fulfilled') {
          toast.success('Товар упакован!')
          handleCancel()
        } else {
          toast.error(res.payload || 'Произошла ошибка при отправке')
        }
      })
    } catch (error) {
      alert('Ошибка при подтверждении упаковки')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setPackageData(null)
    setLastScannedCode('')
  }

  const resetState = () => {
    setPackageData(null)
    setLastScannedCode('')
    setSuccessMessage(null)
    setCameraError(null)
    stopScanner()
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-900 py-3">
      <div className="px-4 py-3 border-b bg-white dark:bg-gray-800">
        <div className="flex items-center justify-center gap-3">
          <Package size={24} className="text-blue-600 dark:text-blue-400" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Упаковка товаров</h1>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">

          {/* Скрытый div для сканирования из файла */}
          <div id="qr-file-reader" className="hidden"></div>

          {/* Контейнер для сканера - всегда в DOM */}
          <div className={isScanning ? 'block' : 'hidden'}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
              <div 
                id="qr-reader" 
                className="w-full"
              ></div>
              <div className="p-4 space-y-3">
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Наведите камеру на QR-код товара
                </div>
                <button 
                  onClick={stopScanner} 
                  className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>

          {/* Сообщение об успехе */}
          {successMessage && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex gap-3 animate-fade-in">
              <CheckCircle size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0"/>
              <div className="flex-1 text-sm text-green-800 dark:text-green-200">{successMessage}</div>
            </div>
          )}

          {/* Старт */}
          {!isScanning && !packageData && !successMessage && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-8">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Scan size={40} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Сканирование товара</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Отсканируйте QR-код товара для упаковки
                </p>
                <button
                  onClick={startScanner}
                  disabled={isCheckingPermission || !scannerReady}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {isCheckingPermission ? (
                    "Запуск камеры..."
                  ) : !scannerReady ? (
                    "Загрузка сканера..."
                  ) : (
                    <>
                      <Camera size={20}/> Запустить камеру
                    </>
                  )}
                </button>
                <div className="pt-4 border-t dark:border-gray-700">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!scannerReady}
                    className="w-full px-6 py-3 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-gray-900 dark:text-gray-100"
                  >
                    <Camera size={20}/> Загрузить фото QR
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Ошибка */}
          {cameraError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex gap-3">
              <AlertCircle size={20} className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0"/>
              <div className="flex-1 text-sm text-red-800 dark:text-red-200">{cameraError}</div>
              <button onClick={() => setCameraError(null)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200">
                <X size={16}/>
              </button>
            </div>
          )}

          {/* Карточка товара (корзина) */}
          {packageData && !successMessage && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 overflow-hidden">
                {/* Заголовок */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                  <div className="flex items-center gap-3 text-white">
                    <Package size={28} />
                    <div>
                      <h3 className="text-lg font-bold">Товар к упаковке</h3>
                    </div>
                  </div>
                </div>

                {/* Информация о товаре */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-lg flex items-center justify-center">
                      <Package size={32} className="text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                        {packageData.productName}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        QR: {packageData.qrCode}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Цвет</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {packageData.color}
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">Размер</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {packageData.size}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Кнопки действий */}
                <div className="px-6 pb-6 grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors text-gray-900 dark:text-gray-100 font-medium"
                  >
                    Отмена
                  </button>
                  <button 
                    onClick={handleConfirmPacking}
                    disabled={isSubmitting}
                    className="px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Упаковка...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20}/> Упаковать
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Подсказка */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                  💡 Проверьте соответствие товара перед подтверждением упаковки
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default PackerSkan