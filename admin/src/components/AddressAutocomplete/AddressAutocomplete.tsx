import React, { useState, useEffect } from 'react'
import { Input, AutoComplete, message } from 'antd'
import { EnvironmentOutlined } from '@ant-design/icons'

interface AddressOption {
  label: string
  value: string
  address: string
  latitude: number
  longitude: number
  city: string
  zipcode: string
}

interface AddressAutocompleteProps {
  value?: string
  onChange: (value: string) => void
  onSelect: (data: {
    address: string
    latitude: number
    longitude: number
    city: string
    zipcode: string
  }) => void
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value = '',
  onChange,
  onSelect
}) => {
  const [options, setOptions] = useState<AddressOption[]>([])
  const [loading, setLoading] = useState(false)

  const searchAddress = async (searchText: string) => {
    if (!searchText || searchText.length < 3) {
      setOptions([])
      return
    }

    setLoading(true)
    try {
      // Using Nominatim OpenStreetMap API (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&limit=5&addressdetails=1&countrycodes=fr`,
        {
          headers: {
            'User-Agent': 'Planches-Mixtes-Admin/1.0' // Required by Nominatim
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch addresses')
      }

      const data = await response.json()

      const addressOptions: AddressOption[] = data.map((result: any) => ({
        label: result.display_name,
        value: result.display_name,
        address: result.address?.road || result.address?.house_number 
          ? `${result.address.house_number || ''} ${result.address.road || ''}`.trim()
          : result.display_name.split(',')[0],
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        city: result.address?.city || result.address?.town || result.address?.village || '',
        zipcode: result.address?.postcode || ''
      }))

      setOptions(addressOptions)
    } catch (error) {
      console.error('Error searching address:', error)
      message.error('Erreur lors de la recherche d\'adresse')
      setOptions([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchText: string) => {
    onChange(searchText)
    searchAddress(searchText)
  }

  const handleSelect = (selectedValue: string) => {
    const selectedOption = options.find(opt => opt.value === selectedValue)
    if (selectedOption) {
      onChange(selectedValue)
      onSelect({
        address: selectedOption.address,
        latitude: selectedOption.latitude,
        longitude: selectedOption.longitude,
        city: selectedOption.city,
        zipcode: selectedOption.zipcode
      })
    }
  }

  return (
    <AutoComplete
      value={value}
      options={options}
      onSearch={handleSearch}
      onSelect={handleSelect}
      placeholder="Rechercher une adresse (ex: 123 rue de la Paix, Paris)"
      style={{ width: '100%' }}
      allowClear
      notFoundContent={loading ? 'Recherche en cours...' : undefined}
    >
      <Input
        prefix={<EnvironmentOutlined />}
        allowClear
      />
    </AutoComplete>
  )
}

export default AddressAutocomplete

