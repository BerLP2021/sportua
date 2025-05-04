import spinner from '../assets/icons/spinner.svg?raw'
export class TournamentTableRenderer {
  private apiUrl: string
  private query: string
  private container: HTMLElement

  constructor(apiUrl: string, containerSelector: string, query: string) {
    this.apiUrl = apiUrl
    this.query = query
    const container = document.querySelector(containerSelector)
    if (!container) {
      throw new Error(`Контейнер "${containerSelector}" не найден`)
    }
    this.container = container as HTMLElement
  }

  public async init(): Promise<void> {
    const isTablesRendered =
      Array.from(this.container.querySelectorAll('table')).findIndex(
        (table) => table.dataset.tableType === this.query,
      ) !== -1
    this.hideActiveTable()
    if (!isTablesRendered) this.showLoader()
    try {
      if (!isTablesRendered) {
        const data = await this.fetchData()
        const grouped = this.groupBy(data, 'group')
        this.renderTables(grouped)
      } else {
        this.showActiveTable()
      }
    } catch (error) {
      this.showError(error as Error)
    } finally {
      this.hideLoader()
    }
  }

  private async fetchData(): Promise<Team[]> {
    if (!this.query) return new Promise((resolve) => resolve([]))
    const res = await fetch(this.apiUrl)
    if (!res.ok) {
      throw new Error(`Ошибка при загрузке данных: ${res.status}`)
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
    return await res.json()
  }

  private groupBy(arr: Team[], key: keyof Team): Record<string, Team[]> {
    return arr.reduce((acc: Record<string, Team[]>, item) => {
      const group = String(item[key])
      if (!acc[group]) {
        acc[group] = []
      }
      acc[group].push(item)
      return acc
    }, {})
  }

  private renderTables(groups: Record<string, Team[]>) {
    Object.entries(groups).forEach(([groupName, teams]) => {
      const table = document.createElement('table')
      table.dataset.tableType = this.query
      table.innerHTML = this.getTableHead(groupName) + this.getTableBody(teams)
      this.container.appendChild(table)
    })
  }

  private showActiveTable() {
    this.container.querySelectorAll('table').forEach((table) => {
      if (table.dataset.tableType !== this.query) {
        if (table.style.display !== 'none') table.style.display = 'none'
      } else {
        table.style.display = ''
      }
    })
  }

  private hideActiveTable() {
    this.container.querySelectorAll('table').forEach((table) => {
      table.style.display = 'none'
    })
  }

  private getTableHead(groupName: string): string {
    return `
      <thead>
        <tr class="tournament__results-table-row tournament__results-table-row_head">
          <th class="tournament__row-group">Группа ${groupName.toUpperCase()}</th>
          <th class="tournament__row-games"><span class="mobile">И</span><span class="desktop">Игры</span></th>
          <th class="tournament__row-wins">В</th>
          <th class="tournament__row-draws">Н</th>
          <th class="tournament__row-losses">П</th>
          <th class="tournament__row-scored-conceded">З - П</th>
          <th class="tournament__row-last-matches">Форма</th>
          <th class="tournament__row-points"><span class="mobile">О</span><span class="desktop">Очки</span></th>
        </tr>
      </thead>
    `
  }

  //fake data
  private getQualificationLabel(position: number): Array<string> {
    switch (position) {
      case 0:
        return ['tournament__row-position_blue', 'Чемпионы Лига чемпионов УЕФА']
      case 1:
        return ['tournament__row-position_light-blue', 'Лига чемпионов УЕФА']
      case 2:
        return ['tournament__row-position_yellow', 'Лига Европы УЕФА']
      case 3:
        return ['tournament__row-position_orange', 'Понижение']
      default:
        return ['tournament__row-position_orange', 'Понижение']
    }
  }
  private getTableBody(teams: Team[]): string {
    const sorted = [...teams].sort((a, b) => b.points - a.points)
    return `
      <tbody>
        ${sorted
          .map(
            (team, i) => `
            <tr class="tournament__results-table-row tournament__results-table-row_body">
              <td class="tournament__row-position ${this.getQualificationLabel(i)[0]}">${i + 1} <span class="tournament__row-tooltip">${this.getQualificationLabel(i)[1]}</span></td>
              <td class="tournament__row-club-logo"><img src="${team.logo}" onerror="this.onerror=null; this.src='src/assets/icons/stub-fc.png';"/></td>
              <td class="tournament__row-club-name"><a href="#">${team.name} ________${this.query}</a></td>
              <td class="tournament__row-games">${team.games}</td>
              <td class="tournament__row-wins">${team.wins}</td>
              <td class="tournament__row-draws">${team.draws}</td>
              <td class="tournament__row-losses">${team.loses}</td>
              <td class="tournament__row-scored-conceded">${team.scored} - ${team.conceded}</td>
              <td class="tournament__row-last-matches">${this.renderLastMatches(team.form)}</td>
              <td class="tournament__row-points">${team.points}</td>
            </tr>
          `,
          )
          .join('')}
      </tbody>
    `
  }

  private renderLastMatches(form: TeamForm[]): string {
    return `
      <div class="tournament__last-matches-wrapper">
        ${form
          .map((result) => {
            let className = ''
            let icon = ''

            switch (result) {
              case 'W':
                className = 'tournament__last-match_win'
                icon = 'win'
                break
              case 'D':
                className = 'tournament__last-match_draw'
                icon = 'draw'
                break
              case 'L':
                className = 'tournament__last-match_loss'
                icon = 'loss'
                break
            }

            return `
              <span class="tournament__last-match ${className}">
                <svg width="18" height="18">
                  <use href="src/assets/icons/sprite.svg#${icon}"></use>
                </svg>
              </span>
            `
          })
          .join('')}
      </div>
    `
  }

  private showLoader() {
    this.container.insertAdjacentHTML('afterbegin', `<div class="spinner">${spinner}</div>`)
  }

  private hideLoader() {
    const loader = this.container.querySelector('.spinner')
    if (loader) loader.remove()
  }

  private showError(error: Error) {
    this.container.innerHTML = `<div class="error">Ошибка: ${error.message}</div>`
  }
}
