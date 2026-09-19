import { describe, expect, it } from 'vitest'

import { setTranslation, t } from '../translate'

describe('t', () => {
  it('returns the translation when known, the text otherwise', () => {
    setTranslation({ Number: 'Nombre' })

    expect(t('Number')).toBe('Nombre')
    expect(t('Groups')).toBe('Groups')
  })

  it('is not fooled by Object.prototype keys', () => {
    setTranslation({})

    expect(t('constructor')).toBe('constructor')
  })

  it('copies the given map', () => {
    const map = { Add: 'Ajouter' }

    setTranslation(map)
    map.Add = 'Additionner'

    expect(t('Add')).toBe('Ajouter')
  })
})
