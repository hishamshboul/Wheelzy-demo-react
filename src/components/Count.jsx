function Count({ count }) {
  if (!count) {
    return   <div className="alert alert-success" role="alert">
      {count}
    </div>;
  }

  return (
    <div className="alert alert-success" role="alert">
      {count}
    </div>
  );
}

export default Count;