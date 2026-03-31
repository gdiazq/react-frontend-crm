import { ButtonComponent } from '@/components/ui/button/ButtonComponent'
import { InputComponent } from '@/components/ui/input/InputComponent'

interface SearchBarComponentProps {
  value: string
  loading?: boolean
  placeholder?: string
  buttonText?: string
  loadingButtonText?: string
  buttonClassName?: string
  onValueChange: (value: string) => void
  onSearch: () => void
}

export function SearchBarComponent({
  value,
  loading = false,
  placeholder = 'Buscar por nombre, apellido o correo',
  buttonText = 'Buscar',
  loadingButtonText = 'Buscando...',
  buttonClassName = '',
  onValueChange,
  onSearch,
}: SearchBarComponentProps) {
  return (
    <form
      className="flex flex-col gap-3 md:flex-row md:items-end"
      onSubmit={(e) => {
        e.preventDefault()
        onSearch()
      }}
    >
      <div className="flex-1">
        <InputComponent
          value={value}
          type="text"
          placeholder={placeholder}
          onValueChange={onValueChange}
        />
      </div>
      <ButtonComponent
        type="submit"
        variant="primary"
        disabled={loading}
        label={loading ? loadingButtonText : buttonText}
        className={buttonClassName}
      />
    </form>
  )
}
