import { ref, computed } from 'vue'

export interface ValidationRule {
  required?: boolean
  email?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | null
}

export interface ValidationRules {
  [key: string]: ValidationRule
}

export interface FormErrors {
  [key: string]: string | null
}

export function useFormValidation<T extends Record<string, any>>(
  formData: T,
  rules: ValidationRules,
  getSelectedRole?: () => { code?: string } | undefined
) {
  const errors = ref<FormErrors>({})
  const touched = ref<Record<string, boolean>>({})
  const submitted = ref(false)

  const validateField = (field: keyof T, value: string): string | null => {
    const fieldRules = rules[field as string]
    if (!fieldRules) return null

    // Required validation
    if (fieldRules.required && (!value || value.trim() === '')) {
      return 'Ce champ est obligatoire'
    }

    // Skip other validations if field is empty and not required
    if (!value || value.trim() === '') {
      return null
    }

    // Email validation
    if (fieldRules.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return 'Veuillez entrer une adresse email valide'
      }
    }

    // Min length validation
    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      return `Ce champ doit contenir au moins ${fieldRules.minLength} caractères`
    }

    // Max length validation
    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      return `Ce champ ne peut pas dépasser ${fieldRules.maxLength} caractères`
    }

    // Pattern validation
    if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
      return 'Le format de ce champ est invalide'
    }

    // Custom validation
    if (fieldRules.custom) {
      return fieldRules.custom(value)
    }

    return null
  }

  const validateForm = (): boolean => {
    let isValid = true
    const newErrors: FormErrors = {}

    // Get current role dynamically
    const currentRole = getSelectedRole?.()
    console.log('Current role in validateForm:', currentRole?.code)

    Object.keys(rules).forEach(field => {
      const fieldRules = rules[field]
      // Skip validation if rules are undefined/null
      if (!fieldRules) return
      
      // Skip validation if field is not visible/required in current context
      if (field === 'organization' && currentRole?.code === 'CITOYEN') {
        console.log('Skipping organization validation for CITOYEN')
        return
      }
      
      const error = validateField(field as keyof T, formData[field as keyof T] as string)
      newErrors[field] = error
      if (error) isValid = false
    })

    errors.value = newErrors
    return isValid
  }

  const setFieldTouched = (field: keyof T) => {
    touched.value[field as string] = true
    const error = validateField(field, formData[field] as string)
    errors.value[field as string] = error
  }

  const clearFieldError = (field: keyof T) => {
    errors.value[field as string] = null
  }

  const clearAllErrors = () => {
    errors.value = {}
    // Ne pas effacer touched.value pour garder l'état des champs touchés
  }

  const markAllFieldsTouched = () => {
    Object.keys(rules).forEach(field => {
      touched.value[field] = true
    })
  }

  const markAsSubmitted = () => {
    submitted.value = true
  }

  const hasErrors = computed(() => {
    return Object.values(errors.value).some(error => error !== null)
  })

  const getFieldError = (field: keyof T) => {
    return errors.value[field as string]
  }

  const isFieldTouched = (field: keyof T) => {
    return touched.value[field as string] || false
  }

  const isFieldInvalid = (field: keyof T) => {
    return (isFieldTouched(field) || submitted.value) && !!getFieldError(field)
  }

  return {
    errors,
    touched,
    submitted,
    hasErrors,
    validateField,
    validateForm,
    setFieldTouched,
    clearFieldError,
    clearAllErrors,
    markAllFieldsTouched,
    markAsSubmitted,
    getFieldError,
    isFieldTouched,
    isFieldInvalid
  }
}

// Common validation rules
export const commonRules = {
  email: {
    required: true,
    email: true
  },
  password: {
    required: true,
    minLength: 8,
    custom: (value: string) => {
      if (!/(?=.*[a-z])/.test(value)) {
        return 'Le mot de passe doit contenir au moins une lettre minuscule'
      }
      if (!/(?=.*[A-Z])/.test(value)) {
        return 'Le mot de passe doit contenir au moins une lettre majuscule'
      }
      if (!/(?=.*\d)/.test(value)) {
        return 'Le mot de passe doit contenir au moins un chiffre'
      }
      if (!/(?=.*[@$!%*?&])/.test(value)) {
        return 'Le mot de passe doit contenir au moins un caractère spécial'
      }
      return null
    }
  },
  required: {
    required: true
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZÀ-ÿ\s-]+$/
  }
}
