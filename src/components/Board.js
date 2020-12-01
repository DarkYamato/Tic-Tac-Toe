import { useState, useEffect } from "react";
import { Cell } from "./Cell";

import "./Board.css";

const combo = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const mark = {
  X: "X",
  O: "O",
};

export const Board = () => {
  const [cells, setCells] = useState(Array(9).fill(null));
  const [isXturn, setIsXTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const { X, O } = mark;

  useEffect(() => {
    if (!isXturn) {
      computerStep();
    }
  }, [isXturn]);

  useEffect(() => {
    getWinner();
  }, [cells]);

  const handleClick = (i) => {
    const newCells = cells.slice();

    if (!isXturn || cells[i] || winner) {
      return;
    }

    newCells[i] = isXturn ? X : O;
    setCells(newCells);
    setIsXTurn((prevIsXturn) => !prevIsXturn);
  };

  const computerStep = () => {
    const firstStep = !cells.some((x) => x === O);

    if (firstStep) {
      if (!cells[4]) {
        updateCellsByComputer(4);
      } else {
        updateCellsByComputer(0);
      }
    } else {
      const computerIdxs = cells
        .reduce((acc, x, i) => acc.concat(x === O && i), [])
        .filter((x) => x !== false);
      const userIdxs = cells
        .reduce((acc, x, i) => acc.concat(x === X && i), [])
        .filter((x) => x !== false);

      const computerWinIds = findIndexForCombo(computerIdxs, 1);
      const userWinIds = findIndexForCombo(userIdxs, 1);

      if (computerWinIds.length) {
        // Checking if we can finish the game in one move
        updateCellsByComputer(computerWinIds[0]);
      } else if (userWinIds.length) {
        // Checking if we can mess up the combo for the user
        updateCellsByComputer(userWinIds[0]);
      } else {
        const bestStep = findIndexForCombo(computerIdxs, 2);
        updateCellsByComputer(bestStep[0]);
      }
    }
  };

  const updateCellsByComputer = (idx) => {
    const newCells = cells.slice();
    newCells[idx] = O;
    setTimeout(() => {
      setCells(newCells);
      setIsXTurn((prevIsXturn) => !prevIsXturn);
    }, 400);
  };

  const findIndexForCombo = (arr, length) => {
    /**
     * @param arr is currently selected ids
     * @param length step for filtering array of combos
     * @returns an array of combos remaining for a successful combination
     */

    const availableIdxs = cells
      .reduce((acc, x, i) => acc.concat(x === null && i), [])
      .filter((x) => x !== false);

    // Remove matching elements from the array of combos, filter and flat
    const filteredMatchCombo = combo
      .map((x) => x.filter((x) => !arr.includes(x)))
      .filter((x) => x.length === length)
      .flat(2);

    const indexesForSelect = filteredMatchCombo.filter((x) =>
      availableIdxs.includes(x)
    );

    return indexesForSelect;
  };

  const handleClear = () => {
    setCells(Array(9).fill(null));
    setIsXTurn(true);
    setWinner(null);
  };

  const renderCell = (i) => (
    <Cell value={cells[i]} onClick={() => handleClick(i)} />
  );

  const getWinner = () => {
    combo.forEach((item, i) => {
      const [x, y, z] = combo[i];
      if (cells[x] !== null && cells[x] === cells[y] && cells[x] === cells[z]) {
        setWinner(cells[x]);
      }
      return null;
    });
  };

  const noWinner = !winner && !cells.includes(null);

  let status;

  if (winner) {
    status = `Winner is ${winner}`;
  } else if (noWinner) {
    status = "No winner";
  } else {
    status = isXturn ? "Current Player: X" : "Current Player: O";
  }

  return (
    <div className="container">
      <div>
        <div className="status">{status}</div>
        <table>
          <tbody>
            <tr>
              <td>{renderCell(0)}</td>
              <td>{renderCell(1)}</td>
              <td>{renderCell(2)}</td>
            </tr>
            <tr>
              <td>{renderCell(3)}</td>
              <td>{renderCell(4)}</td>
              <td>{renderCell(5)}</td>
            </tr>
            <tr>
              <td>{renderCell(6)}</td>
              <td>{renderCell(7)}</td>
              <td>{renderCell(8)}</td>
            </tr>
          </tbody>
        </table>
        <button className="clear" onClick={handleClear}>
          clear
        </button>
      </div>
    </div>
  );
};
