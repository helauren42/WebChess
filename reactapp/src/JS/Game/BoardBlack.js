import { useEffect, useState } from 'react'
import '../../CSS/Play.css'
import '../../CSS/Game.css'

import { positionPieceImages } from './BoardActions.js'

export const BoardBlack = ({ gameData, onClickSquare }) => {
  console.log("Black Board")
  useEffect(() => {
    console.log("effect to positionPieceImages")
    if (!gameData || gameData == {})
      return
    positionPieceImages(gameData["board"])
  }, [gameData])
  return (
    <div className='board' id="board-black">
      <button className="square white-square" id="row-0-col-7" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-0-col-7"></img></button>
      <button className="square black-square" id="row-0-col-6" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-0-col-6"></img></button>
      <button className="square white-square" id="row-0-col-5" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-0-col-5"></img></button>
      <button className="square black-square" id="row-0-col-4" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-0-col-4"></img></button>
      <button className="square white-square" id="row-0-col-3" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-0-col-3"></img></button>
      <button className="square black-square" id="row-0-col-2" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-0-col-2"></img></button>
      <button className="square white-square" id="row-0-col-1" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-0-col-1"></img></button>
      <button className="square black-square" id="row-0-col-0" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-0-col-0"></img></button>
      <button className="square black-square" id="row-1-col-7" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-1-col-7"></img></button>
      <button className="square white-square" id="row-1-col-6" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-1-col-6"></img></button>
      <button className="square black-square" id="row-1-col-5" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-1-col-5"></img></button>
      <button className="square white-square" id="row-1-col-4" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-1-col-4"></img></button>
      <button className="square black-square" id="row-1-col-3" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-1-col-3"></img></button>
      <button className="square white-square" id="row-1-col-2" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-1-col-2"></img></button>
      <button className="square black-square" id="row-1-col-1" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-1-col-1"></img></button>
      <button className="square white-square" id="row-1-col-0" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-1-col-0"></img></button>
      <button className="square white-square" id="row-2-col-7" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-2-col-7"></img></button>
      <button className="square black-square" id="row-2-col-6" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-2-col-6"></img></button>
      <button className="square white-square" id="row-2-col-5" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-2-col-5"></img></button>
      <button className="square black-square" id="row-2-col-4" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-2-col-4"></img></button>
      <button className="square white-square" id="row-2-col-3" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-2-col-3"></img></button>
      <button className="square black-square" id="row-2-col-2" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-2-col-2"></img></button>
      <button className="square white-square" id="row-2-col-1" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-2-col-1"></img></button>
      <button className="square black-square" id="row-2-col-0" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-2-col-0"></img></button>
      <button className="square black-square" id="row-3-col-7" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-3-col-7"></img></button>
      <button className="square white-square" id="row-3-col-6" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-3-col-6"></img></button>
      <button className="square black-square" id="row-3-col-5" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-3-col-5"></img></button>
      <button className="square white-square" id="row-3-col-4" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-3-col-4"></img></button>
      <button className="square black-square" id="row-3-col-3" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-3-col-3"></img></button>
      <button className="square white-square" id="row-3-col-2" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-3-col-2"></img></button>
      <button className="square black-square" id="row-3-col-1" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-3-col-1"></img></button>
      <button className="square white-square" id="row-3-col-0" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-3-col-0"></img></button>
      <button className="square white-square" id="row-4-col-7" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-4-col-7"></img></button>
      <button className="square black-square" id="row-4-col-6" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-4-col-6"></img></button>
      <button className="square white-square" id="row-4-col-5" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-4-col-5"></img></button>
      <button className="square black-square" id="row-4-col-4" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-4-col-4"></img></button>
      <button className="square white-square" id="row-4-col-3" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-4-col-3"></img></button>
      <button className="square black-square" id="row-4-col-2" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-4-col-2"></img></button>
      <button className="square white-square" id="row-4-col-1" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-4-col-1"></img></button>
      <button className="square black-square" id="row-4-col-0" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-4-col-0"></img></button>
      <button className="square black-square" id="row-5-col-7" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-5-col-7"></img></button>
      <button className="square white-square" id="row-5-col-6" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-5-col-6"></img></button>
      <button className="square black-square" id="row-5-col-5" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-5-col-5"></img></button>
      <button className="square white-square" id="row-5-col-4" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-5-col-4"></img></button>
      <button className="square black-square" id="row-5-col-3" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-5-col-3"></img></button>
      <button className="square white-square" id="row-5-col-2" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-5-col-2"></img></button>
      <button className="square black-square" id="row-5-col-1" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-5-col-1"></img></button>
      <button className="square white-square" id="row-5-col-0" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-5-col-0"></img></button>
      <button className="square white-square" id="row-6-col-7" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-6-col-7"></img></button>
      <button className="square black-square" id="row-6-col-6" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-6-col-6"></img></button>
      <button className="square white-square" id="row-6-col-5" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-6-col-5"></img></button>
      <button className="square black-square" id="row-6-col-4" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-6-col-4"></img></button>
      <button className="square white-square" id="row-6-col-3" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-6-col-3"></img></button>
      <button className="square black-square" id="row-6-col-2" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-6-col-2"></img></button>
      <button className="square white-square" id="row-6-col-1" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-6-col-1"></img></button>
      <button className="square black-square" id="row-6-col-0" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-6-col-0"></img></button>
      <button className="square black-square" id="row-7-col-7" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-7-col-7"></img></button>
      <button className="square white-square" id="row-7-col-6" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-7-col-6"></img></button>
      <button className="square black-square" id="row-7-col-5" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-7-col-5"></img></button>
      <button className="square white-square" id="row-7-col-4" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-7-col-4"></img></button>
      <button className="square black-square" id="row-7-col-3" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-7-col-3"></img></button>
      <button className="square white-square" id="row-7-col-2" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-7-col-2"></img></button>
      <button className="square black-square" id="row-7-col-1" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-7-col-1"></img></button>
      <button className="square white-square" id="row-7-col-0" onClick={(event) => onClickSquare(event)}><img src={null} className="board-cell" id="img-row-7-col-0"></img></button>
    </div>
  )
}
