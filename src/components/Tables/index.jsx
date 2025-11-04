import React from "react";

const Tables = ({ onRemove, onClick, data }) => {
  return (
    <table
      border="0"
      cellPadding="8"
      style={{ borderCollapse: "separate", borderSpacing: "10px" }}
    >
      <thead>
        <tr>
          {/* Generate table headings from keys of first object */}
          {data.length > 0 &&
            Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
        </tr>
      </thead>
      <tbody>
        {/* Generate table rows */}
        {data.length > 0 &&
          data.map((item, idx) => (
            <tr key={idx}>
              {Object.values(item).map((val, i) => (
                <td key={i}>{val}</td>
              ))}
            </tr>
          ))}
      </tbody>
      <td className="btns-2" style={{ padding: "20px 0px" }} colSpan={2}>
        <div className="btns-3">
          <button onClick={onRemove}>Remove</button>
          <button onClick={onClick}>Export</button>
        </div>
      </td>
    </table>
  );
};

export default Tables;
