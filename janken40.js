// 潜在的なバグを減らす。
'use strict';

// イベントリスナの設定
// 開始ボタンを押されるとゲーム開始
const playButton  = document.getElementById("play");
playButton.addEventListener('click', jankenHandler);

// メイン処理
// player の手を取得
const jankenInputBox = document.getElementById("janken_number");
let player = parseInt(jankenInputBox.value);

// conputer の手を 乱数で設定
let computer = Math.floor(Math.random()*3);

// じゃんけんの勝ち負けの結果を表示する関数
function jankenHandler(event) {
  if (player === 0) {
    // プレイヤーがグーの時なら
    if (computer === 0) {
      // コンピュータがグーを出した場合、
      alert("あいこです!");
    } else if (computer === 1) {
      // コンピュータがチョキを出した場合
      alert("あなたの勝ちです!");
    } else {
      // コンピュータがパーを出した場合
      alert("あなたの負けです!");
    }
  } else if (player === 1) {
    // プレイヤーがチョキの時に、
    if (computer === 0) {
      // コンピュータがグーを出した場合
      alert("あなたの負けです!");
    } else if (computer === 1) {
      // コンピュータがチョキを出した場合
      alert("あいこです!");
    } else {
      // コンピュータがパーを出した場合
      alert("あなたの勝ちです!");
    }
  } else {
    // プレイヤーがパーの時に、
    if (computer === 0) {
      // コンピュータがグーを出した場合
      alert("あなたの勝ちです!");
    } else if (computer === 1) {
      // コンピュータがチョキを出した場合
      alert("あなたの負けです!");
    } else {
      // コンピュータがパーを出した場合
      alert("あいこです!");
    }
  }
}
