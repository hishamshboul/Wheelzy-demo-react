import CarCaseRow from './CarCaseRow.jsx';

function CarCaseTable({ carCases }) {
  return (
      <div className="table-responsive">
        <p> Showing {carCases.length} car cases </p>
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Year</th>
            <th scope="col">Make</th>
            <th scope="col">Model</th>
            <th scope="col">Submodel</th>
            <th scope="col">ZIP Code</th>
            <th scope="col">Status</th>
            <th scope="col">Active</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>

        <tbody>
          {carCases.map((carCase) => (
            <CarCaseRow
              key={carCase.id}
              carCase={carCase}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CarCaseTable;