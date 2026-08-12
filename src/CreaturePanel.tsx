import type { Blob } from './simulation/Blob'

interface CreaturePanelProps {
  blob: Blob | null
  onClose: () => void
}

function CreaturePanel({
  blob,
  onClose,
}: CreaturePanelProps) {
  if (!blob) {
    return null
  }

  return (
    <aside className="creature-panel">
      <div className="creature-panel-header">
        <div>
          <span className="eyebrow">
            CREATURE
          </span>

          <h2>
            Blob #{blob.id}
          </h2>
        </div>

        <button onClick={onClose}>
          ×
        </button>
      </div>

      <section>
        <h3>Life</h3>

        <div className="creature-stat">
          <span>Generation</span>
          <strong>
            {blob.generation}
          </strong>
        </div>

        <div className="creature-stat">
          <span>Age</span>
          <strong>
            {blob.age} ticks
          </strong>
        </div>

        <div className="creature-stat">
          <span>Parent</span>
          <strong>
            {blob.parentId === null
              ? 'Original'
              : `#${blob.parentId}`}
          </strong>
        </div>

        <div className="creature-stat">
          <span>Children</span>
          <strong>
            {blob.children}
          </strong>
        </div>

        <div className="creature-stat">
          <span>Food eaten</span>
          <strong>
            {blob.foodEaten}
          </strong>
        </div>

        <div className="creature-stat">
          <span>Energy</span>
          <strong>
            {blob.energy.toFixed(1)}
          </strong>
        </div>
      </section>

      <section>
        <h3>Genome</h3>

        <div className="creature-stat">
          <span>Speed</span>
          <strong>
            {blob.genome.speed.toFixed(2)}
          </strong>
        </div>

        <div className="creature-stat">
          <span>Vision</span>
          <strong>
            {blob.genome.vision.toFixed(0)}
          </strong>
        </div>

        <div className="creature-stat">
          <span>Metabolism</span>
          <strong>
            {blob.genome.metabolism.toFixed(3)}
          </strong>
        </div>

        <div className="creature-stat">
          <span>Reproduction</span>
          <strong>
            {blob.genome.reproductionThreshold.toFixed(
              0,
            )}
          </strong>
        </div>
      </section>
    </aside>
  )
}

export default CreaturePanel