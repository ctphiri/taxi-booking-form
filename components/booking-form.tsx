"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MapPin, Users, Car, User, Check, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react'

interface VehicleData {
  type: string
  title: string
  description: string
  maxPassengers: number
  maxBaggage: number
  maxCarSeats: number
  icon: React.ReactNode
}

const vehicles: VehicleData[] = [
  {
    type: "Sedan",
    title: "Berlina",
    description: "Mercedes Classe E",
    maxPassengers: 3,
    maxBaggage: 3,
    maxCarSeats: 1,
    icon: <Car className="w-8 h-8" />,
  },
  {
    type: "Sedan VIP",
    title: "Berlina Executive",
    description: "Mercedes Classe S",
    maxPassengers: 3,
    maxBaggage: 3,
    maxCarSeats: 1,
    icon: <Car className="w-8 h-8" />,
  },
  {
    type: "Minivan",
    title: "Minivan",
    description: "Mercedes Classe V",
    maxPassengers: 7,
    maxBaggage: 12,
    maxCarSeats: 3,
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
        <path d="M3 7l2-4h14l2 4" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
        <path d="M9 7v6" />
        <path d="M15 7v6" />
      </svg>
    ),
  },
  {
    type: "Van",
    title: "Van",
    description: "Mercedes Vito/Sprinter",
    maxPassengers: 8,
    maxBaggage: 15,
    maxCarSeats: 3,
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 6v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6" />
        <path d="M3 6l3-3h12l3 3" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
        <rect x="7" y="6" width="10" height="8" />
      </svg>
    ),
  },
]

const steps = [
  { id: 1, label: "Dettagli Viaggio", icon: MapPin },
  { id: 2, label: "Vettura e Opzioni", icon: Users },
  { id: 3, label: "Info Contatti", icon: User },
  { id: 4, label: "Riepilogo", icon: Check },
]

interface QuantitySelectorProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
  helperText?: string
}

function QuantitySelector({
  label,
  value,
  onChange,
  min = 0,
  max = 20,
  disabled = false,
  helperText,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > min && !disabled) {
      onChange(value - 1)
    }
  }

  const handleIncrement = () => {
    if (value < max && !disabled) {
      onChange(value + 1)
    }
  }

  const isDecrementDisabled = disabled || value <= min
  const isIncrementDisabled = disabled || value >= max

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={isDecrementDisabled}
          className="h-10 w-10 p-0 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="flex items-center justify-center min-w-[3rem] h-10 px-3 border border-gray-300 rounded-md bg-white">
          <span className="text-sm font-medium">{value}</span>
        </div>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={isIncrementDisabled}
          className="h-10 w-10 p-0 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {helperText && <p className="text-sm text-gray-600 mt-1">{helperText}</p>}
    </div>
  )
}

export default function TaxiBookingForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    pickupAddress: "",
    dropoffAddress: "",
    pickupDate: "",
    pickupTime: "",
    passengers: 1,
    vehicleType: "",
    carSeatsCount: 0,
    baggage: 0,
    baggageUnsure: false,
    assistenzaStazione: false,
    additionalNotes: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Get selected vehicle data
  const selectedVehicle = vehicles.find((v) => v.type === formData.vehicleType)

  // Auto-select first suitable vehicle when passengers change
  useEffect(() => {
    const passengerCount = formData.passengers
    const suitableVehicles = vehicles.filter((vehicle) => passengerCount <= vehicle.maxPassengers)

    if (suitableVehicles.length > 0) {
      const currentVehicleStillSuitable = suitableVehicles.find((v) => v.type === formData.vehicleType)
      if (!currentVehicleStillSuitable) {
        setFormData((prev) => ({ ...prev, vehicleType: suitableVehicles[0].type }))
      }
    } else {
      setFormData((prev) => ({ ...prev, vehicleType: "" }))
    }
  }, [formData.passengers])

  // Auto-adjust car seats and baggage when vehicle changes
  useEffect(() => {
    if (selectedVehicle) {
      const updates: Partial<typeof formData> = {}

      // Adjust car seats if current selection exceeds vehicle capacity
      if (formData.carSeatsCount > selectedVehicle.maxCarSeats) {
        updates.carSeatsCount = selectedVehicle.maxCarSeats
      }

      // Adjust baggage if current selection exceeds vehicle capacity
      if (formData.baggage > selectedVehicle.maxBaggage) {
        updates.baggage = selectedVehicle.maxBaggage
      }

      if (Object.keys(updates).length > 0) {
        setFormData((prev) => ({ ...prev, ...updates }))
      }
    }
  }, [formData.vehicleType, selectedVehicle])

  const updateFormData = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateStep = () => {
    const errors: Record<string, string> = {}

    switch (currentStep) {
      case 1:
        // Validate date and time are in the future
        if (formData.pickupDate && formData.pickupTime) {
          const pickupDateTime = new Date(`${formData.pickupDate}T${formData.pickupTime}`)
          const now = new Date()
          if (pickupDateTime <= now) {
            errors.pickupDate = "La data e l'ora di partenza devono essere nel futuro"
            errors.pickupTime = "La data e l'ora di partenza devono essere nel futuro"
          }
        }
        break
      case 2:
        // Validate vehicle selection
        if (!formData.vehicleType) {
          errors.vehicleType = "Seleziona una vettura"
        }
        break
      case 3:
        // Validate contact information
        if (!formData.firstName.trim()) {
          errors.firstName = "Il nome è obbligatorio"
        }
        if (!formData.lastName.trim()) {
          errors.lastName = "Il cognome è obbligatorio"
        }
        if (!formData.phoneNumber.trim()) {
          errors.phoneNumber = "Il numero di telefono è obbligatorio"
        }
        if (!formData.email.trim()) {
          errors.email = "L'email è obbligatoria"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          errors.email = "Inserisci un'email valida"
        }
        break
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const nextStep = () => {
    if (validateStep() && currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep()) {
      console.log("Form data:", formData)
      alert("Prenotazione inviata con successo! Ti contatteremo presto per confermare la tua prenotazione.")
    }
  }

  const formatDateTime = (date: string, time: string) => {
    if (!date || !time) return "Non specificato"
    const dateObj = new Date(`${date}T${time}`)
    return (
      dateObj.toLocaleDateString("it-IT", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }) +
      " alle " +
      time
    )
  }

  const getVehicleDisplayName = (vehicleType: string) => {
    const vehicle = vehicles.find((v) => v.type === vehicleType)
    return vehicle ? `${vehicle.title} (${vehicle.description}) - ${vehicle.maxPassengers} pax` : vehicleType
  }

  const isVehicleDisabled = (vehicle: VehicleData) => {
    const passengerCount = formData.passengers
    return passengerCount > vehicle.maxPassengers
  }

  const getBaggageHelperText = () => {
    if (!selectedVehicle) return undefined

    return `Stima approssimativa - massimo ${selectedVehicle.maxBaggage} bagagli per questo veicolo (valigie grandi contano come 2). Potremo sempre aggiustare i dettagli in seguito.`
  }

  const isNightTrip = () => {
    if (!formData.pickupTime) return false
    const time = formData.pickupTime
    const hour = Number.parseInt(time.split(":")[0])
    return hour >= 22 || hour < 6
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-900">Prenota un Taxi</h2>
        <p className="text-gray-600 mb-6">Compila il modulo sottostante per richiedere una prenotazione taxi</p>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="h-2 rounded-full bg-amber-700 transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex justify-between mb-8">
          {steps.map((step) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div key={step.id} className="flex flex-col items-center flex-1 max-w-32">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2 ${
                    isCompleted
                      ? "bg-amber-700 border-amber-700 text-white"
                      : isActive
                        ? "border-amber-700 text-amber-700"
                        : "border-gray-300 text-gray-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-sm font-medium text-center ${isActive ? "text-amber-700" : "text-gray-500"}`}>
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Trip Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Dettagli Viaggio</h3>
            <div>
              <label htmlFor="pickupAddress" className="block text-sm font-medium text-gray-700 mb-1">Indirizzo di Partenza</label>
              <input
                id="pickupAddress"
                type="text"
                value={formData.pickupAddress}
                onChange={(e) => updateFormData("pickupAddress", e.target.value)}
                placeholder="Inserisci indirizzo di partenza"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label htmlFor="dropoffAddress" className="block text-sm font-medium text-gray-700 mb-1">Indirizzo di Arrivo</label>
              <input
                id="dropoffAddress"
                type="text"
                value={formData.dropoffAddress}
                onChange={(e) => updateFormData("dropoffAddress", e.target.value)}
                placeholder="Inserisci indirizzo di arrivo"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-1">Data di Partenza</label>
                <input
                  id="pickupDate"
                  type="date"
                  value={formData.pickupDate}
                  onChange={(e) => updateFormData("pickupDate", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${validationErrors.pickupDate ? "border-red-500" : "border-gray-300"}`}
                />
                {validationErrors.pickupDate && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.pickupDate}</p>
                )}
              </div>
              <div>
                <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 mb-1">Orario di Partenza</label>
                <input
                  id="pickupTime"
                  type="time"
                  value={formData.pickupTime}
                  onChange={(e) => updateFormData("pickupTime", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${validationErrors.pickupTime ? "border-red-500" : "border-gray-300"}`}
                />
                {validationErrors.pickupTime && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.pickupTime}</p>
                )}
                {isNightTrip() && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <p className="text-sm text-amber-800">
                      <strong>Notturno (corse dalle 22:00 - 06:00) +€10</strong>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Passengers and Vehicle */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Vettura e Opzioni</h3>

            <QuantitySelector
              label="Numero di Passeggeri"
              value={formData.passengers}
              onChange={(value) => updateFormData("passengers", value)}
              min={1}
              max={8}
            />

            <div>
              <label className="block mb-4 text-sm font-medium text-gray-700">Vettura</label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {vehicles.map((vehicle) => {
                  const isDisabled = isVehicleDisabled(vehicle)
                  const isSelected = formData.vehicleType === vehicle.type
                  return (
                    <div key={vehicle.type} className="relative">
                      <input
                        type="radio"
                        id={vehicle.type}
                        name="vehicleType"
                        value={vehicle.type}
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={(e) => updateFormData("vehicleType", e.target.value)}
                        className="sr-only"
                      />
                      <label
                        htmlFor={vehicle.type}
                        className={`
                          flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all
                          ${
                            isDisabled
                              ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                              : isSelected
                                ? "border-amber-700 bg-amber-50 text-amber-700"
                                : "border-gray-200 hover:border-gray-300 text-gray-600"
                          }
                        `}
                      >
                        <div className={`mb-3 ${isDisabled ? "text-gray-300" : isSelected ? "text-amber-700" : "text-gray-600"}`}>
                          {vehicle.icon}
                        </div>
                        <div className="text-center">
                          <div className={`font-medium text-sm ${isDisabled ? "text-gray-400" : "text-gray-900"}`}>
                            {vehicle.title}
                          </div>
                          <div className={`text-xs mt-1 ${isDisabled ? "text-gray-300" : "text-gray-600"}`}>
                            {vehicle.maxPassengers} pax max
                          </div>
                        </div>
                        {isDisabled && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                            <span className="text-xs text-gray-500 font-medium">Non disponibile</span>
                          </div>
                        )}
                      </label>
                    </div>
                  )
                })}
              </div>
              {validationErrors.vehicleType && (
                <p className="text-red-500 text-sm mt-2">{validationErrors.vehicleType}</p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="baggageUnsure"
                  checked={formData.baggageUnsure}
                  onChange={(e) => {
                    const isChecked = e.target.checked
                    updateFormData("baggageUnsure", isChecked)
                    if (isChecked) {
                      updateFormData("baggage", 0)
                    }
                  }}
                  className="rounded border-gray-300"
                />
                <label htmlFor="baggageUnsure" className="text-sm">
                  Non sono sicuro del numero di bagagli
                </label>
              </div>

              {!formData.baggageUnsure && (
                <QuantitySelector
                  label="Bagagli (stima)"
                  value={formData.baggage}
                  onChange={(value) => updateFormData("baggage", value)}
                  min={0}
                  max={selectedVehicle?.maxBaggage || 15}
                  helperText={getBaggageHelperText()}
                />
              )}

              {formData.baggageUnsure && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    Nessun problema! Puoi specificare i dettagli dei bagagli nelle note qui sotto, oppure li definiremo
                    insieme al momento della conferma.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">Opzioni Aggiuntive</h4>

              <QuantitySelector
                label="Seggiolini (+€10)"
                value={formData.carSeatsCount}
                onChange={(value) => updateFormData("carSeatsCount", value)}
                min={0}
                max={selectedVehicle?.maxCarSeats || 3}
                helperText={
                  selectedVehicle ? `Massimo ${selectedVehicle.maxCarSeats} seggiolini per questo veicolo` : undefined
                }
              />

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="assistenzaStazione"
                  checked={formData.assistenzaStazione}
                  onChange={(e) => updateFormData("assistenzaStazione", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="assistenzaStazione" className="text-sm">
                  Assistenza in stazione (+€10)
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">Note aggiuntive o richieste speciali</label>
              <textarea
                id="additionalNotes"
                value={formData.additionalNotes}
                onChange={(e) => updateFormData("additionalNotes", e.target.value)}
                placeholder="Specifica dettagli sui bagagli se non sei sicuro, oppure inserisci altre richieste speciali per il tuo viaggio. Ricorda: tutti i dettagli possono essere confermati e aggiustati prima del viaggio!"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>
        )}

        {/* Step 3: Contact Information */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Info Contatti</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  placeholder="Mario"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${validationErrors.firstName ? "border-red-500" : "border-gray-300"}`}
                />
                {validationErrors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Cognome</label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  placeholder="Rossi"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${validationErrors.lastName ? "border-red-500" : "border-gray-300"}`}
                />
                {validationErrors.lastName && <p className="text-red-500 text-sm mt-1">{validationErrors.lastName}</p>}
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                  placeholder="+39 333 1234567"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${validationErrors.phoneNumber ? "border-red-500" : "border-gray-300"}`}
                />
                {validationErrors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.phoneNumber}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="mario.rossi@esempio.com"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${validationErrors.email ? "border-red-500" : "border-gray-300"}`}
                />
                {validationErrors.email && <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Summary */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Riepilogo Prenotazione</h3>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-600">Partenza:</span>
                  <p>{formData.pickupAddress || "Non specificato"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Arrivo:</span>
                  <p>{formData.dropoffAddress || "Non specificato"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Data e Ora:</span>
                  <p>{formatDateTime(formData.pickupDate, formData.pickupTime)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Passeggeri:</span>
                  <p>{formData.passengers}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Vettura:</span>
                  <p>{formData.vehicleType ? getVehicleDisplayName(formData.vehicleType) : "Non selezionato"}</p>
                </div>
                {(formData.baggage > 0 || formData.baggageUnsure) && (
                  <div>
                    <span className="font-medium text-gray-600">Bagagli:</span>
                    <p>{formData.baggageUnsure ? "Da definire" : formData.baggage}</p>
                  </div>
                )}
                {formData.additionalNotes && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-600">Note aggiuntive:</span>
                    <p>{formData.additionalNotes}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-600">Nome:</span>
                  <p>
                    {formData.firstName} {formData.lastName}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Contatto:</span>
                  <p>
                    {formData.email} / {formData.phoneNumber}
                  </p>
                </div>
              </div>

              {/* Additional Options Summary */}
              {(formData.carSeatsCount > 0 || formData.assistenzaStazione || isNightTrip()) && (
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <span className="font-medium text-gray-600 block mb-2">Opzioni Aggiuntive:</span>
                  <div className="space-y-1">
                    {formData.carSeatsCount > 0 && (
                      <p className="text-sm">• Seggiolini: {formData.carSeatsCount} (+€10)</p>
                    )}
                    {formData.assistenzaStazione && <p className="text-sm">• Assistenza in stazione (+€10)</p>}
                    {isNightTrip() && <p className="text-sm">• Notturno (22:00 - 06:00) (+€10)</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Precedente
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800"
            >
              Successivo
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800">
              <Car className="w-4 h-4" />
              Prenota Taxi
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
