"use client"
import { useState, useRef, useEffect } from 'react';
import Image from "next/image";

// import { parse } from "@xwordly/xword-parser";
// import { readFileSync } from "fs";
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { setDefaultAutoSelectFamily } from 'net';
import { setHeapSnapshotNearHeapLimit } from 'v8';
import { CellType } from '@xwordly/xword-parser';
import { IncomingMessage } from 'http';
import puzzle from './testPuz.json'
import { TestCache } from '@mui/x-data-grid/internals';
import next from 'next';
import { Preahvihear } from 'next/font/google';
// const fileContent = readFileSync('USA Today - 20260109 - One of Two Ways.puz'); 
// const puzzle = parse(fileContent); 
const cells = puzzle.cells

const cluesAcross = puzzle.clues.across

const cluesDown = puzzle.clues.down

// console.log(puzzle.clues); 

// const columnsAcross: GridColDef[] = [
//   { field: 'number', headerName: ' ', width: 50 },
//   { field: 'text', headerName: 'Across', width: 300 },
// ];
// const columnsDown: GridColDef[] = [
//   { field: 'number', headerName: ' ', width: 50 },
//   { field: 'text', headerName: 'Down', width: 300 },
// ];



export default function Home() {

  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const acrossClueRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const downClueRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});



  const [activeCell, setActiveCell] = useState<typeof cells[0] | null>(null);
  const [activeOrientation, setActiveOrientation] = useState<"across" | "down">("across") 
  const [cellValues, setCellValues] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!activeCell) return;

    if (activeCell.acrossClueNum != null) {
      acrossClueRefs.current[activeCell.acrossClueNum]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
    if (activeCell.downClueNum != null) {
      downClueRefs.current[activeCell.downClueNum]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeCell, activeOrientation]);


  const clueStartMap = new Map<string, number>();
  [...puzzle.clues.across, ...puzzle.clues.down].forEach(clue => {
    const key = `${clue.startRow}-${clue.startCol}`;
    if (!clueStartMap.has(key)) clueStartMap.set(key, clue.number);
  });

  
  const divs = cells.map(cell => {

  const cornerNum = clueStartMap.get(`${cell.row}-${cell.col}`);

  // const activeCell = cells.find(c => c.id === activeCellId);

  const highlightedIds = new Set(
    activeCell
      ? cells
          .filter(c =>
            activeOrientation === "across"
              ? c.row === activeCell.row && !c.isBlack && c.acrossClueNum == activeCell.acrossClueNum
              : c.col === activeCell.col && !c.isBlack && c.downClueNum == activeCell.downClueNum
          )
          .map(c => c.id)
      : []
  );


    // <div style={{display: "flex", flexDirection: "row", backgroundColor: "#141313"}}
    //       key={row.id}
    // >
    return(
      <div style={{border: "1px solid #777", width: "50px", "height": "50px"}} key={cell.id}>
        <div
            onClick={() => {
              //TODO: Should not be able to click on black cells! 
              //TODO: Click on a clue in the list, sets proper cell and clue as Active. 
              console.log(highlightedIds)
              if(!cell.isBlack) {
                setActiveCell(cell);
                inputRefs.current[cell.id]?.focus();
              }
            }}
            // onClick={() => {
            //  if(!cell.isBlack) setActiveCellId(cell.id); 
            // }}



            style={{
              backgroundColor: cell.isBlack 
                ? "black" 
                : activeCell === cell
                ? "#f9dc4a" 
                : highlightedIds.has(cell.id)
                ? "#a7d8f0"
                : "white", 
              margin: "0px", 
              width: "50px", 
              height: "50px",
              outline: "none",
              borderRight: "1px solid #777", borderBottom: "1px solid #777",
            }}
            key={cell.id} tabIndex={-1} 
        >
          <div style={{paddingTop: "1px", paddingLeft: "3px", fontSize: "13px", paddingBottom: "-10px", marginBottom: "-4px"}}>
          {cornerNum ? cornerNum : ""} &nbsp;

          
          </div>

          <input 

              ref={(el) => {
                inputRefs.current[cell.id] = el;
              }}              
              maxLength={1}
              onFocus={(e) => {
                // e.target.select();
                setActiveCell(cell);
              }}
              type='text'
              onKeyDown={(e) => {handleKey(e, cell)}}
              onChange={() => {}}
              value={cellValues[cell.id] || ""}

              // contentEditable={!cell.isBlack ? true : false} 
              
              style={{
                // backgroundColor: activeCellId === cell.id ? "#f9dc4a" : "transparent",
                width:"48px", 
                height: "33px", 
                marginLeft: "1px",
                textAlign: "center",
                fontSize: "29px", 
                lineHeight: 1, 
                paddingTop: "2px", 
                caretColor: "transparent", 
                outline: "none",
                textTransform: "uppercase",
                
              }}
          />

          
          
        </div>
      </div>
      
    // )}

    // </div>
    );
  });

  //TODO: Stylize clue lists properly! 
  const divsAcross = cluesAcross.map(clue => (
    <div 
      key={clue.number}
      ref={el => { acrossClueRefs.current[clue.number] = el; }}
      style={{
        padding: "5px",
        backgroundColor: activeOrientation === "across" && clue.number == activeCell?.acrossClueNum
          ? "#a7d8f0"
          : "transparent"
      }}
      
    >
      <div style={{
        display: "inline", 
        padding: "7px",
        backgroundColor: activeOrientation === "down" && clue.number == activeCell?.acrossClueNum
          ? "#a7d8f0" 
          : "transparent"
        }}
      >
        {clue.number}
      </div>
      <div style={{display: "inline"}}>
        {clue.clue}
      </div>
    </div>
  ))

  const divsDown = cluesDown.map(clue => (
    <div 
      key={clue.number} 
      ref={el => { downClueRefs.current[clue.number] = el; }}
      style={{
        padding: "5px",
        backgroundColor: activeOrientation === "down" && clue.number == activeCell?.downClueNum
          ? "#a7d8f0"
          : "transparent"
      }}
    >
      <div style={{
        display: "inline", 
        padding: "7px",
        backgroundColor: activeOrientation === "across" && clue.number == activeCell?.downClueNum
          ? "#a7d8f0" 
          : "transparent"
        }}
      >
        {clue.number}
      </div>
      <div style={{display: "inline"}}>
        {clue.clue}
      </div>
    </div>
  ))


  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>, cell: any) => {
    
    if(e.metaKey || e.ctrlKey) return;
    console.log(e.key)
    if (e.key === " ") {
      e.preventDefault(); // stops the page from scrolling
      setActiveOrientation(prev => prev === "across" ? "down" : "across");
    }
    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
      e.preventDefault();
      const value = e.key.toUpperCase();
      setCellValues(prev => ({ ...prev, [cell.id]: value }));
      if(activeOrientation === "across") {
        moveCell(cell, "right");
      } else {
        moveCell(cell, "down");
      }
    }
    if(e.key == "Backspace") {
      e.preventDefault()

      console.log(cell.id)
      console.log(cellValues[cell.id])

      if(cellValues[cell.id] != "") {
          setCellValues(prev => ({...prev, [cell.id]: ""}))
      } else if(activeOrientation === "across") {
        const prevCell = cells.find(
          c => c.col === cell.col - 1 && c.row === cell.row && !c.isBlack
        );

        if(prevCell) {
          setCellValues(prev => ({...prev, [prevCell.id]: ""}))
          moveCell(cell, "left");
        }

      } else if (activeOrientation === "down") {
        const prevCell = cells.find(
          c => c.row === cell.row - 1 && c.col === cell.col && !c.isBlack
        );

        if(prevCell) {
          setCellValues(prev => ({...prev, [prevCell.id]: ""}))
          moveCell(cell, "up");
        }
      }
    }
    if(e.key == "ArrowRight") {
      setActiveOrientation("across");
      moveCell(cell, "arrowright")
    }
    if(e.key == "ArrowLeft") {
      setActiveOrientation("across")
      moveCell(cell, "arrowleft")
    }
    if(e.key == "ArrowUp") {
      setActiveOrientation("down")
      moveCell(cell, "arrowup")
    }
    if(e.key == "ArrowDown") {
      setActiveOrientation("down")
      moveCell(cell, "arrowdown")
    }
  }

  const moveCell = (currentCell: any, dir: string) => {
    let nextCell = currentCell;

    switch (dir) {
      case "right":
        nextCell = cells.find(
          c => c.col == currentCell.col + 1 && !c.isBlack && c.row == currentCell.row
        );
        break;
      case "left":
        nextCell = cells.find(
          c => c.col == currentCell.col - 1 && !c.isBlack && c.row == currentCell.row && currentCell.col - 1 >= 0 
        );
        break;
      case "down":
        nextCell = cells.find(
          c => c.col == currentCell.col && c.row == currentCell.row + 1 && !c.isBlack
        );
        break;
      case "up":
        nextCell = cells.find(
          c => c.col == currentCell.col && c.row == currentCell.row - 1 && !c.isBlack
        );
        console.log("NEXT CELL" + nextCell)
        break;
      case "arrowleft": 
        nextCell = cells.find(
          c => c.col == currentCell.col - 1 && c.row == currentCell.row
        );

        while(nextCell?.isBlack && currentCell.col >= 0) {
          nextCell = cells.find(
            c => c.col == nextCell.col - 1 && c.row == currentCell.row
          );
        }
        break;
      case "arrowright":
        nextCell = cells.find(
          c => c.col == currentCell.col + 1 && c.row == currentCell.row
        );

        while(nextCell?.isBlack && currentCell.col < puzzle.meta.width) {
          nextCell = cells.find(
            c => c.col == nextCell.col + 1 && c.row == currentCell.row
          );
        }
        break;
      case "arrowup":
        nextCell = cells.find(
          c => c.col == currentCell.col && c.row == currentCell.row - 1
        );

        while(nextCell?.isBlack && currentCell.row >= 0)
          nextCell = cells.find(
            c => c.col == currentCell.col && c.row == nextCell.row - 1
          )
        break;
      case "arrowdown": 
        nextCell = cells.find(
          c => c.col == currentCell.col && c.row == currentCell.row + 1
        );

        while(nextCell?.isBlack && currentCell.row < puzzle.meta.height) {
          nextCell = cells.find(
            c => c.col == currentCell.col && c.row == nextCell.row + 1
          );
        }
        break;
      default:
        break;
    }




    if(nextCell) {
      inputRefs.current[nextCell.id]?.focus();
      setActiveCell(nextCell)
    }
  };



  return (
    
    <div>
      <main>

        <div style={{display: "flex"}}>
          
          <div style={{margin: "40px 50px 0px 40px", width: "fit-content"}}>
            <div style={{
              display: "grid", 
              gridTemplateColumns: `repeat(${puzzle.meta.width}, 50px)`, 
              border: "4px solid black",
              borderLeft: "3px solid black",  // also covers the missing left cell border
              borderTop: "3px solid black",   // also covers the missing top cell border

              // borderRight: "5px solid black"
              // margin: "40px 50px 0px 40px"
              }} 
              id="divs">

              {divs}
            </div>
          </div>

          <div>
            <h3 style={{textAlign: "left", paddingLeft: "14px"}}><b>ACROSS</b></h3>
            <hr style={{color: "lightgray"}}></hr>
            <ol style={{overflowY: "scroll", height: "700px", overflowX: "scroll", width: "300px"}}>
              <li>{divsAcross}</li>
            </ol>
          </div>
          <div style={{marginLeft: "30px"}}>
            <h3 style={{textAlign: "left", paddingLeft: "14px"}}><b>DOWN</b></h3>
            <hr style={{color: "lightgrey"}}></hr>
            <ol style={{overflowY: "scroll", height: "700px", width: "300px"}}>
              <li>{divsDown}</li>
            </ol>
          </div> 

        </div>




    
      </main>
    </div>
  );
}
