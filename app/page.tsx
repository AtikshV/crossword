"use client"
import { useState, useRef, useEffect, act, useActionState } from 'react';
import puzzle from './test2.json'


const cells = puzzle.cells
const cluesAcross = puzzle.clues.across
const cluesDown = puzzle.clues.down



export default function Home() {

  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const acrossClueRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const downClueRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const lastClickedCellId = useRef<string | null>(null)



  const [activeCell, setActiveCell] = useState<typeof cells[0] | null>(null);
  const [activeOrientation, setActiveOrientation] = useState<"across" | "down">("across") 

  const [cellValues, setCellValues] = useState<{ [key: string]: string }>( () => {
    if (typeof window === "undefined") return {}

    try { 
      const saved = localStorage.getItem("cellVals");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {}   
    }
  });
  //Scroll clues on sidebar whenever activeCell / Orientation changes
  useEffect(() => {
    if (!activeCell) return;

    if (activeCell.acrossClueNum != null) {
      acrossClueRefs.current[activeCell.acrossClueNum]?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
    if (activeCell.downClueNum != null) {
      downClueRefs.current[activeCell.downClueNum]?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, [activeCell, activeOrientation]);

  //Focus first cell on reload
  useEffect( () => {
  
    const firstCell = getFirstUnfilledCell(cluesAcross, filledAcrossClues, "across")

    if(!firstCell) getFirstCell(cluesAcross,"across" )
  }, [])

  //set cellValues localStorage
  useEffect( () => {
    localStorage.setItem("cellVals", JSON.stringify(cellValues))
  }, [cellValues])

  const clueStartMap = new Map<string, number>();
  [...puzzle.clues.across, ...puzzle.clues.down].forEach(clue => {
    const key = `${clue.startRow}-${clue.startCol}`;
    if (!clueStartMap.has(key)) clueStartMap.set(key, clue.number);
  });

  const filledAcrossClues = new Set(
    cluesAcross
      .filter(
        clue => cells
        .filter(c => c.acrossClueNum === clue.number)
        .every(c => !!cellValues[c.id])
      )
      .map(clue => clue.number)
  )

  const filledDownClues = new Set(
    cluesDown
      .filter(
        clue => cells
        .filter(c => c.downClueNum === clue.number)
        .every(c => !!cellValues[c.id])
      )
      .map(clue => clue.number)
  )

const getFirstUnfilledCell = (
  clueSet: typeof cluesAcross, 
  filledSet: typeof filledAcrossClues, 
  dir: typeof activeOrientation,
  fromEdge = false,
  backward = false
) => {
  const currentClueNum = fromEdge 
    ? (backward ? Infinity : 0) 
    : (dir == "across" ? activeCell?.acrossClueNum : activeCell?.downClueNum) ?? 0;
  const clueNumKey = dir == "across" ? "acrossClueNum" : "downClueNum";

  const ordered = backward ? [...clueSet].reverse() : clueSet;

  const match = backward
    ? (n: number) => n < currentClueNum
    : (n: number) => n > currentClueNum;

  const nextClue = ordered.find(
    cl => !filledSet.has(cl.number) && match(cl.number)
  );

  if (nextClue) {
    const nextCell = cells.find(
      c => c[clueNumKey] === nextClue.number && !c.isBlack && !cellValues[c.id]
    );

    if (nextCell) {
      setActiveCell(nextCell);
      setActiveOrientation(dir);
      inputRefs.current[nextCell.id]?.focus();
      return true;
    }
  }
  return false;
};  

const getFirstCell = (
  clueSet: typeof cluesAcross, 
  dir: typeof activeOrientation,
  fromEdge = false,
  backward = false
) => {
  const currentClueNum = fromEdge
    ? (backward ? Infinity : 0)
    : (dir == "across" ? activeCell?.acrossClueNum : activeCell?.downClueNum) ?? 0;
  const clueNumKey = dir == "across" ? "acrossClueNum" : "downClueNum";

  const ordered = backward ? [...clueSet].reverse() : clueSet;
  const match = backward
    ? (n: number) => n < currentClueNum
    : (n: number) => n > currentClueNum;


  const nextClue = ordered.find(cl => match(cl.number));

  if (nextClue) {
    const nextCell = cells.find(
      c => c[clueNumKey] === nextClue.number && !c.isBlack
    );
    if (nextCell) {
      setActiveCell(nextCell);
      setActiveOrientation(dir);
      inputRefs.current[nextCell.id]?.focus();
      return true;
    }
  }
  return false;
};  
  
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
                if (!cell.isBlack) {
                  if (cell.id === lastClickedCellId.current) {
                    setActiveOrientation(prev => prev === "across" ? "down" : "across");
                  }
                  lastClickedCellId.current = cell.id;
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
            { !cell.isBlack && ( 
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
            )}

            
            
          </div>
        </div>
        
      // )}

      // </div>
      );
  });

  //TODO: Stylize clue lists properly! 
  const divsAcross = cluesAcross.map(clue => {

    return (
    <div 
      key={clue.number}
      ref={el => { acrossClueRefs.current[clue.number] = el; }}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        padding: "5px 5px 5px 12px",
        backgroundColor: activeOrientation === "across" && clue.number == activeCell?.acrossClueNum
          ? "#a7d8f0"
          : "transparent"
      }}
      onClick={() => {
        const currentCell = cells.find(
          c => c.acrossClueNum === clue.number && c.col == clue.startCol
        )

        setActiveOrientation("across")
        console.log(acrossClueRefs.current[clue.number])
        if(currentCell != undefined) {
          setActiveCell(currentCell)
          inputRefs.current[currentCell.id]?.focus();
        }
      }}

      
    >
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "10px",
        borderRadius: "2px",
        backgroundColor: activeOrientation === "down" && clue.number == activeCell?.acrossClueNum
          ? "#a7d8f0" : "transparent",

      }} />
        <span style={{
          flexShrink: 0,
          minWidth: "24px",
          textAlign: "right",
          padding: "0 4px 0 4px",
          fontWeight: "bold",
          color: filledAcrossClues.has(clue.number) ? "#888" : ""
        }}>{clue.number}</span>
        <div style={{ flex: 1, overflowWrap: "break-word", wordBreak: "break-word", color: filledAcrossClues.has(clue.number) ? "#888" : ""}}>
          {clue.clue}
        </div>
    </div>
    );
  })

  const divsDown = cluesDown.map(clue => {

    return(
      <div 
        key={clue.number} 
        ref={el => { downClueRefs.current[clue.number] = el; }}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          padding: "5px 5px 5px 12px",
          backgroundColor: activeOrientation === "down" && clue.number == activeCell?.downClueNum
            ? "#a7d8f0" : "transparent",
        }}

        onClick={() => {
          const currentCell = cells.find(
            c => c.downClueNum === clue.number && c.row == clue.startRow
          )
          setActiveOrientation("down")
          if(currentCell != undefined) {
            setActiveCell(currentCell)
            inputRefs.current[currentCell.id]?.focus();
          }

        }}
      >
          <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "10px",
            borderRadius: "2px",
            backgroundColor: activeOrientation === "across" && clue.number == activeCell?.downClueNum
              ? "#a7d8f0" : "transparent",
          }} />
          <span style={{
            flexShrink: 0,
            minWidth: "24px",
            textAlign: "right",
            padding: "0 4px 0 4px",
            fontWeight: "bold",
            color: filledDownClues.has(clue.number) ? "#888" : ""
          }}>{clue.number}</span>

          <div style={{ flex: 1, overflowWrap: "break-word", wordBreak: "break-word", color: filledDownClues.has(clue.number) ? "#888" : ""}}>
            {clue.clue}
          </div>

      </div>
    )
})


  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>, cell: typeof cells[0]) => {
    
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

      if(cellValues[cell.id]) {
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
    if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();

      const otherDir = activeOrientation === "across" ? "down" : "across";
      const otherClueSet = activeOrientation === "across" ? cluesDown : cluesAcross;
      const otherFilledSet = activeOrientation === "across" ? filledDownClues : filledAcrossClues;
      const currentClueSet = activeOrientation === "across" ? cluesAcross : cluesDown;
      const currentFilledSet = activeOrientation === "across" ? filledAcrossClues : filledDownClues;

      const backward = e.shiftKey; 


      getFirstUnfilledCell(currentClueSet, currentFilledSet, activeOrientation,false, backward)        // next unfilled in current direction
        || getFirstUnfilledCell(otherClueSet, otherFilledSet, otherDir, true, backward)           // next unfilled in other direction (from start)
        || getFirstUnfilledCell(currentClueSet, currentFilledSet, activeOrientation, true, backward) // wrap around current direction
        || getFirstCell(currentClueSet, activeOrientation, false, backward)                             // next clue in current direction
        || getFirstCell(otherClueSet, otherDir, true, backward)                                  // next clue in other direction (from start)
        || getFirstCell(currentClueSet, activeOrientation, true, backward);                      // wrap around to first clue

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
          c => !c.isBlack && c.row == currentCell.row && !cellValues[c.id] && c != currentCell && c.col >= currentCell.col
            && c.acrossClueNum == currentCell.acrossClueNum
        );

        if(!nextCell) {
          console.log("going back")
          console.log(cellValues)
          nextCell = cells.find(
            c => !c.isBlack && c.row == currentCell.row && !cellValues[c.id]
              && c.col < currentCell.col && c.acrossClueNum == currentCell.acrossClueNum
          )
        }
        if(!nextCell) {
          nextCell = cells.find(
            c => !c.isBlack && c.row == currentCell.row && c.acrossClueNum == currentCell.acrossClueNum && c.col == currentCell.col + 1
          )
        }
        console.log("next cell forwarding: ")
        console.log(nextCell)
        console.log(cellValues)
        break;
      case "left":
        nextCell = cells.find(
          c => c.col == currentCell.col - 1 && !c.isBlack && c.row == currentCell.row && currentCell.col - 1 >= 0 
        );
        break;
      case "down":
        // nextCell = cells.find(
        //   c => c.col == currentCell.col && c.row == currentCell.row + 1 && !c.isBlack
        // );

        nextCell = cells.find(
          c => !c.isBlack && c.col == currentCell.col && !cellValues[c.id] && c != currentCell && c.row >= currentCell.row
            && c.downClueNum == currentCell.downClueNum
        );

        if(!nextCell) {
          console.log("going back")
          console.log(cellValues)
          nextCell = cells.find(
            c => !c.isBlack && c.col == currentCell.col && !cellValues[c.id]
              && c.row < currentCell.row && c.downClueNum == currentCell.downClueNum
          )
        }
        if(!nextCell) {
          nextCell = cells.find(
            c => !c.isBlack && c.col == currentCell.col && c.downClueNum == currentCell.downClueNum && c.row == currentCell.row + 1
          )
        }
        console.log("next cell forwarding: ")
        console.log(nextCell)
        console.log(cellValues)
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

        while(nextCell?.isBlack && currentCell.col >= 0 && nextCell) {
          nextCell = cells.find(
            c => c.col == nextCell.col - 1 && c.row == currentCell.row
          );
        }
        break;
      case "arrowright":
        nextCell = cells.find(
          c => c.col == currentCell.col + 1 && c.row == currentCell.row
        );

        while(nextCell?.isBlack && currentCell.col < puzzle.meta.width && nextCell) {
          nextCell = cells.find(
            c => c.col == nextCell.col + 1 && c.row == currentCell.row
          );
        }
        break;
      case "arrowup":
        nextCell = cells.find(
          c => c.col == currentCell.col && c.row == currentCell.row - 1
        );

        while(nextCell?.isBlack && currentCell.row >= 0 && nextCell)
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

  const clueText = activeOrientation == "across"
    ? cluesAcross.find(cl => cl.number == activeCell?.acrossClueNum)?.clue
    : cluesDown.find(cl => cl.number == activeCell?.downClueNum)?.clue
  
  const clueLabel = activeCell
    ? (activeOrientation === "across" ? activeCell.acrossClueNum + "A" : activeCell.downClueNum + "D")
    : null;

  const gridHeight = puzzle.meta.height * 50
  return (
    
    <div>
      <main>

        <div style={{display: "flex"}}>
          <div style={{margin: "40px 50px 0px 40px", width: "fit-content"}}>
            <div style={{
              backgroundColor: "#deedf6",
              padding: "16px 20px",
              marginBottom: "8px",
              borderRadius: "4px",
              fontSize: "16px",
              lineHeight: "1.4",
              display: "flex",
              alignItems: "baseline",
              gap: "12px",
              minHeight: "52px"
            }}>

              {clueLabel && (
                <span style={{ fontWeight: "bold", flexShrink: 0 }}>{clueLabel}</span>
              )}
              <span>{clueText}</span>
            </div>
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

          <div style={{marginTop: "40px"}} >
            <h3 style={{textAlign: "left", paddingLeft: "14px"}}><b>ACROSS</b></h3>
            <hr style={{color: "lightgray"}}></hr>
            <ol style={{overflowY: "scroll", height: `${gridHeight+40}px`, overflowX: "hidden", width: "300px"}}>
              <li>{divsAcross}</li>
            </ol>
          </div>
          <div style={{marginLeft: "30px", marginTop: "40px"}}>
            <h3 style={{textAlign: "left", paddingLeft: "14px"}}><b>DOWN</b></h3>
            <hr style={{color: "lightgrey"}}></hr>
            <ol style={{overflowY: "scroll", height: `${gridHeight+40}px`, overflowX: "hidden", width: "300px"}}>
              <li>{divsDown}</li>
            </ol>
          </div> 

        </div>




    
      </main>
    </div>
  );
}
