import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const learningHighlights = [
  { title: 'React architecture', description: 'Reusable components, props, hooks, and routing.' },
  { title: 'Forms & state', description: 'Controlled inputs, dependent selects, and validation.' },
  { title: 'API integration', description: 'Axios requests, loading states, and error handling.' },
  { title: 'Data & queries', description: 'Relational data, status history, and LINQ filtering.' },
];

const workflow = [
  { title: 'Record the car', description: 'Vehicle details & location' },
  { title: 'Choose a quote', description: 'Compare offers from buyers' },
  { title: 'Track pickup', description: 'Follow a dated status history' },
];

function HomePage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Home | WheelzyDemo';
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <div className="wheelzy-home">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-intro">
          <p className="home-eyebrow"><span aria-hidden="true" />Full-stack portfolio project</p>
          <h1 id="home-title">From car details<br />to <span>pickup.</span></h1>
          <p className="home-description">
            WheelzyDemo brings vehicle cases, buyer quotes, and status tracking
            into one car selling workflow.
          </p>
          <div className="home-actions">
            <Link to="/car-cases" className="home-link home-link-primary">
              Explore car cases
              <svg className="home-arrow" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 16 16 4M5 4h11v11" />
              </svg>
            </Link>
            <Link to="/car-cases/create" className="home-link home-link-secondary">
              Create a case <span aria-hidden="true">+</span>
            </Link>
          </div>
          <ul className="home-stack" aria-label="Technology stack">
            {['React', 'ASP.NET Core', 'EF Core', 'SQL Server'].map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        </div>

        <div className="home-workflow">
          <div className="home-workflow-top">
            <p className="home-eyebrow">The case journey</p>
            <svg className="home-car-icon" viewBox="0 0 40 28" fill="none" aria-hidden="true">
              <path d="m9 11 4-7h14l4 7M5 12l4-1h22l4 1v10H5V12Z" />
              <path d="M11 22v3M29 22v3M9 16h5M26 16h5M17 17h6" />
            </svg>
          </div>
          <h2>One case.<br /><span>Every step connected.</span></h2>
          <ol className="home-steps">
            {workflow.map((step, index) => (
              <li key={step.title}>
                <span className="home-step-number" aria-hidden="true">0{index + 1}</span>
                <div><h3>{step.title}</h3><p>{step.description}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-learning" aria-labelledby="learning-title">
        <div className="home-learning-heading">
          <h2 id="learning-title">What I learned</h2>
          <p>From the interface to the database.</p>
        </div>
        <ul className="home-concepts">
          {learningHighlights.map((concept, index) => (
            <li key={concept.title}>
              <span className="home-concept-number" aria-hidden="true">0{index + 1}</span>
              <h3>{concept.title}</h3>
              <p>{concept.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default HomePage;
