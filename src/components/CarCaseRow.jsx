import { Link } from 'react-router-dom';

function CarCaseRow({ carCase }) {
  return (
    <tr>
      <td>{carCase.id}</td>
      <td>{carCase.year}</td>
      <td>{carCase.make}</td>
      <td>{carCase.model}</td>
      <td>{carCase.subModel}</td>
      <td>{carCase.zipCode}</td>
      <td>{carCase.currentStatus ?? 'No status'}</td>
      <td>{carCase.isActive ? 'Yes' : 'No'}</td>
      <td>
  <Link
    to={`/car-cases/${carCase.id}`}
    className="btn btn-sm btn-outline-primary"
  >
    View Details
  </Link>
</td>
    </tr>
  );
}

export default CarCaseRow;