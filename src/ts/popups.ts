abstract class BaseModal {
  protected toggleBodyClass(className: string, isOpen: boolean) {
    document.body.classList.toggle(className, isOpen)
  }
}

export class Dialog extends BaseModal {
  private dialog: HTMLDialogElement | null
  private triggerOpenBtn: HTMLButtonElement | null
  private triggerCloseBtn: HTMLButtonElement | null

  constructor(dialogSelector: string, triggerOpenSelector: string, triggerCloseSelector: string) {
    super()
    this.dialog = document.querySelector(dialogSelector)
    this.triggerOpenBtn = document.querySelector(triggerOpenSelector)
    this.triggerCloseBtn = document.querySelector(triggerCloseSelector)
    if (!this.dialog) throw new Error('Dialog not found')
  }

  init() {
    this.triggerOpenBtn?.addEventListener('click', () => this.open())
    this.triggerCloseBtn?.addEventListener('click', () => this.close())
    this.dialog?.addEventListener('close', () => this.toggleBodyClass('menu-open', false))
    document.addEventListener('click', (e) => this.handleClickOutsideDialog(e))
  }

  public open() {
    this.toggleBodyClass('menu-open', true)
    this.dialog?.showModal()
  }
  public close() {
    this.dialog?.close()
  }

  protected handleClickOutsideDialog(e: MouseEvent) {
    const target = e.target as HTMLElement
    if (!target.contains(this.dialog)) return
    this.dialog?.close()
  }
}

export class Popover extends BaseModal {
  private popover: HTMLElement | null
  private triggerCloseBtn: HTMLButtonElement | null
  constructor(popoverSelector: string, triggerCloseSelector: string) {
    super()
    this.popover = document.querySelector(popoverSelector)
    this.triggerCloseBtn = document.querySelector(triggerCloseSelector)
    if (!this.popover) throw new Error('Popover not found')
  }
  public init() {
    this.popover?.addEventListener('beforetoggle', (event: Event) => {
      if (event instanceof ToggleEvent) this.toggleBodyClass('menu-open', event.newState === 'open')
    })
    this.triggerCloseBtn?.addEventListener('click', () => this.close())
  }

  public close() {
    this.popover?.hidePopover()
  }
}
