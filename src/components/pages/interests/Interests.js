import Icon from '../../components/Icon'
import interests from '../../../data/interests'

function InterestCard({ item }) {
  return (
    <article className="interest">
      <div className="interest__media">
        <img src={item.img} alt={item.name} loading="lazy" />
      </div>
      <div className="interest__body">
        <h3 className="interest__title">{item.name}</h3>
        <p className="interest__desc">{item.description}</p>
        <a
          className="interest__link"
          href={item.link}
          target="_blank"
          rel="noreferrer"
        >
          {item.linkText} <Icon name="arrow" size={14} />
        </a>
      </div>
    </article>
  )
}

function Interests() {
  return (
    <section className="page">
      <header className="page__head">
        <h1 className="page__title">Interests</h1>
        <p className="page__lede">Outside of coding — the things that recharge me and shape how I think about craft.</p>
      </header>
      <div className="interests">
        {interests.map(item => <InterestCard key={item.id} item={item} />)}
      </div>
    </section>
  )
}

export default Interests
