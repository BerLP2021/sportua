export class SearchFormToggle {
  private trigger: HTMLButtonElement
  private form: HTMLFormElement
  private input: HTMLInputElement | null
  private removeListeners: (() => void) | null = null

  constructor(triggerSelector: string, formSelector: string) {
    const trigger = document.querySelector(triggerSelector) as HTMLButtonElement
    const form = document.querySelector(formSelector) as HTMLFormElement

    if (!trigger || !form) {
      throw new Error('Trigger or form not found')
    }

    this.trigger = trigger
    this.form = form
    this.input = form.querySelector('input[type="search"]')

    this.init()
  }

  private init() {
    this.trigger.addEventListener('click', () => this.toggleForm())
    this.form.addEventListener('submit', (e) => {
      e.preventDefault()
      this.toggleForm()
    })
  }

  private toggleForm() {
    if (this.form.hasAttribute('inert')) {
      this.openForm()
    } else {
      this.closeForm()
    }
  }

  private openForm() {
    this.form.removeAttribute('inert')
    this.form.classList.add('active')

    this.disableTabbing()

    let focused = false
    const focusInput = () => {
      if (!focused) {
        this.input?.focus()
        this.restoreTabbing()
        focused = true
      }
    }

    this.form.addEventListener('transitionend', focusInput, { once: true })
    setTimeout(focusInput, 300)

    this.removeListeners = this.addCloseListeners()
  }

  private closeForm() {
    this.form.setAttribute('inert', 'true')
    this.form.classList.remove('active')
    this.restoreTabbing()
    this.removeListeners?.()
  }

  private disableTabbing() {
    const elements = this.form.querySelectorAll<HTMLElement>('button, input, [tabindex]')
    elements.forEach((el) => {
      el.setAttribute('tabindex', '-1')
    })
  }

  private restoreTabbing() {
    const elements = this.form.querySelectorAll<HTMLElement>('button, input, [tabindex]')
    elements.forEach((el) => {
      if (el.hasAttribute('tabindex') && el.getAttribute('tabindex') === '-1') {
        el.setAttribute('tabindex', '0')
      } else {
        el.removeAttribute('tabindex')
      }
    })
  }

  private addCloseListeners() {
    const handleClickOutside = (e: MouseEvent) => {
      if (!this.form.contains(e.target as Node)) {
        this.closeForm()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.closeForm()
      }
    }

    document.documentElement.addEventListener('click', handleClickOutside, true)
    document.documentElement.addEventListener('keydown', handleEscape, true)

    return () => {
      document.documentElement.removeEventListener('click', handleClickOutside, true)
      document.documentElement.removeEventListener('keydown', handleEscape, true)
    }
  }
}
