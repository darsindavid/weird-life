import type { CreatureRecord } from './simulation/CreatureRecord'

interface HistoricalCreaturePanelProps {
  record: CreatureRecord
  onClose: () => void
}

function HistoricalCreaturePanel({
  record,
  onClose,
}: HistoricalCreaturePanelProps) {
  const isAlive = record.deathTick === null

  const lifetime =
    record.deathTick === null
      ? null
      : record.deathTick - record.birthTick

  const traitBars = [
    {
      label: 'Movement speed',
      description: 'How quickly it can move',
      value: record.genome.speed,
      display: record.genome.speed.toFixed(2),
      percent: Math.min((record.genome.speed / 2) * 100, 100),
    },
    {
      label: 'Food detection',
      description: 'How far it can sense food',
      value: record.genome.vision,
      display: record.genome.vision.toFixed(0),
      percent: Math.min((record.genome.vision / 160) * 100, 100),
    },
    {
      label: 'Energy use',
      description: 'Energy spent each step',
      value: record.genome.metabolism,
      display: record.genome.metabolism.toFixed(3),
      percent: Math.min((record.genome.metabolism / 0.05) * 100, 100),
    },
    {
      label: 'Reproduction threshold',
      description: 'Energy needed to reproduce',
      value: record.genome.reproductionThreshold,
      display: record.genome.reproductionThreshold.toFixed(0),
      percent: Math.min(
        (record.genome.reproductionThreshold / 220) * 100,
        100,
      ),
    },
  ]

  return (
    <aside
      className="creature-panel historical-creature-panel"
      aria-label={`Historical record for creature ${record.id}`}
    >
      <div className="creature-panel-header">
        <div>
          <span className="eyebrow">
            {isAlive ? 'LIVING RECORD' : 'ARCHIVED RECORD'}
          </span>

          <h2>Blob #{record.id}</h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close creature inspector"
          className="inspector-close"
        >
          ×
        </button>
      </div>

      <div
        className={`creature-status ${
          isAlive ? 'alive' : 'dead'
        }`}
      >
        <span
          className="creature-status-dot"
          aria-hidden="true"
        />

        <span>{isAlive ? 'Alive' : 'Deceased'}</span>

        <span className="status-separator">•</span>

        <span>
          Generation {record.generation}
        </span>
      </div>

      <section className="inspector-section">
        <div className="inspector-section-heading">
          <div>
            <span className="section-kicker">LIFE HISTORY</span>
            <h3>Timeline</h3>
          </div>
        </div>

        <div className="inspector-grid">
          <div className="inspector-metric">
            <span>Born</span>
            <strong>
              Tick {record.birthTick.toLocaleString()}
            </strong>
          </div>

          {isAlive ? (
            <div className="inspector-metric">
              <span>Status</span>
              <strong>Still living</strong>
            </div>
          ) : (
            <>
              <div className="inspector-metric">
                <span>Died</span>
                <strong>
                  Tick {record.deathTick?.toLocaleString()}
                </strong>
              </div>

              <div className="inspector-metric">
                <span>Lifetime</span>
                <strong>
                  {lifetime?.toLocaleString()} ticks
                </strong>
              </div>
            </>
          )}

          <div className="inspector-metric">
            <span>Generation</span>
            <strong>{record.generation}</strong>
          </div>
        </div>
      </section>

      <section className="inspector-section">
        <div className="inspector-section-heading">
          <div>
            <span className="section-kicker">LINEAGE</span>
            <h3>Family record</h3>
          </div>
        </div>

        <div className="inspector-grid">
          <div className="inspector-metric">
            <span>Parent</span>
            <strong>
              {record.parentId === null
                ? 'Original population'
                : `#${record.parentId}`}
            </strong>
          </div>

          <div className="inspector-metric">
            <span>Offspring</span>
            <strong>{record.children}</strong>
          </div>
        </div>
      </section>

      <section className="inspector-section">
        <div className="inspector-section-heading">
          <div>
            <span className="section-kicker">
              SURVIVAL RECORD
            </span>
            <h3>Resource history</h3>
          </div>
        </div>

        <div className="inspector-feature">
          <div>
            <span>Food consumed</span>
            <small>
              Total food items eaten during its lifetime
            </small>
          </div>

          <strong>{record.foodEaten}</strong>
        </div>
      </section>

      <section className="inspector-section genome-section">
        <div className="inspector-section-heading">
          <div>
            <span className="section-kicker">
              INHERITED TRAITS
            </span>
            <h3>Genome</h3>
          </div>

          <span
            className="inspector-help"
            title="These traits were inherited from the creature's parent and may differ through mutation."
          >
            ?
          </span>
        </div>

        <div className="trait-list">
          {traitBars.map((trait) => (
            <div className="trait-meter" key={trait.label}>
              <div className="trait-meter-header">
                <div>
                  <strong>{trait.label}</strong>
                  <span>{trait.description}</span>
                </div>

                <b>{trait.display}</b>
              </div>

              <div
                className="trait-meter-track"
                aria-hidden="true"
              >
                <div
                  className="trait-meter-fill"
                  style={{
                    width: `${trait.percent}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="inspector-section about-section">
        <span className="section-kicker">
          ABOUT THIS CREATURE
        </span>

        <h3>What you're seeing</h3>

        <p>
          {isAlive
            ? 'This creature is part of the living population. Its inherited traits influence how it moves, finds food, spends energy, and reproduces.'
            : 'This creature is no longer alive. Its archived record preserves the traits and life history it left behind.'}
        </p>

        <p>
          Traits can change between generations through
          mutation. Creatures that survive and reproduce pass
          their traits to their offspring.
        </p>
      </section>
    </aside>
  )
}

export default HistoricalCreaturePanel