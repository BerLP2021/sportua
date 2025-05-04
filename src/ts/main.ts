import { Dialog, Popover } from './popups'
import { SearchFormToggle } from './searchForm'
import { TournamentTableRenderer } from './tournamentTable'

//remove focus after click/press
document.addEventListener('mouseup', function (e: MouseEvent) {
  const btn = (e.target as HTMLElement).closest('button')
  btn?.blur()
})
document.querySelectorAll('button').forEach((btn) => {
  btn.addEventListener('keydown', () => {
    btn.blur()
  })
})

//init search form in header
new SearchFormToggle('.header__search-btn', '.header__search-form')

//init burger-menu popover
new Popover('#burgerMenu', '.close-burger-menu-btn').init()

//init user-menu dialog
new Dialog('#signInDialog', '.open-user-menu-btn', '.close-user-menu-btn').init()

//fetch tournament tables
const tablesTriggers = document.querySelector('.tournament__results-filters')
//first init tournament table
new TournamentTableRenderer(
  'https://63ee0ec0388920150dd83e3c.mockapi.io/teams',
  '.tournament__results-table',
  'total',
).init()
//change active tournament table
tablesTriggers?.addEventListener('click', (e) => {
  const target = e.target as HTMLElement
  if (target.tagName === 'BUTTON' && target.dataset.type) {
    tablesTriggers?.querySelectorAll('button').forEach((btn) => {
      btn.classList.remove('tournament__results-filter_active')
      btn.disabled = false
      btn.setAttribute('aria-selected', 'false')
      btn.setAttribute('aria-disabled', 'false')
    })

    target.classList.add('tournament__results-filter_active')
    ;(target as HTMLButtonElement).disabled = true
    ;(target as HTMLButtonElement).setAttribute('aria-selected', 'true')
    ;(target as HTMLButtonElement).setAttribute('aria-disabled', 'true')

    new TournamentTableRenderer(
      'https://63ee0ec0388920150dd83e3c.mockapi.io/teams',
      '.tournament__results-table',
      target.dataset.type,
    ).init()

    // eslint-disable-next-line no-console
    console.log(
      `It fake fetch for ${target.dataset.type}.\n\nBut data still fetched from https://63ee0ec0388920150dd83e3c.mockapi.io/teams`,
    )
  }
})
