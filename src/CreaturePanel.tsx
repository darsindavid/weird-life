import type { BlobSnapshot } from './simulation/SimulationSnapshot'

interface CreaturePanelProps {
  blob: BlobSnapshot | null
  onClose: () => void
}

function CreaturePanel({
  blob,
  onClose,
}: CreaturePanelProps) {
  if (!blob) {
    return null
  }

  const speedLevel = Math.min(
    100,
    (blob.genome.speed / 2.5) * 100,
  )

  const visionLevel = Math.min(
    100,
    (blob.genome.vision / 200) * 100,
  )

  const metabolismLevel = Math.min(
    100,
    (blob.genome.metabolism / 0.06) * 100,
  )

  const reproductionLevel = Math.min(
    100,
    (blob.genome.reproductionThreshold / 250) * 100,
  )

  return (
    <aside
      className="creature-panel"
      aria-label={`Creature ${blob.id} inspector`}
    >
      <div className="creature-panel-header">
        <div>
          <span className="eyebrow">
            CREATURE INSPECTOR
          </span>

          <div className="creature-title-row">
            <h2>Blob #{blob.id}</h2>

            <span className="creature-status">
              <span className="status-dot" />
              Alive
            </span>
          </div>

          <p className="creature-subtitle">
            Generation {blob.generation} ·
            {blob.parentId === null
              ? ' original population'
              : ` offspring of #${blob.parentId}`}
          </p>
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

      <section className="inspector-section">
        <div className="inspector-section-heading">
          <div>
            <span className="section-kicker">
              CURRENT STATE
            </span>
            <h3>Life</h3>
          </div>
        </div>

        <div className="inspector-stats-grid">
          <div
            className="inspector-stat-card"
            title="How many simulation steps this creature has been alive."
          >
            <span>Age</span>
            <strong>
              {blob.age.toLocaleString()}
            </strong>
            <small>simulation steps</small>
          </div>

          <div
            className="inspector-stat-card"
            title="Current stored energy. A creature dies when its energy reaches zero."
          >
            <span>Energy</span>
            <strong>{blob.energy.toFixed(1)}</strong>
            <small>stored energy</small>
          </div>

          <div
            className="inspector-stat-card"
            title="Total amount of food this creature has consumed."
          >
            <span>Food eaten</span>
            <strong>{blob.foodEaten}</strong>
            <small>food items</small>
          </div>

          <div
            className="inspector-stat-card"
            title="Number of offspring this creature has produced."
          >
            <span>Children</span>
            <strong>{blob.children}</strong>
            <small>offspring</small>
          </div>
        </div>

        <div className="lineage-summary">
          <span>Parent</span>

          <strong>
            {blob.parentId === null
              ? 'Original population'
              : `Blob #${blob.parentId}`}
          </strong>
        </div>
      </section>

      <section className="inspector-section">
        <div className="inspector-section-heading">
          <div>
            <span className="section-kicker">
              INHERITED TRAITS
            </span>
            <h3>Genome</h3>
          </div>

          <span
            className="info-badge"
            title="These traits are inherited from the creature's parent and can change through mutation."
          >
            ?
          </span>
        </div>

        <div className="trait-list">
          <div
            className="trait-meter"
            title="How quickly the creature can move."
          >
            <div className="trait-meter-header">
              <div>
                <strong>Movement speed</strong>
                <span>
                  How quickly it can move
                </span>
              </div>

              <b>{blob.genome.speed.toFixed(2)}</b>
            </div>

            <div className="trait-track">
              <div
                className="trait-fill"
                style={{ width: `${speedLevel}%` }}
              />
            </div>
          </div>

          <div
            className="trait-meter"
            title="How far the creature can detect nearby food."
          >
            <div className="trait-meter-header">
              <div>
                <strong>Food detection</strong>
                <span>
                  How far it can sense food
                </span>
              </div>

              <b>
                {blob.genome.vision.toFixed(0)}
              </b>
            </div>

            <div className="trait-track">
              <div
                className="trait-fill"
                style={{ width: `${visionLevel}%` }}
              />
            </div>
          </div>

          <div
            className="trait-meter"
            title="Baseline energy consumed every simulation step."
          >
            <div className="trait-meter-header">
              <div>
                <strong>Energy use</strong>
                <span>
                  Energy spent each step
                </span>
              </div>

              <b>
                {blob.genome.metabolism.toFixed(3)}
              </b>
            </div>

            <div className="trait-track">
              <div
                className="trait-fill"
                style={{ width: `${metabolismLevel}%` }}
              />
            </div>
          </div>

          <div
            className="trait-meter"
            title="Amount of energy required before this creature can reproduce."
          >
            <div className="trait-meter-header">
              <div>
                <strong>Reproduction threshold</strong>
                <span>
                  Energy needed to reproduce
                </span>
              </div>

              <b>
                {blob.genome.reproductionThreshold.toFixed(
                  0,
                )}
              </b>
            </div>

            <div className="trait-track">
              <div
                className="trait-fill"
                style={{ width: `${reproductionLevel}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="inspector-section inspector-explainer">
        <div className="inspector-section-heading">
          <div>
            <span className="section-kicker">
              ABOUT THIS CREATURE
            </span>
            <h3>What you're seeing</h3>
          </div>
        </div>

        <p>
          This creature is part of the living population.
          Its inherited traits influence how it moves,
          finds food, spends energy, and reproduces.
        </p>

        <p>
          Traits can change between generations through
          mutation. Creatures that survive and reproduce
          pass their traits to their offspring.
        </p>
      </section>
    </aside>
  )
}

export default CreaturePanel