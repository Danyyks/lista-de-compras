// Categorias predefinidas do app
export const CATEGORIES = [
  { key: 'frutas',    label: 'Frutas',             color: 'var(--cat-frutas)'    },
  { key: 'verduras',  label: 'Verduras e Legumes',  color: 'var(--cat-verduras)'  },
  { key: 'carnes',    label: 'Carnes e Aves',        color: 'var(--cat-carnes)'    },
  { key: 'laticinios',label: 'Laticínios',           color: 'var(--cat-laticinios)'},
  { key: 'padaria',   label: 'Padaria',              color: 'var(--cat-padaria)'   },
  { key: 'bebidas',   label: 'Bebidas',              color: 'var(--cat-bebidas)'   },
  { key: 'limpeza',   label: 'Limpeza',              color: 'var(--cat-limpeza)'   },
  { key: 'higiene',   label: 'Higiene Pessoal',      color: 'var(--cat-higiene)'   },
  { key: 'outros',    label: 'Outros',               color: 'var(--cat-outros)'    },
]

// Mapa de chave → label para lookup rápido
export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map(c => [c.key, c])
)

// Retorna a cor de uma categoria (predefinida ou custom)
export function getCategoryColor(key) {
  return CATEGORY_MAP[key]?.color ?? 'var(--cat-custom)'
}

// Retorna o label de uma categoria
export function getCategoryLabel(key) {
  return CATEGORY_MAP[key]?.label ?? key
}

// Ordem de exibição das categorias: predefinidas primeiro, "outros" sempre por último
export function sortCategoryKeys(keys) {
  const predefinedOrder = CATEGORIES.map(c => c.key)
  return [...keys].sort((a, b) => {
    const ai = predefinedOrder.indexOf(a)
    const bi = predefinedOrder.indexOf(b)
    if (a === 'outros') return 1
    if (b === 'outros') return -1
    if (ai === -1 && bi === -1) return a.localeCompare(b) // custom: alfabético
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })
}
