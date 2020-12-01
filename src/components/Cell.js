import "./Cell.css";

export const Cell = ({ onClick, value }) => {
  return (
    <div className="cell" onClick={onClick}>
      {value}
    </div>
  );
};
