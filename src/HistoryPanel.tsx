import type { CreatureRecord } from './simulation/CreatureRecord'

interface HistoryPanelProps {
  records: CreatureRecord[]
  selectedId: number | null
  onSelect: (id: number) => void
}

function HistoryPanel({
  records,
  selectedId,
  onSelect,
}: HistoryPanelProps) {
  const sortedRecords = [...records].sort(
    (a, b) => b.id - a.id,
  )

  return (
    <section className="history-panel">
      <div className="history-header">
        <div>
          <span className="section-eyebrow">
            EVOLUTION LOG
          </span>

          <h2>Creature history</h2>
        </div>

        <span className="history-count">
          {records.length} recorded
        </span>
      </div>

      <p className="history-description">
        Every creature that has existed in this world,
        including those that have already died.
      </p>

      <div className="history-list">
        {sortedRecords.map((record) => {
          const alive = record.deathTick === null
          const selected = record.id === selectedId

          return (
           <button
  type="button"
  key={record.id}
  className={`history-row ${
    selected ? 'selected' : ''
  } ${alive ? '' : 'dead-row'}`}
  onClick={() => onSelect(record.id)}
  title={
    alive
      ? `Inspect creature #${record.id}`
      : `Creature #${record.id} is archived; historical inspection is coming next`
  }
>
              <span className="history-id">
                #{record.id}
              </span>

              <span className="history-generation">
                Gen {record.generation}
              </span>

              <span
                className={`history-status ${
                  alive ? 'alive' : 'dead'
                }`}
              >
                <span className="status-dot" />
                {alive ? 'Alive' : 'Dead'}
              </span>

              <span className="history-age">
                {alive
                  ? 'Living'
                  : `Died at ${record.deathTick}`}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default HistoryPanel