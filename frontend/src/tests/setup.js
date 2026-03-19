import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock de IntersectionObserver si es necesario (para virtualización o animaciones)
class IntersectionObserverMock {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)

// Mock de ResizeObserver (requerido por TanStack Virtual)
class ResizeObserverMock {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('ResizeObserver', ResizeObserverMock)

// Mock de window.confirm si es necesario
vi.stubGlobal('confirm', vi.fn(() => true))
