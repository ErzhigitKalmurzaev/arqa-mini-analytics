import { useState, useRef, useEffect } from "react"
import { Camera, X, CheckCircle, XCircle, Scan, AlertCircle } from "lucide-react"
import { toast } from "react-toastify"
import { useAppDispatch } from "../../store/hooks"
import { sendSkanDatas } from "../../store/otk/skanSlice"

interface ScannedData {
  qrCode: string
  color: string
  size: string
  product: string
}

interface DefectPhoto {
  id: string;
  url: string;
  file: File; // Добавляем оригинальный файл
}

const DEFECT_TYPES = [
  { value: 'Защип', label: 'Защип' },
  { value: 'Пропуск шва', label: 'Пропуск шва' },
  { value: 'Пятно', label: 'Пятно' },
  { value: 'Пуговица', label: 'Пуговица' },
  { value: 'Технический брак', label: 'Технический брак' },
  { value: 'Замок', label: 'Замок' },
  { value: 'Молния', label: 'Молния' },
  { value: 'Текстильный брак', label: 'Текстильный брак' },
  { value: 'Карман', label: 'Карман' },
  { value: 'Лассы', label: 'Лассы' },
  { value: 'Несоответствие размера', label: 'Несоответствие размера' }
]

const QualityControl = () => {

  const dispatch = useAppDispatch();

  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState<ScannedData | null>(null)
  const [showDefectForm, setShowDefectForm] = useState(false)
  const [defectPhotos, setDefectPhotos] = useState<DefectPhoto[]>([])
  const [defectType, setDefectType] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isCheckingPermission, setIsCheckingPermission] = useState(false)
  const [lastScannedCode, setLastScannedCode] = useState<string>('')
  const [scannerReady, setScannerReady] = useState(false)

  const html5QrCodeRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)
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
    
    // Вибрация при успешном сканировании (если доступна)
    if (navigator.vibrate) {
      navigator.vibrate(200)
    }
    
    setScannedData({
      qrCode: decodedQR.internal_code,
      color: decodedQR.color,
      size: decodedQR.size,
      product: decodedQR.product
    })
    
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

      // Проверяем существование элемента
      const element = document.getElementById('qr-reader')
      if (!element) {
        throw new Error('Элемент qr-reader не найден')
      }

      console.log('Элемент найден, инициализация сканера...')

      // Небольшая задержка для уверенности что DOM обновился
      await new Promise(resolve => setTimeout(resolve, 200))

      const Html5Qrcode = (window as any).Html5Qrcode
      
      // Создаем новый экземпляр каждый раз
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
          // Ошибки сканирования (когда QR не найден) - игнорируем
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
        if (state === 2) { // Сканер активен
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

  const handleAccept = async () => {
    setIsSubmitting(true)
    try {
      dispatch(sendSkanDatas({
        internal_code: scannedData?.qrCode || '',
        comment: defectType,
        images: defectPhotos || [],
        is_defect: showDefectForm
      })).then((res) => {
        if(res.meta.requestStatus === 'fulfilled') {
          toast.success('Товар принят!')
          resetState()
        } else {
          toast.error('Произошла ошибка при отправке')
        }
      })
    } catch {
      toast.error('Ошибка')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = () => setShowDefectForm(true)

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhoto: DefectPhoto = {
          id: Date.now().toString() + Math.random().toString(36),
          url: event.target?.result as string,
          file: file // Сохраняем оригинальный файл
        };
        setDefectPhotos(prev => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    });
    
    // Очищаем input для возможности повторной загрузки того же файла
    e.target.value = '';
  };

  const removePhoto = (id: string) => {
    setDefectPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  const submitDefect = async () => {
    if (!defectType) {
      alert('Выберите тип брака')
      return
    }
    if (defectPhotos.length === 0) {
      alert('Добавьте фото')
      return
    }
    setIsSubmitting(true)
    try {
      dispatch(sendSkanDatas({
        internal_code: scannedData?.qrCode || '',
        comment: defectType,
        images: defectPhotos || [],
        is_defect: showDefectForm
      })).then((res) => {
        if(res.meta.requestStatus === 'fulfilled') {
          toast.success('Брак зарегистрирован')
          resetState()
        } else {
          toast.error('Произошла ошибка при отправке')
        }
      })
    } catch {
      alert('Ошибка при отправке')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetState = () => {
    setScannedData(null)
    setShowDefectForm(false)
    setDefectPhotos([])
    setDefectType('')
    setLastScannedCode('')
    stopScanner()
    setCameraError(null)
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-900 py-3">
      <div className="px-4 py-3 border-b bg-white dark:bg-gray-800">
        <h1 className="text-xl font-bold">Контроль качества (ОТК)</h1>
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
                  Наведите камеру на QR-код
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

          {/* Старт */}
          {!isScanning && !scannedData && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-8">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Scan size={40} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Сканирование QR</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Нажмите кнопку для запуска камеры
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

          {/* Результат */}
          {scannedData && !showDefectForm && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="text-green-500" size={24} />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">QR код отсканирован!</h3>
                </div>
                <div className="space-y-2 text-gray-700 dark:text-gray-300 text-left">
                  <p><span className="font-semibold">Продукт:</span> {scannedData.product}</p>
                  <p><span className="font-semibold">Цвет:</span> {scannedData.color}</p>
                  <p><span className="font-semibold">Размер:</span> {scannedData.size}</p>
                  <p><span className="font-semibold">Внутренний код:</span> {scannedData.qrCode}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleAccept} 
                  disabled={isSubmitting}
                  className="px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg flex gap-2 justify-center items-center font-medium transition-colors"
                >
                  <CheckCircle size={20}/> Принять
                </button>
                <button 
                  onClick={handleReject}
                  disabled={isSubmitting}
                  className="px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg flex gap-2 justify-center items-center font-medium transition-colors"
                >
                  <XCircle size={20}/> В брак
                </button>
              </div>
            </div>
          )}

          {/* Форма брака */}
          {showDefectForm && scannedData && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Регистрация брака</h3>

                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoCapture}
                  className="hidden"
                />
                
                <button 
                  onClick={() => photoInputRef.current?.click()} 
                  className="w-full px-4 py-3 border-2 border-dashed dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  <Camera size={20}/> Добавить фото
                </button>

                {defectPhotos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {defectPhotos.map(photo => (
                      <div key={photo.id} className="relative aspect-square">
                        <img 
                          src={photo.url} 
                          alt="Брак" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button 
                          onClick={() => removePhoto(photo.id)} 
                          className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-colors"
                        >
                          <X size={16}/>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <select 
                  value={defectType} 
                  onChange={(e) => setDefectType(e.target.value)} 
                  className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg mt-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Выберите тип брака</option>
                  {DEFECT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button 
                    onClick={() => { 
                      setShowDefectForm(false)
                      setDefectPhotos([])
                      setDefectType('') 
                    }} 
                    disabled={isSubmitting}
                    className="px-4 py-3 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors text-gray-900 dark:text-gray-100"
                  >
                    Отмена
                  </button>
                  <button 
                    onClick={submitDefect}
                    disabled={isSubmitting}
                    className="px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors"
                  >
                    {isSubmitting ? "Отправка..." : "Отправить"}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default QualityControl