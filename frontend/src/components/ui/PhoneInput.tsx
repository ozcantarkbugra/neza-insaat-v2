'use client'

import PhoneInputWithCountry from 'react-phone-number-input/max'
import { isValidPhoneNumber } from 'react-phone-number-input/max'
import type { E164Number } from 'libphonenumber-js/core'
import 'react-phone-number-input/style.css'
import { useMantineTheme, useMantineColorScheme } from '@mantine/core'

export { isValidPhoneNumber }

type PhoneInputProps = {
  value?: E164Number | string
  onChange?: (value?: E164Number) => void
  onBlur?: () => void
  error?: string
  label?: string
  placeholder?: string
  disabled?: boolean
}

export default function PhoneInput({
  value,
  onChange,
  onBlur,
  error,
  label,
  placeholder,
  disabled,
}: PhoneInputProps) {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <div>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 4,
            color: isDark ? theme.colors.gray[3] : theme.colors.gray[7],
          }}
        >
          {label}
        </label>
      )}
      <PhoneInputWithCountry
        international
        defaultCountry="TR"
        value={value || undefined}
        onChange={onChange ?? (() => {})}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        countryCallingCodeEditable={false}
        limitMaxLength
        className={`phone-input-mantine ${error ? 'phone-input-error' : ''}`}
      />
      {error && (
        <div
          style={{
            fontSize: 12,
            color: theme.colors.red[6],
            marginTop: 4,
          }}
        >
          {error}
        </div>
      )}
    </div>
  )
}
