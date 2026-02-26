"use client"
import { useState, useRef } from 'react';
import Image from "next/image";
// import { parse } from "@xwordly/xword-parser";
// import { readFileSync } from "fs";
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { setDefaultAutoSelectFamily } from 'net';
import { setHeapSnapshotNearHeapLimit } from 'v8';
import { CellType } from '@xwordly/xword-parser';

// const fileContent = readFileSync('USA Today - 20260109 - One of Two Ways.puz'); 
// const puzzle = parse(fileContent); 
const rows = [
  
    [
      { solution: 'P', number: 1, isBlack: false, id: 0},
      { solution: 'I', number: 2, isBlack: false, id: 1},
      { solution: 'N', number: 3, isBlack: false, id: 2 },
      { solution: 'O', number: 4, isBlack: false, id: 3 },
      { solution: 'T', number: 5, isBlack: false, id: 4 },
      { solution: undefined, number: undefined, isBlack: true, id: 5 },
      { solution: undefined, number: undefined, isBlack: true, id:6 },
      { solution: 'S', number: 6, isBlack: false, id:7 },
      { solution: 'P', number: 7, isBlack: false, id:8 },
      { solution: 'U', number: 8, isBlack: false, id: 9 },
      { solution: 'N', number: 9, isBlack: false, id: 10 },
      { solution: undefined, number: undefined, isBlack: true, id: 11},
      { solution: 'A', number: 10, isBlack: false, id: 12 },
      { solution: 'S', number: 11, isBlack: false, id: 13 },
      { solution: 'P', number: 12, isBlack: false, id: 14 }
    ],
    [
      { solution: 'A', number: 13, isBlack: false, id: 15},
      { solution: 'M', number: undefined, isBlack: false, id: 16 },
      { solution: 'O', number: undefined, isBlack: false, id: 17 },
      { solution: 'R', number: undefined, isBlack: false, id: 18 },
      { solution: 'A', number: undefined, isBlack: false, id: 19 },
      { solution: 'L', number: 14, isBlack: false, id: 20},
      { solution: undefined, number: undefined, isBlack: true, id: 21},
      { solution: 'H', number: 15, isBlack: false, id: 22},
      { solution: 'O', number: undefined, isBlack: false, id: 23},
      { solution: 'B', number: undefined, isBlack: false, id: 24 },
      { solution: 'O', number: undefined, isBlack: false, id: 25 },
      { solution: undefined, number: undefined, isBlack: true, id: 26},
      { solution: 'P', number: 16, isBlack: false, id: 27},
      { solution: 'A', number: undefined, isBlack: false, id:28 },
      { solution: 'R', number: undefined, isBlack: false, id: 29}
    ],
    [
    { solution: 'M', number: 17, isBlack: false, id: 30},
    { solution: 'O', number: undefined, isBlack: false, id: 31 },
    { solution: 'B', number: undefined, isBlack: false, id: 32 },
    { solution: 'I', number: undefined, isBlack: false, id: 33 },
    { solution: 'L', number: undefined, isBlack: false, id: 34 },
    { solution: 'E', number: undefined, isBlack: false, id: 35 },
    { solution: undefined, number: undefined, isBlack: true, id: 36 },
    { solution: 'A', number: 18, isBlack: false, id: 37 },
    { solution: 'M', number: undefined, isBlack: false, id: 38 },
    { solution: 'E', number: undefined, isBlack: false, id: 39 },
    { solution: 'N', number: undefined, isBlack: false, id: 40 },
    { solution: undefined, number: undefined, isBlack: true, id: 41 },
    { solution: 'H', number: 19, isBlack: false, id: 42 },
    { solution: 'U', number: undefined, isBlack: false, id: 43 },
    { solution: 'E', number: undefined, isBlack: false, id: 44 }
  ],
  [
    { solution: undefined, number: undefined, isBlack: true, id: 45 },
    { solution: undefined, number: undefined, isBlack: true, id: 46 },
    { solution: 'R', number: 20, isBlack: false, id: 47 },
    { solution: 'E', number: undefined, isBlack: false, id: 48 },
    { solution: 'C', number: undefined, isBlack: false, id: 49 },
    { solution: 'O', number: undefined, isBlack: false, id: 50 },
    { solution: 'R', number: 21, isBlack: false, id: 51 },
    { solution: 'D', number: undefined, isBlack: false, id: 52 },
    { solution: 'P', number: undefined, isBlack: false, id: 53 },
    { solution: 'R', number: undefined, isBlack: false, id: 54 },
    { solution: 'O', number: undefined, isBlack: false, id: 55 },
    { solution: 'F', number: 22, isBlack: false, id: 56 },
    { solution: 'I', number: undefined, isBlack: false, id: 57 },
    { solution: 'T', number: undefined, isBlack: false, id: 58 },
    { solution: 'S', number: undefined, isBlack: false, id: 59 }
  ],
  [
    { solution: 'J', number: 23, isBlack: false, id: 60 },
    { solution: 'O', number: 24, isBlack: false, id: 61 },
    { solution: 'A', number: undefined, isBlack: false, id: 62  },
    { solution: 'N', number: undefined, isBlack: false, id: 63  },
    { solution: undefined, number: undefined, isBlack: true, id: 64 },
    { solution: undefined, number: undefined, isBlack: true, id: 65  },
    { solution: 'E', number: 25, isBlack: false, id: 66  },
    { solution: 'Y', number: undefined, isBlack: false, id: 67 },
    { solution: 'E', number: undefined, isBlack: false, id: 68  },
    { solution: undefined, number: undefined, isBlack: true, id: 69  },
    { solution: undefined, number: undefined, isBlack: true, id: 70  },
    { solution: 'I', number: 26, isBlack: false, id: 71  },
    { solution: 'D', number: undefined, isBlack: false, id: 72  },
    { solution: 'E', number: undefined, isBlack: false, id: 73  },
    { solution: 'S', number: undefined, isBlack: false, id: 74  }
  ],
  [
    { solution: 'E', number: 27, isBlack: false, id: 75  },
    { solution: 'D', number: undefined, isBlack: false, id: 76   },
    { solution: 'I', number: undefined, isBlack: false, id: 77   },
    { solution: 'T', number: undefined, isBlack: false, id: 78   },
    { solution: 'O', number: 28, isBlack: false, id: 79   },
    { solution: 'R', number: 29, isBlack: false, id: 80   },
    { solution: 'S', number: undefined, isBlack: false, id: 81   },
    { solution: undefined, number: undefined, isBlack: true, id: 82   },
    { solution: 'O', number: 30, isBlack: false, id: 83   },
    { solution: 'C', number: 31, isBlack: false, id: 84   },
    { solution: 'H', number: 32, isBlack: false, id: 85   },
    { solution: 'O', number: undefined, isBlack: false, id: 86   },
    { solution: undefined, number: undefined, isBlack: true, id: 87   },
    { solution: undefined, number: undefined, isBlack: true, id: 88   },
    { solution: undefined, number: undefined, isBlack: true, id: 89   }
  ],
  [
    { solution: 'E', number: 33, isBlack: false, id: 90 },
    { solution: 'O', number: undefined, isBlack: false, id: 91},
    { solution: 'N', number: undefined, isBlack: false, id: 92},
    { solution: undefined, number: undefined, isBlack: true, id: 93 },
    { solution: 'P', number: 34, isBlack: false, id: 94 },
    { solution: 'E', number: undefined, isBlack: false, id: 95 },
    { solution: 'E', number: undefined, isBlack: false, id: 96 },
    { solution: 'R', number: 35, isBlack: false, id: 97 },
    { solution: undefined, number: undefined, isBlack: true, id: 98 },
    { solution: 'A', number: 36, isBlack: false, id: 99 },
    { solution: 'O', number: undefined, isBlack: false, id: 100 },
    { solution: 'N', number: undefined, isBlack: false, id: 101 },
    { solution: 'E', number: 37, isBlack: false, id: 102 },
    { solution: undefined, number: undefined, isBlack: true, id: 103 },
    { solution: undefined, number: undefined, isBlack: true, id: 104 }
  ],
  [
    { solution: 'P', number: 38, isBlack: false, id: 105 },
    { solution: 'R', number: undefined, isBlack: false, id: 106 },
    { solution: 'E', number: undefined, isBlack: false, id: 107 },
    { solution: 'S', number: 39, isBlack: false, id: 108 },
    { solution: 'E', number: undefined, isBlack: false, id: 109 },
    { solution: 'N', number: undefined, isBlack: false, id: 110 },
    { solution: 'T', number: undefined, isBlack: false, id: 111},
    { solution: 'C', number: undefined, isBlack: false, id: 112 },
    { solution: 'O', number: 40, isBlack: false, id: 113 },
    { solution: 'M', number: undefined, isBlack: false, id: 114 },
    { solution: 'P', number: undefined, isBlack: false, id: 115 },
    { solution: 'A', number: undefined, isBlack: false, id: 116 },
    { solution: 'N', number: undefined, isBlack: false, id: 117 },
    { solution: 'Y', number: 41, isBlack: false, id: 118 },
    { solution: undefined, number: undefined, isBlack: true, id: 119 }
  ],
  [
    { solution: undefined, number: undefined, isBlack: true, id: 120 },
    { solution: undefined, number: undefined, isBlack: true, id: 121 },
    { solution: 'R', number: 42, isBlack: false, id: 122 },
    { solution: 'A', number: undefined, isBlack: false, id: 123 },
    { solution: 'R', number: undefined, isBlack: false, id: 124 },
    { solution: 'E', number: undefined, isBlack: false, id: 125 },
    { solution: undefined, number: undefined, isBlack: true, id: 126 },
    { solution: 'A', number: 43, isBlack: false, id: 127 },
    { solution: 'C', number: undefined, isBlack: false, id: 128 },
    { solution: 'R', number: undefined, isBlack: false, id: 129 },
    { solution: 'E', number: undefined, isBlack: false, id: 130 },
    { solution: undefined, number: undefined, isBlack: true, id: 131 },
    { solution: 'D', number: 44, isBlack: false, id: 132 },
    { solution: 'E', number: undefined, isBlack: false, id: 133 },
    { solution: 'W', number: 45, isBlack: false, id: 134 }
  ],
  [
    { solution: undefined, number: undefined, isBlack: true, id: 135 },
    { solution: undefined, number: undefined, isBlack: true, id: 136 },
    { solution: undefined, number: undefined, isBlack: true, id: 137 },
    { solution: 'L', number: 46, isBlack: false, id: 138 },
    { solution: 'A', number: undefined, isBlack: false, id: 139 },
    { solution: 'W', number: undefined, isBlack: false, id: 140 },
    { solution: 'S', number: 47, isBlack: false, id: 141 },
    { solution: undefined, number: undefined, isBlack: true, id: 142 },
    { solution: 'H', number: 48, isBlack: false, id: 143 },
    { solution: 'Y', number: undefined, isBlack: false, id: 144 },
    { solution: 'D', number: undefined, isBlack: false, id: 145 },
    { solution: 'R', number: 49, isBlack: false, id: 146 },
    { solution: 'A', number: undefined, isBlack: false, id: 147 },
    { solution: 'T', number: undefined, isBlack: false, id: 148 },
    { solution: 'E', number: undefined, isBlack: false, id: 149 }
  ],
  [
    { solution: 'O', number: 50, isBlack: false, id: 150 },
    { solution: 'N', number: 51, isBlack: false, id: 151 },
    { solution: 'C', number: 52, isBlack: false, id: 152 },
    { solution: 'E', number: undefined, isBlack: false, id:153 },
    { solution: undefined, number: undefined, isBlack: true, id: 154 },
    { solution: undefined, number: undefined, isBlack: true, id: 155 },
    { solution: 'U', number: 53, isBlack: false, id: 156 },
    { solution: 'S', number: 54, isBlack: false, id: 157 },
    { solution: 'E', number: undefined, isBlack: false, id: 158 },
    { solution: undefined, number: undefined, isBlack: true, id: 159 },
    { solution: undefined, number: undefined, isBlack: true, id: 160 },
    { solution: 'U', number: 55, isBlack: false, id: 161 },
    { solution: 'N', number: undefined, isBlack: false, id: 162 },
    { solution: 'I', number: undefined, isBlack: false, id: 163 },
    { solution: 'T', number: undefined, isBlack: false, id: 164 }
  ],
  [
    { solution: 'P', number: 56, isBlack: false, id: 165},
    { solution: 'E', number: undefined, isBlack: false, id: 166 },
    { solution: 'R', number: undefined, isBlack: false, id: 167 },
    { solution: 'M', number: undefined, isBlack: false, id: 168 },
    { solution: 'I', number: 57, isBlack: false, id: 169 },
    { solution: 'T', number: 58, isBlack: false, id: 170 },
    { solution: 'P', number: undefined, isBlack: false, id: 171 },
    { solution: 'A', number: undefined, isBlack: false, id: 172 },
    { solution: 'R', number: undefined, isBlack: false, id: 173 },
    { solution: 'K', number: 59, isBlack: false, id: 174 },
    { solution: 'I', number: 60, isBlack: false, id: 175 },
    { solution: 'N', number: undefined, isBlack: false, id: 176 },
    { solution: 'G', number: undefined, isBlack: false, id: 177 },
    { solution: undefined, number: undefined, isBlack: true, id: 178 },
    { solution: undefined, number: undefined, isBlack: true, id: 179 }
  ],
  [
    { solution: 'A', number: 61, isBlack: false, id: 180 },
    { solution: 'X', number: undefined, isBlack: false, id: 181 },
    { solution: 'E', number: undefined, isBlack: false, id: 182 },
    { solution: undefined, number: undefined, isBlack: true, id: 183 },
    { solution: 'R', number: 62, isBlack: false, id: 184 },
    { solution: 'A', number: undefined, isBlack: false, id: 185 },
    { solution: 'P', number: undefined, isBlack: false, id: 186 },
    { solution: 'T', number: undefined, isBlack: false, id: 187 },
    { solution: undefined, number: undefined, isBlack: true, id: 188 },
    { solution: 'G', number: 63, isBlack: false, id: 189 },
    { solution: 'O', number: undefined, isBlack: false, id: 190 },
    { solution: 'N', number: undefined, isBlack: false, id: 191 },
    { solution: 'E', number: undefined, isBlack: false, id: 192 },
    { solution: 'R', number: 64, isBlack: false, id: 193 },
    { solution: 'S', number: 65, isBlack: false, id: 194 }
  ],
  [
    { solution: 'R', number: 66, isBlack: false, id: 195},
    { solution: 'U', number: undefined, isBlack: false, id: 196 },
    { solution: 'E', number: undefined, isBlack: false, id: 197 },
    { solution: undefined, number: undefined, isBlack: true, id: 198 },
    { solution: 'A', number: 67, isBlack: false, id: 199 },
    { solution: 'C', number: undefined, isBlack: false, id: 200 },
    { solution: 'L', number: undefined, isBlack: false, id: 201 },
    { solution: 'U', number: undefined, isBlack: false, id: 202 },
    { solution: undefined, number: undefined, isBlack: true, id: 203 },
    { solution: 'S', number: 68, isBlack: false, id: 204},
    { solution: 'T', number: undefined, isBlack: false, id: 205 },
    { solution: 'E', number: undefined, isBlack: false, id: 206 },
    { solution: 'R', number: undefined, isBlack: false, id: 207 },
    { solution: 'E', number: undefined, isBlack: false, id: 208 },
    { solution: 'O', number: undefined, isBlack: false, id: 209 }
  ],
  [
    { solution: 'T', number: 69, isBlack: false, id: 210},
    { solution: 'S', number: undefined, isBlack: false, id: 211 },
    { solution: 'K', number: undefined, isBlack: false, id: 212 },
    { solution: undefined, number: undefined, isBlack: true, id: 213 },
    { solution: 'S', number: 70, isBlack: false, id: 214 },
    { solution: 'T', number: undefined, isBlack: false, id: 215 },
    { solution: 'E', number: undefined, isBlack: false, id: 216 },
    { solution: 'P', number: undefined, isBlack: false, id: 217 },
    { solution: undefined, number: undefined, isBlack: true, id: 218 },
    { solution: undefined, number: undefined, isBlack: true, id: 219 },
    { solution: 'A', number: 71, isBlack: false, id: 220 },
    { solution: 'R', number: undefined, isBlack: false, id: 221 },
    { solution: 'S', number: undefined, isBlack: false, id: 222 },
    { solution: 'O', number: undefined, isBlack: false, id: 223 },
    { solution: 'N', number: undefined, isBlack: false, id: 224 }
  ]
  
]

const cluesAcross = [
    { number: 1, text: '___ gris'},
    { number: 6, text: 'Cooking spray brand' },
    { number: 10, text: '"if u ask me"' },
    { number: 13, text: 'Obvious choice' },
    { number: 15, text: 'Point in the right direction' },
    { number: 16, text: 'Extra-soft mineral' },
    { number: 17, text: 'Took a turn on "Wheel of Fortune"' },
    { number: 18, text: 'Not trustworthy' },
    { number: 19, text: `"Grey's Anatomy" star Ellen` },
    { number: 20, text: 'Rideshare app' },
    { number: 23, text: 'Forbidden activity' },
    { number: 25, text: 'Nile slitherer' },
    { number: 26, text: "Ladybug's lunch" },
    { number: 27, text: 'Cook mushrooms, perhaps' },
    { number: 30, text: 'Freedom of the ___ (First Amendment right)' },
    { number: 33, text: 'Ethically indifferent' },
    { number: 34, text: 'Summer zodiac sign' },
    { number: 36, text: 'Handbag type' },
    {
      number: 38,
      text: "It's typically around 72 for an 18-hole course"
    },
    { number: 42, text: 'Structure hanging over a crib' },
    { number: 43, text: '"You said it!"' },
    { number: 44, text: 'Color wheel option' },
    {
      number: 46,
      text: 'Highest earnings ever, or write down earnings'
    },
    { number: 48, text: 'Bowling lane button' },
    { number: 50, text: 'Princess in "Shrek"' },
    {
      number: 53,
      text: 'Cusack who voices Jessie in the "Toy Story" films'
    },
    { number: 55, text: 'Liberty automaker' },
    { number: 56, text: 'Smell' },
    { number: 61, text: 'Place for a contact lens' },
    { number: 62, text: 'The ___ of March' },
    { number: 63, text: 'Masthead names' },
    { number: 66, text: 'La Scala performance' },
    { number: 67, text: 'Extend a subscription' },
    { number: 68, text: 'Cuatro x dos' },
    {
      number: 69,
      text: `Toyota sedan that's aptly an anagram of "my car"`
    },
    { number: 70, text: 'Wished' },
    { number: 71, text: 'Long, long time' }
]

const cluesDown = [
    { number: 1, text: 'Social equal' },
    { number: 2, text: 'Record label for Childish Gambino' },
    { number: 3, text: 'Top-notch' },
    { number: 4, text: "Puts in harm's way" },
    {
      number: 5,
      text: 'The people here right now, or introduce people'
    },
    { number: 6, text: "Oregon's capital" },
    { number: 7, text: 'Brownish-yellow color' },
    { number: 8, text: 'Himalayan cryptid' },
    { number: 9, text: 'Uncommon' },
    { number: 10, text: 'Farmland measure' },
    { number: 11, text: 'Moisture on grass' },
    { number: 12, text: 'Damp' },
    { number: 14, text: 'What bills may become' },
    { number: 21, text: "Like an acrobat's limbs" },
    { number: 22, text: 'Drink water after a workout, say' },
    { number: 23, text: 'Marathon participant' },
    { number: 24, text: '___ in a lifetime' },
    { number: 28, text: 'Illusion-based painting style' },
    { number: 29, text: 'Meeting point' },
    { number: 31, text: `Word after "Schitt's" or "Dawson's"` },
    { number: 32, text: 'Bring into play' },
    { number: 35, text: 'Stopped slouching' },
    { number: 37, text: 'Standard of measurement' },
    {
      number: 39,
      text: 'Feature of a certain residential street, or let drivers leave their cars on a street'
    },
    { number: 40, text: '401(k) alternatives' },
    { number: 41, text: 'Diplomacy' },
    { number: 45, text: 'Metric units of mass (Abbr.)' },
    { number: 47, text: 'Teeny bit' },
    { number: 49, text: "Lumberjack's tool" },
    { number: 50, text: 'Riveted' },
    { number: 51, text: "They're doomed" },
    { number: 52, text: '___ Speedwagon' },
    { number: 54, text: 'Dad, to Grandpa' },
    { number: 57, text: 'Regret' },
    { number: 58, text: 'Bill of Rights advocacy org.' },
    { number: 59, text: 'Multi-speaker system' },
    { number: 60, text: 'Disapproving sound' },
    { number: 64, text: 'Choreography part' },
    { number: 65, text: 'Fire-starting crime' }
]

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

  const inputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const [activeCellId, setActiveCellId] = useState<number | null>(null);
  const [cellValues, setCellValues] = useState<{ [key: number]: string }>({});

  
  const divs = rows.map(row => (

    <div style={{display: "flex", flexDirection: "row", backgroundColor: "#141313"}}
          key={row[0].id}
    >

    {row.map(cell => 
      <div style={{border: "1px solid #777"}} key={cell.id}>
        <div
            onClick={() => {
              if(!cell.isBlack) {
                setActiveCellId(cell.id);
                inputRefs.current[cell.id]?.focus();
              }
            }}
            // onClick={() => {
            //  if(!cell.isBlack) setActiveCellId(cell.id); 
            // }}



            style={{
              backgroundColor: cell.isBlack ? "black" : activeCellId === cell.id ? "#f9dc4a" : "white", 
              margin: "0px", 
              width: "50px", 
              height: "50px",
              outline: "none"
            }}
            key={cell.id} tabIndex={-1} 
        >
          <div style={{paddingTop: "1px", paddingLeft: "3px", fontSize: "13px", paddingBottom: "-10px", marginBottom: "-4px"}}>
          {cell.number} &nbsp;
          </div>

          <input 

              ref={(el) => {
                inputRefs.current[cell.id] = el;
              }}              
              maxLength={1}
              onFocus={(e) => {
                // e.target.select();
                setActiveCellId(cell.id);
              }}
              type='text'
              onChange={(e) => handleChange(e, cell)}
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
      
    )}

    </div>
  ))


  const divsAcross = cluesAcross.map(clue => (
    <div key={clue.number} style={{padding: "5px"}}>
      <div style={{display: "inline", padding: "7px"}}>
        {clue.number}
      </div>
      <div style={{display: "inline"}}>
        {clue.text}
      </div>
    </div>
  ))

  const divsDown = cluesDown.map(clue => (
    <div key={clue.number} style={{padding: "5px"}}>
      <div style={{display: "inline", padding: "7px"}}>
        {clue.number}
      </div>
      <div style={{display: "inline", overflowBlock: "revert-layer"}}>
        {clue.text}
      </div>
    </div>
  ))


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, cell: any) => {
      const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
      console.log("change handling: " + value)

      setCellValues(prev => ({
        ...prev, 
        [cell.id]: value
      }))

      if(value) {
        moveRight(cell.id)
      }
  }

  const moveRight = (currentId: number) => {
    const nextId = currentId + 1;
    

    if (rows.flat().find(c => c.id === nextId && !c.isBlack)) {
      inputRefs.current[nextId]?.focus();
      setActiveCellId(nextId);
    }
  };



  return (
    
    <div>
      <main>

        <div style={{display: "flex"}}>
          
          <div style={{display: "inline"}} id="divs">
            {divs}
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
